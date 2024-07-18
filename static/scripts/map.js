
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
            console.log(response);
            
            var map = L.map('map').setView([-18.918999, -48.277950], 7);
            var attb = '&copy; <a target="_blank" href="https://www.maptiler.com/copyright/">MapTiler</a>, &copy; <a target = "_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a href="https://github.com/KyKirma/" target="_blank">Kourly</a>, <a href="https://github.com/gustavomcss" target="_blank">Corrêa</a>';

            const key = 'jlq6npehL8CYWBPs1v4S';
            
            L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,{ //style URL
                tileSize: 512,
                zoomOffset: -1,
                attribution: attb,
                crossOrigin: true
            }).addTo(map);

            L.control.maptilerGeocoding({ apiKey: key }).addTo(map);

            /*
            var base = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
            var attb = '<a href="https://github.com/KyKirma/" target="_blank">Pedro Kourly</a>, <a href="https://github.com/gustavomcss" target="_blank">Gustavo Corrêa</a>, &copy; <a target = "_blank" href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. <a href="https://carto.com/attributions" target="_blank">CARTO</a>';
            L.tileLayer(base, {attribution: attb}).addTo(map);

            new GeoSearch.GeoSearchControl({
                provider: new GeoSearch.OpenStreetMapProvider(),
                searchLabel: 'Pesquise um Município',
                autoClose: true,
                showMarker: false,
                style: 'bar'
            }).addTo(map);
            */

            for (i = 0; i < response.qnt; i++) {
                marker = L.circleMarker([response.data['LAT'][i], response.data['LONG'][i]], {
                    color: 'green',
                    radius: 5,
                    stroke: false
                });

                marker.bindPopup('<b>' + response.data['MUNICIPIO'][i] + '</b><br>' + 'Área: ' + response.data['AREA_HA'][i] + "Km").addTo(map);
            }
            
        })

        .catch(function (error) {
            console.error("Error fetching data:", error);
        });
});