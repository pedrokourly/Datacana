// Função GET Dados
async function getDados() {
    try {
        const response = await fetch('/data/resume/2022');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

async function startOdometer(totalAreaCana){
    try {
        window.odometerOptions = {
            auto: false,
            format: '(,ddd).dddddd'
        };

        // Seleção do Odometer
        var el = document.getElementById('odometer');
        od = new Odometer({
            el: el
        });

        // Observer
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && entries[0].intersectionRatio === 1) {
                od.update(totalAreaCana); // totalAreaHa
            }
        }, {
            threshold: 1,
        });

        observer.observe(el)
    } catch (error) {
        console.error('Erro ao iniciar o odômetro:', error);
    }
}

$(document).ready(async function () {
    try {
        const response = await getDados();

        // Mapa
        var map = L.map('map', {
            zoomControl: false,
        });

        // Estilo Mapa
        var estilos = {
            uf: {
                color: '#818181',
                fillColor: '#9FD97C',
                fillOpacity: 1,
                weight: 1,
            }
        }

        function getRadius(proporcao) {
            const scale = 0.002;
            const radius = (Math.sqrt(proporcao) * scale) / 2;
            return Math.max(radius, 2);
        }

        jQuery.getJSON("https://servicodados.ibge.gov.br/api/v2/malhas/31?formato=application/vnd.geo+json", function(JSON) {
            var layer = new L.geoJSON(JSON, estilos.uf);   
            var ufExtent = layer.getBounds();

            map.fitBounds(ufExtent, { animate: false });
            layer.addTo(map);

            for (let i = 0; i < response.qnt; i++) {
                const areaHa = response.dadosCana['TOTAL_AREA'][i];
                const radius = getRadius(areaHa);
                const coordenadas = L.latLng(response.dadosCana['LAT'][i], response.dadosCana['LONG'][i])

                let marker = L.circleMarker(coordenadas, {
                    color: 'darkgreen',
                    radius: radius,
                    stroke: true,
                    weight: 0.8,
                    opacity: 1,
                });
                marker.addTo(layer);

            }
        });                   
        
        // Desativação do Mapa
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();

        function ajustarZoom() {
            var larguraTela = window.innerWidth;
        
            if (larguraTela >= 1200) {
                map.setZoom(6); // Zoom para telas grandes
            } else if (larguraTela >= 768) {
                map.setZoom(5); // Zoom para telas médias
            } else {
                map.setZoom(5); // Zoom para telas pequenas
            }
        }
        
        // Chama a função ao carregar a página
        ajustarZoom();
        
        // Adiciona um listener para redimensionamento da janela
        window.addEventListener('resize', function(){
            map.invalidateSize();
            ajustarZoom();
        });

        startOdometer(response.totalArea);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});