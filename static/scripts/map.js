// Função GET Dados
async function getDados() {
    try {
        const response = await fetch('/mapData');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

$(document).ready(function () {
    getDados()
        .then(function (response) {
            var map = L.map('map', {
                fullscreenControl: true,
                fullscreenControlOptions: { position: 'topleft' }
            }).setView([-18.918999, -48.277950], 7);

            var attb = '&copy; <a target="_blank" href="https://www.maptiler.com/copyright/">MapTiler</a>, &copy; <a target = "_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a href="https://github.com/KyKirma/" target="_blank">Kourly</a>, <a href="https://github.com/gustavomcss" target="_blank">Corrêa</a>';

            const key = 'jlq6npehL8CYWBPs1v4S';
            
            L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}@2x.png?key=${key}`,{ //style URL
                attribution: attb,
                tileSize: 512,
                zoomOffset: -1,
                crossOrigin: true
            }).addTo(map);

            L.control.maptilerGeocoding({ apiKey: key }).addTo(map);
            
            L.control.resetView({
                position: "topleft",
                title: "Reset view",
                latlng: L.latLng([-18.918999, -48.277950]),
                zoom: 7,
            }).addTo(map);

            var info = L.control({position: 'bottomleft'});
            info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info');
                this.update();
                return this._div;
            };

            let totalAreaHa = 0;
            for (let i = 0; i < response.qnt; i++) {
                totalAreaHa += response.data['AREA_HA'][i];
            }
            
            info.update = function (props) {
                if (props) {
                    let municipio = props.municipio;
                    let areaHa = props.areaHa;

                    this._div.innerHTML = '<h4>Município de '+municipio+':</h4>' + '<b>' + 'Área de cana: ' + areaHa + ' Km' +'</b>';
                } 
                else {
                    this._div.innerHTML = '<h4>Minas Gerais</h4>' +  '<b>' + 'Área de cana total: ' + totalAreaHa.toFixed(2) + ' Km' + '</b>';
                }
            };

            function highlightFeature(e) {
                info.update(e.sourceTarget.options);
            }
            
            function resetHighlight(e) {
                info.update();
            }

            info.addTo(map);

            function getRadius(areaHa) {
                // Define a escala de raio
                const scale = 0.15;

                // Calcula o raio com base na área em hectares
                const radius = (Math.sqrt(areaHa) * scale) / 2;

                // Retorna o raio com um valor mínimo de 2 pixels
                return Math.max(radius, 2);
            }

            for (let i = 0; i < response.qnt; i++) {
                const municipio = response.data['MUNICIPIO'][i];
                const areaHa = response.data['AREA_HA'][i];
                const radius = getRadius(areaHa);

                let marker = L.circleMarker([response.data['LAT'][i], response.data['LONG'][i]], {
                    color: 'darkgreen',
                    radius: radius,
                    stroke: true,
                    weight: 0.5,
                    opacity: 1,
                    municipio: municipio,
                    areaHa: areaHa,
                });

                var popup = L.responsivePopup().setContent(
                    '<b>' + response.data['MUNICIPIO'][i] + '</b><br>' + 'Área: ' + response.data['AREA_HA'][i] + "Km"
                );
                marker.on({mouseover: highlightFeature, mouseout: resetHighlight});
                marker.addTo(map).bindPopup(popup);
            }
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });
});