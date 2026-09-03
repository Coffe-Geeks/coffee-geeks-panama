"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitVote, submitPublicVote, getActiveCafeteriasForVoting } from "@/app/actions/voting";
import { login, register } from "@/app/actions/auth";
import PrivacyCheckbox from "@/app/components/PrivacyCheckbox";

interface VoteModalProps {
  open: boolean;
  preselected?: string | null;
  onClose: () => void;
}

export default function VoteModal({ open, preselected, onClose }: VoteModalProps) {
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Elegir, 2: Calificar, 3: Éxito, 4: Auth
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Data del servidor
  const [shops, setShops] = useState<any[]>([]);
  const [round, setRound] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("user");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Auth local states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Calificaciones (jueces)
  const [exp, setExp] = useState<number>(0);
  const [pres, setPres] = useState<number>(0);
  const [cup, setCup] = useState<number>(0);

  // Voto popular simplificado: barista favorito (1–5) + bebida favorita
  const [publicVotingEnabled, setPublicVotingEnabled] = useState(false);
  const [scoreBarista, setScoreBarista] = useState<number>(0);
  const [favoriteDrink, setFavoriteDrink] = useState<"" | "espresso" | "filtrado" | "signature">("");

  const router = useRouter();

  // Fetch data on open
  useEffect(() => {
    if (open) {
      setStep(1);
      setExp(0);
      setPres(0);
      setCup(0);
      setScoreBarista(0);
      setFavoriteDrink("");
      setErrorMsg("");
      setSelectedId(preselected || null);

      if (shops.length === 0) {
        setLoadingData(true);
        getActiveCafeteriasForVoting()
          .then((res) => {
            setShops(res.cafeterias);
            setRound(res.round);
            setUserRole(res.userRole);
            setIsAuthenticated(res.isAuthenticated || false);
            setPublicVotingEnabled((res as any).publicVotingEnabled || false);

            // Si hay preselected, saltamos directo al paso 2 si existe la cafetería
            if (preselected && res.cafeterias.some((c: any) => c.id === preselected)) {
              setStep(2);
            }

            setLoadingData(false);
          })
          .catch((err) => {
            console.error(err);
            setErrorMsg("Error al cargar las cafeterías.");
            setLoadingData(false);
          });
      } else {
        // Ya teníamos la data
        if (preselected && shops.some((c: any) => c.id === preselected)) {
          setStep(2);
        }
      }
    }
  }, [open, preselected, shops.length]); // eslint-disable-line

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleNextStep = () => {
    if (!selectedId) {
      setErrorMsg("Selecciona una cafetería primero.");
      return;
    }
    const shop = shops.find(s => s.id === selectedId);
    // El público puede votar por cualquier barista de la casa; los jueces
    // evalúan al destacado.
    const baristaRequerido = isPublicVoter ? shop?.baristaAnyId : shop?.baristaId;
    if (!shop || !baristaRequerido) {
      setErrorMsg("Esta cafetería no tiene un barista asignado para votar.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleVote = async () => {
    const esPublico = isPublicVoter;
    if (esPublico) {
      if (!selectedId || scoreBarista === 0 || !favoriteDrink) {
        setErrorMsg("Califica al barista y elige tu bebida favorita antes de votar.");
        return;
      }
    } else if (!selectedId || exp === 0 || pres === 0 || cup === 0) {
      setErrorMsg("Debes calificar todos los criterios antes de enviar tu voto.");
      return;
    }

    const shop = shops.find(s => s.id === selectedId);
    if (!shop) return;

    if (!isAuthenticated) {
      setStep(4);
      return;
    }

    setLoadingSubmit(true);
    setErrorMsg("");

    const res = esPublico
      ? await submitPublicVote(shop.id, shop.baristaAnyId || shop.baristaId, {
          scoreBarista,
          favoriteDrink: favoriteDrink as "espresso" | "filtrado" | "signature",
        })
      : await submitVote(shop.id, shop.baristaId, {
          scoreExperience: exp,
          scorePresence: pres,
          scoreCup: cup
        });

    setLoadingSubmit(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setStep(3);
      setTimeout(() => {
        onClose();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }, 2100);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "register" && !privacyAccepted) {
      setErrorMsg("Debes aceptar las políticas de privacidad.");
      return;
    }
    setAuthLoading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("email", authEmail);
    formData.append("password", authPassword);
    formData.append("ajax", "true");
    formData.append("role", "user");

    if (authMode === "register") {
      formData.append("name", authName);

      if (typeof window !== "undefined" && (window as any).grecaptcha) {
        try {
          const token = await (window as any).grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'register_modal' });
          formData.append("recaptchaToken", token);
        } catch (err) {
          console.error("reCAPTCHA error:", err);
        }
      }

      const res = await register(null, formData);
      if (res?.error) {
        setErrorMsg(res.error);
        setAuthLoading(false);
        return;
      }
    } else {
      const res = await login(null, formData);
      if (res?.error) {
        setErrorMsg(res.error);
        setAuthLoading(false);
        return;
      }
    }

    setIsAuthenticated(true);
    setUserRole("user"); // Simplified for now since we just need it to continue
    setAuthLoading(false);
    setErrorMsg("");
    setStep(2);
  };

  const renderStars = (value: number, setValue: (v: number) => void) => {
    return (
      <div className="vm-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} de 5`}
            onClick={() => setValue(star)}
            className={`vm-star${value >= star ? " on" : ""}${value === star ? " last" : ""}`}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.65 1.13 6.57L12 17.56l-5.9 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const renderR2Scale = (
    value: number,
    setValue: (v: number) => void,
    customOptions?: { v: number; label: string }[]
  ) => {
    const defaultOptions = [
      { v: 1, label: "Bueno" },
      { v: 2, label: "Excelente" },
      { v: 3, label: "Excepcional" },
    ];
    const options = customOptions || defaultOptions;
    return (
      <div className="vm-opts">
        {options.map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => setValue(opt.v)}
            className={`vm-opt${value === opt.v ? " sel" : ""}`}
          >
            <span className="vm-opt-name">{opt.label}</span>
            <span className="vm-opt-check">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
          </button>
        ))}
      </div>
    );
  };

  const selectedShop = shops.find(s => s.id === selectedId);
  // El público vota con el flujo simplificado (barista + bebida favorita);
  // hasta que se encienda el interruptor, su votación permanece cerrada.
  const isPublicVoter = userRole === "user";
  const isVotingBlockedForRole =
    userRole === "cafeteria" ||
    (isPublicVoter && !publicVotingEnabled) ||
    (round === 1 && userRole === "juez_internacional");

  const progress = step === 1 ? 1 : step === 2 || step === 4 ? 2 : 3;

  const drinkOptions = selectedShop ? ([
    { key: "espresso", label: "Espresso", sub: "Intenso, corto y directo", photo: selectedShop.drinks?.espressoPhoto, available: selectedShop.drinks?.espresso },
    { key: "filtrado", label: "Filtrado", sub: "Método de la casa", photo: selectedShop.drinks?.filtradoPhoto, available: selectedShop.drinks?.filtrado },
    {
      key: "signature",
      label: "Bebida de autor",
      sub: selectedShop.drinks?.signatureName || "Creación original de la casa",
      photo: selectedShop.drinks?.signaturePhoto,
      available: selectedShop.drinks?.signature,
    },
  ] as const).filter((d) => d.available) : [];

  return (
    <>
      <style>{`
        .ov{position:fixed;inset:0;z-index:500;background:rgba(22,4,9,.76);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:18px;opacity:0;pointer-events:none;transition:opacity .3s ease}
        .ov.open{opacity:1;pointer-events:all}
        .mod{background:#fff;border-radius:28px;width:100%;max-width:640px;overflow:hidden;transform:translateY(26px) scale(.97);opacity:0;transition:transform .45s cubic-bezier(.16,1,.3,1),opacity .35s ease;box-shadow:0 32px 80px rgba(22,4,9,.45);display:flex;flex-direction:column;max-height:calc(100dvh - 36px)}
        .ov.open .mod{transform:translateY(0) scale(1);opacity:1}

        .mod-hd{background:#38050e;padding:24px 30px 20px;position:relative;flex-shrink:0}
        .mod-x{position:absolute;top:16px;right:16px;width:34px;height:34px;border:none;background:rgba(255,255,255,.1);border-radius:50%;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,transform .2s}
        .mod-x:hover{background:rgba(255,255,255,.22)}
        .mod-x:active{transform:scale(.92)}
        .mod-x svg{width:14px;height:14px;stroke:currentColor;stroke-width:2.2;fill:none}
        .mod-t{font-family:'Barlow Condensed',sans-serif;font-size:1.7rem;font-weight:900;text-transform:uppercase;color:#fff;line-height:1}
        .mod-s{font-size:13px;color:rgba(255,255,255,.5);margin-top:5px;font-family:'Barlow',sans-serif}

        /* Progreso: tres tramos finos, sin números */
        .vm-prog{display:flex;gap:5px;margin-top:16px}
        .vm-seg{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.14);overflow:hidden;position:relative}
        .vm-seg::after{content:"";position:absolute;inset:0;background:#cddbf2;transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.16,1,.3,1)}
        .vm-seg.on::after{transform:scaleX(1)}

        .mod-body{padding:26px 30px 30px;overflow-y:auto}

        /* Cada paso entra con un deslizamiento suave */
        .vm-step{animation:vmIn .4s cubic-bezier(.16,1,.3,1)}
        @keyframes vmIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

        .vm-q{font-family:'Barlow Condensed',sans-serif;font-size:1.05rem;font-weight:900;text-transform:uppercase;color:#38050e;letter-spacing:.02em}
        .vm-hint{font-family:'Barlow',sans-serif;font-size:13px;color:rgba(56,5,14,.55);margin-top:2px}

        /* Paso 1: cafeterías */
        .shop-opts{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:16px 0 4px;max-height:320px;overflow-y:auto;padding:2px 4px 2px 2px}
        .sopt{background:#f8f4ea;border-radius:14px;padding:12px 13px;display:flex;align-items:center;gap:12px;cursor:pointer;border:2px solid transparent;transition:border-color .22s,background .22s,transform .22s,box-shadow .22s;position:relative}
        .sopt:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(56,5,14,.09)}
        .sopt:active{transform:scale(.98)}
        .sopt.sel{border-color:#38050e;background:#cddbf2}
        .sopt-img{width:52px;height:52px;border-radius:10px;background-size:cover;background-position:center top;background-color:#e8dfd0;flex-shrink:0}
        .sopt-name{font-family:'Barlow Condensed',sans-serif;font-size:.92rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05}
        .sopt-loc{display:flex;align-items:center;gap:4px;font-size:11px;color:rgba(56,5,14,.55);font-family:'Barlow',sans-serif;margin-top:3px}
        .sopt-loc svg{width:10px;height:10px;stroke:currentColor;fill:none;stroke-width:1.8;flex-shrink:0}
        .sopt-tick{position:absolute;top:8px;right:8px;width:20px;height:20px;border-radius:50%;background:#38050e;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.4);transition:opacity .22s,transform .3s cubic-bezier(.34,1.56,.64,1)}
        .sopt.sel .sopt-tick{opacity:1;transform:scale(1)}
        .sopt-tick svg{width:11px;height:11px;stroke:#fff;stroke-width:3;fill:none}

        /* Paso 2: barista */
        .vm-bar{background:#38050e;border-radius:18px;padding:16px 18px;display:flex;align-items:center;gap:16px}
        .vm-bar-av{width:72px;height:72px;border-radius:50%;background-size:cover;background-position:center top;flex-shrink:0;border:2px solid rgba(255,255,255,.25)}
        .vm-bar-av.ph{display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);color:#cddbf2;font-family:'Barlow Condensed',sans-serif;font-size:1.7rem;font-weight:900}
        .vm-bar-k{font-family:'Barlow',sans-serif;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.45)}
        .vm-bar-n{font-family:'Barlow Condensed',sans-serif;font-size:1.35rem;font-weight:900;text-transform:uppercase;color:#fff;line-height:1.05;margin-top:2px}
        .vm-bar-c{font-family:'Barlow',sans-serif;font-size:12px;color:#cddbf2;margin-top:3px}

        /* Estrellas */
        .vm-stars{display:flex;gap:6px;margin-top:10px}
        .vm-star{width:42px;height:42px;border:none;background:#f8f4ea;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,transform .15s}
        .vm-star svg{width:22px;height:22px;fill:rgba(56,5,14,.18);transition:fill .2s,transform .2s}
        .vm-star:hover{background:#f1e9d8}
        .vm-star:hover svg{fill:rgba(56,5,14,.35)}
        .vm-star:active{transform:scale(.9)}
        .vm-star.on{background:#38050e}
        .vm-star.on svg{fill:#e9b64c}
        .vm-star.on.last svg{animation:starPop .35s cubic-bezier(.34,1.56,.64,1)}
        @keyframes starPop{0%{transform:scale(.5)}70%{transform:scale(1.25)}100%{transform:scale(1)}}

        /* Opciones (bebidas y escala R2) */
        .vm-opts{display:flex;flex-direction:column;gap:9px;margin-top:10px}
        .vm-opt{display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:12px 14px;border-radius:14px;border:2px solid #eee6d6;background:#fff;cursor:pointer;transition:border-color .22s,background .22s,transform .18s;position:relative}
        .vm-opt:hover{border-color:rgba(56,5,14,.35)}
        .vm-opt:active{transform:scale(.985)}
        .vm-opt.sel{border-color:#38050e;background:#38050e}
        .vm-opt-img{width:60px;height:60px;border-radius:10px;background-size:cover;background-position:center;flex-shrink:0}
        .vm-opt-ph{width:60px;height:60px;border-radius:10px;background:#f8f4ea;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .vm-opt-ph svg{width:24px;height:24px;stroke:rgba(56,5,14,.35);fill:none;stroke-width:1.6}
        .vm-opt.sel .vm-opt-ph{background:rgba(255,255,255,.1)}
        .vm-opt.sel .vm-opt-ph svg{stroke:rgba(255,255,255,.6)}
        .vm-opt-name{font-family:'Barlow Condensed',sans-serif;font-size:1.05rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;transition:color .22s}
        .vm-opt-sub{font-family:'Barlow',sans-serif;font-size:12px;color:rgba(56,5,14,.55);margin-top:2px;transition:color .22s}
        .vm-opt.sel .vm-opt-name{color:#fff}
        .vm-opt.sel .vm-opt-sub{color:rgba(255,255,255,.6)}
        .vm-opt-check{margin-left:auto;width:24px;height:24px;border-radius:50%;border:2px solid rgba(56,5,14,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .22s,background .22s}
        .vm-opt-check svg{width:12px;height:12px;stroke:transparent;stroke-width:3;fill:none;transition:stroke .15s}
        .vm-opt.sel .vm-opt-check{border-color:#cddbf2;background:#cddbf2}
        .vm-opt.sel .vm-opt-check svg{stroke:#38050e}

        .vm-sep{height:1px;background:#eee6d6;margin:18px 0}

        /* Botones */
        .vm-cta{width:100%;padding:16px;border:none;border-radius:50px;background:#38050e;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:900;letter-spacing:.09em;text-transform:uppercase;cursor:pointer;transition:transform .18s,box-shadow .25s,opacity .2s}
        .vm-cta:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 24px rgba(56,5,14,.28)}
        .vm-cta:active:not(:disabled){transform:translateY(0) scale(.98);box-shadow:none}
        .vm-cta:disabled{opacity:.3;cursor:default}
        .vm-back{flex-shrink:0;padding:16px 22px;border:none;border-radius:50px;background:#f4efe4;color:#38050e;font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:900;letter-spacing:.09em;text-transform:uppercase;cursor:pointer;transition:background .2s,transform .18s}
        .vm-back:hover{background:#cddbf2}
        .vm-back:active{transform:scale(.97)}
        .vm-note{font-family:'Barlow',sans-serif;font-size:11.5px;color:rgba(56,5,14,.45);text-align:center;margin-top:10px}

        .vm-err{background:#fdeaea;color:#b3261e;padding:12px 16px;border-radius:12px;font-size:13px;font-weight:600;text-align:center;border:1px solid #f6cfcc;font-family:'Barlow',sans-serif;animation:vmIn .3s ease}

        /* Éxito */
        .vm-ok{text-align:center;padding:36px 0 30px}
        .vm-ok-ring{width:84px;height:84px;margin:0 auto 18px;animation:okPop .5s cubic-bezier(.34,1.56,.64,1)}
        .vm-ok-ring circle{fill:none;stroke:#cddbf2;stroke-width:2.5}
        .vm-ok-ring path{fill:none;stroke:#38050e;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:40;stroke-dashoffset:40;animation:okDraw .5s .25s cubic-bezier(.16,1,.3,1) forwards}
        @keyframes okPop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
        @keyframes okDraw{to{stroke-dashoffset:0}}
        .vm-ok-t{font-family:'Barlow Condensed',sans-serif;font-size:1.7rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1}
        .vm-ok-s{font-family:'Barlow',sans-serif;font-size:14px;color:rgba(56,5,14,.6);margin-top:8px}

        /* Bloqueado / cerrado */
        .vm-lock{text-align:center;padding:38px 10px 30px}
        .vm-lock svg{width:40px;height:40px;stroke:#38050e;fill:none;stroke-width:1.6;margin:0 auto 14px;display:block;opacity:.8}
        .vm-lock-t{font-family:'Barlow Condensed',sans-serif;font-size:1.25rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.2;max-width:380px;margin:0 auto}

        /* Auth */
        .vm-tabs{display:flex;gap:8px}
        .vm-tab{flex:1;padding:13px;border:none;border-radius:50px;font-family:'Barlow Condensed',sans-serif;font-size:.95rem;font-weight:900;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;transition:background .25s,color .25s,transform .18s}
        .vm-tab:active{transform:scale(.97)}
        .vm-tab.on{background:#38050e;color:#fff}
        .vm-tab.off{background:#f4efe4;color:rgba(56,5,14,.55)}
        .vm-tab.off:hover{background:#cddbf2;color:#38050e}
        .vm-lbl{font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(56,5,14,.55);margin-bottom:5px;display:block}
        .vm-inp{width:100%;padding:14px 16px;border-radius:14px;border:1.5px solid #eee6d6;background:#faf7f0;color:#38050e;font-size:15px;font-family:'Barlow',sans-serif;outline:none;transition:border-color .2s,box-shadow .2s}
        .vm-inp::placeholder{color:rgba(56,5,14,.35)}
        .vm-inp:focus{border-color:#38050e;box-shadow:0 0 0 3px rgba(56,5,14,.1)}

        .toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%) translateY(46px);z-index:600;background:#38050e;color:#fff;padding:13px 26px;border-radius:50px;font-family:'Barlow Condensed',sans-serif;font-size:.88rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 10px 30px rgba(22,4,9,.35);opacity:0;transition:opacity .35s,transform .45s cubic-bezier(.16,1,.3,1);pointer-events:none;white-space:nowrap}
        .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

        @media(max-width:560px){
          .mod-hd{padding:20px 22px 18px}
          .mod-body{padding:20px 22px 24px}
          .shop-opts{grid-template-columns:1fr;max-height:300px}
          .mod-x{width:40px;height:40px;top:12px;right:12px}
          .vm-bar-av{width:60px;height:60px}
          .vm-star{width:min(42px,calc((100vw - 44px - 24px)/5));height:42px}
        }

        @media(prefers-reduced-motion:reduce){
          .mod,.ov,.vm-step,.vm-seg::after,.sopt,.sopt-tick,.vm-star,.vm-star.on.last svg,.vm-opt,.vm-cta,.vm-back,.vm-ok-ring,.vm-ok-ring path,.toast{animation:none!important;transition:none!important}
          .vm-ok-ring path{stroke-dashoffset:0}
        }
      `}</style>

      {/* Modal overlay */}
      <div className={`ov${open ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="mod" role="dialog" aria-modal="true" aria-label="Votar">
          {/* Header */}
          <div className="mod-hd">
            <button className="mod-x" onClick={onClose} aria-label="Cerrar">
              <svg viewBox="0 0 24 24"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
            </button>
            <div className="mod-t">Emitir mi voto</div>
            <div className="mod-s">
              {round === 0 ? "Votaciones cerradas" : `Ronda ${round}`}
              {selectedShop && !isVotingBlockedForRole ? ` · ${selectedShop.name}` : ""}
            </div>
            {round !== 0 && !isVotingBlockedForRole && step !== 3 && (
              <div className="vm-prog" aria-hidden="true">
                <div className={`vm-seg${progress >= 1 ? " on" : ""}`} />
                <div className={`vm-seg${progress >= 2 ? " on" : ""}`} />
                <div className={`vm-seg${progress >= 3 ? " on" : ""}`} />
              </div>
            )}
          </div>

          {/* Body */}
          <div className="mod-body">
            {round === 0 && !loadingData && (
              <div className="vm-lock vm-step">
                <svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                <div className="vm-lock-t">Las votaciones se encuentran cerradas en este momento.</div>
              </div>
            )}

            {isVotingBlockedForRole && !loadingData && (
              <div className="vm-lock vm-step">
                <svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                <div className="vm-lock-t">
                  {userRole === "cafeteria"
                    ? "Tu usuario no está habilitado para emitir votos."
                    : isPublicVoter
                    ? "La votación del público abre muy pronto. Vuelve para votar por tu barista favorito."
                    : "Las votaciones están temporalmente desactivadas para tu perfil en esta ronda."
                  }
                </div>
              </div>
            )}

            {round !== 0 && !isVotingBlockedForRole && step === 1 && (
              <div className="vm-step" key="s1">
                <div className="vm-q">¿Por cuál cafetería votas?</div>
                <div className="vm-hint">Toca una para seleccionarla.</div>

                {loadingData ? (
                  <div className="text-center py-10 text-[#38050e] font-bold text-sm uppercase tracking-widest animate-pulse">Cargando cafeterías...</div>
                ) : (
                  <div className="shop-opts">
                    {shops.map((s) => (
                      <div
                        key={s.id}
                        className={`sopt${selectedId === s.id ? " sel" : ""}`}
                        onClick={() => setSelectedId(s.id)}
                      >
                        <div className="sopt-img" style={{ backgroundImage: `url('${s.coverImage || '/background.webp'}')` }} />
                        <div>
                          <div className="sopt-name">{s.name}</div>
                          <div className="sopt-loc">
                            <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            {s.neighborhood || "Panamá"}
                          </div>
                        </div>
                        <span className="sopt-tick">
                          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {errorMsg && <div className="vm-err" style={{ marginTop: 10 }}>{errorMsg}</div>}

                <button className="vm-cta" style={{ marginTop: 16 }} onClick={handleNextStep} disabled={!selectedId}>
                  Continuar
                </button>
              </div>
            )}

            {round !== 0 && !isVotingBlockedForRole && step === 2 && selectedShop && (
              <div className="vm-step" key="s2">
                <div className="vm-bar">
                  {(isPublicVoter ? selectedShop.baristaAnyPhoto : selectedShop.baristaPhoto) ? (
                    <div className="vm-bar-av" style={{ backgroundImage: `url('${isPublicVoter ? selectedShop.baristaAnyPhoto : selectedShop.baristaPhoto}')` }} />
                  ) : (
                    <div className="vm-bar-av ph">{((isPublicVoter ? selectedShop.baristaAnyName : selectedShop.baristaName) || "B").charAt(0)}</div>
                  )}
                  <div>
                    <div className="vm-bar-k">Barista de la casa</div>
                    <div className="vm-bar-n">{(isPublicVoter ? selectedShop.baristaAnyName : selectedShop.baristaName) || "No asignado"}</div>
                    <div className="vm-bar-c">{selectedShop.competitionCategory || "Categoría general"}</div>
                  </div>
                </div>

                {errorMsg && <div className="vm-err" style={{ marginTop: 16 }}>{errorMsg}</div>}

                {isPublicVoter ? (
                  /* Voto popular: dos preguntas, directo al grano */
                  <div style={{ marginTop: 20 }}>
                    <div className="vm-q">Califica a tu barista</div>
                    <div className="vm-hint">De una a cinco estrellas.</div>
                    {renderStars(scoreBarista, setScoreBarista)}

                    <div className="vm-sep" />

                    <div className="vm-q">Elige tu bebida favorita</div>
                    <div className="vm-hint">La que probaste y te conquistó.</div>
                    <div className="vm-opts">
                      {drinkOptions.map((d) => (
                        <button key={d.key} type="button" className={`vm-opt${favoriteDrink === d.key ? " sel" : ""}`} onClick={() => setFavoriteDrink(d.key)}>
                          {d.photo ? (
                            <span className="vm-opt-img" style={{ backgroundImage: `url('${d.photo}')` }} />
                          ) : (
                            <span className="vm-opt-ph">
                              <svg viewBox="0 0 24 24"><path d="M17 8h1.5a2.5 2.5 0 0 1 0 5H17" /><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" /></svg>
                            </span>
                          )}
                          <span>
                            <span className="vm-opt-name" style={{ display: "block" }}>{d.label}</span>
                            <span className="vm-opt-sub" style={{ display: "block" }}>{d.sub}</span>
                          </span>
                          <span className="vm-opt-check">
                            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                          </span>
                        </button>
                      ))}
                      {drinkOptions.length === 0 && (
                        <p className="vm-hint">Esta cafetería aún no publica sus bebidas de competencia.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 20 }}>
                    <div className="vm-q">Experiencia integral</div>
                    {round === 1
                      ? renderStars(exp, setExp)
                      : renderR2Scale(exp, setExp, [
                          { v: 1, label: "Bueno" },
                          { v: 2, label: "Excelente" },
                          { v: 3, label: "Excepcional" },
                        ])}
                    <div className="vm-sep" />
                    <div className="vm-q">Presencia del barista</div>
                    {round === 1
                      ? renderStars(pres, setPres)
                      : renderR2Scale(pres, setPres, [
                          { v: 1, label: "Buena presentación" },
                          { v: 2, label: "Alto Potencial" },
                          { v: 3, label: "Excepcional" },
                        ])}
                    <div className="vm-sep" />
                    <div className="vm-q">Calidad de la taza</div>
                    {round === 1
                      ? renderStars(cup, setCup)
                      : renderR2Scale(cup, setCup, [
                          { v: 1, label: "Alta calidad" },
                          { v: 2, label: "Limpieza de taza" },
                          { v: 3, label: "Creatividad e innovación" },
                        ])}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
                  <button className="vm-back" onClick={() => setStep(1)}>Volver</button>
                  <button className="vm-cta" style={{ flex: 1, width: "auto" }} onClick={handleVote} disabled={loadingSubmit}>
                    {loadingSubmit ? "Enviando..." : "Confirmar mi voto"}
                  </button>
                </div>
                <p className="vm-note">Tu voto es definitivo y no podrá cambiarse.</p>
              </div>
            )}

            {step === 3 && (
              <div className="vm-ok vm-step" key="s3">
                <svg className="vm-ok-ring" viewBox="0 0 84 84">
                  <circle cx="42" cy="42" r="39" />
                  <path d="M28 43.5l9.5 9.5L57 33" />
                </svg>
                <div className="vm-ok-t">¡Tu voto fue registrado!</div>
                <div className="vm-ok-s">Gracias por ser parte de El Camino a la Gran Taza.</div>
              </div>
            )}

            {step === 4 && (
              <div className="vm-step" key="s4" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {authMode === "register" && (
                  <script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} async defer></script>
                )}

                <div style={{ textAlign: "center" }}>
                  <div className="vm-q" style={{ fontSize: "1.3rem" }}>Un paso más</div>
                  <div className="vm-hint">Inicia sesión o crea tu cuenta para confirmar tu voto.</div>
                </div>

                <div className="vm-tabs">
                  <button className={`vm-tab ${authMode === "login" ? "on" : "off"}`} onClick={() => { setAuthMode("login"); setErrorMsg(""); }}>
                    Iniciar sesión
                  </button>
                  <button className={`vm-tab ${authMode === "register" ? "on" : "off"}`} onClick={() => { setAuthMode("register"); setErrorMsg(""); }}>
                    Registrarme
                  </button>
                </div>

                {errorMsg && <div className="vm-err">{errorMsg}</div>}

                <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {authMode === "register" && (
                    <div>
                      <label className="vm-lbl">Nombre</label>
                      <input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)} className="vm-inp" placeholder="Tu nombre" />
                    </div>
                  )}

                  <div>
                    <label className="vm-lbl">Correo electrónico</label>
                    <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="vm-inp" placeholder="tucorreo@ejemplo.com" />
                  </div>

                  <div>
                    <label className="vm-lbl">Contraseña</label>
                    <input type="password" required minLength={6} value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="vm-inp" placeholder="Mínimo 6 caracteres" />
                  </div>

                  {authMode === "register" && (
                    <PrivacyCheckbox
                      checked={privacyAccepted}
                      onChange={setPrivacyAccepted}
                      accentColor="#38050e"
                      textColor="#38050e"
                    />
                  )}

                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button type="button" className="vm-back" onClick={() => setStep(2)}>Volver</button>
                    <button type="submit" className="vm-cta" style={{ flex: 1, width: "auto" }} disabled={authLoading || (authMode === "register" && !privacyAccepted)}>
                      {authLoading ? "Procesando..." : (authMode === "login" ? "Entrar y votar" : "Crear cuenta y votar")}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast${showToast ? " show" : ""}`}>
        ¡Voto registrado con éxito!
      </div>
    </>
  );
}
