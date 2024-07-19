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

            function getRadius(areaHa) {
                // Define a escala de raio
                const scale = 0.15;

                // Calcula o raio com base na área em hectares
                const radius = (Math.sqrt(areaHa) * scale) / 2;

                // Retorna o raio com um valor mínimo de 2 pixels
                return Math.max(radius, 2);
            }

            for (let i = 0; i < response.qnt; i++) {
                const areaHa = response.data['AREA_HA'][i];
                const radius = getRadius(areaHa);

                let marker = L.circleMarker([response.data['LAT'][i], response.data['LONG'][i]], {
                    color: 'darkgreen',
                    radius: radius,
                    stroke: true,
                    weight: 0.8,
                    opacity: 1
                });

                var popup = L.responsivePopup().setContent(
                    '<b>' + response.data['MUNICIPIO'][i] + '</b><br>' + 'Área: ' + response.data['AREA_HA'][i] + "Km"
                );
                marker.addTo(map).bindPopup(popup);
            }
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });
});