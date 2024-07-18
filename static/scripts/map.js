
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
                attribution: attb,
                tileSize: 512,
                zoomOffset: -1,
                crossOrigin: true
            }).addTo(map);

            L.control.maptilerGeocoding({ apiKey: key }).addTo(map);

            for (i = 0; i < response.qnt; i++) {
                marker = L.circleMarker([response.data['LAT'][i], response.data['LONG'][i]], {
                    color: 'green',
                    radius: 5,
                });

                marker.bindPopup(
                    '<b>' + response.data['MUNICIPIO'][i] + '</b><br>' + 'Área: ' + response.data['AREA_HA'][i] + "Km"
                ).addTo(map);
            }
            
        })

        .catch(function (error) {
            console.error("Error fetching data:", error);
        });
});