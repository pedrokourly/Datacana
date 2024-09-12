// Função GET Dados
async function getDados() {
    try {
        const response = await fetch('/map/Data');
        const info = await response.json();
    
        const geoJsonResponse = await fetch('https://api.github.com/repos/tbrugz/geodata-br/contents/geojson/geojs-31-mun.json');
        const geoJsonData = await geoJsonResponse.json();
        const downloadUrl = geoJsonData.download_url;
        const geoJsonContentResponse = await fetch(downloadUrl);
        const geoJsonContent = await geoJsonContentResponse.json();
        console.log(geoJsonContent)
        return {info, geoJsonContent};
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
            const key = 'jlq6npehL8CYWBPs1v4S';
            
            // Camada Base
            L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,{ //style URL
                attribution: attb,
                tileSize: 512,
                zoomOffset: -1,
                crossOrigin: true
            }).addTo(map);

            // Tabela GeoJSON Combinada
            var geoJson = response.geoJsonContent
            geoJson.features.forEach((feature) => {
                const municipioValues = Object.values(response.info.data['MUNICIPIO']).map(value => value.toUpperCase());
                const index = municipioValues.indexOf(feature.properties.name.toUpperCase());
                if (index!== -1) {
                    feature.properties.AreaHa = response.info.data['AREA_HA'][index];
                } else {
                    feature.properties.AreaHa = 0;
                }
            });          
            
            // Cálculo Área Total
            let totalAreaHa = 0;
            for (let i = 0; i < response.info.qnt; i++) {
                totalAreaHa += response.info.data['AREA_HA'][i];
            }

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
                    fillColor: getColor(feature.properties.AreaHa),
                    weight: 2,
                    opacity: 0.2,
                    color: 'white',
                    dashArray: '1',
                    fillOpacity: 0.7
                };
            }

            geoJson = L.geoJson(geoJson, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);

            // Barra de Pesquisa
            L.control.maptilerGeocoding({ 
                apiKey: key 
            }).addTo(map);
            
            // Resetar Visualização
            L.control.resetView({
                position: "topleft",
                title: "Reset view",
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
                geoJson.resetStyle(e.target);
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

            // Update Quadro de Informações
            info.update = function (props) {
                if (props) {
                    let municipio = props.name;
                    let areaHa = props.AreaHa;

                    if(areaHa == 0){
                        this._div.innerHTML = '<h4>Município de ' + municipio + ':</h4>' + 'Área de Cana: <br>' + '<b>' + "Não Consta Dados" + '</b>';
                    } else {
                        this._div.innerHTML = '<h4>Município de ' + municipio + ':</h4>' + 'Área de Cana: <br>' + '<b>' + areaHa + 'Km²' + '</b>';
                    }
                    
                }
                else {
                    this._div.innerHTML = '<h4>Minas Gerais</h4>' + 'Área de Cana Total: <br>' + '<b>' + totalAreaHa.toFixed(2) + ' Km²' + '</b>';
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
                                '<div style="font-weight: bold;">Km²</div>' +
                                '<div style="font-weight: bold;">' + (response.info.escala["max"]/1000).toFixed(1) + 'k</div> </div>';

                return div;
            };

            Legend.addTo(map);
            
            /*
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
            */

            info.addTo(map);
            
            /*
            // Código para o modelo de círculos
            function getRadius(areaHa) {
                const scale = 0.15;
                const radius = (Math.sqrt(areaHa) * scale) / 2;
                return Math.max(radius, 2);
            }

            // Pop-up's Municípios
            for (let i = 0; i < response.info.qnt; i++) {
                const municipio = response.info.data['MUNICIPIO'][i];
                const areaHa = response.info.data['AREA_HA'][i];
                const radius = getRadius(areaHa);

                let marker = L.circleMarker([response.info.data['LAT'][i], response.info.data['LONG'][i]], {
                    color: 'darkgreen',
                    radius: radius,
                    stroke: true,
                    weight: 0.8,
                    opacity: 1,
                    municipio: municipio,
                    areaHa: areaHa
                });

                var popup = L.responsivePopup().setContent(
                    '<div style="text-align: center;"> <b>' + response.info.data['MUNICIPIO'][i] + '</b><br>' + 'Área de Cana: ' + response.info.data['AREA_HA'][i] + " Km² </div>"
                );

                marker.on({ mouseover: highlightFeature, mouseout: resetHighlight});
                marker.addTo(map).bindPopup(popup);
            } 
            */
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });
});