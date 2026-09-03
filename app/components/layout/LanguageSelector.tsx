"use client";

import { useEffect, useState, useRef } from "react";

const LANGUAGES = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<"es" | "en">("es");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inyectar CSS dinámico agresivo para ocultar cualquier iframe/banner de Google Translate
    const styleId = "gt-hide-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .goog-te-banner-frame,
        iframe.goog-te-banner-frame,
        iframe.skiptranslate,
        .skiptranslate,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        div#goog-gt-,
        #goog-gt-vt,
        .goog-te-spinner-pos,
        .VIpgJd-Z69j5b-O4fe2d,
        .VIpgJd-Z69j5b-O4fe2d-sn548e,
        .VIpgJd-Z69j5b-O4fe2d-ibn2d,
        iframe[id^=":"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          max-height: 0 !important;
          pointer-events: none !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        html {
          top: 0px !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Observer en tiempo real para eliminar / ocultar cualquier elemento o iframe generado
    const observer = new MutationObserver(() => {
      document.querySelectorAll(
        "iframe.skiptranslate, .goog-te-banner-frame, iframe[id^=':'], .VIpgJd-Z69j5b-O4fe2d, .skiptranslate"
      ).forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.tagName === "IFRAME" || htmlEl.classList.contains("skiptranslate") || htmlEl.classList.contains("goog-te-banner-frame")) {
          htmlEl.style.setProperty("display", "none", "important");
          htmlEl.style.setProperty("visibility", "hidden", "important");
          htmlEl.style.setProperty("height", "0px", "important");
        }
      });
      if (document.body.style.top !== "0px" && document.body.style.top !== "") {
        document.body.style.setProperty("top", "0px", "important");
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Detectar idioma actual desde cookie o localStorage
    const cookies = document.cookie.split("; ");
    const googtransCookie = cookies.find((row) => row.startsWith("googtrans="));
    if (googtransCookie) {
      const val = googtransCookie.split("=")[1];
      if (val?.endsWith("/en")) {
        setCurrentLang("en");
      } else if (val?.endsWith("/es")) {
        setCurrentLang("es");
      }
    } else {
      const saved = localStorage.getItem("cgp_lang");
      if (saved === "en" || saved === "es") {
        setCurrentLang(saved);
      }
    }

    // Cargar script de Google Translate dinámicamente si no está presente
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "es",
              includedLanguages: "en,es",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      };
    }

    return () => observer.disconnect();
  }, []);

  // Cerrar desplegable al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: "es" | "en") => {
    if (code === currentLang) {
      setIsOpen(false);
      return;
    }

    const domain = window.location.hostname;
    document.cookie = `googtrans=/es/${code}; path=/;`;
    document.cookie = `googtrans=/es/${code}; path=/; domain=${domain};`;
    document.cookie = `googtrans=/es/${code}; path=/; domain=.${domain};`;
    localStorage.setItem("cgp_lang", code);
    setCurrentLang(code);
    setIsOpen(false);

    window.location.reload();
  };

  const selectedOption = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Contenedor oculto de Google Translate */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* Botón Redondo Principal - Solo la Bandera */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Seleccionar idioma"
        className="ibtn-lang"
        title={selectedOption.name}
      >
        <span style={{ fontSize: "18px", lineHeight: 1 }}>{selectedOption.flag}</span>
      </button>

      {/* Menú Desplegable (Dropdown) */}
      {isOpen && (
        <div className="lang-dropdown">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelectLanguage(lang.code as "es" | "en")}
              className={`lang-option ${currentLang === lang.code ? "selected" : ""}`}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
              {currentLang === lang.code && (
                <span className="lang-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
