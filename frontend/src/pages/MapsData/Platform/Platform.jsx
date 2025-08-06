// Import Style Page Module
import './Platform.css';

// Import Images
import Logo from '/assets/images/DataCana.svg';

// Import React Libs
import { useState, useEffect, useRef } from 'react';

// Import React Router DOM
import { NavLink } from 'react-router-dom';

// Import Services
import { fetchDataForYear, fetchGeoJsonFiles } from '../../../services/dataService.js';

// Import Plugin
import '../../../utils/Snogylop.js';

// Import Components
import MapControlPanel from '../../../components/MapControlPanel/MapControlPanel.jsx';
import MapInfoPanel from '../../../components/MapInfoPanel/MapInfoPanel.jsx';
import MapLegend from '../../../components/MapLegendPanel/MapLegendPanel.jsx';
import MapScale from '../../../components/MapScalePanel/MapScalePanel.jsx';

const Platform = () => {
    // Variables and Constants
    const layerPriority = ['Cultura', 'Municipal', 'Estadual'];
    const colorScaleColors = ['#0A4A1A', '#1A7A2A', '#2A9A3A', '#4ABA5A', '#6ADA7A'];
    const noDataColor = '#9D9D9D';

    // State Management
    const [mapData, setMapData] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [availableYears] = useState([2017, 2018, 2022]);
    const [currentYear, setCurrentYear] = useState(2022);
    const [activeOverlays, setActiveOverlays] = useState(['Estadual']);
    const [hoverInfo, setHoverInfo] = useState({ name: 'Minas Gerais (MG)', area: null });
    const [isLoading, setIsLoading] = useState(true);

    // Refs
    const mapContainerRef = useRef(null);
    const layersRef = useRef({});
    const tileBaseRef = useRef(null);
    const tileOffColorRef = useRef(null);

    // Handling the Leaflet Map
    useEffect(() => {
        if (mapInstance) return;

        // Map Initialization
        const map = L.map('map', { zoomSnap: 0.5, zoomDelta: 0.5 });
        map.setView([-19, -46], 7);
        setMapInstance(map);

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
        return () => { map.remove(); setMapInstance(null); }
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

                // Equal Interval Scale (Logic)
                if (info && info.dadosCana && info.dadosCana['TOTAL_AREA']) {
                    const areaData = Object.values(info.dadosCana['TOTAL_AREA']).filter(area => area != null && area > 0);
                    
                    if (areaData.length > 0) {
                        const minValue = Math.min(...areaData);
                        const maxValue = Math.max(...areaData);
                        const range = maxValue - minValue;
                        const numClasses = 5;
                        const interval = range / numClasses;

                        info.escala = {
                            min: minValue,
                            break1: minValue + interval,
                            break2: minValue + (2 * interval),
                            break3: minValue + (3 * interval),
                            break4: minValue + (4 * interval),
                            max: maxValue,
                        };
                    }
                } 

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
        const map = mapInstance;
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

            // Equal Interval Scale (Color)
            if (area === null || area === 0) return noDataColor;
            if (area > scale.break4) return colorScaleColors[0];
            if (area > scale.break3) return colorScaleColors[1];
            if (area > scale.break2) return colorScaleColors[2];
            if (area > scale.break1) return colorScaleColors[3];
            if (area >= scale.min) return colorScaleColors[4];

            return noDataColor;
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

    }, [mapData, mapInstance, activeOverlays]);

    // Handling Tile Layer Swapping
    useEffect(() => {
        const map = mapInstance;
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
    }, [mapInstance, activeOverlays]);

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
                        <MapScale map={mapInstance} />
                        <MapInfoPanel title={hoverInfo.name} area={hoverInfo.area} isLoading={isLoading} />
                        <MapLegend scale={mapData ? mapData.info.escala : null} colors={colorScaleColors} noDataColor={noDataColor} isLoading={isLoading} />
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