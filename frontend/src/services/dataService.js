class DataProcessor {
    constructor() {
        this.csvCache = new Map();
        this.geoJsonCache = new Map();
    }

    async getData(year) {
        try {
            // Carrega os dados necessários
            const [detailedData, resumeData, geoJsonData] = await Promise.all([
                this.loadCSV(`/assets/datacana/Data_${year}.csv`),
                this.loadCSV(`/assets/datacana/Data_${year}_Resume.csv`),
                this.loadGeoJSON(`/assets/datacana/Cana_${year}.geojson`)
            ]);

            // Processa os dados
            const areaValues = detailedData.map(row => parseFloat(row.AREA)).filter(val => !isNaN(val));
            const escala = this.calculateDescribeStats(areaValues);
            const qnt = detailedData.length;
            const totalArea = areaValues.reduce((sum, val) => sum + val, 0);
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

    async loadCSV(filePath) {
        if (this.csvCache.has(filePath)) {
            return this.csvCache.get(filePath);
        }

        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Erro ao carregar CSV: ${response.statusText}`);

        const csvText = await response.text();

        const data = this.parseCSV(csvText);
        this.csvCache.set(filePath, data);

        return data;
    }

    async loadGeoJSON(filePath) {
        if (this.geoJsonCache.has(filePath)) {
            return this.geoJsonCache.get(filePath);
        }

        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Erro ao carregar GeoJSON: ${response.statusText}`);

        const geoJsonData = await response.json();
        this.geoJsonCache.set(filePath, geoJsonData);

        return geoJsonData;
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));

        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const obj = {};

            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });

            return obj;
        });
    }

    calculateDescribeStats(values) {
        if (values.length === 0) return { min: 0, '25%': 0, '50%': 0, '75%': 0, max: 0 };

        const sorted = [...values].sort((a, b) => a - b);

        const getPercentile = (p) => {
            const index = (p / 100) * (sorted.length - 1);
            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            const weight = index % 1;

            if (upper >= sorted.length) return sorted[sorted.length - 1];

            return sorted[lower] * (1 - weight) + sorted[upper] * weight;
        };

        return {
            count: values.length,
            mean: values.reduce((a, b) => a + b, 0) / values.length,
            min: sorted[0],
                '25%': getPercentile(25),
                '50%': getPercentile(50),
                '75%': getPercentile(75),
            max: sorted[sorted.length - 1]
        };
    }

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
}

const dataProcessor = new DataProcessor();

export const fetchDataForYear = async (year) => {
    return await dataProcessor.getData(year);
};

export const fetchGeoJsonFiles = async () => {
    const [geoJsonMGMunicipios, geoJsonMG] = await Promise.all([
        fetch('/assets/external/IBGE_MG_MUN.json').then(res => res.json()),
        fetch('/assets/external/IBGE_MG_EST.json').then(res => res.json())
    ]);

    return { geoJsonMGMunicipios, geoJsonMG };
};