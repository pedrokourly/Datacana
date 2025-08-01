// Import Style Component
import './MapInfoPanel.css';

const MapInfoPanel = ({ title, area, isLoading }) => {
    const areaDisplay = (area !== null && area !== undefined) ? `${parseFloat(area).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha` : 'Não Consta Dados';

    return (
        <div className="MapInfoPanel">
            {isLoading ? (
                <div className="loadingContent">
                    <div className="loadingSpinner"></div>
                    <span>Carregando...</span>
                </div>
            ) : (
                <>
                    <h2 className="infoTitle">{title}</h2>
                    <p className="infoArea">{areaDisplay}</p>
                </>
            )}
        </div>
    );
};

export default MapInfoPanel;