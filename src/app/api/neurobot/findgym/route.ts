import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Dynamic lock to rate-limit Nominatim geocoding requests to 1 req/sec
let lastNominatimRequestTime = 0;

async function rateLimitNominatim() {
  const now = Date.now();
  const timeSinceLast = now - lastNominatimRequestTime;
  const waitTime = Math.max(0, 1050 - timeSinceLast); // 1.05s buffer
  if (waitTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }
  lastNominatimRequestTime = Date.now();
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

function formatAddress(tags: any): string | undefined {
  if (!tags) return undefined;
  
  const houseNumber = tags["addr:housenumber"] || "";
  const street = tags["addr:street"] || "";
  const city = tags["addr:city"] || "";
  const postCode = tags["addr:postcode"] || "";

  const parts = [];
  if (houseNumber || street) {
    parts.push(`${houseNumber} ${street}`.trim());
  }
  if (city) {
    parts.push(city);
  }
  if (postCode) {
    parts.push(postCode);
  }

  return parts.length > 0 ? parts.join(", ") : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    let lat = 0;
    let lng = 0;
    let resolvedName = "";

    const userAgent = "NeuroFit/2.0 (contact: xavier.zaidane@gmail.com)";

    // Step 1: Geocode if location text is provided
    if (location) {
      const queryAttempts = [location.trim()];
      
      // If query has commas, add simplified versions as fallbacks
      if (location.includes(",")) {
        const parts = location.split(",").map(p => p.trim()).filter(Boolean);
        // Fallback 1: Drop the first part (e.g. suite/apt/unit info)
        if (parts.length > 1) {
          queryAttempts.push(parts.slice(1).join(", "));
        }
        // Fallback 2: Keep only the city/state/country info (last 2 parts)
        if (parts.length > 2) {
          queryAttempts.push(parts.slice(-2).join(", "));
        }
        // Fallback 3: Keep only the last part (usually city or country)
        if (parts.length > 1) {
          queryAttempts.push(parts[parts.length - 1]);
        }
      }

      let geocodeResults: any[] = [];
      for (const queryAttempt of queryAttempts) {
        try {
          await rateLimitNominatim();
          const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            queryAttempt
          )}&format=json&limit=1`;

          const geocodeResponse = await fetch(geocodeUrl, {
            headers: {
              "User-Agent": userAgent,
              "Referer": "https://github.com/xavierzaidane/neurofit-ai",
            },
            signal: AbortSignal.timeout(10000), // 10s timeout
          });

          if (!geocodeResponse.ok) {
            console.warn(`Nominatim geocoding error for "${queryAttempt}": ${geocodeResponse.statusText}`);
            continue;
          }

          const results = await geocodeResponse.json();
          if (results && results.length > 0) {
            geocodeResults = results;
            break; // Found a match!
          }
        } catch (err) {
          console.warn(`Failed geocoding attempt for "${queryAttempt}":`, err);
        }
      }

      if (!geocodeResults || geocodeResults.length === 0) {
        return NextResponse.json({ error: "location_not_found" });
      }

      lat = parseFloat(geocodeResults[0].lat);
      lng = parseFloat(geocodeResults[0].lon);
      resolvedName = geocodeResults[0].display_name;
    } else if (latParam && lngParam) {
      lat = parseFloat(latParam);
      lng = parseFloat(lngParam);
      resolvedName = `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } else {
      return NextResponse.json(
        { error: "Missing 'location' or 'lat'/'lng' query parameters" },
        { status: 400 }
      );
    }

    // Step 2: Search Overpass for gyms in radius
    let radius = 5000; // start with 5km
    let elements: any[] = [];
    
    const fetchGyms = async (searchRadius: number) => {
      const overpassQuery = `
        [out:json][timeout:10];
        (
          node["leisure"="fitness_centre"](around:${searchRadius}, ${lat}, ${lng});
          way["leisure"="fitness_centre"](around:${searchRadius}, ${lat}, ${lng});
          node["amenity"="gym"](around:${searchRadius}, ${lat}, ${lng});
          way["amenity"="gym"](around:${searchRadius}, ${lat}, ${lng});
        );
        out center;
      `;
      
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": userAgent,
          "Referer": "https://github.com/xavierzaidane/neurofit-ai",
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.elements || [];
    };

    elements = await fetchGyms(radius);

    // Step 3: Widen to 15km if less than 5 results
    if (elements.length < 5) {
      radius = 15000;
      elements = await fetchGyms(radius);
    }

    if (elements.length === 0) {
      return NextResponse.json({
        error: "no_gyms_found",
        searchedLocation: { lat, lng, resolvedName },
      });
    }

    // Step 4: Map distances and sort
    const gyms = elements.map((el: any) => {
      const elLat = el.lat !== undefined ? el.lat : el.center?.lat;
      const elLng = el.lon !== undefined ? el.lon : el.center?.lon;
      const distance = haversineDistance(lat, lng, elLat, elLng);
      const name = el.tags?.name || "Unnamed Gym / Fitness Centre";
      const address = formatAddress(el.tags);

      return {
        name,
        lat: elLat,
        lng: elLng,
        address,
        distanceMeters: Math.round(distance),
      };
    });

    // Sort ascending, take top 5
    gyms.sort((a, b) => a.distanceMeters - b.distanceMeters);
    const topGyms = gyms.slice(0, 5);

    return NextResponse.json({
      location: { lat, lng, resolvedName },
      gyms: topGyms,
    });
  } catch (error: any) {
    console.error("Error in findgym endpoint:", error);
    // Generic server/network error is expected to return status 500
    return NextResponse.json(
      { error: "internal_server_error", message: error.message || "Failed to fetch gym locations" },
      { status: 500 }
    );
  }
}
