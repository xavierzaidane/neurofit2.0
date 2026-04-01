"use client";

import type MapLibreGL from "maplibre-gl";
import { useRef } from "react";
import {
    Map as MapComponent,
    MapMarker,
    MarkerContent,
    MarkerTooltip,
} from "@/components/ui/map";

const provinceCoords: Record<string, [number, number]> = {
    "Phnom Penh": [104.8885, 11.5621],
    "Siem Reap": [103.8564, 13.3618],
    "Battambang": [103.2022, 13.0957],
    "Kampot": [104.2859, 10.6104],
};

const weatherByProvince: Record<string, { temp_c: number; condition: string }> = {
    "Phnom Penh": { temp_c: 32, condition: "Sunny" },
    "Siem Reap": { temp_c: 30, condition: "Partly Cloudy" },
    "Battambang": { temp_c: 31, condition: "Cloudy" },
    "Kampot": { temp_c: 29, condition: "Rain" },
};

export function GymMap() {
    const mapRef = useRef<MapLibreGL.Map | null>(null);
    return (
        <div className="w-full h-full bg-black">
            <MapComponent
                ref={mapRef}
                center={[105.0, 12.5]}
                zoom={6}
                className="w-full h-full"
                theme="dark"
            >
                {Object.entries(provinceCoords).map(([name, coords]) => {
                    const provinceWeather = weatherByProvince[name];
                    return (
                        <MapMarker
                            key={name}
                            longitude={coords[0]}
                            latitude={coords[1]}
                        >
                            <MarkerContent>
                                <div
                                    className={
                                        "flex items-center justify-center w-8 h-8 border-2 bg-card border-border"
                                    }
                                >
                                    <span
                                        className={
                                            "text-xs font-mono font-bold text-foreground"
                                        }
                                    >
                                        {provinceWeather
                                            ? Math.round(provinceWeather.temp_c)
                                            : "--"}
                                    </span>
                                </div>
                            </MarkerContent>
                            <MarkerTooltip>
                                <div className="text-center bg-card border border-border px-3 py-2">
                                    <p className="font-mono text-xs uppercase tracking-wide text-foreground">
                                        {name}
                                    </p>
                                    {provinceWeather && (
                                        <p className="text-[10px] text-muted-foreground font-mono mt-1">
                                            {Math.round(provinceWeather.temp_c)}
                                            °C · {provinceWeather.condition}
                                        </p>
                                    )}
                                </div>
                            </MarkerTooltip>
                        </MapMarker>
                    );
                })}
            </MapComponent>
        </div>
    );
}