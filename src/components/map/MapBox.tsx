
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MapBoxProps {
  selectedTribeId?: string | null;
  tribes?: {
    id: string;
    name: string;
    color: string;
    regions: string[];
  }[];
}

export function MapBox({ selectedTribeId, tribes = [] }: MapBoxProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the Mapbox token from our edge function
  const fetchMapboxToken = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.token;
    } catch (err) {
      console.error('Error fetching Mapbox token:', err);
      setError('Failed to load map token');
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    
    let isMounted = true;
    
    const initializeMap = async () => {
      try {
        // Get mapbox token from edge function
        const token = await fetchMapboxToken();
        
        if (!token || !isMounted) return;
        
        // Initialize Mapbox
        mapboxgl.accessToken = token;
        
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [0, 30], // Center on Africa
          zoom: 1.8,
          projection: 'globe',
          pitch: 40
        });

        // Add navigation controls
        mapInstance.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true
          }),
          'bottom-right'
        );

        mapInstance.on('load', () => {
          if (!isMounted) return;
          
          // Add atmosphere and fog effects
          mapInstance.setFog({
            color: 'rgb(12, 12, 30)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.4,
            'space-color': '#000',
            'star-intensity': 0.8
          });
          
          // Add 3D terrain
          mapInstance.setTerrain({ 
            source: 'mapbox-dem',
            exaggeration: 1.5 
          });
          
          // Add the DEM source for terrain
          mapInstance.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          });

          // If we have tribes data, add tribe territories
          if (tribes && tribes.length > 0) {
            // Very simplified territory coverage for the mock tribes
            const regionCoordinates = {
              'North America': [-100, 45],
              'South America': [-60, -20],
              'Europe': [10, 50],
              'Africa': [20, 0],
              'Asia': [100, 35],
              'Australia': [135, -25],
              'Middle East': [45, 25]
            };
            
            // Add source for tribe territories
            mapInstance.addSource('tribe-territories', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: tribes.flatMap(tribe => 
                  tribe.regions.map(region => ({
                    type: 'Feature',
                    properties: {
                      tribeId: tribe.id,
                      tribeName: tribe.name,
                      tribeColor: tribe.color
                    },
                    geometry: {
                      type: 'Circle',
                      coordinates: regionCoordinates[region as keyof typeof regionCoordinates],
                      radius: 10 // degrees
                    }
                  }))
                )
              }
            });
            
            // Add layer for all tribes
            mapInstance.addLayer({
              id: 'tribe-territories',
              type: 'fill-extrusion',
              source: 'tribe-territories',
              paint: {
                'fill-extrusion-color': ['get', 'tribeColor'],
                'fill-extrusion-opacity': 0.4,
                'fill-extrusion-height': 100000,
                'fill-extrusion-base': 0
              }
            });
            
            // Add tribe labels
            mapInstance.addLayer({
              id: 'tribe-labels',
              type: 'symbol',
              source: 'tribe-territories',
              layout: {
                'text-field': ['get', 'tribeName'],
                'text-size': 14,
                'text-allow-overlap': false,
                'text-ignore-placement': false
              },
              paint: {
                'text-color': ['get', 'tribeColor'],
                'text-halo-color': 'rgba(0,0,0,0.8)',
                'text-halo-width': 2
              }
            });
          }
          
          setLoading(false);
        });
        
        // Start a gentle rotation
        const rotateCamera = () => {
          if (!isMounted) return;
          mapInstance.easeTo({
            bearing: mapInstance.getBearing() - 0.1,
            duration: 100,
            easing: t => t
          });
          requestAnimationFrame(rotateCamera);
        };
        
        // Start rotation
        requestAnimationFrame(rotateCamera);
        
        map.current = mapInstance;
      } catch (err) {
        console.error('Error initializing map:', err);
        if (isMounted) {
          setError('Failed to initialize map');
          setLoading(false);
        }
      }
    };
    
    initializeMap();
    
    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // When selected tribe changes, highlight it on the map
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    
    if (selectedTribeId) {
      // Highlight selected tribe
      map.current.setPaintProperty(
        'tribe-territories',
        'fill-extrusion-opacity',
        [
          'case',
          ['==', ['get', 'tribeId'], selectedTribeId],
          0.8, // Selected tribe
          0.2  // Other tribes
        ]
      );
      
      map.current.setPaintProperty(
        'tribe-territories',
        'fill-extrusion-height',
        [
          'case',
          ['==', ['get', 'tribeId'], selectedTribeId],
          200000, // Selected tribe
          50000   // Other tribes
        ]
      );
    } else {
      // Reset all tribes to default
      map.current.setPaintProperty(
        'tribe-territories',
        'fill-extrusion-opacity',
        0.4
      );
      
      map.current.setPaintProperty(
        'tribe-territories',
        'fill-extrusion-height',
        100000
      );
    }
  }, [selectedTribeId]);

  if (error) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center bg-black/50">
        <Globe className="h-16 w-16 text-justice-primary/50 mb-4" />
        <h3 className="text-lg font-medium text-justice-light mb-2">ScrollPlanet Map</h3>
        <p className="text-sm text-gray-400 text-center max-w-md mb-4">
          {error}
        </p>
        <Badge variant="outline" className="mb-6">
          Map Loading Error
        </Badge>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center bg-black/50">
        <Loader2 className="h-16 w-16 text-justice-primary/50 mb-4 animate-spin" />
        <h3 className="text-lg font-medium text-justice-light mb-2">Loading ScrollPlanet Map</h3>
        <p className="text-sm text-gray-400 text-center max-w-md mb-4">
          Initializing the interactive map...
        </p>
        <Badge variant="outline" className="mb-6 animate-pulse">
          Map Loading
        </Badge>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative rounded-md overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-4 left-4 z-10 bg-black/70 p-3 rounded-md text-xs text-gray-300">
        ScrollPlanet Interactive Map
      </div>
    </div>
  );
}
