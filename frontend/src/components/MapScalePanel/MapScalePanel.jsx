// Import Style Component
import './MapScalePanel.css';

// Import React Libs
import { useState, useEffect } from 'react';

const MapScale = ({ map }) => {
    // State Management
    const [scaleText, setScaleText] = useState('');
    const [scaleWidth, setScaleWidth] = useState(0);

    useEffect(() => {
        if (!map) return;

        // Round the Scale Value
        const getRoundNum = (num) => {
            const pow10 = Math.pow(10, (Math.floor(num) + '').length - 1);
            let d = num / pow10;
            
            d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 2 ? 2 : 1;

            return pow10 * d;
        };

        // Calculate the Scale
        const updateScale = () => {
            const y = map.getSize().y / 2;
            const center = map.containerPointToLatLng([map.getSize().x / 2, y]);
            const target = map.containerPointToLatLng([map.getSize().x / 2 + 100, y]);
            const distance = center.distanceTo(target);

            const roundDistance = getRoundNum(distance);
            const newScaleWidth = (roundDistance / distance) * 100;
            
            const scaleTextInKm = roundDistance / 1000;

            setScaleWidth(newScaleWidth);
            setScaleText(`${scaleTextInKm} km`);
        };

        // Event Listeners
        map.on('moveend', updateScale);
        map.on('zoomend', updateScale);

        updateScale();

        // Cleanup Listeners
        return () => {
            map.off('moveend', updateScale);
            map.off('zoomend', updateScale);
        };
    }, [map]);

    if (!map) {
        return null;
    }

    return (
        <div className="MapScale">
            <div className="scaleLine" style={{ width: `${scaleWidth}px` }}></div>
            <span className="scaleText">{scaleText}</span>
        </div>
    );
};

export default MapScale;