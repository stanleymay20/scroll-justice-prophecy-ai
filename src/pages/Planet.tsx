
import { useEffect, useRef, useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { MetaTags } from "@/components/MetaTags";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Users, Map, Layers } from "lucide-react";
import { CompactEHourClock } from "@/components/scroll-time/CompactEHourClock";
import { supabase } from "@/integrations/supabase/client";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace with your Mapbox public token
const MAPBOX_TOKEN = "pk.eyJ1Ijoic2Nyb2xsY291cnQiLCJhIjoiY2t6eThzejRpMDV5eDJ1cGVtYjRrOGdiaSJ9.0wA7TtL8NI78LUBQahU0Xg";

interface JudgeLocation {
  id: string;
  lat: number;
  lng: number;
  username: string;
  gate: string;
  active: boolean;
}

interface TribeData {
  id: string;
  name: string;
  color: string;
  members: number;
  regions: string[];
}

// Simulation data (in a real implementation, this would come from the database)
const mockJudges: JudgeLocation[] = [
  { id: "1", lat: 40.7128, lng: -74.0060, username: "JusticeBearer", gate: "dawn", active: true },
  { id: "2", lat: 34.0522, lng: -118.2437, username: "ScrollKeeper", gate: "light", active: true },
  { id: "3", lat: 51.5074, lng: -0.1278, username: "TruthSeeker", gate: "sun", active: true },
  { id: "4", lat: 35.6762, lng: 139.6503, username: "FlameGuardian", gate: "fire", active: false },
  { id: "5", lat: -33.8688, lng: 151.2093, username: "MercyWielder", gate: "moon", active: true },
  { id: "6", lat: 19.4326, lng: -99.1332, username: "UnityWalker", gate: "star", active: true },
  { id: "7", lat: -22.9068, lng: -43.1729, username: "WaterBearer", gate: "water", active: false }
];

const mockTribes: TribeData[] = [
  { id: "tribe1", name: "Dawn Seekers", color: "#f59e0b", members: 37, regions: ["North America", "Europe"] },
  { id: "tribe2", name: "Light Bearers", color: "#10b981", members: 28, regions: ["South America", "Africa"] },
  { id: "tribe3", name: "Sun Walkers", color: "#3b82f6", members: 45, regions: ["Asia", "Australia"] },
  { id: "tribe4", name: "Fire Keepers", color: "#ef4444", members: 19, regions: ["Europe", "Middle East"] },
  { id: "tribe5", name: "Star Gazers", color: "#8b5cf6", members: 33, regions: ["North America", "Asia"] },
];

export default function PlanetPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeTab, setActiveTab] = useState("globe");
  const [selectedTribe, setSelectedTribe] = useState<string | null>(null);
  
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
      pitch: 45,
    });
    
    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );
    
    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      if (!map.current) return;
      
      map.current.setFog({
        color: 'rgb(5, 5, 20)',
        'high-color': 'rgb(20, 20, 40)',
        'horizon-blend': 0.2,
      });
      
      map.current.addSource('judges', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: mockJudges.map(judge => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [judge.lng, judge.lat]
            },
            properties: {
              id: judge.id,
              username: judge.username,
              gate: judge.gate,
              active: judge.active
            }
          }))
        }
      });
      
      // Add judge markers layer
      map.current.addLayer({
        id: 'judges-layer',
        type: 'circle',
        source: 'judges',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'gate'],
            'dawn', '#f59e0b',
            'light', '#10b981',
            'sun', '#3b82f6',
            'fire', '#ef4444',
            'moon', '#8b5cf6',
            'star', '#ec4899',
            'water', '#0ea5e9',
            '#ffffff'
          ],
          'circle-opacity': [
            'case',
            ['==', ['get', 'active'], true],
            0.9,
            0.4
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.7,
        }
      });
      
      // Add pulsing effect for active judges
      map.current.addLayer({
        id: 'judges-pulse',
        type: 'circle',
        source: 'judges',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['%', ['time'], 3000],
            0, 8,
            1500, 25,
            3000, 8
          ],
          'circle-color': [
            'match',
            ['get', 'gate'],
            'dawn', '#f59e0b',
            'light', '#10b981',
            'sun', '#3b82f6',
            'fire', '#ef4444',
            'moon', '#8b5cf6',
            'star', '#ec4899',
            'water', '#0ea5e9',
            '#ffffff'
          ],
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['%', ['time'], 3000],
            0, 0.7,
            1500, 0,
            3000, 0.7
          ],
          'circle-stroke-width': 0
        },
        filter: ['==', ['get', 'active'], true]
      });
      
      // Add a tribal territory layer (simplified)
      const tribeRegions = {
        type: 'FeatureCollection',
        features: [
          // North America
          {
            type: 'Feature',
            properties: { tribe: 'tribe1', name: 'Dawn Seekers' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-125, 49], [-125, 25], [-95, 25], [-65, 25], [-65, 49], [-125, 49]
              ]]
            }
          },
          // South America
          {
            type: 'Feature',
            properties: { tribe: 'tribe2', name: 'Light Bearers' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-80, 10], [-80, -55], [-35, -55], [-35, 10], [-80, 10]
              ]]
            }
          },
          // Europe
          {
            type: 'Feature',
            properties: { tribe: 'tribe4', name: 'Fire Keepers' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-10, 35], [-10, 60], [40, 60], [40, 35], [-10, 35]
              ]]
            }
          },
          // Asia
          {
            type: 'Feature',
            properties: { tribe: 'tribe3', name: 'Sun Walkers' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [60, 10], [60, 60], [140, 60], [140, 10], [60, 10]
              ]]
            }
          },
          // Australia
          {
            type: 'Feature',
            properties: { tribe: 'tribe3', name: 'Sun Walkers' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [115, -10], [115, -40], [155, -40], [155, -10], [115, -10]
              ]]
            }
          }
        ]
      };
      
      map.current.addSource('tribes', {
        type: 'geojson',
        data: tribeRegions as any
      });
      
      map.current.addLayer({
        id: 'tribe-territories',
        type: 'fill',
        source: 'tribes',
        layout: {},
        paint: {
          'fill-color': [
            'match',
            ['get', 'tribe'],
            'tribe1', '#f59e0b',
            'tribe2', '#10b981',
            'tribe3', '#3b82f6',
            'tribe4', '#ef4444',
            'tribe5', '#8b5cf6',
            '#ffffff'
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'tribe'], selectedTribe || ''],
            0.4,
            0.2
          ]
        }
      });
      
      // Add tribe labels
      map.current.addLayer({
        id: 'tribe-labels',
        type: 'symbol',
        source: 'tribes',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold'],
          'text-size': 14,
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.05,
          'text-offset': [0, 0]
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 2
        }
      });
      
      // Add click events for judges
      map.current.on('click', 'judges-layer', (e) => {
        if (!e.features || e.features.length === 0 || !map.current) return;
        
        const feature = e.features[0];
        const properties = feature.properties;
        
        if (!properties) return;
        
        const popupContent = `
          <div class="p-2">
            <div class="font-bold">${properties.username}</div>
            <div class="text-sm">Gate: ${properties.gate}</div>
            <div class="text-sm">${properties.active ? 'Active' : 'Inactive'}</div>
          </div>
        `;
        
        new mapboxgl.Popup()
          .setLngLat((feature.geometry as any).coordinates)
          .setHTML(popupContent)
          .addTo(map.current);
      });
      
      // Change cursor on hover
      map.current.on('mouseenter', 'judges-layer', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      
      map.current.on('mouseleave', 'judges-layer', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    });
    
    // Add glow effects for gates when in globe view
    const pulseGates = () => {
      if (!map.current) return;
      
      // Update tribe territories based on selection
      if (map.current.getLayer('tribe-territories')) {
        map.current.setPaintProperty('tribe-territories', 'fill-opacity', [
          'case',
          ['==', ['get', 'tribe'], selectedTribe || ''],
          0.4,
          0.2
        ]);
      }
    };
    
    // Set up animation loop for gate pulses
    const animation = setInterval(pulseGates, 100);
    
    // Set up auto-rotation of globe
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;
    
    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond / 60;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }
    
    // Event listeners for interaction
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('moveend', () => {
      spinGlobe();
    });
    
    // Start the globe spinning
    spinGlobe();
    const interval = setInterval(spinGlobe, 1000);
    
    // Cleanup
    return () => {
      clearInterval(animation);
      clearInterval(interval);
      map.current?.remove();
    };
  }, [selectedTribe]);
  
  const handleTribeSelect = (tribeId: string) => {
    setSelectedTribe(tribeId === selectedTribe ? null : tribeId);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title="ScrollPlanet Map" />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-justice-light">ScrollPlanet & Tribe Map</h1>
          <CompactEHourClock />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-black/30 border border-justice-primary/30 overflow-hidden">
              <div ref={mapContainer} className="w-full h-[600px]" />
            </Card>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-black/30 border border-justice-primary/30">
              <CardContent className="p-4">
                <Tabs defaultValue="tribes" className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="tribes" className="flex-1">
                      <Users className="w-4 h-4 mr-2" />
                      Tribes
                    </TabsTrigger>
                    <TabsTrigger value="gates" className="flex-1">
                      <Layers className="w-4 h-4 mr-2" />
                      Gates
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tribes">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300 mb-2">
                        Select a tribe to highlight their territory on the map:
                      </p>
                      
                      {mockTribes.map(tribe => (
                        <div 
                          key={tribe.id}
                          className={`p-3 rounded-lg cursor-pointer border transition-all ${
                            selectedTribe === tribe.id 
                              ? 'bg-black/50 border-justice-primary' 
                              : 'bg-black/20 border-transparent hover:border-justice-primary/30'
                          }`}
                          onClick={() => handleTribeSelect(tribe.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-white flex items-center">
                              <span 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: tribe.color }}
                              ></span>
                              {tribe.name}
                            </h3>
                            <Badge variant="outline" className="bg-black/40">
                              {tribe.members} members
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-400">
                            Regions: {tribe.regions.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gates">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300 mb-2">
                        Active gates around the ScrollPlanet:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-black/20 rounded-lg border border-scroll-dawn/30">
                          <div className="flex items-center mb-1">
                            <span className="w-3 h-3 rounded-full bg-scroll-dawn mr-2"></span>
                            <span className="text-scroll-dawn text-sm font-medium">Dawn Gate</span>
                          </div>
                          <div className="text-xs text-gray-400">12 active judges</div>
                        </div>
                        
                        <div className="p-2 bg-black/20 rounded-lg border border-scroll-rise/30">
                          <div className="flex items-center mb-1">
                            <span className="w-3 h-3 rounded-full bg-scroll-rise mr-2"></span>
                            <span className="text-scroll-rise text-sm font-medium">Light Gate</span>
                          </div>
                          <div className="text-xs text-gray-400">9 active judges</div>
                        </div>
                        
                        <div className="p-2 bg-black/20 rounded-lg border border-scroll-ascend/30">
                          <div className="flex items-center mb-1">
                            <span className="w-3 h-3 rounded-full bg-scroll-ascend mr-2"></span>
                            <span className="text-scroll-ascend text-sm font-medium">Sun Gate</span>
                          </div>
                          <div className="text-xs text-gray-400">7 active judges</div>
                        </div>
                        
                        <div className="p-2 bg-black/20 rounded-lg border border-justice-tertiary/30">
                          <div className="flex items-center mb-1">
                            <span className="w-3 h-3 rounded-full bg-justice-tertiary mr-2"></span>
                            <span className="text-justice-tertiary text-sm font-medium">Fire Gate</span>
                          </div>
                          <div className="text-xs text-gray-400">5 active judges</div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-xs text-gray-400 mb-1">Legend:</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-white mr-1"></span>
                            <span className="text-xs text-gray-300">Active</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-white opacity-30 mr-1"></span>
                            <span className="text-xs text-gray-300">Inactive</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border border-justice-primary/30">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-justice-light mb-2">ScrollGate Pulse</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Dawn Gate:</span>
                    <div className="w-1/2 bg-black/40 rounded-full h-1.5">
                      <div className="bg-scroll-dawn h-1.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Light Gate:</span>
                    <div className="w-1/2 bg-black/40 rounded-full h-1.5">
                      <div className="bg-scroll-rise h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Sun Gate:</span>
                    <div className="w-1/2 bg-black/40 rounded-full h-1.5">
                      <div className="bg-scroll-ascend h-1.5 rounded-full animate-pulse" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Fire Gate:</span>
                    <div className="w-1/2 bg-black/40 rounded-full h-1.5">
                      <div className="bg-justice-tertiary h-1.5 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-justice-primary/20">
                  <p className="text-xs text-gray-400 mb-2">Active Scroll Judges: 38</p>
                  <p className="text-xs text-gray-400">Gates Open: 7/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
