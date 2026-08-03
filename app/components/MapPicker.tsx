"use client";
import dynamic from 'next/dynamic';

const MapPickerInner = dynamic(() => import('./MapPickerInner'), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-[300px] bg-black/20 animate-pulse rounded-xl flex items-center justify-center border border-white/10">
      <span className="text-white/50 text-sm">Cargando mapa...</span>
    </div>
  )
});

export default function MapPicker({ 
  initialLat, 
  initialLng, 
  onLocationChange 
}: { 
  initialLat?: number | null, 
  initialLng?: number | null, 
  onLocationChange: (lat: number, lng: number) => void 
}) {
  return <MapPickerInner initialLat={initialLat} initialLng={initialLng} onLocationChange={onLocationChange} />;
}
