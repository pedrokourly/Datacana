/**
 * Sistema usando arquivos GeoJSON locais
 * 
 * VANTAGENS:
 * - ✅ Evita erro 429 (Too Many Requests) de APIs externas
 * - ✅ Carregamento mais rápido (arquivos locais)
 * - ✅ Maior confiabilidade (não depende de APIs externas)
 * - ✅ Controle total sobre os dados
 * - ✅ Funciona offline depois do primeiro carregamento
 * 
 * ARQUIVOS:
 * - /cache/utils/geojs-31-mun.json: Dados dos municípios de Minas Gerais
 * - /cache/utils/br_mg.json: Dados do estado de Minas Gerais
 */

// Função GET Dados - Usando arquivos locais e dataProcessor
async function getDados(year = 2022) {
    try {
        // Usa o dataProcessor local ao invés de fetch para o endpoint Flask
        console.log(`🔄 Carregando dados do ano ${year} usando dataProcessor local...`);
        const info = await fetchDataForYear(year);
        console.log(`✅ Dados do ano ${year} carregados com dataProcessor:`, info);
        
        // Busca dados GeoJSON locais (sempre usamos os mesmos limites geográficos)
        console.log('📂 Carregando GeoJSON dos municípios de MG...');
        const geoJsonMGMunicipiosResponse = await fetch('/cache/utils/geojs-31-mun.json');
        const geoJsonMGMunicipios = await geoJsonMGMunicipiosResponse.json();
        console.log('✅ GeoJSON municípios carregado');

        console.log('📂 Carregando GeoJSON do estado de MG...');
        const geoJsonMGResponse = await fetch('/cache/utils/br_mg.json');
        const geoJsonMG = await geoJsonMGResponse.json();
        console.log('✅ GeoJSON estado carregado');
        
        return {info, geoJsonMGMunicipios, geoJsonMG, year};
    } catch (error) {
        console.error(`❌ Erro ao buscar dados do ano ${year}:`, error);
        throw error;
    }
}

// Variáveis globais para controle da timeline
let currentYear = 2022;
let map, geoJsonMGMunicipiosProps, geoJsonMG, geoJsonMGE, geoJsonCana;
let info, layerControl, baseLayers;
let availableYears = [2017, 2022]; // Anos disponíveis
let activeLayers = ["Área Ocupada: Estadual"]; // Camadas ativas atualmente

// Função para criar o controle da timeline
function createTimelineControl() {
    // Cria um controle personalizado que não usa as posições padrão do Leaflet
    var TimelineControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function(map) {
            var div = L.DomUtil.create('div', 'timeline-control');
            
            div.innerHTML = `
                <div class="timeline-header">Linha do Tempo - Dados da Cana-de-açúcar</div>
                <div class="timeline-container">
                    <div class="timeline-years">
                        ${availableYears.map(year => 
                            `<div class="timeline-year ${year === currentYear ? 'active' : ''}" 
                                  data-year="${year}">${year}</div>`
                        ).join('')}
                    </div>
                </div>
                <div class="timeline-info">Clique em um ano para visualizar os dados</div>
            `;
            
            // Previne que os cliques no controle afetem o mapa
            L.DomEvent.disableClickPropagation(div);
            L.DomEvent.disableScrollPropagation(div);
            
            // Adiciona eventos de clique nos anos
            div.addEventListener('click', function(e) {
                if (e.target.classList.contains('timeline-year')) {
                    const selectedYear = parseInt(e.target.dataset.year);
                    if (selectedYear !== currentYear) {
                        changeYear(selectedYear);
                    }
                }
            });
            
            return div;
        },

        onRemove: function(map) {
            // Limpeza se necessário
        }
    });
    
    return new TimelineControl();
}

// Função para atualizar as camadas do mapa com novos dados
async function updateMapLayers(response) {
    try {
        // Salva quais camadas estão atualmente ativas
        let currentActiveLayers = [];
        if (baseLayers) {
            Object.keys(baseLayers).forEach(layerName => {
                if (map.hasLayer(baseLayers[layerName])) {
                    currentActiveLayers.push(layerName);
                }
            });
        }
        
        // Remove as camadas antigas se existirem
        if (baseLayers) {
            Object.values(baseLayers).forEach(layer => {
                if (map.hasLayer(layer)) {
                    map.removeLayer(layer);
                }
            });
        }
        
        // Remove controles antigos
        if (layerControl) {
            map.removeControl(layerControl);
        }
        
        // Recria as camadas com os novos dados
        createMapLayers(response);
        
        // Recria o controle de camadas
        layerControl = L.control.layers(null, baseLayers, {position: 'bottomright', collapsed: false}).addTo(map);
        
        // Restaura as camadas que estavam ativas ou adiciona a camada padrão se é o primeiro carregamento
        if (currentActiveLayers.length > 0) {
            activeLayers = currentActiveLayers;
        }
        
        // Adiciona as camadas ativas
        activeLayers.forEach(layerName => {
            if (baseLayers[layerName]) {
                baseLayers[layerName].addTo(map);
            }
        });
        
        // Reaplica os eventos de hierarquia
        setupLayerEvents();
        
        // Atualiza o quadro de informações para mostrar os novos dados
        if (info) {
            info.update();
        }
        
        console.log(`✅ Mapa atualizado com dados do ano ${response.year}`);
        
    } catch (error) {
        console.error('❌ Erro ao atualizar camadas do mapa:', error);
    }
}

// Função para alterar o ano
async function changeYear(year) {
    try {
        // Atualiza visual do controle timeline
        document.querySelectorAll('.timeline-year').forEach(btn => {
            btn.classList.remove('active', 'timeline-loading');
            if (parseInt(btn.dataset.year) === year) {
                btn.classList.add('timeline-loading');
                btn.textContent = 'Carregando...';
            }
        });
        
        console.log(`🔄 Alterando para o ano ${year}...`);
        
        // Busca os novos dados
        const response = await getDados(year);
        
        // Atualiza as camadas do mapa
        await updateMapLayers(response);
        
        // Atualiza o ano atual
        currentYear = year;
        
        // Atualiza visual do controle timeline
        document.querySelectorAll('.timeline-year').forEach(btn => {
            btn.classList.remove('active', 'timeline-loading');
            btn.textContent = btn.dataset.year;
            if (parseInt(btn.dataset.year) === year) {
                btn.classList.add('active');
            }
        });
        
        console.log(`✅ Ano alterado para ${year} com sucesso!`);
        
    } catch (error) {
        console.error(`❌ Erro ao alterar para o ano ${year}:`, error);
        
        // Restaura visual em caso de erro
        document.querySelectorAll('.timeline-year').forEach(btn => {
            btn.classList.remove('timeline-loading');
            btn.textContent = btn.dataset.year;
            if (parseInt(btn.dataset.year) === currentYear) {
                btn.classList.add('active');
            }
        });
        
        alert(`Erro ao carregar dados do ano ${year}. Tente novamente.`);
    }
}

$(document).ready(function () {
    getDados(currentYear)
        .then(function (response) {
            
            // Inicializa o mapa
            initializeMap();
            
            // Cria as camadas do mapa
            createMapLayers(response);
            
            // Adiciona controles do mapa
            setupMapControls(response);
            
            // Cria e adiciona a timeline
            const timelineControl = createTimelineControl();
            timelineControl.addTo(map);
        })
        .catch(function (error) {
            console.error("Error fetching data:", error);
        });
});

// Função para inicializar o mapa
function initializeMap() {
    // Mapa
    map = L.map('map', {
        fullscreenControl: true,
        fullscreenControlOptions: { position: 'topleft' },
        zoomSnap: 0.5,
        zoomDelta: 0.5
    });

    // Esconder o elemento de carregamento após o mapa ser carregado
    map.whenReady(function() {
        $('.box-load').fadeOut('slow', function() {
            $(this).css('display', 'none');
        });
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

    // Escala Customizada
    var CustomScaleControl = L.Control.extend({
        options: {
            position: 'bottomleft',
            maxWidth: 200,
            metric: true,
            imperial: false
        },

        onAdd: function(map) {
            var container = L.DomUtil.create('div', 'custom-scale-control');
            
            this._map = map;
            
            container.innerHTML = `
                <div class="scale-header">
                    <div class="scale-icon">�</div>
                    <span>Escala</span>
                </div>
                <div class="scale-line-container">
                    <div class="scale-line" style="width: 100px;"></div>
                    <div class="scale-text">Carregando...</div>
                </div>
            `;
            
            this._container = container;
            this._scaleLine = container.querySelector('.scale-line');
            this._scaleText = container.querySelector('.scale-text');
            
            map.on('zoomend', this._update, this);
            this._update();
            
            // Previne interação com o mapa
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableScrollPropagation(container);
            
            return container;
        },

        onRemove: function(map) {
            map.off('zoomend', this._update, this);
        },

        _update: function() {
            var map = this._map;
            var maxMeters = this._getMaxMeters(map);
            
            if (maxMeters) {
                this._updateScale(maxMeters);
            }
        },

        _getMaxMeters: function(map) {
            var containerWidth = this.options.maxWidth;
            var latLng = map.getCenter();
            
            // Calcula a distância em metros para a largura máxima do controle
            var pointA = map.containerPointToLatLng([0, 0]);
            var pointB = map.containerPointToLatLng([containerWidth, 0]);
            
            return pointA.distanceTo(pointB);
        },

        _updateScale: function(maxMeters) {
            var scale = this._getRoundedScale(maxMeters);
            var ratio = scale.distance / maxMeters;
            var width = Math.round(this.options.maxWidth * ratio);
            
            this._scaleLine.style.width = width + 'px';
            this._scaleText.textContent = scale.text;
        },

        _getRoundedScale: function(meters) {
            if (meters >= 1000) {
                var km = meters / 1000;
                if (km >= 100) return { distance: Math.round(km / 100) * 100 * 1000, text: Math.round(km / 100) * 100 + ' km' };
                if (km >= 10) return { distance: Math.round(km / 10) * 10 * 1000, text: Math.round(km / 10) * 10 + ' km' };
                if (km >= 1) return { distance: Math.round(km) * 1000, text: Math.round(km) + ' km' };
                return { distance: Math.round(km * 10) * 100, text: (Math.round(km * 10) / 10) + ' km' };
            } else {
                if (meters >= 100) return { distance: Math.round(meters / 100) * 100, text: Math.round(meters / 100) * 100 + ' m' };
                if (meters >= 10) return { distance: Math.round(meters / 10) * 10, text: Math.round(meters / 10) * 10 + ' m' };
                return { distance: Math.round(meters), text: Math.round(meters) + ' m' };
            }
        }
    });

    // Adiciona a escala customizada
    new CustomScaleControl().addTo(map);
}

// Função para criar as camadas do mapa
function createMapLayers(response) {
    // Cálculo Área Total
    let totalArea_ha = response.info.totalArea;

    // Função para formatar números de forma agradável
    function formatNumber(num) {
        if (num === 0) return '0';
        
        // Para números muito pequenos (menos que 1)
        if (num < 1) {
            return num.toFixed(2);
        }
        
        // Para números pequenos (menos que 100)
        if (num < 100) {
            return num.toFixed(1);
        }
        
        // Para números em milhares
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        
        // Para números normais
        return Math.round(num).toString();
    }

    // Colorir os Municípios
    function getColor(d) {
        return  d === 0 || d == null || d === undefined  ? '#9d9d9d' :
                d >= response.info.escala['max']  ? '#0a4a1a' :
                d >= response.info.escala['75%']  ? '#1a7a2a' :
                d >= response.info.escala['50%']  ? '#2a9a3a' :
                d >= response.info.escala['25%']  ? '#4aba5a' :
                d >= response.info.escala['min']  ? '#6ada7a' :
                                                    '#9d9d9d';
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

    // Para as layers
    baseLayers = {
        "Área Ocupada: Cultura": L.layerGroup([tileOffColor, geoJsonCana, geoJsonMG]),
        "Área Ocupada: Municipal": L.layerGroup([geoJsonMGMunicipiosProps]),
        "Área Ocupada: Estadual": L.layerGroup([geoJsonMGE])
    };
}

// Função para configurar os controles do mapa
function setupMapControls(response) {
    // Quadro de Informações 
    info = L.control({ 
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
        // Busca a área total atual dos dados carregados
        let totalArea_ha = geoJsonMGE.getLayers()[0].feature.properties.Area_ha;
        
        if (props) {
            let municipio = props.name;
            if (!municipio){
                municipio = props.NM_MUNICI;
            }

            let Area_ha = parseFloat(props.Area_ha) || 0;

            if(Area_ha == 0){
                this._div.innerHTML = '<h4>Município de ' + titleCase(municipio) + ':</h4>' + 'Área de Cana: <br>' + '<b>' + "Não Consta Dados" + '</b>';
            } else {
                this._div.innerHTML = '<h4>Município de ' + titleCase(municipio) + ':</h4>' + 'Área de Cana: <br>' + '<b>' + Area_ha.toFixed(2).toString().replace(/\./, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ha' + '</b>';
            }
            
        }
        else {
            this._div.innerHTML = '<h4>Minas Gerais</h4>' + 'Área de Cana Total: <br>' + '<b>' + totalArea_ha.toFixed(2).toString().replace(/\./, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ha' + '</b>';
        }
    };

    var Legend = L.control({
        position: 'bottomleft'
    });

    function formatNumber(num) {
        if (num === 0) return '0';
        
        // Para números muito pequenos (menos que 1)
        if (num < 1) {
            return num.toFixed(2);
        }
        
        // Para números pequenos (menos que 100)
        if (num < 100) {
            return num.toFixed(1);
        }
        
        // Para números em milhares
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        
        // Para números normais
        return Math.round(num).toString();
    }

    Legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');

        div.innerHTML = '<div class="legend-color"></div>' +
                        '<div style="display: flex; justify-content: space-between; margin-top: 8px;">' + 
                        '<div style="font-weight: bold;">' + formatNumber(response.info.escala["min"]) + '</div>' +
                        '<div style="font-weight: bold;"> hectares (ha)</div>' +
                        '<div style="font-weight: bold;">' + formatNumber(response.info.escala["max"]) + '</div> </div>';

        return div;
    };

    Legend.addTo(map);
    
    // Colorir os Municípios
    function getColor(d) {
        return  d === 0 || d == null || d === undefined  ? '#9d9d9d' :
                d >= response.info.escala['max']  ? '#0a4a1a' :
                d >= response.info.escala['75%']  ? '#1a7a2a' :
                d >= response.info.escala['50%']  ? '#2a9a3a' :
                d >= response.info.escala['25%']  ? '#4aba5a' :
                d >= response.info.escala['min']  ? '#6ada7a' :
                                                    '#9d9d9d';
    }
    info.addTo(map);

    // Controle de Camadas
    layerControl = L.control.layers(null, baseLayers, {position: 'bottomright', collapsed: false}).addTo(map);

    // Adiciona a camada estadual por padrão
    baseLayers["Área Ocupada: Estadual"].addTo(map);
    
    // Inicializa a lista de camadas ativas
    activeLayers = ["Área Ocupada: Estadual"];

    // Configura eventos das camadas
    setupLayerEvents();
}

// Função para configurar eventos das camadas
function setupLayerEvents() {
    // Função para manter a hierarquia das camadas
    function maintainLayerOrder() {
        baseLayers["Área Ocupada: Estadual"].eachLayer(function(layer) {
            layer.bringToBack();
        });
        baseLayers["Área Ocupada: Municipal"].eachLayer(function(layer) {
            layer.bringToBack();
        });
        baseLayers["Área Ocupada: Cultura"].eachLayer(function(layer) {
            layer.bringToFront();
        });
    }

    // Função para atualizar a lista de camadas ativas
    function updateActiveLayers() {
        activeLayers = [];
        Object.keys(baseLayers).forEach(layerName => {
            if (map.hasLayer(baseLayers[layerName])) {
                activeLayers.push(layerName);
            }
        });
        console.log('Camadas ativas atualizadas:', activeLayers);
    }

    // Eventos para manter a hierarquia e rastrear camadas ativas
    map.on('overlayadd', function(eventLayer) {
        maintainLayerOrder();
        updateActiveLayers();
    });

    map.on('overlayremove', function(eventLayer) {
        maintainLayerOrder();
        updateActiveLayers();
    });

    // Inicializa a ordem das camadas
    maintainLayerOrder();

    // Adiciona eventos para manter a hierarquia ao interagir com as camadas
    baseLayers["Área Ocupada: Municipal"].eachLayer(function(layer) {
        layer.on('mouseover', function() {
            maintainLayerOrder();
        });
        layer.on('mouseout', function() {
            maintainLayerOrder();
        });
    });

    baseLayers["Área Ocupada: Estadual"].eachLayer(function(layer) {
        layer.on('mouseover', function() {
            maintainLayerOrder();
        });
        layer.on('mouseout', function() {
            maintainLayerOrder();
        });
    });

    baseLayers["Área Ocupada: Cultura"].eachLayer(function(layer) {
        layer.on('mouseover', function() {
            maintainLayerOrder();
        });
        layer.on('mouseout', function() {
            maintainLayerOrder();
        });
    });
}