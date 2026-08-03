"use client";

import { useState, useRef, useEffect } from "react";
import { uploadBlogImage } from "@/app/actions/blog";

interface BlogEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
}

export default function BlogEditor({ initialContent = "", onChange }: BlogEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && initialContent && editorRef.current.innerHTML === "") {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const handleCommand = (command: string, value: string = "") => {
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

    const result = await uploadBlogImage(formData);
    if (result.url) {
      handleCommand("insertImage", result.url);
    } else {
      alert("Error al subir imagen");
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
        <button type="button" onClick={() => handleCommand("bold")} className="p-2 hover:bg-[#cddbf2]/20 rounded font-bold transition-colors">B</button>
        <button type="button" onClick={() => handleCommand("italic")} className="p-2 hover:bg-[#cddbf2]/20 rounded italic transition-colors">I</button>
        <button type="button" onClick={() => handleCommand("underline")} className="p-2 hover:bg-[#cddbf2]/20 rounded underline transition-colors">U</button>
        <div className="w-px h-6 bg-[#cddbf2]/10 mx-1 self-center" />
        <button type="button" onClick={() => handleCommand("formatBlock", "h2")} className="p-2 hover:bg-[#cddbf2]/20 rounded font-black transition-colors">H2</button>
        <button type="button" onClick={() => handleCommand("formatBlock", "h3")} className="p-2 hover:bg-[#cddbf2]/20 rounded font-bold transition-colors">H3</button>
        <button type="button" onClick={() => handleCommand("formatBlock", "p")} className="p-2 hover:bg-[#cddbf2]/20 rounded transition-colors">P</button>
        <div className="w-px h-6 bg-[#cddbf2]/10 mx-1 self-center" />
        <button type="button" onClick={() => handleCommand("justifyLeft")} className="p-2 hover:bg-[#cddbf2]/20 rounded transition-colors">L</button>
        <button type="button" onClick={() => handleCommand("justifyCenter")} className="p-2 hover:bg-[#cddbf2]/20 rounded transition-colors">C</button>
        <button type="button" onClick={() => handleCommand("justifyRight")} className="p-2 hover:bg-[#cddbf2]/20 rounded transition-colors">R</button>
        <div className="w-px h-6 bg-[#cddbf2]/10 mx-1 self-center" />
        {/* Imágenes desactivadas temporalmente para evitar error de 1MB */}
        {/* <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-[#cddbf2]/20 rounded transition-colors">
          📷 Imagen
        </button> */}
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
          // Prevent pasting large base64 images
          const items = e.clipboardData.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              e.preventDefault();
              alert("Por ahora, no se pueden pegar imágenes directamente para evitar errores de tamaño. Por favor, usa el botón de subida (cuando esté activo) o usa texto.");
              return;
            }
          }
        }}
        className="min-h-[400px] p-6 focus:outline-none prose prose-invert max-w-none text-[#cddbf2] bg-transparent selection:bg-[#cddbf2]/30"
        style={{
          fontFamily: "'Barlow', sans-serif",
        }}
      />
      
      <style jsx global>{`
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
      `}</style>
    </div>
  );
}
