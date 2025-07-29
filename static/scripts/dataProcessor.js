/**
 * Script JavaScript que replica a funcionalidade do endpoint /data/<int:year>
 * Processa dados de cana-de-açúcar de um ano específico
 */

class DataProcessor {
    constructor() {
        this.csvCache = new Map();
        this.geoJsonCache = new Map();
    }

    /**
     * Função principal que replica o endpoint /data/<int:year>
     * @param {number} year - Ano dos dados a serem processados
     * @returns {Promise<Object>} - Objeto com os dados processados
     */
    async getData(year) {
        try {
            // Carrega os dados necessários - usando URLs do servidor Flask
            const [detailedData, resumeData, geoJsonData] = await Promise.all([
                this.loadCSV(`/cache/CSVs/Data_${year}.csv`),
                this.loadCSV(`/cache/CSVs/Data_${year}_Resume.csv`),
                this.loadGeoJSON(`/cache/Cana_${year}.geojson`)
            ]);

            // Processa os dados detalhados para calcular estatísticas
            const areaValues = detailedData.map(row => parseFloat(row.AREA)).filter(val => !isNaN(val));
            const escala = this.calculateDescribeStats(areaValues);
            const qnt = detailedData.length;
            const totalArea = areaValues.reduce((sum, val) => sum + val, 0);

            // Converte dados resumidos para o formato de dicionário (similar ao pandas.to_dict())
            const dadosCana = this.convertToDict(resumeData);

            return {
                geoJsonCana: geoJsonData,
                dadosCana: dadosCana,
                escala: escala,
                qnt: qnt,
                totalArea: totalArea
            };

        } catch (error) {
            console.error(`Erro ao processar dados do ano ${year}:`, error);
            throw error;
        }
    }

    /**
     * Carrega um arquivo CSV e converte para array de objetos
     * @param {string} filePath - Caminho para o arquivo CSV
     * @returns {Promise<Array>} - Array de objetos representando as linhas do CSV
     */
    async loadCSV(filePath) {
        // Verifica cache primeiro
        if (this.csvCache.has(filePath)) {
            return this.csvCache.get(filePath);
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Erro ao carregar CSV: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            const data = this.parseCSV(csvText);
            
            // Armazena no cache
            this.csvCache.set(filePath, data);
            return data;

        } catch (error) {
            console.error(`Erro ao carregar CSV ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Carrega um arquivo GeoJSON
     * @param {string} filePath - Caminho para o arquivo GeoJSON
     * @returns {Promise<Object>} - Objeto GeoJSON
     */
    async loadGeoJSON(filePath) {
        // Verifica cache primeiro
        if (this.geoJsonCache.has(filePath)) {
            return this.geoJsonCache.get(filePath);
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Erro ao carregar GeoJSON: ${response.statusText}`);
            }
            
            const geoJsonData = await response.json();
            
            // Armazena no cache
            this.geoJsonCache.set(filePath, geoJsonData);
            return geoJsonData;

        } catch (error) {
            console.error(`Erro ao carregar GeoJSON ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Parser simples para CSV
     * @param {string} csvText - Conteúdo do arquivo CSV
     * @returns {Array} - Array de objetos
     */
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
        
        return lines.slice(1).map(line => {
            const values = this.parseCSVLine(line);
            const obj = {};
            
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            
            return obj;
        });
    }

    /**
     * Parser para linha individual do CSV (lida com vírgulas dentro de aspas)
     * @param {string} line - Linha do CSV
     * @returns {Array} - Array de valores
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim().replace(/"/g, ''));
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim().replace(/"/g, ''));
        return result;
    }

    /**
     * Calcula estatísticas descritivas (similar ao pandas.describe())
     * @param {Array} values - Array de valores numéricos
     * @returns {Object} - Objeto com estatísticas
     */
    calculateDescribeStats(values) {
        if (values.length === 0) {
            return {
                count: 0,
                mean: 0,
                std: 0,
                min: 0,
                '25%': 0,
                '50%': 0,
                '75%': 0,
                max: 0
            };
        }

        const sorted = [...values].sort((a, b) => a - b);
        const count = values.length;
        const sum = values.reduce((acc, val) => acc + val, 0);
        const mean = sum / count;
        
        // Calcula desvio padrão
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
        const std = Math.sqrt(variance);
        
        // Calcula percentis originais
        const getPercentile = (arr, percentile) => {
            const index = (percentile / 100) * (arr.length - 1);
            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            const weight = index % 1;
            
            if (upper >= arr.length) return arr[arr.length - 1];
            return arr[lower] * (1 - weight) + arr[upper] * weight;
        };

        // Calcula valores originais
        const originalStats = {
            count: count,
            mean: mean,
            std: std,
            min: sorted[0],
            '25%': getPercentile(sorted, 25),
            '50%': getPercentile(sorted, 50),
            '75%': getPercentile(sorted, 75),
            max: sorted[sorted.length - 1]
        };

        // Cria intervalos mais agradáveis para visualização
        const niceIntervals = this.createNiceIntervals(originalStats.min, originalStats.max);

        return {
            ...originalStats,
            // Mantém os valores originais mas adiciona intervalos visuais melhorados
            visualIntervals: niceIntervals,
            // Sobrescreve com valores mais agradáveis para a legenda
            '25%': niceIntervals[1],
            '50%': niceIntervals[2], 
            '75%': niceIntervals[3],
            min: niceIntervals[0],
            max: niceIntervals[4]
        };
    }

    /**
     * Cria intervalos mais agradáveis para visualização
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {Array} - Array com 5 valores para intervalos
     */
    createNiceIntervals(min, max) {
        const range = max - min;
        
        // Se o range é muito pequeno, usa valores decimais
        if (range < 1) {
            const step = range / 4;
            return [
                this.roundToNice(min),
                this.roundToNice(min + step),
                this.roundToNice(min + 2 * step),
                this.roundToNice(min + 3 * step),
                this.roundToNice(max)
            ];
        }
        
        // Para ranges maiores, cria intervalos "redondos"
        const magnitude = Math.pow(10, Math.floor(Math.log10(range)));
        const normalizedRange = range / magnitude;
        
        let niceStep;
        if (normalizedRange <= 1) {
            niceStep = 0.2 * magnitude;
        } else if (normalizedRange <= 2) {
            niceStep = 0.5 * magnitude;
        } else if (normalizedRange <= 5) {
            niceStep = 1 * magnitude;
        } else {
            niceStep = 2 * magnitude;
        }
        
        // Ajusta o mínimo para um valor "redondo"
        const niceMin = Math.floor(min / niceStep) * niceStep;
        
        return [
            Math.max(niceMin, 0), // Não pode ser negativo para área
            niceMin + niceStep,
            niceMin + 2 * niceStep,
            niceMin + 3 * niceStep,
            niceMin + 4 * niceStep
        ];
    }

    /**
     * Arredonda um número para um valor "agradável"
     * @param {number} value - Valor a ser arredondado
     * @returns {number} - Valor arredondado
     */
    roundToNice(value) {
        if (value === 0) return 0;
        
        const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(value))));
        const normalized = value / magnitude;
        
        let niceNormalized;
        if (normalized < 1.5) {
            niceNormalized = 1;
        } else if (normalized < 3) {
            niceNormalized = 2;
        } else if (normalized < 7) {
            niceNormalized = 5;
        } else {
            niceNormalized = 10;
        }
        
        return niceNormalized * magnitude;
    }

    /**
     * Converte array de objetos para formato de dicionário (similar ao pandas.to_dict())
     * @param {Array} data - Array de objetos
     * @returns {Object} - Objeto no formato {column: {index: value}}
     */
    convertToDict(data) {
        if (data.length === 0) return {};
        
        const result = {};
        const headers = Object.keys(data[0]);
        
        headers.forEach(header => {
            result[header] = {};
            data.forEach((row, index) => {
                result[header][index] = row[header];
            });
        });
        
        return result;
    }

    /**
     * Limpa o cache
     */
    clearCache() {
        this.csvCache.clear();
        this.geoJsonCache.clear();
    }
}

// Função utilitária para uso direto (similar ao endpoint)
async function fetchDataForYear(year) {
    const processor = new DataProcessor();
    return await processor.getData(year);
}

// Exemplo de uso:
/*
// Uso básico
fetchDataForYear(2022).then(data => {
    console.log('Dados processados:', data);
}).catch(error => {
    console.error('Erro:', error);
});

// Uso com classe
const processor = new DataProcessor();
processor.getData(2022).then(data => {
    console.log('GeoJSON:', data.geoJsonCana);
    console.log('Dados da cana:', data.dadosCana);
    console.log('Estatísticas:', data.escala);
    console.log('Quantidade:', data.qnt);
    console.log('Área total:', data.totalArea);
});
*/

// Exporta para uso em módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataProcessor, fetchDataForYear };
}
