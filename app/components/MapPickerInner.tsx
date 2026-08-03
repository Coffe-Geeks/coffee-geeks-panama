"use client";
import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';

function MapUpdater({ position }: { position: {lat: number, lng: number} }) {
  const map = useMapEvents({
    click() {}
  });
  
  useEffect(() => {
    map.flyTo([position.lat, position.lng], map.getZoom());
  }, [position, map]);
  
  return null;
}

export default function MapPickerInner({ 
  initialLat, 
  initialLng, 
  onLocationChange 
}: { 
  initialLat?: number | null, 
  initialLng?: number | null, 
  onLocationChange: (lat: number, lng: number) => void 
}) {
  const panamaCenter = [8.9833, -79.5167];
  const [position, setPosition] = useState<{lat: number, lng: number}>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : { lat: panamaCenter[0], lng: panamaCenter[1] }
  );

  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          onLocationChange(newPos.lat, newPos.lng);
        }
      },
    }),
    [onLocationChange]
  );

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  return (
    <MapContainer 
      center={[position.lat, position.lng]} 
      zoom={13} 
      scrollWheelZoom={false} 
      style={{ height: "300px", width: "100%", borderRadius: "12px", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      />
      <MapUpdater position={position} />
    </MapContainer>
  );
}
