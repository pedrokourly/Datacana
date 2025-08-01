// Import Style Page Module
import './Platform.css';

// Import Images
import Logo from '/assets/images/DataCana.svg';

// Import React Libs
import { useState, useEffect, useRef } from 'react';

// Import React DOM
import { createRoot } from 'react-dom/client';

// Import React Router DOM
import { NavLink } from 'react-router-dom';

// Import Services
import { fetchDataForYear, fetchGeoJsonFiles } from '../../../services/dataService.js';

// Import Plugin
import '../../../utils/Snogylop.js';

// Import Components
import MapControlPanel from '../../../components/MapControlPanel/MapControlPanel.jsx';
import MapInfoPanel from '../../../components/MapInfoPanel/MapInfoPanel.jsx';

const Platform = () => {
    // Variables and Constants
    const layerPriority = ['Cultura', 'Municipal', 'Estadual'];

    // State Management
    const [mapData, setMapData] = useState(null);
    const [availableYears] = useState([2017, 2022]);
    const [currentYear, setCurrentYear] = useState(2022);
    const [activeOverlays, setActiveOverlays] = useState(['Estadual']);
    const [hoverInfo, setHoverInfo] = useState({ name: 'Minas Gerais (MG)', area: null });
    const [isLoading, setIsLoading] = useState(true);

    // Refs
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const layersRef = useRef({});
    const tileBaseRef = useRef(null);
    const tileOffColorRef = useRef(null);

    // Handling the Leaflet Map
    useEffect(() => {
        if (mapRef.current) return;

        // Map Initialization
        const map = L.map('map', { zoomSnap: 0.5, zoomDelta: 0.5 });
        map.setView([-19, -46], 7);
        mapRef.current = map;

        // API Key
        const APIKey = import.meta.env.VITE_MAPTILER_API_KEY;

        // Map Attribution
        const Attb = '&copy; <a target="_blank" href="https://www.maptiler.com/copyright/">MapTiler</a>, &copy; <a target = "_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a> | <a href="https://github.com/KyKirma/" target="_blank">Kourly</a>, <a href="https://github.com/gustavomcss" target="_blank">Corrêa</a>'

        // Tile Layers
        tileBaseRef.current = L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${APIKey}`, {
            attribution: Attb, tileSize: 512, zoomOffset: -1
        });
        tileOffColorRef.current = L.tileLayer(`https://api.maptiler.com/maps/streets-v2-light/{z}/{x}/{y}.png?key=${APIKey}`, {
            attribution: Attb, tileSize: 512, zoomOffset: -1
        });
        tileBaseRef.current.addTo(map);

        // Map Control (FullScreen)
        L.control.fullscreen({
            position: 'topleft',
            title: 'Full Screen',
            titleCancel: 'Exit Full Screen',
            forceSeparateButton: true,
            fullscreenElement: mapContainerRef.current,
        }).addTo(map);

        // Map Control (ResetView)
        L.control.resetView({
            position: 'topleft',
            title: 'Reset View',
            latlng: L.latLng([-19, -46]),
            zoom: 7
        }).addTo(map);

        // Map Control (SearchBar)
        L.control.maptilerGeocoding({
            apiKey: APIKey
        }).addTo(map);

        // Map Cleanup
        return () => { map.remove(); mapRef.current = null; };
    }, []);

    // Handling Data Fetching
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [info, geoJsonFiles] = await Promise.all([
                    fetchDataForYear(currentYear),
                    fetchGeoJsonFiles()
                ]);

                setMapData({ info, ...geoJsonFiles });
                setHoverInfo({ name: 'Minas Gerais (MG)', area: info.totalArea });
            } catch (error) {
                console.error(`Failed to Load Data for Year ${currentYear}:`, error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

    }, [currentYear]);

    // Handling Map Layers and Features
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapData) return;

        // Clear Previous Layers
        Object.values(layersRef.current).forEach(layer => {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        });

        // Priorirty Layer Management
        const highestPriorityLayer = layerPriority.find(layerName => activeOverlays.includes(layerName));

        // Features (Color Scale)
        const getColor = (area) => {
            const scale = mapData.info.escala;
            return area === null || area === 0 ? '#9d9d9d' :
                area >= scale['max'] ? '#0a4a1a' :
                    area >= scale['75%'] ? '#1a7a2a' :
                        area >= scale['50%'] ? '#2a9a3a' :
                            area >= scale['25%'] ? '#4aba5a' :
                                area >= scale['min'] ? '#6ada7a' :
                                    '#9d9d9d';
        };

        // Features (Style)
        const styleFeature = (feature) => ({
            fillColor: getColor(feature.properties.Area_ha),
            fillOpacity: 0.85,
            color: 'white',
            weight: 2,
            opacity: 0.25,
            dashArray: '1'
        });

        // Features (Highlight)
        const highlightFeature = (e) => {
            const layer = e.target;
            layer.setStyle({
                color: '#666666',
                weight: 2,
                opacity: 0.5,
                dashArray: '1',
            });
            layer.bringToFront();
        };

        // Prepare GeoJSON Data
        const { geoJsonMG, geoJsonMGMunicipios, info } = mapData;

        // 1. State Layer
        geoJsonMG.features.forEach(feature => feature.properties.Area_ha = info.totalArea);
        const stateLayer = L.geoJson(geoJsonMG, { style: styleFeature });

        // 2. Municipal Layer
        geoJsonMGMunicipios.features.forEach(feature => {
            const municipioName = feature.properties.name.toUpperCase();
            const index = Object.values(info.dadosCana['MUNICIPIO']).findIndex(val => val.toUpperCase() === municipioName);
            feature.properties.Area_ha = (index !== -1) ? info.dadosCana['TOTAL_AREA'][index] : null;
        });
        const municipalLayer = L.geoJson(geoJsonMGMunicipios, {
            style: styleFeature,
            onEachFeature: highestPriorityLayer === 'Municipal' ? (feature, layer) => {
                layer.on({
                    mouseover: (e) => {
                        highlightFeature(e);
                        setHoverInfo({
                            name: feature.properties.name,
                            area: e.target.feature.properties.Area_ha
                        });
                    },
                    mouseout: (e) => {
                        municipalLayer.resetStyle(e.target);
                        setHoverInfo({
                            name: 'Minas Gerais (MG)',
                            area: info.totalArea
                        });
                    }
                });
            } : undefined
        });

        // 3. Culture Layer
        const cultureLayer = L.geoJson(info.geoJsonCana, {
            style: styleFeature,
            onEachFeature: highestPriorityLayer === 'Cultura' ? (feature, layer) => {
                layer.on({
                    mouseover: (e) => {
                        highlightFeature(e);
                        setHoverInfo({
                            name: 'Talhão de Cana',
                            area: e.target.feature.properties.Area_ha
                        });
                    },
                    mouseout: (e) => {
                        cultureLayer.resetStyle(e.target);
                        setHoverInfo({
                            name: 'Minas Gerais (MG)',
                            area: info.totalArea
                        });
                    }
                })
            } : undefined
        });

        // 4. Inverted Mask
        const invertedStateMask = L.geoJson(geoJsonMG, {
            invert: true,
            style: { fillColor: '#000000', fillOpacity: 0.5, weight: 0 }
        })
        const cultureLayerGroup = L.layerGroup([cultureLayer, invertedStateMask]);

        // Layers Group
        const layersGroup = { "Estadual": stateLayer, "Municipal": municipalLayer, "Cultura": cultureLayerGroup };
        layersRef.current = layersGroup;

        layerPriority.slice().reverse().forEach(layerName => {
            if (activeOverlays.includes(layerName) && layersGroup[layerName]) {
                layersGroup[layerName].addTo(map);
            }
        });

    }, [mapData, activeOverlays]);

    // Handling Tile Layer Swapping
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !tileBaseRef.current || !tileOffColorRef.current) return;

        const culturaIsActive = activeOverlays.includes('Cultura');

        if (culturaIsActive) {
            if (map.hasLayer(tileBaseRef.current)) {
                map.removeLayer(tileBaseRef.current);
            }
            if (!map.hasLayer(tileOffColorRef.current)) {
                tileOffColorRef.current.addTo(map).bringToBack();
            }
        } else {
            if (map.hasLayer(tileOffColorRef.current)) {
                map.removeLayer(tileOffColorRef.current);
            }
            if (!map.hasLayer(tileBaseRef.current)) {
                tileBaseRef.current.addTo(map).bringToBack();
            }
        }
    }, [activeOverlays]);

    // Handling Year Change
    const handleYearChange = (year) => {
        if (year !== currentYear && !isLoading) {
            setCurrentYear(year);
        }
    };

    // Handling Layer Toggle
    const handleLayerChange = (layerName) => {
        setActiveOverlays(prev =>
            prev.includes(layerName)
                ? prev.filter(name => name !== layerName)
                : [...prev, layerName]
        );
    };

    const layerDefinitions = { "Estadual": {}, "Municipal": {}, "Cultura": {} };

    return (
        <div className="Platform">
            <div className="navBar">
                <NavLink className="logo" to="/">
                    <img src={Logo} alt="Logo DataCana" />
                </NavLink>
            </div>

            <div className="mapContainer" ref={mapContainerRef}>
                <div id="map"></div>

                <div className="mapUI-container">
                    <div className="mapUI-bottom-left">
                        <MapInfoPanel title={hoverInfo.name} area={hoverInfo.area} isLoading={isLoading} />
                    </div>
                    <div className="mapUI-bottom-right">
                        <MapControlPanel availableYears={availableYears} currentYear={currentYear} onYearChange={handleYearChange} layers={layerDefinitions} activeOverlays={activeOverlays} onLayerChange={handleLayerChange} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Platform;