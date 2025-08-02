// Import Style Component
import './MapLegend.css';

const MapLegend = ({ scale, colors, noDataColor, isLoading }) => {
    // Formats Number
    const formatNumber = (num) => {
        return Math.round(parseFloat(num)).toLocaleString('pt-BR');
    };

    // Loading State
    if (isLoading || !scale) {
        return (
            <div className="MapLegend">
                <div className="loadingContent">
                    <div className="loadingSpinner"></div>
                    <span>Carregando...</span>
                </div>
            </div>
        );
    }

    // Format Breaks in Legend
    const formattedBreaks = {
        break1: formatNumber(scale.break1 || 0),
        break2: formatNumber(scale.break2 || 0),
        break3: formatNumber(scale.break3 || 0),
        break4: formatNumber(scale.break4 || 0),
    };

    // Calculate max length for padding
    const allNumbers = Object.values(formattedBreaks);
    const maxLength = Math.max(...allNumbers.map(s => s.length));
    const pad = (str) => str.padStart(maxLength, ' ');

    // Items in Legend
    const legendItems = [
        { color: colors[0], label: `> ${pad(formattedBreaks.break4)}` },
        { color: colors[1], label: `${pad(formattedBreaks.break3)} - ${pad(formattedBreaks.break4)}` },
        { color: colors[2], label: `${pad(formattedBreaks.break2)} - ${pad(formattedBreaks.break3)}` },
        { color: colors[3], label: `${pad(formattedBreaks.break1)} - ${pad(formattedBreaks.break2)}` },
        { color: colors[4], label: `< ${pad(formattedBreaks.break1)}` },
        { color: noDataColor, label: 'Não Consta Dados' }
    ];

    return (
        <>
            <div className="MapLegend">
                <h2 className="legendTitle">Legenda (ha)</h2>
                <div className="legendItems">
                    {legendItems.map((item, index) => (
                        <div key={index} className="legendItem">
                            <span className="legendColor" style={{ backgroundColor: item.color }}></span>
                            <span className="legendLabel">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MapLegend;