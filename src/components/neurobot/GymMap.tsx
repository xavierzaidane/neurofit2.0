"use client";

import type MapLibreGL from "maplibre-gl";
import { useCallback, useEffect, useState } from "react";
import {
    Map as MapComponent,
    MapMarker,
    MarkerContent,
    MarkerTooltip,
} from "@/components/ui/map";

type GymMapProps = {
    onLocationSelect?: (
        location: string,
        coords: { latitude: number; longitude: number }
    ) => void;
};

export function GymMap({ onLocationSelect }: GymMapProps) {
    const [mapInstance, setMapInstance] = useState<MapLibreGL.Map | null>(null);
    const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
    const [selectedLabel, setSelectedLabel] = useState<string>("");

    const setMapComponentRef = useCallback((instance: MapLibreGL.Map | null) => {
        setMapInstance(instance);
    }, []);

    useEffect(() => {
        if (!mapInstance) return;

        const handleMapClick = async (event: MapLibreGL.MapMouseEvent) => {
            const longitude = event.lngLat.lng;
            const latitude = event.lngLat.lat;

            setSelectedCoords([longitude, latitude]);
            setSelectedLabel("Resolving location...");

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                );

                if (!response.ok) {
                    throw new Error("Reverse geocoding failed");
                }

                const data = await response.json();
                const address = data?.address || {};
                const district =
                    address.suburb ||
                    address.city_district ||
                    address.state_district ||
                    address.district ||
                    address.borough ||
                    address.neighbourhood ||
                    "";
                const city =
                    address.city ||
                    address.town ||
                    address.village ||
                    address.county ||
                    "";
                const state = address.state || address.region || "";
                const country = address.country || "";

                const locationParts = [district, city, state, country]
                    .map((part: unknown) => (typeof part === "string" ? part.trim() : ""))
                    .filter(Boolean)
                    .filter((part, index, parts) => parts.indexOf(part) === index);

                const location =
                    locationParts.join(", ") ||
                    data?.display_name ||
                    `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

                setSelectedLabel(location);
                onLocationSelect?.(location, { latitude, longitude });
            } catch {
                const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                setSelectedLabel(fallback);
                onLocationSelect?.(fallback, { latitude, longitude });
            }
        };

        mapInstance.on("click", handleMapClick);

        return () => {
            mapInstance.off("click", handleMapClick);
        };
    }, [mapInstance, onLocationSelect]);

    return (
        <div className="w-full h-full bg-black">
            <MapComponent
                ref={setMapComponentRef}
                center={[105.0, 12.5]}
                zoom={6}
                className="w-full h-full"
                theme="dark"
            >
                {selectedCoords && (
                    <MapMarker longitude={selectedCoords[0]} latitude={selectedCoords[1]}>
                        <MarkerContent>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-emerald-500" />
                        </MarkerContent>
                        <MarkerTooltip>
                            <div className="text-center bg-card border border-border px-3 py-2 max-w-52">
                                <p className="font-mono text-[10px] uppercase tracking-wide text-foreground">
                                    Selected Location
                                </p>
                                <p className="text-[10px] text-muted-foreground font-mono mt-1 break-words">
                                    {selectedLabel}
                                </p>
                            </div>
                        </MarkerTooltip>
                    </MapMarker>
                )}
            </MapComponent>
        </div>
    );
}