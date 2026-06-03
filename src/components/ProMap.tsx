"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import { Fragment, useEffect, useMemo } from "react";
import { categoryOf, type Creator } from "@/lib/data";

function pinIcon(creator: Creator, active: boolean) {
  const cat = categoryOf(creator.categories[0]);
  const [a, , c] = cat.grad;
  const size = active ? 52 : 44;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    html: `
      <div style="transform: translateY(-2px); filter: drop-shadow(0 6px 8px rgba(120,86,78,.45));">
        <div style="
          width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;
          transform: rotate(-45deg);
          background: linear-gradient(135deg, ${a}, ${c});
          border: 2.5px solid #fff; display:grid; place-items:center;">
          <span style="transform: rotate(45deg); font-size:${size * 0.42}px;">${cat.emoji}</span>
        </div>
      </div>`,
  });
}

function FitBounds({ creators }: { creators: Creator[] }) {
  const map = useMap();
  useEffect(() => {
    if (!creators.length) return;
    const b = L.latLngBounds(creators.map((c) => [c.lat, c.lng] as [number, number]));
    map.fitBounds(b, { padding: [50, 50], maxZoom: 13, animate: true });
  }, [creators, map]);
  return null;
}

export default function ProMap({
  creators,
  selected,
  onSelect,
}: {
  creators: Creator[];
  selected?: string;
  onSelect: (slug: string) => void;
}) {
  const center = useMemo<[number, number]>(() => [46.45, 6.35], []);

  return (
    <MapContainer
      center={center}
      zoom={11}
      zoomControl={false}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds creators={creators} />
      {creators.map((c) => (
        <Fragment key={c.id}>
          {c.mode === "mobile" && c.radiusKm && (
            <Circle
              center={[c.lat, c.lng]}
              radius={c.radiusKm * 1000}
              pathOptions={{
                color: "#d9a48a",
                weight: 1,
                fillColor: "#e6b3b8",
                fillOpacity: selected === c.slug ? 0.22 : 0.1,
              }}
            />
          )}
          <Marker
            position={[c.lat, c.lng]}
            icon={pinIcon(c, selected === c.slug)}
            eventHandlers={{ click: () => onSelect(c.slug) }}
          />
        </Fragment>
      ))}
    </MapContainer>
  );
}
