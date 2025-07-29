/**
 * Exemplo de uso do dataProcessor.js
 * Demonstra como usar o script que replica o endpoint /data/<int:year>
 */

// Exemplo 1: Uso básico com async/await
async function exemploUsoBasico() {
    try {
        console.log('Carregando dados de 2022...');
        const dados = await fetchDataForYear(2022);
        
        console.log('✅ Dados carregados com sucesso!');
        console.log('📊 Quantidade de registros:', dados.qnt);
        console.log('📏 Área total:', dados.totalArea.toFixed(2));
        console.log('📈 Estatísticas da área:', dados.escala);
        
        return dados;
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
    }
}

// Exemplo 2: Uso com múltiplos anos
async function compararAnos(anos) {
    const processor = new DataProcessor();
    const resultados = {};
    
    for (const ano of anos) {
        try {
            console.log(`Processando ano ${ano}...`);
            const dados = await processor.getData(ano);
            resultados[ano] = {
                quantidade: dados.qnt,
                areaTotal: dados.totalArea,
                areaMédia: dados.escala.mean
            };
        } catch (error) {
            console.error(`Erro ao processar ano ${ano}:`, error);
            resultados[ano] = null;
        }
    }
    
    return resultados;
}

// Exemplo 3: Integração com interface de usuário
function integrarComInterface() {
    // Supondo que existe um select para escolher o ano
    const selectAno = document.getElementById('selectAno');
    const btnCarregar = document.getElementById('btnCarregar');
    const divResultados = document.getElementById('resultados');
    
    if (btnCarregar) {
        btnCarregar.addEventListener('click', async () => {
            const ano = parseInt(selectAno.value);
            
            // Mostra loading
            divResultados.innerHTML = '<p>⏳ Carregando dados...</p>';
            
            try {
                const dados = await fetchDataForYear(ano);
                
                // Exibe os resultados
                divResultados.innerHTML = `
                    <h3>Dados de ${ano}</h3>
                    <p><strong>Quantidade de registros:</strong> ${dados.qnt.toLocaleString()}</p>
                    <p><strong>Área total:</strong> ${dados.totalArea.toLocaleString()} ha</p>
                    <p><strong>Área média:</strong> ${dados.escala.mean.toFixed(2)} ha</p>
                    <p><strong>Área máxima:</strong> ${dados.escala.max.toFixed(2)} ha</p>
                    <p><strong>Área mínima:</strong> ${dados.escala.min.toFixed(2)} ha</p>
                `;
                
                // Aqui você pode usar os dados para atualizar mapas, gráficos, etc.
                if (typeof atualizarMapa === 'function') {
                    atualizarMapa(dados.geoJsonCana);
                }
                
                if (typeof criarGraficos === 'function') {
                    criarGraficos(dados.dadosCana);
                }
                
            } catch (error) {
                divResultados.innerHTML = `<p style="color: red;">❌ Erro ao carregar dados: ${error.message}</p>`;
            }
        });
    }
}

// Exemplo 4: Função para atualizar mapa (exemplo com Leaflet)
function atualizarMapa(geoJsonData) {
    // Supondo que existe um mapa Leaflet já inicializado
    if (typeof map !== 'undefined' && map) {
        // Remove camadas anteriores
        map.eachLayer(layer => {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });
        
        // Adiciona nova camada GeoJSON
        L.geoJSON(geoJsonData, {
            style: feature => ({
                fillColor: getColor(feature.properties.AREA),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            }),
            onEachFeature: (feature, layer) => {
                layer.bindPopup(`
                    <strong>Município:</strong> ${feature.properties.MUNICIPIO}<br>
                    <strong>Área:</strong> ${feature.properties.AREA.toFixed(2)} ha<br>
                    <strong>Mesorregião:</strong> ${feature.properties.MESO}
                `);
            }
        }).addTo(map);
    }
}

// Função auxiliar para colorir por área
function getColor(area) {
    return area > 1000 ? '#800026' :
           area > 500  ? '#BD0026' :
           area > 200  ? '#E31A1C' :
           area > 100  ? '#FC4E2A' :
           area > 50   ? '#FD8D3C' :
           area > 20   ? '#FEB24C' :
           area > 10   ? '#FED976' :
                        '#FFEDA0';
}

// Exemplo 5: Processamento de dados para gráficos
function processarDadosParaGraficos(dadosCana) {
    // Converte dados para formato adequado para Chart.js ou similar
    const municipios = Object.values(dadosCana.MUNICIPIO || {});
    const areas = Object.values(dadosCana.TOTAL_AREA || {}).map(Number);
    
    // Top 10 municípios por área
    const dadosOrdenados = municipios.map((municipio, index) => ({
        municipio,
        area: areas[index] || 0
    })).sort((a, b) => b.area - a.area).slice(0, 10);
    
    return {
        labels: dadosOrdenados.map(item => item.municipio),
        data: dadosOrdenados.map(item => item.area)
    };
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DataProcessor carregado e pronto para uso!');
    
    // Integra com a interface se os elementos existirem
    integrarComInterface();
    
    // Exemplo de uso imediato (descomente se necessário)
    // exemploUsoBasico();
});

// Exemplo de como usar com promises
function exemploComPromises() {
    fetchDataForYear(2022)
        .then(dados => {
            console.log('Dados recebidos:', dados);
            // Processar dados aqui
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Exporta funções para uso global
window.DataCanaProcessor = {
    fetchDataForYear,
    DataProcessor,
    compararAnos,
    processarDadosParaGraficos,
    atualizarMapa
};
