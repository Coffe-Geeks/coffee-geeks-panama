"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getSlugId } from "@/lib/utils";

interface ParticipantItem {
  id: string;
  _id?: string;
  name: string;
  cafeteriaName?: string;
  isActive?: boolean;
}

interface ParticipantQRModalProps {
  mode: "all" | "single";
  participant?: ParticipantItem | null;
  participants?: ParticipantItem[];
  onClose: () => void;
}

export default function ParticipantQRModal({
  mode,
  participant,
  participants = [],
  onClose,
}: ParticipantQRModalProps) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const activeParticipants =
    mode === "single" && participant
      ? [participant]
      : participants.filter((p) => p.isActive !== false);

  const baseOrigin =
    origin || (typeof window !== "undefined" ? window.location.origin : "") || "https://coffeegeeks.com.pa";

  const handlePrintWindow = () => {
    const printWindow = window.open("", "_blank", "width=900,height=750");
    if (!printWindow) {
      alert("Por favor permite las ventanas emergentes (popups) para abrir la vista de impresión.");
      return;
    }

    const cardsHtml = activeParticipants
      .map((p) => {
        const pId = p.id || p._id || "";
        const cName = p.cafeteriaName || p.name || "Cafetería";
        const slug = getSlugId(cName, pId);
        const qrUrl = `${baseOrigin}/participantes/${slug}`;

        // Obtener el marcado SVG exacto del elemento en pantalla
        const svgEl = document.getElementById(`qr-svg-${pId}`);
        let svgMarkup = "";
        if (svgEl) {
          svgMarkup = new XMLSerializer().serializeToString(svgEl);
        } else {
          // Fallback vía API de QR por si acaso no estuviera montado el SVG
          svgMarkup = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
            qrUrl
          )}" alt="QR Code" width="200" height="200" />`;
        }

        return `
        <div class="qr-card">
          <div class="brand-tag">COFFEE GEEKS PANAMÁ</div>
          <h2 class="cafeteria-name">${cName}</h2>
          <div class="qr-wrapper">${svgMarkup}</div>
          <p class="qr-instruction">Escanea para conocer más y votar por este participante</p>
        </div>
      `;
      })
      .join("");

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>Coffee Geeks Panamá — Códigos QR Participantes</title>
          <style>
            @page {
              margin: 12mm;
              size: portrait;
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background: #ffffff;
              color: #38050e;
              margin: 0;
              padding: 24px;
            }
            .header-banner {
              text-align: center;
              margin-bottom: 28px;
              padding-bottom: 16px;
              border-bottom: 3px solid #38050e;
            }
            .header-banner h1 {
              font-size: 22px;
              font-weight: 900;
              margin: 0 0 6px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #38050e;
            }
            .header-banner p {
              font-size: 13px;
              color: #555555;
              margin: 0;
            }
            .qr-grid {
              ${
                mode === "single"
                  ? "display: flex; justify-content: center; margin-top: 20px;"
                  : "display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;"
              }
            }
            .qr-card {
              border: 2px solid #38050e;
              border-radius: 20px;
              padding: 24px 20px;
              text-align: center;
              background: #ffffff;
              page-break-inside: avoid;
              break-inside: avoid;
              ${mode === "single" ? "width: 380px;" : "width: 100%;"}
            }
            .brand-tag {
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 2px;
              color: rgba(56, 5, 14, 0.65);
              margin-bottom: 6px;
              text-transform: uppercase;
            }
            .cafeteria-name {
              font-size: 20px;
              font-weight: 900;
              color: #38050e;
              margin: 0 0 16px 0;
              line-height: 1.25;
            }
            .qr-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 16px 0;
            }
            .qr-wrapper svg {
              width: 210px !important;
              height: 210px !important;
              display: block;
            }
            .qr-instruction {
              font-size: 12px;
              font-weight: 700;
              color: #38050e;
              margin: 12px 0 0 0;
            }
          </style>
        </head>
        <body>
          ${
            mode === "all"
              ? `
            <div class="header-banner">
              <h1>Coffee Geeks Panamá — Votaciones 2026</h1>
              <p>Escanea el código QR de cada cafetería participante para ingresar a su ficha de competencia y votar.</p>
            </div>
          `
              : ""
          }
          <div class="qr-grid">
            ${cardsHtml}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
                window.close();
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  };

  const downloadSingleQR = (id: string, name: string) => {
    const svgElement = document.getElementById(`qr-svg-${id}`) as SVGSVGElement | null;
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const padding = 40;
      const textSpace = 110;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2 + textSpace;

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#38050e";
        ctx.lineWidth = 4;
        ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

        ctx.fillStyle = "#38050e";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("COFFEE GEEKS PANAMÁ · VOTACIONES 2026", canvas.width / 2, padding + 15);

        ctx.font = "bold 22px sans-serif";
        ctx.fillText(name || "Cafetería Participante", canvas.width / 2, padding + 48);

        ctx.drawImage(img, padding, padding + 65);

        ctx.fillStyle = "#555555";
        ctx.font = "13px sans-serif";
        ctx.fillText("Escanea este código para conocer más y votar", canvas.width / 2, canvas.height - 28);
      }

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      const cleanName = (name || "cafeteria").toLowerCase().replace(/[^a-z0-9]+/g, "_");
      downloadLink.download = `QR_${cleanName}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#38050e] border border-[#cddbf2]/20 rounded-3xl p-6 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Cabecera modal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-[#cddbf2]/10 sticky top-0 bg-[#38050e] z-10">
          <div>
            <h2 className="text-2xl font-black text-[#cddbf2]">
              {mode === "single"
                ? `Código QR - ${participant?.cafeteriaName || participant?.name}`
                : "Listado Completo de Códigos QR de Participantes"}
            </h2>
            <p className="text-xs text-[#cddbf2]/60 mt-1">
              Versión imprimible y descargable para escanear y emitir votos.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handlePrintWindow}
              className="bg-[#cddbf2] hover:bg-[#cddbf2]/90 text-[#38050e] px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              🖨️ Imprimir {mode === "all" ? "Todo" : "QR"}
            </button>
            <button
              onClick={onClose}
              className="text-[#cddbf2] hover:text-white font-bold text-xl px-2 py-1 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Vista previa en pantalla */}
        <div>
          <div
            className={
              mode === "single"
                ? "max-w-md mx-auto"
                : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            }
          >
            {activeParticipants.map((p) => {
              const pId = p.id || p._id || "";
              const cName = p.cafeteriaName || p.name || "Cafetería";
              const slug = getSlugId(cName, pId);
              const qrUrl = `${baseOrigin}/participantes/${slug}`;

              return (
                <div
                  key={pId}
                  className="bg-white p-6 rounded-2xl text-center shadow-xl border border-[#cddbf2]/30 flex flex-col items-center justify-between"
                >
                  <div className="w-full mb-3">
                    <span className="text-[10px] font-extrabold tracking-widest text-[#38050e]/70 uppercase block mb-1">
                      Coffee Geeks Panamá
                    </span>
                    <h3 className="font-black text-xl text-[#38050e] leading-tight">
                      {cName}
                    </h3>
                  </div>

                  <div className="my-3 p-3 bg-white rounded-2xl border-2 border-[#38050e]/10 shadow-sm flex items-center justify-center">
                    <QRCodeSVG
                      id={`qr-svg-${pId}`}
                      value={qrUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <p className="text-xs text-[#38050e]/90 font-bold mb-4">
                    Escanea para votar por este participante
                  </p>

                  <button
                    onClick={() => downloadSingleQR(pId, cName)}
                    className="bg-[#38050e] hover:bg-[#2a040b] text-[#cddbf2] text-xs font-bold px-4 py-2.5 rounded-xl transition-all w-full flex items-center justify-center gap-1.5 shadow-md"
                  >
                    📥 Descargar PNG
                  </button>
                </div>
              );
            })}

            {activeParticipants.length === 0 && (
              <div className="col-span-full py-12 text-center text-[#cddbf2]/60">
                No hay participantes activos disponibles para mostrar el código QR.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
