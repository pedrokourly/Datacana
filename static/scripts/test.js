$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/wcota/covid19br/master/cases-gps.csv",
        dataType: "text",
        success: function(data) {
            next_step(data);
        }
    });
    function next_step(allText) {
        $.ajax({
            type: "GET",
            url: "https://labs.wcota.me/covid19br/json/last_day_info.json",
            dataType: "text",
            success: function(data) {
                processData(allText, JSON.parse(data));
            }
        });
    }
    function processData(allText, jsondata) {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var casesData = [];
        for (var i = 1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {
                var tarr = {};
                for (var j = 0; j < headers.length; j++) {
                    tarr[headers[j]] = data[j];
                }
                casesData.push(tarr);
            }
        }
        var createMap = function() {
            lang = findGetParameter('lang');
            document.getElementById("loader").style = "display:none!important";
            var map = L.map('map', {
                zoomSnap: 0.2,
                gestureHandling: true,
            });
            map.createPane('labels');
            map.getPane('labels').style.zIndex = 650;
            map.getPane('labels').style.pointerEvents = 'none';
            var gps1 = [-34.25, -74.37];
            var gps2 = [5.61, -33.25];
            map.fitBounds([gps1, gps2]);
            var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '<a href="https://wcota.me/" target="_parent">Wesley Cota (UFV)</a>, &copy; <a target = "_parent" href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a target="_parent" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(map);
            function getBaseLog(x, y) {
                return Math.log(y) / Math.log(x);
            }
            var maxcasos = 0;
            var totalBR = 0;
            var totalObitosBR = 0;
            var totalMunicipiosCasos = 0;
            var totalMunicipiosObitos = 0;
            var totalMunicipios = 5570;
            for (i = 0; i < casesData.length; i++) {
                if (casesData[i]['type'] == '0' || casesData[i]['type'] == '1') {
                    maxcasos = Math.max(maxcasos, casesData[i]['total']);
                    totalBR = totalBR + parseInt(casesData[i]['total']);
                    if (casesData[i]['type'] == '1') {
                        totalMunicipiosCasos += 1;
                    }
                } else {
                    totalObitosBR = totalObitosBR + parseInt(casesData[i]['total']);
                    if (casesData[i]['type'] == 'D1') {
                        totalMunicipiosObitos += 1;
                    }
                }
            }
            perMunicipiosCasos = totalMunicipiosCasos / totalMunicipios * 100.0
            perMunicipiosObitos = totalMunicipiosObitos / totalMunicipios * 100.0
            perMunicipiosCasos = perMunicipiosCasos
            perMunicipiosObitos = perMunicipiosObitos
            var info = L.control();
            info.onAdd = function(map) {
                this._div = L.DomUtil.create('div', 'info');
                this.update();
                return this._div;
            }
            ;
            info.update = function(props) {
                if (props) {
                    total = props.total;
                    cidade = props.name;
                    mtitle = props.mtitle;
                    this._div.innerHTML = '<h4>Número de ' + mtitle + ':</h4>' + '<b>' + cidade + '</b><br />' + parseInt(total).toLocaleString('pt-BR');
                    if (lang == 'en')
                        this._div.innerHTML = this._div.innerHTML = '<h4>Number of ' + mtitle + ':</h4>' + '<b>' + cidade + '</b><br />' + parseInt(total).toLocaleString('en-US');
                } else {
                    this._div.innerHTML = '<h4>Total no Brasil:</h4><b>' + totalBR.toLocaleString('pt-BR') + '</b><br /><br /><h4>Óbitos:</h4><b>' + totalObitosBR.toLocaleString('pt-BR') + '</b> <br /><br /><h4>Municípios:</h4><b>' + totalMunicipiosCasos.toLocaleString('pt-BR') + ' </b>(' + perMunicipiosCasos.toLocaleString('pt-BR', {
                        maximumFractionDigits: 2
                    }) + '%)<br /><br /><h4>- com óbitos:</h4><b>' + totalMunicipiosObitos.toLocaleString('pt-BR') + ' </b>(' + perMunicipiosObitos.toLocaleString('pt-BR', {
                        maximumFractionDigits: 2
                    }) + '%)<br /><br /><h4>Doses aplicadas:</h4><b>' + (jsondata['vaccinated'] + jsondata['vaccinated_second'] + jsondata['vaccinated_single']).toLocaleString('pt-BR') + '</b>';
                    if (lang == 'en')
                        this._div.innerHTML = '<h4>Total in Brazil:</h4><b>' + totalBR.toLocaleString('en-US') + '</b><br /><br /><h4>Deaths:</h4><b>' + totalObitosBR.toLocaleString('en-US') + '</b> <br /><br /><h4>Municipalities:</h4><b>' + totalMunicipiosCasos.toLocaleString('en-US') + ' </b>(' + perMunicipiosCasos.toLocaleString('en-US', {
                            maximumFractionDigits: 2
                        }) + '%)<br /><br /><h4>- with deaths:</h4><b>' + totalMunicipiosObitos.toLocaleString('en-US') + ' </b>(' + perMunicipiosObitos.toLocaleString('en-US', {
                            maximumFractionDigits: 2
                        }) + '%)<br /><br /><h4>Doses administered:</h4><b>' + (jsondata['vaccinated'] + jsondata['vaccinated_second'] + jsondata['vaccinated_single'] + jsondata['vaccinated_third']).toLocaleString('en-US') + '</b>';
                }
            }
            ;
            info.addTo(map);
            function highlightFeature(e) {
                info.update(e.sourceTarget.options);
            }
            function resetHighlight(e) {
                info.update();
            }
            var raioMin = 10;
            var raioMax = 18;
            function getRadius(total, tipo) {
                var ntotal = total;
                if (tipo == 'cases') {
                    var fator = 1.4
                } else {
                    var fator = 0.7
                }
                return fator * ((ntotal - 1) / (maxcasos - 1) * (raioMax - raioMin) + 1);
            }
            function getOpacity(tipo) {
                if (tipo == 'cases') {
                    return 0.9;
                } else {
                    return 0.5;
                }
            }
            function getColor(tipo) {
                if (tipo == '0') {
                    return 'orange';
                } else if (tipo == '1') {
                    return 'red';
                } else if (tipo == 'D0') {
                    return 'grey';
                } else if (tipo == 'D1') {
                    return 'black';
                }
            }
            markers = [];
            var tipo;
            var title = {
                'cases': 'Casos',
                'deaths': 'Óbitos'
            };
            var mtitle = {
                'cases': 'casos',
                'deaths': 'óbitos'
            };
            if (lang == 'en') {
                var title = {
                    'cases': 'Cases',
                    'deaths': 'Deaths'
                };
                var mtitle = {
                    'cases': 'cases',
                    'deaths': 'deaths'
                };
            }
            for (i = 0; i < casesData.length; i++) {
                if (casesData[i]['type'] == '0' || casesData[i]['type'] == '1') {
                    tipo = 'cases'
                } else {
                    tipo = 'deaths'
                }
                ;markers.push(L.circleMarker([casesData[i]['lat'], casesData[i]['lon']], {
                    color: getColor(casesData[i]['type']),
                    fillOpacity: 0.6,
                    opacity: getOpacity(tipo),
                    radius: getRadius(casesData[i]['total'], tipo),
                    tipo: tipo,
                    stroke: false,
                    name: casesData[i]['name'],
                    total: casesData[i]['total'],
                    mtitle: mtitle[tipo]
                }).bindPopup('<b>' + casesData[i]['name'] + '</b><br />' + title[tipo] + ': ' + casesData[i]['total']))
            }
            var pontos = L.featureGroup(markers).on({
                mouseover: highlightFeature,
                mouseout: resetHighlight
            }).addTo(map);
            var legend = L.control({
                position: 'bottomleft'
            });
            function buildLegend(map) {
                var div = L.DomUtil.create('div', 'info author');
                div.innerHTML = '<h4>Dados e mapa:</h4> <b><a href="https://covid19br.wcota.me/" rel="author" target="_parent">Wesley Cota (UFV)</a></b><br /><a style="font-size: 8pt;" href="https://doi.org/10.1590/SciELOPreprints.362" target="_parent">10.1590/SciELOPreprints.362</a>';
                if (lang == 'en')
                    div.innerHTML = '<h4>Data and map:</h4> <b><a href="https://covid19br.wcota.me/en" rel="author" target="_parent">Wesley Cota (UFV-BR)</a></b><br /><a style="font-size: 8pt;" href="https://doi.org/10.1590/SciELOPreprints.362" target="_parent">10.1590/SciELOPreprints.362</a>';
                return div;
            }
            legend.onAdd = buildLegend;
            map.addControl(legend);
            map.addControl(new L.Control.Fullscreen({
                position: 'bottomleft'
            }));
            var initialZoom = map.getZoom();
            map.on('zoomend', function() {
                var currentZoom = map.getZoom();
                markers.forEach(item=>{
                    item.setRadius(((currentZoom / initialZoom) ** 1.6) * getRadius(item.options.total, item.options.tipo));
                }
                );
            });
            var searchControl = new L.Control.Search({
                layer: pontos,
                propertyName: 'name',
                marker: false,
                position: 'topleft',
                moveToLocation: function(latlng, title, map) {
                    map.setView(latlng, 12);
                }
            });
            map.addControl(searchControl);
        };
        createMap();
    }
});