// Import Style Page Module
import './Platform.css';

// Import Images
import Logo from '/assets/images/DataCana.svg';

// Import React Libs
import { useEffect, useRef } from 'react';

// Import React Router DOM
import { NavLink } from 'react-router-dom';

const Platform = () => {
    // Handling the Leaflet Map
    useEffect(() => {
        let map;

        // Check if Map has Already been Initialized
        if (L.DomUtil.get("map") !== null) {
            L.DomUtil.get("map")._leaflet_id = null;
        }

        // Map Variable
        map = L.map("map");
        map.setView([-19, -46], 7);

        // Map Attribution
        const attb = '&copy; <a target="_blank" href="https://www.maptiler.com/copyright/">MapTiler</a>, &copy; <a target = "_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a> | <a href="https://github.com/KyKirma/" target="_blank">Kourly</a>, <a href="https://github.com/gustavomcss" target="_blank">Corrêa</a>'

        // API Key
        const APIKey = import.meta.env.VITE_MAPTILER_API_KEY;

        // Tile Layers
        const tileBase = L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${APIKey}`, {
            attribution: attb,
            tileSize: 512,
            zoomOffset: -1,
            crossOrigin: true
        }).addTo(map);

        const tileOffColor = L.tileLayer(`https://api.maptiler.com/maps/streets-v2-light/{z}/{x}/{y}.png?key=${APIKey}`, {
            attribution: attb,
            tileSize: 512,
            zoomOffset: -1,
            crossOrigin: true
        });

        // Map Control (FullScreen)
        L.control.fullscreen({
            position: 'topleft',
            title: 'Full Screen',
            titleCancel: 'Exit Full Screen',
            forceSeparateButton: true
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

        // TODO: Data Processing
        

        // Cleanup Function
        return () => { if (map) { map.remove(); } };
    }, []);

    return (
        <div className="Platform">
            <div className="navBar">
                <NavLink className="logo" to="/">
                    <img src={Logo} alt="Logo DataCana" />
                </NavLink>
            </div>

            <div id="map"></div>
        </div>
    );
};

export default Platform;