// Import Style Page Module
import './Home.css';

// Import Images
import IconMG from '/assets/images/IconMG.png';
import IconCana from '/assets/images/IconCana.png';
import IconMuni from '/assets/images/IconMuni.png';

// Import React Icons
import { HiCursorClick } from 'react-icons/hi';

// Import React Libs
import { useState, useEffect } from 'react';

// Import React Router DOM
import { Link } from 'react-router-dom';

// Import Components
import Cover from '../../components/Cover/Cover.jsx';

// Import Number Flow
import NumberFlow from '@number-flow/react';

// Import React Intersection Observer
import { useInView } from 'react-intersection-observer';

const Home = () => {
    // Handling the Leaflet Map
    useEffect(() => {
        let map;

        // Check if Map has Already been Initialized
        if (L.DomUtil.get("map") !== null) {
            L.DomUtil.get("map")._leaflet_id = null;
        }

        map = L.map("map", {
            zoomControl: false
        });

        // Make a Request to GET GeoJSON data from IBGE API
        fetch('https://servicodados.ibge.gov.br/api/v2/malhas/31?formato=application/vnd.geo+json')
            .then(response => response.json())
            .then(geoJSONData => {
                const geoJSONLayer = L.geoJSON(geoJSONData, {
                    style: {
                        fillColor: "#86D95F",
                        fillOpacity: 1,
                        color: "#000000",
                        weight: 0.75
                    }
                }).addTo(map);

                // Get the Boundaries of GeoJSON Layer
                var ufBounds = geoJSONLayer.getBounds();

                const updateZoom = () => {
                    map.fitBounds(ufBounds);
                };
                updateZoom();

                // Adds a Listener to Adjust the Zoom when Resizing
                window.addEventListener("resize", updateZoom);

                // Turn Off Map Controls (Static Map)
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.boxZoom.disable();
                map.keyboard.disable();

                // Function Cleanup (Disassenbling)
                return () => {
                    window.removeEventListener("resize", updateZoom);
                    if (map) {
                        map.remove();
                    }
                };
            })
            .catch(error => console.error(error));
    }, []);

    // Handling the Number Flow
    const [value, setValue] = useState(null);

    const { ref } = useInView({
        threshold: 0.25,
        onChange: (inView) => {
            setValue(inView ? 821226.9 : null);
        }
    });

    return (
        <div className="Home">
            <Cover pageName="DataCana" />

            <div className="content">
                <div className="container">
                    <div className="line">
                        <div className="slogan">
                            <h2>A ESPACIALIZAÇÃO DO CULTIVO DA CANA-DE-AÇÚCAR EM MINAS GERAIS A UM CLIQUE</h2>
                            <p>O DataCana é mais do que uma plataforma; é a democratização do acesso à informação.</p>
                            <Link to="/mapsdata/platform" target="_blank">Acesse a Plataforma <HiCursorClick /></Link>
                        </div>

                        <div id="map" onClick={() => window.open("/mapsdata/platform", "_blank")}></div>
                    </div>
                </div>
            </div>

            <div className="brief-cover">
                <div className="blur">
                    <h2>Área Total de Cana em MG (2022)</h2>
                    <NumberFlow ref={ref} value={value} suffix=" ha" trend={+1} spinTiming={{ duration: 2000, easing: 'ease' }} />
                </div>
            </div>

            <div className="content">
                <div className="container">
                    <div className="carton-container">
                        <div className="carton">
                            <div className="carton-image" id="iconMG">
                                <img src={IconMG} alt="Ícone MG" />
                            </div>
                            <div className="carton-body">
                                <h3>Área Territorial</h3>
                                <p className="carton-text">
                                    <small>Minas Gerais</small>
                                </p>
                                <p className="carton-text data-number">
                                    586.513.983 <span>ha</span>
                                </p>
                            </div>
                        </div>

                        <div className="carton">
                            <div className="carton-image" id="iconMuni">
                                <img src={IconMuni} alt="Ícone Município" />
                            </div>
                            <div className="carton-body">
                                <h3>Município de Maior Área</h3>
                                <p className="carton-text">
                                    <small>Uberaba</small>
                                </p>
                                <p className="carton-text data-number">
                                    98.926,21 <span>ha</span>
                                </p>
                            </div>
                        </div>

                        <div className="carton">
                            <div className="carton-image" id="iconCana">
                                <img src={IconCana} alt="Ícone Cana" />
                            </div>
                            <div className="carton-body">
                                <h3>Polígonos Totais</h3>
                                <p className="carton-text">
                                    <small>Arquivo .SHP</small>
                                </p>
                                <p className="carton-text data-number">
                                    9073 <span>Polígonos</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
        </div>
    );
};

export default Home;