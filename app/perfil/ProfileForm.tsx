"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { updateProfile } from "@/app/actions/user";
import {
  updateCafeteriaProfile,
  addBarista,
  deleteBarista,
  setHighlightedBarista,
  uploadGalleryImages,
  deleteGalleryImage,
} from "@/app/actions/cafeteria";
import MapPicker from "@/app/components/MapPicker";
import FlashMessage from "@/app/components/FlashMessage";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { getSlugId } from "@/lib/utils";




// ─── Input compartido ─────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] placeholder-[#38050e]/50 focus:outline-none focus:ring-2 focus:ring-[#cddbf2]/50 transition-all";
const labelCls = "text-[#cddbf2] text-sm font-medium pl-1";

// ─── Componente principal ──────────────────────────────────────────────────────
export default function ProfileForm({ user, maxGalleryImages = 3 }: { user: any, maxGalleryImages?: number }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [showQRModal, setShowQRModal] = useState(false);

  const tabs = [
    { id: "personal", label: "Información Personal" },
    ...(user.role === "cafeteria" ? [
      { id: "cafeteria", label: "Datos Cafetería" },
      { id: "ubicacion", label: "Ubicación" },
      { id: "baristas", label: "Baristas" },
      { id: "imagenes", label: "Imágenes" }
    ] : [])
  ];

  // ── Perfil básico ──
  const [basicState, basicAction, basicPending] = useActionState(updateProfile, null);
  const [basicMsg, setBasicMsg] = useState("");
  const [basicErr, setBasicErr] = useState("");

  useEffect(() => {
    if (basicState?.success) { setBasicMsg(basicState.success); setTimeout(() => setBasicMsg(""), 3500); }
    if (basicState?.error) { setBasicErr(basicState.error); setTimeout(() => setBasicErr(""), 4000); }
  }, [basicState]);

  // ── Perfil cafetería ──
  const [cafState, cafAction, cafPending] = useActionState(updateCafeteriaProfile, null);
  const [cafMsg, setCafMsg] = useState("");
  const [cafErr, setCafErr] = useState("");
  const [coverPreview, setCoverPreview] = useState<string>(user.coverImage || "");
  // Estado controlado para que el select NO se limpie tras el submit
  const [categories, setCategories] = useState<string[]>(
    Array.isArray(user.competitionCategory) ? user.competitionCategory : (user.competitionCategory ? [user.competitionCategory] : [])
  );
  const [businessType, setBusinessType] = useState<string>(user.businessType || "coffee");

  useEffect(() => {
    if (cafState?.success) {
      setCafMsg(cafState.success);
      setTimeout(() => setCafMsg(""), 3500);
      // Sincronizar categoría desde la respuesta si la hubiera (no necesario, ya está controlado)
    }
    if (cafState?.error) { setCafErr(cafState.error); setTimeout(() => setCafErr(""), 4000); }
  }, [cafState]);

  // ── Mapa ──
  const [locationLat, setLocationLat] = useState<number | null>(user.locationLat);
  const [locationLng, setLocationLng] = useState<number | null>(user.locationLng);
  const [mapMsg, setMapMsg] = useState("");

  async function handleGeocode() {
    const address = (document.getElementById("neighborhood") as HTMLInputElement)?.value;
    if (!address) {
      setMapMsg("Ingresa una ubicación primero.");
      setTimeout(() => setMapMsg(""), 3000);
      return;
    }
    setMapMsg("Buscando...");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ", Panama")}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setLocationLat(parseFloat(data[0].lat));
        setLocationLng(parseFloat(data[0].lon));
        setMapMsg("Ubicación encontrada.");
      } else {
        setMapMsg("No se encontró. Intenta mover el marcador.");
      }
    } catch (e) {
      setMapMsg("Error al buscar ubicación.");
    }
    setTimeout(() => setMapMsg(""), 3000);
  }

  // ── Galería de imágenes ──
  const [galleryState, galleryAction, galleryPending] = useActionState(uploadGalleryImages, null);
  const [galleryMsg, setGalleryMsg] = useState("");
  const [galleryErr, setGalleryErr] = useState("");
  const galleryFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (galleryState?.success) {
      setGalleryMsg(galleryState.success);
      galleryFormRef.current?.reset();
      setTimeout(() => setGalleryMsg(""), 3500);
    }
    if (galleryState?.error) { setGalleryErr(galleryState.error); setTimeout(() => setGalleryErr(""), 4000); }
  }, [galleryState]);

  async function handleDeleteGalleryImage(url: string) {
    if (!confirm("¿Eliminar imagen?")) return;
    await deleteGalleryImage(url, user._id || user.id);
  }

  // ── Agregar barista ──
  const [baristaState, baristaAction, baristaPending] = useActionState(addBarista, null);
  const [baristaMsg, setBaristaMsg] = useState("");
  const [baristaErr, setBaristaErr] = useState("");
  const [baristaPhotoPreview, setBaristaPhotoPreview] = useState("");
  const baristaFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (baristaState?.success) {
      setBaristaMsg(baristaState.success);
      setBaristaPhotoPreview("");
      baristaFormRef.current?.reset();
      setTimeout(() => setBaristaMsg(""), 3500);
    }
    if (baristaState?.error) { setBaristaErr(baristaState.error); setTimeout(() => setBaristaErr(""), 4000); }
  }, [baristaState]);

  // ── Estado optimista de baristas ──
  const [baristas, setBaristas] = useState<any[]>(user.baristas || []);
  useEffect(() => { setBaristas(user.baristas || []); }, [user.baristas]);

  async function handleDelete(baristaId: string) {
    setBaristas((prev) => prev.filter((b) => b._id !== baristaId));
    await deleteBarista(baristaId, user._id || user.id);
  }

  async function handleHighlight(baristaId: string) {
    setBaristas((prev) =>
      prev.map((b) => ({ ...b, isHighlighted: b._id === baristaId }))
    );
    await setHighlightedBarista(baristaId, user._id || user.id);
  }

  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      // Usar un tamaño grande para mejor calidad de impresión
      canvas.width = 1024;
      canvas.height = 1024;
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${user.cafeteriaName || "perfil"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // ── Estado controlado para validación en tiempo real ──
  const [formData, setFormData] = useState({
    name: user.name || "",
    lastName: user.lastName || "",
    email: user.email || "",
    cafeteriaName: user.cafeteriaName || "",
    legalRepresentative: user.legalRepresentative || "",
    ruc: user.ruc || "",
    neighborhood: user.neighborhood || "",
    description: user.description || "",
    hours: user.hours || "",
    phone: user.phone || "",
    web: user.web || ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Sincronizar estado cuando los datos del usuario cambian (post-save)
  useEffect(() => {
    setFormData({
      name: user.name || "",
      lastName: user.lastName || "",
      email: user.email || "",
      cafeteriaName: user.cafeteriaName || "",
      legalRepresentative: user.legalRepresentative || "",
      ruc: user.ruc || "",
      neighborhood: user.neighborhood || "",
      description: user.description || "",
      hours: user.hours || "",
      phone: user.phone || "",
      web: user.web || ""
    });
    setCategories(Array.isArray(user.competitionCategory) ? user.competitionCategory : (user.competitionCategory ? [user.competitionCategory] : []));
    setBusinessType(user.businessType || "coffee");
    setCoverPreview(user.coverImage || "");
    setLocationLat(user.locationLat);
    setLocationLng(user.locationLng);
  }, [user]);

  const checkIncomplete = () => {
    const incomplete = {
      personal: !formData.name || !formData.email,
      cafeteria: user.role === "cafeteria" && (!formData.cafeteriaName || !formData.ruc || categories.length === 0 || !businessType),
      ubicacion: user.role === "cafeteria" && (!formData.neighborhood || !locationLat),
      baristas: user.role === "cafeteria" && (baristas.length === 0),
      imagenes: user.role === "cafeteria" && (!coverPreview || !user.gallery || user.gallery.length === 0),
      gallery: user.role === "cafeteria" && (!user.gallery || user.gallery.length === 0)
    };
    return incomplete;
  };

  const isIncomplete = checkIncomplete();

  return (
    <div className="flex flex-col gap-6">
      
      {/* ─── Acciones Rápidas ─── */}
      {user.role === "cafeteria" && (
        <div className="flex justify-end">
          <button 
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#cddbf2]/10 hover:bg-[#cddbf2]/20 text-[#cddbf2] font-bold text-[10px] sm:text-xs transition-all border border-[#cddbf2]/10 shadow-lg shadow-black/20"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" style={{ strokeWidth: 2 }}>
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Mi Código QR
          </button>
        </div>
      )}

      {/* ─── Navegación por Pestañas ─── */}
      <div className="flex flex-wrap md:flex-nowrap gap-1.5 mb-2 p-1 rounded-2xl bg-[#2a040b] border border-[#cddbf2]/10">
        {tabs.map((tab) => {
          const tabIncomplete = isIncomplete[tab.id as keyof typeof isIncomplete];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#cddbf2] text-[#38050e] shadow-lg shadow-[#cddbf2]/10"
                  : "text-[#cddbf2]/60 hover:text-[#cddbf2] hover:bg-white/5"
              }`}
            >
              {tab.label}
              {tabIncomplete && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center text-white">!</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2">
        {/* ─────────────────── SECCIÓN: Perfil Básico ─────────────────── */}
        {activeTab === "personal" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-[#cddbf2]/80 text-xs font-semibold uppercase tracking-widest mb-4 pl-1">
              Información Personal
            </h2>
            <form action={basicAction} className="flex flex-col gap-4">
              <input type="hidden" name="targetUserId" value={user._id || user.id || ""} />
              <div className="flex flex-col gap-1">
                <FlashMessage msg={basicErr} type="error" />
                <FlashMessage msg={basicMsg} type="success" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={labelCls} htmlFor="name">Nombre</label>
                  <input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls} htmlFor="lastName">Apellido</label>
                  <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className={inputCls} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelCls} htmlFor="email">Correo Electrónico</label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className={inputCls} />
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelCls} htmlFor="password">Nueva Contraseña (Opcional)</label>
                <input id="password" name="password" type="password" minLength={6}
                  placeholder="Deja en blanco para no cambiarla" className={inputCls} />
              </div>

              {isIncomplete.personal && (
                <p className="text-red-400 text-[10px] font-medium flex items-center gap-1.5 pl-1 animate-pulse">
                  <span>⚠️</span> Por favor, completa los datos obligatorios que faltan.
                </p>
              )}

              <button type="submit" disabled={basicPending}
                className="mt-2 w-full py-3.5 rounded-xl bg-[#cddbf2] text-[#38050e] font-semibold tracking-wide hover:bg-[#cddbf2]/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                {basicPending ? "Guardando..." : "Actualizar Información"}
              </button>
            </form>
          </section>
        )}

        {/* ─────────────────── SECCIÓN: Cafetería ─────────────────── */}
        {user.role === "cafeteria" && activeTab === "cafeteria" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-[#cddbf2]/90 text-xs font-semibold uppercase tracking-widest mb-4 pl-1">
              ☕ Datos de la Cafetería
            </h2>
            <form action={cafAction} className="flex flex-col gap-4">
              <input type="hidden" name="targetUserId" value={user._id || user.id || ""} />
              <div className="flex flex-col gap-1">
                <FlashMessage msg={cafErr} type="error" />
                <FlashMessage msg={cafMsg} type="success" />
              </div>

              {/* Nombre comercial */}
              <div className="flex flex-col gap-2">
                <label className={labelCls} htmlFor="cafeteriaName">Nombre Comercial *</label>
                <input id="cafeteriaName" name="cafeteriaName" type="text"
                  required
                  value={formData.cafeteriaName}
                  onChange={handleInputChange}
                  placeholder="Ej: The Brew Lab Panamá"
                  className={inputCls} />
              </div>

              {/* Representante Legal & RUC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={labelCls} htmlFor="legalRepresentative">Representante Legal (Op)</label>
                  <input id="legalRepresentative" name="legalRepresentative" type="text"
                    value={formData.legalRepresentative}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan Pérez"
                    className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls} htmlFor="ruc">RUC *</label>
                  <input id="ruc" name="ruc" type="text"
                    required
                    value={formData.ruc}
                    onChange={(e) => {
                      let val = e.target.value.toUpperCase();
                      // Regex para formato X-XXX-XXX (simplificado)
                      if (val.length <= 9) {
                        setFormData(prev => ({ ...prev, ruc: val }));
                      }
                    }}
                    onBlur={(e) => {
                      const rucRegex = /^[\w\d]-[\w\d]{3,4}-[\w\d]{3,4}$/;
                      // No bloqueamos pero podemos avisar o el server validará
                    }}
                    placeholder="Ej: 8-888-888"
                    className={inputCls} />
                </div>
              </div>

              {/* Barrio y Mapa movidos a Tab Ubicación */}

              {/* Categoría de competencia */}
              <div className="flex flex-col gap-2">
                <label className={labelCls}>Categoría de competencia</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "Filtrado", label: "Filtrado" },
                    { id: "Espresso", label: "Espresso" },
                    { id: "Bebida de Autor", label: "Bebida de Autor" }
                  ].map((opt) => {
                    const isSelected = categories.includes(opt.id);
                    return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setCategories(prev => 
                          prev.includes(opt.id) ? prev.filter(c => c !== opt.id) : [...prev, opt.id]
                        );
                      }}
                      className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? "bg-[#cddbf2] text-[#38050e] border-[#cddbf2]"
                          : "bg-[#cddbf2]/10 text-[#cddbf2] border-[#cddbf2]/20 hover:bg-[#cddbf2]/20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  )})}
                </div>
                {categories.map(cat => (
                  <input key={cat} type="hidden" name="competitionCategory" value={cat} />
                ))}
              </div>

              {/* Tipo de negocio */}
              <div className="flex flex-col gap-2">
                <label className={labelCls}>Tipo de Negocio</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "coffee", label: "Coffee Shop" },
                    { id: "hotel", label: "Hotel" },
                    { id: "rest", label: "Restaurante" }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBusinessType(opt.id)}
                      className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                        businessType === opt.id
                          ? "bg-[#cddbf2] text-[#38050e] border-[#cddbf2]"
                          : "bg-[#cddbf2]/10 text-[#cddbf2] border-[#cddbf2]/20 hover:bg-[#cddbf2]/20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="businessType" value={businessType} />
              </div>

              {/* Información Adicional */}
              <div className="flex flex-col gap-2">
                <label className={labelCls} htmlFor="description">Descripción de la Cafetería</label>
                <textarea id="description" name="description" rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Cuéntanos sobre tu cafetería, historia, especialidades..."
                  className={`${inputCls} resize-none`} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={labelCls} htmlFor="hours">Horarios de atención</label>
                  <input id="hours" name="hours" type="text"
                    value={formData.hours}
                    onChange={handleInputChange}
                    placeholder="Ej: Lun-Vie 8am - 6pm"
                    className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelCls} htmlFor="phone">Teléfono</label>
                  <input id="phone" name="phone" type="text"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ej: +507 6000-0000"
                    className={inputCls} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelCls} htmlFor="web">Sitio web o Instagram</label>
                <input id="web" name="web" type="text"
                  value={formData.web}
                  onChange={handleInputChange}
                  placeholder="Ej: instagram.com/tu_cafe"
                  className={inputCls} />
              </div>

              {/* Foto de portada movida a Tab Imágenes */}

              {isIncomplete.cafeteria && (
                <p className="text-red-400 text-[10px] font-medium flex items-center gap-1.5 pl-1 animate-pulse">
                  <span>⚠️</span> Por favor, completa los datos obligatorios de la cafetería.
                </p>
              )}

              <button type="submit" disabled={cafPending}
                className="w-full py-3.5 rounded-xl bg-[#cddbf2] text-[#38050e] font-semibold tracking-wide hover:bg-[#cddbf2]/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#38050e]/20">
                {cafPending ? "Guardando..." : "Guardar Datos de Cafetería"}
              </button>
            </form>
          </section>
        )}

        {/* ─────────────────── SECCIÓN: Ubicación ─────────────────── */}
        {user.role === "cafeteria" && activeTab === "ubicacion" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-[#cddbf2]/90 text-xs font-semibold uppercase tracking-widest mb-4 pl-1">
              📍 Ubicación de la Cafetería
            </h2>
            <form action={cafAction} className="flex flex-col gap-4">
              <input type="hidden" name="targetUserId" value={user._id || user.id || ""} />
              {/* Sincronizar datos que no están en este tab */}
              <input type="hidden" name="cafeteriaName" value={formData.cafeteriaName} />
              <input type="hidden" name="legalRepresentative" value={formData.legalRepresentative} />
              <input type="hidden" name="ruc" value={formData.ruc} />
              <input type="hidden" name="businessType" value={businessType} />
              <input type="hidden" name="description" value={formData.description} />
              <input type="hidden" name="hours" value={formData.hours} />
              <input type="hidden" name="phone" value={formData.phone} />
              <input type="hidden" name="web" value={formData.web} />
              {categories.map(cat => <input key={cat} type="hidden" name="competitionCategory" value={cat} />)}
              
              <div className="flex flex-col gap-1">
                <FlashMessage msg={cafErr} type="error" />
                <FlashMessage msg={cafMsg} type="success" />
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelCls} htmlFor="neighborhood">Barrio o ubicación en Panamá *</label>
                <div className="flex gap-2">
                  <input id="neighborhood" name="neighborhood" type="text"
                    required
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Ej: Casco Viejo, San Francisco..."
                    className={inputCls} />
                  <button type="button" onClick={handleGeocode} className="px-4 py-2 rounded-xl bg-[#cddbf2]/10 hover:bg-[#cddbf2]/20 text-[#cddbf2] font-medium text-sm transition-colors border border-[#cddbf2]/10 whitespace-nowrap">
                    Buscar en Mapa
                  </button>
                </div>
                {mapMsg && <p className="text-amber-400 text-xs pl-1">{mapMsg}</p>}
                <div className="mt-2 relative z-0">
                   <MapPicker 
                     initialLat={locationLat} 
                     initialLng={locationLng} 
                     onLocationChange={(lat, lng) => {
                       setLocationLat(lat);
                       setLocationLng(lng);
                     }} 
                   />
                </div>
                <input type="hidden" name="locationLat" value={locationLat ?? ""} />
                <input type="hidden" name="locationLng" value={locationLng ?? ""} />
              </div>

              {isIncomplete.ubicacion && (
                <p className="text-red-400 text-[10px] font-medium flex items-center gap-1.5 pl-1 animate-pulse">
                  <span>⚠️</span> Por favor, indica el barrio y marca la ubicación en el mapa.
                </p>
              )}

              <button type="submit" disabled={cafPending}
                className="w-full py-3.5 rounded-xl bg-[#cddbf2] text-[#38050e] font-semibold tracking-wide hover:bg-[#cddbf2]/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#38050e]/20">
                {cafPending ? "Guardando Ubicación..." : "Guardar Ubicación"}
              </button>
            </form>
          </section>
        )}

        {/* ── Módulo de Imágenes ── */}
        {user.role === "cafeteria" && activeTab === "imagenes" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-[#cddbf2]/90 text-xs font-semibold uppercase tracking-widest mb-4 pl-1">
              📸 Imágenes de la Cafetería
            </h2>

            {/* Foto de portada */}
            <div className="mb-8 p-4 rounded-2xl bg-black/20 border border-white/10">
              <h3 className="text-[#cddbf2]/70 text-xs font-semibold uppercase tracking-wider mb-4 pl-1">
                Foto de Portada *
              </h3>
              <form action={cafAction} className="flex flex-col gap-4">
                <input type="hidden" name="targetUserId" value={user._id || user.id || ""} />
                {/* Sincronizar datos */}
                <input type="hidden" name="cafeteriaName" value={formData.cafeteriaName} />
                <input type="hidden" name="legalRepresentative" value={formData.legalRepresentative} />
                <input type="hidden" name="ruc" value={formData.ruc} />
                <input type="hidden" name="businessType" value={businessType} />
                <input type="hidden" name="neighborhood" value={formData.neighborhood} />
                <input type="hidden" name="locationLat" value={locationLat ?? ""} />
                <input type="hidden" name="locationLng" value={locationLng ?? ""} />
                {categories.map(cat => <input key={cat} type="hidden" name="competitionCategory" value={cat} />)}

                <div className="flex flex-col gap-2">
                  {coverPreview && (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 mb-2">
                      <Image src={coverPreview} alt="Portada" fill className="object-cover" />
                    </div>
                  )}
                  <input
                    id="coverImage" name="coverImage" type="file" accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert("La imagen no debe exceder los 2MB");
                          e.target.value = "";
                          return;
                        }
                        setCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-sm text-[#cddbf2]/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#cddbf2]/20 file:text-[#cddbf2] file:font-medium file:cursor-pointer hover:file:bg-[#cddbf2]/30 transition-all cursor-pointer"
                  />
                  <p className="text-[10px] text-[#cddbf2]/40 pl-1 italic">Máximo 2MB. Formatos: .jpg, .png, .webp</p>
                </div>

                <button type="submit" disabled={cafPending}
                  className="w-full py-3 rounded-xl bg-[#cddbf2]/10 hover:bg-[#cddbf2]/20 text-[#cddbf2] font-semibold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-[#cddbf2]/10">
                  {cafPending ? "Guardando..." : "Actualizar Foto de Portada"}
                </button>
              </form>
            </div>

            <h3 className="text-[#cddbf2]/70 text-xs font-semibold uppercase tracking-wider mb-4 pl-1">
              Galería (Máximo {maxGalleryImages}) *
            </h3>


            {user.gallery && user.gallery.length === 0 ? (
              <p className="text-[#cddbf2]/40 text-sm text-center py-4">
                Aún no has agregado imágenes a tu galería.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {(user.gallery || []).map((url: string, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                    <Image src={url} alt="Galería" fill className="object-cover" />
                    <button type="button" onClick={() => handleDeleteGalleryImage(url)} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs shadow-lg">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(!user.gallery || user.gallery.length < maxGalleryImages) && (
              <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
              <h3 className="text-[#cddbf2]/70 text-xs font-semibold uppercase tracking-wider mb-3">
                Añadir a la galería (Máximo {maxGalleryImages})
              </h3>
                <form ref={galleryFormRef} action={galleryAction} className="flex flex-col gap-3">
                  <input type="hidden" name="targetUserId" value={user._id || user.id || ""} />
                  <div className="flex flex-col gap-1">
                    <FlashMessage msg={galleryErr} type="error" />
                    <FlashMessage msg={galleryMsg} type="success" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <input name="gallery" type="file" accept="image/jpeg,image/png,image/webp" multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        for (const file of files) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert(`La imagen ${file.name} excede los 2MB`);
                            e.target.value = "";
                            return;
                          }
                        }
                      }}
                      className="w-full text-sm text-[#cddbf2]/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#cddbf2]/10 file:text-[#cddbf2]/70 file:font-medium file:cursor-pointer hover:file:bg-[#cddbf2]/20 transition-all cursor-pointer"
                    />
                    <p className="text-[10px] text-[#cddbf2]/40 pl-1 italic text-center">Formatos: .jpg, .png, .webp (Máx. 2MB cada una)</p>
                  </div>
                  <button type="submit" disabled={galleryPending}
                    className="w-full py-3 rounded-xl bg-[#cddbf2]/10 hover:bg-[#cddbf2]/20 text-[#cddbf2] font-semibold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-[#cddbf2]/10">
                    {galleryPending ? "Subiendo..." : "Subir Imágenes"}
                  </button>
                </form>
              </div>
            )}

            {isIncomplete.gallery && (
              <p className="mt-4 text-red-400 text-[10px] font-medium flex items-center gap-1.5 pl-1 animate-pulse">
                <span>⚠️</span> Debes subir al menos una imagen a tu galería.
              </p>
            )}
          </section>
        )}

        {/* ── Módulo de Baristas ── */}
        {user.role === "cafeteria" && activeTab === "baristas" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-[#cddbf2]/90 text-xs font-semibold uppercase tracking-widest mb-4 pl-1">
              👤 Baristas
            </h2>

            {/* Lista de baristas */}
            {baristas.length === 0 ? (
              <p className="text-[#cddbf2]/40 text-sm text-center py-4">
                Aún no has agregado baristas.
              </p>
            ) : (
              <ul className="flex flex-col gap-3 mb-6">
                {baristas.map((b) => (
                  <li key={b._id}
                    className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${b.isHighlighted
                      ? "bg-[#cddbf2]/10 border-[#cddbf2]/50"
                      : "bg-black/20 border-white/10"
                      }`}>
                    {/* Foto */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                      {b.photo ? (
                        <Image src={b.photo} alt={b.fullName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/40 text-lg">
                          👤
                        </div>
                      )}
                    </div>

                    {/* Nombre + badge */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#cddbf2] font-medium text-sm truncate">{b.fullName}</p>
                      {b.isHighlighted && (
                        <span className="text-xs text-[#cddbf2] font-semibold">★ Destacado</span>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!b.isHighlighted && (
                        <button
                          type="button"
                          onClick={() => handleHighlight(b._id)}
                          title="Marcar como destacado"
                          className="text-xs px-3 py-1.5 rounded-lg bg-[#cddbf2]/20 hover:bg-[#cddbf2]/40 text-[#cddbf2] font-semibold transition-colors">
                          ★ Destacar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(b._id)}
                        title="Eliminar barista"
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 font-semibold transition-colors">
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Formulario agregar barista */}
            <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
              <h3 className="text-[#cddbf2]/70 text-xs font-semibold uppercase tracking-wider mb-3">
                Agregar Barista
              </h3>
              <form ref={baristaFormRef} action={baristaAction} className="flex flex-col gap-3">
                <input type="hidden" name="targetUserId" value={user._id || user.id || ""} />
                <div className="flex flex-col gap-1">
                  <FlashMessage msg={baristaErr} type="error" />
                  <FlashMessage msg={baristaMsg} type="success" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelCls} htmlFor="fullName">Nombre completo</label>
                  <input id="fullName" name="fullName" type="text" required
                    placeholder="Ej: María González"
                    className={inputCls} />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelCls} htmlFor="baristaPhoto">Foto del barista</label>
                  {baristaPhotoPreview && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border border-white/20">
                      <Image src={baristaPhotoPreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <input id="baristaPhoto" name="photo" type="file" accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert("La foto del barista no debe exceder los 2MB");
                          e.target.value = "";
                          return;
                        }
                        setBaristaPhotoPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-sm text-[#cddbf2]/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#cddbf2]/10 file:text-[#cddbf2]/70 file:font-medium file:cursor-pointer hover:file:bg-[#cddbf2]/20 transition-all cursor-pointer"
                  />
                  <p className="text-[10px] text-[#cddbf2]/40 pl-1 italic">Máximo 2MB. Formatos: .jpg, .png, .webp</p>
                </div>

                <button type="submit" disabled={baristaPending}
                  className="w-full py-3 rounded-xl bg-[#cddbf2]/10 hover:bg-[#cddbf2]/20 text-[#cddbf2] font-semibold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-[#cddbf2]/10">
                  {baristaPending ? "Agregando..." : "+ Agregar Barista"}
                </button>
              </form>
            </div>

            {isIncomplete.baristas && (
              <p className="mt-4 text-red-400 text-[10px] font-medium flex items-center gap-1.5 pl-1 animate-pulse">
                <span>⚠️</span> Debes agregar al menos un barista a tu cafetería.
              </p>
            )}
          </section>
        )}
      </div>

      {/* ─── Modal de QR ─── */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#38050e] rounded-3xl border border-[#cddbf2]/20 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-[#cddbf2]/40 hover:text-[#cddbf2] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" style={{ strokeWidth: 2.5 }}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#cddbf2]/10 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#cddbf2] fill-none stroke-current" style={{ strokeWidth: 2 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5 5-5m-5 5V3" />
                </svg>
              </div>
              
              <h2 className="text-[#cddbf2] text-xl font-bold mb-2">Código QR del Perfil</h2>
              <p className="text-[#cddbf2]/50 text-xs mb-8">Descarga e imprime para tu establecimiento</p>
              
              <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/participantes/${getSlugId(user.cafeteriaName, user._id || user.id)}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <h3 className="text-[#cddbf2] font-bold text-sm mb-2">¡Listo para compartir!</h3>
              <p className="text-[#cddbf2]/60 text-xs mb-8 leading-relaxed">
                Tus clientes podrán escanear este código para ver tu historia, conocer a tus baristas y votar por ti directamente.
              </p>
              
              <button 
                onClick={downloadQR}
                className="w-full py-4 rounded-xl bg-[#cddbf2] text-[#38050e] font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" style={{ strokeWidth: 2 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5 5-5m-5 5V3" />
                </svg>
                Descargar para Impresión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
