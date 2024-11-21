// Função GET Dados
async function getDados() {
    try {
        var response = await fetch('/data/2022');
        const info = await response.json();
        
        var geoJsonResponse = await fetch('https://api.github.com/repos/tbrugz/geodata-br/contents/geojson/geojs-31-mun.json');
        var geoJsonData = await geoJsonResponse.json();
        var downloadUrl = geoJsonData.download_url;
        var geoJsonContentResponse = await fetch(downloadUrl);
        const geoJsonMGMunicipios = await geoJsonContentResponse.json();

        response = await fetch('https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/main/geojson/br_states/br_mg.json');
        const geoJsonMG = await response.json();
        
        return {info, geoJsonMGMunicipios, geoJsonMG};
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

$(document).ready(function () {
    getDados()
        .then(function (response) {

            // Mapa
            var map = L.map('map', {
                fullscreenControl: true,
                fullscreenControlOptions: { position: 'topleft' },
                zoomSnap: 0.5,
                zoomDelta: 0.5
            });

            // Visualização
            map.setView([-18.918999, -48.277950], 7);

            // Atribuição
            var attb = '&copy; <a target="_blank" href="https://www.maptiler.com/copyright/">MapTiler</a>, &copy; <a target = "_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a> | <a href="https://github.com/KyKirma/" target="_blank">Kourly</a>, <a href="https://github.com/gustavomcss" target="_blank">Corrêa</a>';

            // Chave API MapTiler
            key = 'jlq6npehL8CYWBPs1v4S'
            
            // Camada Base
            tileBase = L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,{ //style URL
                attribution: attb,
                tileSize: 512,
                zoomOffset: -1,
                crossOrigin: true
            }).addTo(map);

            tileOffColor = L.tileLayer(`https://api.maptiler.com/maps/streets-v2-light/{z}/{x}/{y}.png?key=${key}`,{ //style URL
                attribution: attb,
                tileSize: 512,
                zoomOffset: -1,
                crossOrigin: true
            });

            // Cálculo Área Total
            let totalArea_ha = response.info.totalArea;

            // Colorir os Municípios
            function getColor(d) {
                return  d >= response.info.escala['max']  ? '#006d2c' :
                        d >= response.info.escala['75%']  ? '#31a354' :
                        d >= response.info.escala['50%']  ? '#74c476' :
                        d >= response.info.escala['25%']  ? '#bae4b3' :
                        d >= response.info.escala['min']  ? '#edf8e9' :
                                                            '#bdbdbd';
            }
            
            // Estilo dos Municípios
            function style(feature) {
                return {
                    fillColor: getColor(feature.properties.Area_ha),
                    weight: 2,
                    opacity: 0.2,
                    color: 'white',
                    dashArray: '1',
                    fillOpacity: 0.7
                };
            }

            var geoJsonMGMunicipios = response.geoJsonMGMunicipios;
            geoJsonMGMunicipios.features.forEach((featureMG) => {
                const municipioName = featureMG.properties.name.toUpperCase();

                const municipioValues = Object.values(response.info.dadosCana['MUNICIPIO']).map(value => value.toUpperCase());
                const index = municipioValues.indexOf(municipioName);
                if (index!== -1) {
                    featureMG.properties.Area_ha = response.info.dadosCana['TOTAL_AREA'][index];
                } else {
                    featureMG.properties.Area_ha = 0;
                }
            });

            geoJsonMGMunicipiosProps = L.geoJson(geoJsonMGMunicipios, {
                style: style,
                onEachFeature: onEachFeature
            });
            
            geoJsonMG = L.geoJson(response.geoJsonMG, {
                style: function(feature) {
                    return {
                        fillColor: '#000000',
                        weight: 2,
                        opacity: 0.2,
                        color: 'white',
                        dashArray: '1',
                        fillOpacity: 0.5
                    };
                },
                invert: true,
                renderer: L.svg({ padding: 1 })
            });

            geoJsonMGE = response.geoJsonMG;
            geoJsonMGE.features.forEach((feature) => {
                feature.properties.Area_ha = totalArea_ha;
            });

            geoJsonMGE = L.geoJson(response.geoJsonMG, {
                style: style
            });
            
            geoJsonCana = L.geoJson(response.info.geoJsonCana, {
                style: style,
                onEachFeature: onEachFeature
            });

            // Barra de Pesquisa
            L.control.maptilerGeocoding({ 
                apiKey: key 
            }).addTo(map);
            
            // Resetar Visualização
            L.control.resetView({
                position: 'topleft',
                title: 'Reset view',
                latlng: L.latLng([-18.918999, -48.277950]),
                zoom: 7
            }).addTo(map);

            // Quadro de Informações 
            var info = L.control({ 
                position: 'bottomleft' 
            });

            // Hover Quadro de Informações
            function highlightFeature(e) {
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                });

                layer.bringToFront();
                info.update(layer.feature.properties);
            }

            function resetHighlight(e) {
                geoJsonMGMunicipiosProps.resetStyle(e.target);
                info.update();
            }
            
            function zoomToFeature(e) {
                map.fitBounds(e.target.getBounds(), { maxZoom: 9.7 });
            }

            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
            }

            // Criação HTML Quadro de Informações
            info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info');
                this.update();
                return this._div;
            };

            function titleCase(str) {
                return str.split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ');
            }

            // Update Quadro de Informações
            info.update = function (props) {
                if (props) {
                    let municipio = props.name;
                    if (!municipio){
                        municipio = props.NM_MUNICI;
                    }

                    let Area_ha = props.Area_ha;

                    if(Area_ha == 0){
                        this._div.innerHTML = '<h4>Município de ' + titleCase(municipio) + ':</h4>' + 'Área de Cana: <br>' + '<b>' + "Não Consta Dados" + '</b>';
                    } else {
                        this._div.innerHTML = '<h4>Município de ' + titleCase(municipio) + ':</h4>' + 'Área de Cana: <br>' + '<b>' + Area_ha.toFixed(2).toString().replace(/\./, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' Km²' + '</b>';
                    }
                    
                }
                else {
                    this._div.innerHTML = '<h4>Minas Gerais</h4>' + 'Área de Cana Total: <br>' + '<b>' + totalArea_ha.toFixed(2).toString().replace(/\./, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' Km²' + '</b>';
                }
            };

            var Legend = L.control({
                position: 'bottomleft'
            });

            Legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend');

                div.innerHTML = '<div class="legend-color"></div>' +
                                '<div style="display: flex; justify-content: space-between; margin-top: 8px;">' + 
                                '<div style="font-weight: bold;">' + response.info.escala["min"].toFixed(1) + '</div>' +
                                '<div style="font-weight: bold;"> Km²</div>' +
                                '<div style="font-weight: bold;">' + (response.info.escala["max"]/1000).toFixed(1) + 'k</div> </div>';

                return div;
            };

            Legend.addTo(map);
            
            // Quadro de Escala
            var legend = L.control({ 
                position: 'bottomleft' 
            });

            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [  response.info.escala['min'].toFixed(2),  
                                response.info.escala['25%'].toFixed(2),    
                                response.info.escala['50%'].toFixed(2),    
                                response.info.escala['75%'].toFixed(2),    
                                response.info.escala['max'].toFixed(2)],
                    labels = [];
            
                // Criação HTML Quadro de Escala
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '+');
                }
            
                return div;
            };
            
            legend.addTo(map);

            info.addTo(map);
    
            // Para as layers
            var baseLayers = {
                "Visualização Estadual": L.layerGroup([geoJsonMGE]),
                "Visualização Municipal": L.layerGroup([geoJsonMGMunicipiosProps]),
                "Visualização Detalhada": L.layerGroup([tileOffColor, geoJsonCana, geoJsonMG]),
            };

            baseLayers["Visualização Estadual"].addTo(map);

            // Controle de Camadas
            var layerControl = L.control.layers(baseLayers, null, {position: 'topleft'}).addTo(map);
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });
});