// Import Style Component
import './MapControlPanel.css';

const MapControlPanel = (props) => {
    const {
        availableYears,
        currentYear,
        onYearChange,
        layers,
        activeOverlays,
        onLayerChange,
        isLoading
    } = props;

    return (
        <>
            <div className="MapControlPanel">
                <div className="panelSection">
                    <h2 className="sectionTitle">Linha do Tempo</h2>
                    <div className="timelineOptions">
                        {availableYears.map(year => (
                            <label key={year} className="radioYear-label">
                                <input type="radio" name="year-selector" value={year} checked={currentYear === year} onChange={() => onYearChange(year)} disabled={isLoading}/>
                                <span className="radioYear-text">{year}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="panelSection">
                    <h2 className="sectionTitle">Camadas de Visualização</h2>
                    <div className="layerOptions">
                        {Object.entries(layers).map(([layerName]) => (
                            <label key={layerName} className={`checkboxLayerLabel ${isLoading ? 'disabled' : ''}`}>
                                <input type="checkbox" checked={activeOverlays.includes(layerName)} onChange={() => onLayerChange(layerName)} disabled={isLoading}/>
                                <span className="checkmark"></span>
                                <span className="layerName">{layerName}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="panelInfo">
                    {isLoading ? (
                        <div className="loadingContent">
                            <div className="loadingSpinner"></div>
                            <span>Carregando...</span>
                        </div>
                    ) : (
                        <span>Selecione o Ano e Camada</span>
                    )}
                </div>
            </div>
        </>
    );
};

export default MapControlPanel;