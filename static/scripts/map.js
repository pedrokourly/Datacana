
// Função get dados
async function getDados() {
    try {
      const response = await fetch('/mapData');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

$(document).ready(function() {
  getDados()
      .then(function(response) {
          console.log(response);

          var map = L.map('map', {
              zoomSnap: 0.2,
              gestureHandling: true
          });
          map.setView([ -19.8157, -43.9542], 6)
          var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
              attribution: '<a href="https://github.com/KyKirma/" target="_parent">Pedro Kourly</a>, <a href="https://github.com/gustavomcss" target="_parent">Gustavo Corrêa</a>, &copy; <a target = "_parent" href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a target="_parent" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: 'abcd',
              maxZoom: 19
          }).addTo(map); 
          
          for (i = 0; i < response.qnt; i++) {
            L.circleMarker([response.data['LAT'][i], response.data['LONG'][i]], {
                color: 'red',
                radius: 5,
                stroke: false,
            }).bindPopup('<b>' + response.data['MUNICIPIO'][i] + '</b>').addTo(map);
          }
        })
        .catch(function(error) {
            console.error("Error fetching data:", error);
        });
});