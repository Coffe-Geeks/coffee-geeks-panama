"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { updateProgress } from "@/app/actions/elearning";

export default function PlayerUI({ course, progress }: { course: any, progress: any }) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(progress.currentLessonIndex || 0);
  const [showSidebar, setShowSidebar] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const lessons = [...(course.lessons || [])].sort((a: any, b: any) => a.order - b.order);
  const currentLesson = lessons[currentLessonIndex];

  useEffect(() => {
    // Si hay un cambio de lección, pausamos el video actual para asegurar que se guarde el progreso
    if (videoRef.current) {
      // El currentTime se restaurará en el evento onLoadedMetadata del nuevo video
    }
  }, [currentLessonIndex, progress]);

  const saveProgress = async (lessonIndexToSave = currentLessonIndex) => {
    const currentTime = videoRef.current ? videoRef.current.currentTime : (progress.videoTimestamp || 0);
    await updateProgress(course._id, lessonIndexToSave, currentTime);
  };

  const handleLessonChange = async (index: number) => {
    // Al cambiar, guardamos inmediatamente que el usuario está en la nueva lección
    setCurrentLessonIndex(index);
  };

  // Efecto para guardar progreso automáticamente cuando cambia la lección y periódicamente
  useEffect(() => {
    // Guardamos la nueva lección al instante (con el tiempo en 0 si apenas entró)
    const currentTime = videoRef.current ? videoRef.current.currentTime : 0;
    updateProgress(course._id, currentLessonIndex, currentTime);

    // Guardar periódicamente cada 10 segundos para no perder el progreso del video si cierra la pestaña
    const interval = setInterval(() => {
      const time = videoRef.current ? videoRef.current.currentTime : 0;
      updateProgress(course._id, currentLessonIndex, time);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentLessonIndex, course._id]);

  if (!currentLesson) {
    return <div className="p-10 text-center">No hay lecciones en este curso.</div>;
  }

  // Comprobar si es YouTube
  const isYouTube = currentLesson.videoUrl?.includes("youtube.com") || currentLesson.videoUrl?.includes("youtu.be");
  
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#22191A]">
      {/* Sidebar de Lecciones */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0 bg-[#0f0a0b] border-r border-white/5 flex flex-col`}>
        <div className="p-6 border-b border-white/5 whitespace-nowrap overflow-hidden">
          <Link href={`/academia/${course._id}`} className="text-sm text-[#857375] hover:text-white transition-colors mb-2 inline-block">
            ← Volver al curso
          </Link>
          <h2 className="font-['Barlow_Condensed'] text-2xl font-bold text-white uppercase truncate">
            {course.title}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {lessons.map((lesson: any, i: number) => (
            <button
              key={lesson._id}
              onClick={() => handleLessonChange(i)}
              className={`w-full text-left p-4 border-b border-white/5 transition-colors flex gap-4 items-start ${currentLessonIndex === i ? 'bg-[#38050e] border-l-4 border-l-[#e53e3e]' : 'hover:bg-white/5 border-l-4 border-l-transparent'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentLessonIndex === i ? 'bg-white text-[#38050e]' : 'bg-white/10 text-white/50'}`}>
                {i + 1}
              </div>
              <div className="overflow-hidden">
                <h4 className={`font-['Barlow'] font-bold text-sm truncate ${currentLessonIndex === i ? 'text-white' : 'text-[#cddbf2]/80'}`}>
                  {lesson.title}
                </h4>
                {lesson.duration && (
                  <span className="text-xs text-white/40 mt-1 inline-block">⏱ {lesson.duration}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Área Principal de Video */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-4 left-4 z-50 p-2 bg-black/50 text-white rounded-lg hover:bg-black/80 backdrop-blur"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>

        <div className="w-full bg-black aspect-video flex-shrink-0">
          {isYouTube ? (
            <iframe 
              className="w-full h-full"
              src={getYouTubeEmbedUrl(currentLesson.videoUrl)} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          ) : (
            <video 
              ref={videoRef}
              src={currentLesson.videoUrl} 
              className="w-full h-full"
              controls 
              autoPlay={true}
              onLoadedMetadata={(e) => {
                if (currentLessonIndex === progress.currentLessonIndex && progress.videoTimestamp) {
                  e.currentTarget.currentTime = progress.videoTimestamp;
                }
              }}
              onPause={saveProgress}
              onEnded={() => {
                saveProgress();
                if (currentLessonIndex < lessons.length - 1) {
                   // Opcional: auto-play siguiente
                }
              }}
            />
          )}
        </div>
        
        <div className="p-8 lg:p-12 bg-[#22191A] flex-1">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-['Barlow_Condensed'] text-3xl lg:text-5xl font-bold text-white uppercase mb-6">
              {currentLesson.title}
            </h1>
            <div className="prose prose-invert prose-lg max-w-none font-['Barlow'] text-[#cddbf2]/80">
              {currentLesson.description.split('\n').map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex justify-between">
              <button 
                onClick={() => handleLessonChange(currentLessonIndex - 1)}
                disabled={currentLessonIndex === 0}
                className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                ← Anterior
              </button>
              <button 
                onClick={() => handleLessonChange(currentLessonIndex + 1)}
                disabled={currentLessonIndex === lessons.length - 1}
                className="px-6 py-3 bg-[#38050e] text-white font-bold rounded-xl hover:bg-[#520815] disabled:opacity-30 transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
