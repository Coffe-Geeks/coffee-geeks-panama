"use client";

import { useState, useRef, useEffect } from "react";
import { uploadStoreProductImage } from "@/app/actions/storeProduct";

interface StoreProductEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
}

export default function StoreProductEditor({ initialContent = "", onChange }: StoreProductEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && initialContent && editorRef.current.innerHTML === "") {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const handleCommand = (command: string, value: string = "") => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadStoreProductImage(formData);
    
    // Reset file input value to allow uploading the same file again
    e.target.value = "";

    if (result.url) {
      // Focus the editor first to ensure the insertion command finds a range
      if (editorRef.current) {
        editorRef.current.focus();
      }
      handleCommand("insertImage", result.url);
    } else {
      alert("Error al subir imagen: " + (result.error || "intente de nuevo"));
    }
  };

  const onInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="flex flex-col gap-2 border border-[#cddbf2]/20 rounded-xl overflow-hidden bg-black/20">
      <div className="flex flex-wrap gap-1 p-2 bg-[#cddbf2]/5 border-b border-[#cddbf2]/10 sticky top-0 z-10 backdrop-blur-md">
        <button 
          type="button" 
          onMouseDown={(e) => { e.preventDefault(); handleCommand("bold"); }} 
          className="p-2 hover:bg-[#cddbf2]/20 rounded font-bold transition-colors text-white"
        >
          B
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => { e.preventDefault(); handleCommand("italic"); }} 
          className="p-2 hover:bg-[#cddbf2]/20 rounded italic transition-colors text-white"
        >
          I
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => { e.preventDefault(); handleCommand("underline"); }} 
          className="p-2 hover:bg-[#cddbf2]/20 rounded underline transition-colors text-white"
        >
          U
        </button>
        
        <div className="w-px h-6 bg-[#cddbf2]/10 mx-1 self-center" />
        
        <button 
          type="button" 
          onMouseDown={(e) => { e.preventDefault(); handleCommand("formatBlock", "h2"); }} 
          className="p-2 hover:bg-[#cddbf2]/20 rounded font-black transition-colors text-white"
        >
          H2
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => { e.preventDefault(); handleCommand("formatBlock", "h3"); }} 
          className="p-2 hover:bg-[#cddbf2]/20 rounded font-bold transition-colors text-white"
        >
          H3
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => { e.preventDefault(); handleCommand("formatBlock", "p"); }} 
          className="p-2 hover:bg-[#cddbf2]/20 rounded transition-colors text-white"
        >
          P
        </button>
        
        <div className="w-px h-6 bg-[#cddbf2]/10 mx-1 self-center" />
        
        <button 
          type="button" 
          onMouseDown={(e) => { e.preventDefault(); handleCommand("justifyLeft"); }} 
          className="p-2 hover:bg-[#cddbf2]/20 rounded transition-colors text-white"
        >
          L
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => { e.preventDefault(); handleCommand("justifyCenter"); }} 
          className="p-2 hover:bg-[#cddbf2]/20 rounded transition-colors text-white"
        >
          C
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => { e.preventDefault(); handleCommand("justifyRight"); }} 
          className="p-2 hover:bg-[#cddbf2]/20 rounded transition-colors text-white"
        >
          R
        </button>
        
        <div className="w-px h-6 bg-[#cddbf2]/10 mx-1 self-center" />
        
        <button 
          type="button" 
          onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} 
          className="p-2 hover:bg-[#cddbf2]/20 rounded transition-colors text-xs font-bold text-[#cddbf2] flex items-center gap-1"
        >
          📷 Imagen
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          className="hidden" 
          accept="image/*"
        />
      </div>
      
      <div 
        ref={editorRef}
        contentEditable
        onInput={onInput}
        onPaste={(e) => {
          // Prevent pasting large base64 images to prevent payload issues
          const items = e.clipboardData.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              e.preventDefault();
              alert("Por favor, usa el botón de subir imagen en la barra de herramientas para evitar errores de tamaño.");
              return;
            }
          }
        }}
        className="min-h-[400px] p-6 focus:outline-none prose prose-invert max-w-none text-[#cddbf2] bg-transparent selection:bg-[#cddbf2]/30"
        style={{
          fontFamily: "'Barlow', sans-serif",
        }}
      />
      
      <style dangerouslySetInnerHTML={{ __html: `
        [contenteditable] {
          outline: none;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 20px 0;
          display: block;
        }
        [contenteditable] h2 { font-size: 2rem; font-weight: 800; margin-top: 1.5em; color: #fff; }
        [contenteditable] h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.2em; color: #fff; }
        [contenteditable] p { margin-bottom: 1em; line-height: 1.6; opacity: 0.9; }
      `}} />
    </div>
  );
}
