"use client";

import { useActionState, useState } from "react";
import { updateDetailedCafeteriaProfile } from "@/app/actions/cafeteria";
import FlashMessage from "@/app/components/FlashMessage";
import MapPicker from "@/app/components/MapPicker";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DetailedCafeteriaForm({ user, onClose }: { user: any; onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateDetailedCafeteriaProfile, null);
  const [locationLat, setLocationLat] = useState<number | null>(user.locationLat);
  const [locationLng, setLocationLng] = useState<number | null>(user.locationLng);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  const inputCls = "w-full mt-1.5 px-4 py-3 rounded-xl bg-[#cddbf2] border border-[#cddbf2]/10 text-[#38050e] focus:ring-2 focus:ring-[#cddbf2]/50 focus:outline-none transition-shadow text-sm";
  const labelCls = "text-xs font-bold text-[#cddbf2]/70 uppercase tracking-widest pl-1";
  const sectionCls = "space-y-6 bg-black/20 p-6 rounded-2xl border border-white/5";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#38050e] border border-[#cddbf2]/20 rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#38050e] z-10 pb-4 border-b border-[#cddbf2]/10">
          <div>
            <h2 className="text-2xl font-black text-[#cddbf2] tracking-tight">Información Detallada del Participante</h2>
            <p className="text-[#cddbf2]/50 text-sm">{user.cafeteriaName || user.name}</p>
          </div>
          <button onClick={onClose} className="text-[#cddbf2] hover:text-white font-bold text-2xl transition-colors">✕</button>
        </div>

        {state?.success && <FlashMessage msg={state.success} type="success" />}
        {state?.error && <FlashMessage msg={state.error} type="error" />}

        <form action={action} className="space-y-10">
          <input type="hidden" name="targetUserId" value={user.id || user._id} />

          {/* SECCION 1: Identidad Legal y Comercial */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-[#cddbf2] border-l-4 border-[#cddbf2] pl-3">Identidad Legal y Comercial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Nombre de Razón Social (Identidad Legal)</label>
                <input name="legalName" defaultValue={user.legalName} placeholder="Ej: Café de Panamá S.A." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Nombre Comercial (Público)</label>
                <input name="cafeteriaName" defaultValue={user.cafeteriaName} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}># de Aviso de Operación</label>
                <input name="operationNotice" defaultValue={user.operationNotice} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>RUC</label>
                <input name="ruc" defaultValue={user.ruc} className={inputCls} />
              </div>
            </div>
          </div>

          {/* SECCION 2: Representante y Empresa */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-[#cddbf2] border-l-4 border-[#cddbf2] pl-3">Representante y Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Nombre de Representante</label>
                <input name="legalRepresentative" defaultValue={user.legalRepresentative} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Cargo del Representante</label>
                <input name="legalRepresentativePosition" defaultValue={user.legalRepresentativePosition} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Años de existencia</label>
                <input type="number" name="yearsOfExistence" defaultValue={user.yearsOfExistence} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Provincia / Ubicación</label>
                <input name="province" defaultValue={user.province} placeholder="Ej: Chiriquí" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}># de Sucursales</label>
                <input type="number" name="branchesCount" defaultValue={user.branchesCount} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}># Total de Baristas</label>
                <input type="number" name="totalBaristas" defaultValue={user.totalBaristas} className={inputCls} />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className={labelCls}>Dirección Detallada / Barrio</label>
              <input name="neighborhood" defaultValue={user.neighborhood} className={inputCls} placeholder="Ej: San Francisco, Calle 74" />
              
              <div className="h-60 w-full rounded-xl overflow-hidden border border-[#cddbf2]/20 relative z-0">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="sellsPanamanianCoffee" value="true" defaultChecked={user.sellsPanamanianCoffee} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Vende café panameño?</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="acceptsNotifications" value="true" defaultChecked={user.acceptsNotifications !== false} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">Acepta recibir notificaciones</span>
              </label>
            </div>
          </div>

          {/* SECCION 3: Especificaciones de Café */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-[#cddbf2] border-l-4 border-[#cddbf2] pl-3">Especificaciones de Café</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Nombre de la Finca</label>
                <input name="farmName" defaultValue={user.farmName} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Variedades que vende</label>
                <input name="coffeeVarietiesText" defaultValue={user.coffeeVarieties?.join(", ")} placeholder="Caturra, Geisha, etc..." className={inputCls} />
                <p className="text-[10px] text-[#cddbf2]/40 mt-1 italic pl-1">Separadas por comas</p>
              </div>
              <div>
                <label className={labelCls}>Marca de Máquina</label>
                <input name="machineBrand" defaultValue={user.machineBrand} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Marca de Molino</label>
                <input name="grinderBrand" defaultValue={user.grinderBrand} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="roastsOwnCoffee" value="true" defaultChecked={user.roastsOwnCoffee} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Usted hace el tostado?</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="makesOwnProfile" value="true" defaultChecked={user.makesOwnProfile} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Hace el perfil de su café?</span>
              </label>
            </div>

            <div className="mt-6">
              <label className={labelCls}>Experiencias alrededor del café</label>
              <textarea name="coffeeExperiences" defaultValue={user.coffeeExperiences} rows={3} className={`${inputCls} resize-none`} placeholder="Cuéntenos más sobre las experiencias que ofrece..." />
            </div>
          </div>

          {/* SECCION 4: Visión Internacional */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-[#cddbf2] border-l-4 border-[#cddbf2] pl-3">Visión Internacional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <label className="flex items-center gap-3 cursor-pointer group mt-4">
                <input type="checkbox" name="wantsToInternationalize" value="true" defaultChecked={user.wantsToInternationalize} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Desea internacionalizarse o franquiciar?</span>
              </label>
              <div>
                <label className={labelCls}>¿A qué mercados?</label>
                <input name="targetMarkets" defaultValue={user.targetMarkets} className={inputCls} />
              </div>
            </div>
          </div>

          {/* SECCION 5: Información del Barista Principal */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-[#cddbf2] border-l-4 border-[#cddbf2] pl-3">Información Barista Principal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Nombre Barista Principal</label>
                <input name="mainBaristaName" defaultValue={user.mainBaristaName} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Especialidad</label>
                <input name="mainBaristaSpecialty" defaultValue={user.mainBaristaSpecialty} className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Formación y Trayectoria</label>
                <textarea name="mainBaristaTraining" defaultValue={user.mainBaristaTraining} rows={3} className={`${inputCls} resize-none`} placeholder="Breve explicación de la formación, certificaciones, años de experiencia..." />
              </div>
              <div>
                <label className={labelCls}>Años de Experiencia</label>
                <input type="number" name="mainBaristaYearsExp" defaultValue={user.mainBaristaYearsExp} className={inputCls} />
              </div>
              <div className="flex flex-col gap-3 justify-center">
                 <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" name="mainBaristaCertified" value="true" defaultChecked={user.mainBaristaCertified} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                  <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Cuenta con certificaciones?</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" name="mainBaristaSCA" value="true" defaultChecked={user.mainBaristaSCA} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                  <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Avalada por SCA?</span>
                </label>
              </div>
            </div>
          </div>

          {/* SECCION 6: Diversidad y Formación del Equipo */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-[#cddbf2] border-l-4 border-[#cddbf2] pl-3">Diversidad y Formación del Equipo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Mujeres Baristas</label>
                <input type="number" name="femaleBaristasCount" defaultValue={user.femaleBaristasCount} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Hombres Baristas</label>
                <input type="number" name="maleBaristasCount" defaultValue={user.maleBaristasCount} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Nivel de Formación General</label>
                <select name="trainingLevel" defaultValue={user.trainingLevel} className={inputCls}>
                  <option value="">Seleccione...</option>
                  <option value="básico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Instructor o Medio de formación</label>
                <input name="trainingInstructor" defaultValue={user.trainingInstructor} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
               <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="hasCertifiedTraining" value="true" defaultChecked={user.hasCertifiedTraining} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Tiene formación certificada?</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="trainingSCA" value="true" defaultChecked={user.trainingSCA} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Formación avalada por SCA?</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="interestInCertification" value="true" defaultChecked={user.interestInCertification} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Interés en certificarse?</span>
              </label>
               <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="wantsToJoinCommittee" value="true" defaultChecked={user.wantsToJoinCommittee} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Desea ser parte del comité país?</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="hasDisabledStaff" value="true" defaultChecked={user.hasDisabledStaff} className="w-5 h-5 rounded border-[#cddbf2]/30 bg-[#cddbf2]/10 text-[#cddbf2] focus:ring-[#cddbf2]/50" />
                <span className="text-sm font-semibold text-[#cddbf2]/80 group-hover:text-[#cddbf2] transition-colors">¿Hay personas con discapacidad?</span>
              </label>
            </div>

             <div className="mt-6">
                <label className={labelCls}>Especialidades de interés (Mencione 3)</label>
                <input name="certificationInterestsText" defaultValue={user.certificationInterests?.join(", ")} placeholder="Ej: Tostado, Sensory, Green Coffee..." className={inputCls} />
              </div>
          </div>

          <div className="sticky bottom-0 bg-[#38050e] pt-6 pb-2 border-t border-[#cddbf2]/10 flex justify-end gap-4 z-10">
            <button type="button" onClick={onClose} className="px-8 py-3.5 rounded-xl bg-[#2a040b] hover:bg-[#38050e] border border-[#cddbf2]/10 text-[#cddbf2] font-bold transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={pending} className="px-10 py-3.5 rounded-xl bg-[#cddbf2] hover:bg-[#cddbf2]/90 text-[#38050e] font-bold shadow-xl transition-all disabled:opacity-50">
              {pending ? "Guardando..." : "Guardar Información Detallada"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
