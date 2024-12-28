// Adicione esta função para carregar os dados do backend
async function loadCSVData() {
    try {
        const response = await fetch('/data/resume/2022');
        const data = await response.json(); // Supondo que o backend retorna um JSON
        
        const dadosCana = data.dadosCana;
        const municipios = [];
        const regioes = {};

        if (data && data.dadosCana && data.dadosCana.MUNICIPIO && data.dadosCana.TOTAL_AREA && data.dadosCana.MESO) {
            const municipiosData = data.dadosCana.MUNICIPIO;
            const areasData = data.dadosCana.TOTAL_AREA;
            const regioesData = data.dadosCana.MESO;
    
            for (const key in municipiosData) {
            if (municipiosData.hasOwnProperty(key) && areasData.hasOwnProperty(key) && regioesData.hasOwnProperty(key)) {
                municipios.push({ municipio: municipiosData[key], area: parseFloat(areasData[key]) });
    
                const regiao = regioesData[key];
                if (!regioes[regiao]) {
                regioes[regiao] = 0;
                }
                regioes[regiao] += parseFloat(areasData[key]);
            }
            }
    
            // Ordenar os dados em ordem crescente com base na área
            municipios.sort((a, b) => a.area - b.area);
    
            // Separar os dados ordenados em arrays de municipios e areas
            const sortedMunicipios = municipios.map(item => item.municipio);
            const sortedAreas = municipios.map(item => item.area);
    
            return { dadosCana: dadosCana, municipios: sortedMunicipios, areas: sortedAreas, regioes };
        } else {
            console.error('Formato de dados inesperado:', data);
        }
    
        return { municipios: [], areas: [], regioes: {} };
        } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        return { municipios: [], areas: [], regioes: {} };
        }
}


async function createChart_AreaMunicipio() {
    const { municipios, areas } = await loadCSVData();
  
    const ctx = document.getElementById('AreaMunicipio');
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: municipios,
        datasets: [{
          label: 'Área de Cana (ha)',
          data: areas,
          backgroundColor: '#0ABF6A',
          borderWidth: 1,
          hoverOffset: 4
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true
      }
    });
}

async function createChart_AreaRegiao() {
    const { regioes } = await loadCSVData();
    const ctxPie = document.getElementById('AreaRegiao');
    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
        labels: Object.keys(regioes),
        datasets: [{
            label: 'Área por Região (ha)',
            data: Object.values(regioes),
            borderWidth: 1
        }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
                position: 'right',
                maxHeight: 100, // Ajuste a altura máxima da legenda
                labels: {
                  boxWidth: 10, 
                  padding: 10 
                }
            }
          }
        }
    });
}

async function createChart_AreaMicroRegiao() {
  const { dadosCana } = await loadCSVData();
  const ctx = document.getElementById('AreaMicroRegiao').getContext('2d');
  const microRegioes = {};
  
  if (dadosCana && dadosCana.TOTAL_AREA && dadosCana.MICRO) {
      const areasData = dadosCana.TOTAL_AREA;
      const microData = dadosCana.MICRO;

      for (const key in areasData) {
          if (areasData.hasOwnProperty(key) && microData.hasOwnProperty(key)) {
              const micro = microData[key];
              if (!microRegioes[micro]) {
                  microRegioes[micro] = 0;
              }
              microRegioes[micro] += parseFloat(areasData[key]);
          }
      }

      const sortedEntries = Object.entries(microRegioes).sort((a, b) => b[1] - a[1]);
      const labels = sortedEntries.map(entry => entry[0]);
      const dataValues = sortedEntries.map(entry => entry[1]);

      new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Área por Microregião',
                data: dataValues,
                borderWidth: 1,
                backgroundColor: '#0ABF6A'
            }]
        },
        options: {
          indexAxis: 'y', // Configuração para barras horizontais
          responsive: true,
          plugins: {
              legend: {
                display: false
              }
          },
      }
    });
  } else {
      console.error('Formato de dados inesperado:', dadosCana);
  }
}

async function iniciarDataTable() {
    const { dadosCana } = await loadCSVData();

    // Converte os dados para um array de objetos
    const dataArray = Object.keys(dadosCana.MUNICIPIO).map(index => ({
        MUNICIPIO: dadosCana.MUNICIPIO[index],
        TOTAL_AREA: dadosCana.TOTAL_AREA[index],
        COD_MUNICIPIO: dadosCana.COD_MUNICIPIO[index],
        MESO: dadosCana.MESO[index],
        MICRO: dadosCana.MICRO[index],
    }));

    $('#dadosCanaTable').DataTable({
        data: dataArray,
        columns: [
          { data: 'MUNICIPIO' },
          { data: 'TOTAL_AREA' },
          { data: 'COD_MUNICIPIO' },
          { data: 'MESO' },
          { data: 'MICRO' },
        ],
        responsive: true,
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json"
        }
    });
}

// Chame a função para criar o gráfico
createChart_AreaMunicipio();
createChart_AreaRegiao();
createChart_AreaMicroRegiao();
iniciarDataTable();