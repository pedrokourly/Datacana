// Import Style Page Module
import './GraphBar.css';

// Import DataGraphs
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js Components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraphBar = ({ data, year }) => {
    if (!data) {
        return null;
    }

    // Chart configuration
    const graphConfig = {
        data: {
            labels: data.labels,
            datasets: [{
                label: `Área (ha) em ${year}`,
                data: data.data,
                backgroundColor: data.colors,
                borderRadius: 4,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: false }
            },
            scales: {
                x: {
                    ticks: { color: '#000000' },
                    grid: { color: '#00000050' }
                },
                y: {
                    ticks: { color: '#000000', maxRotation: 0 },
                    grid: { color: '#00000050' }
                }
            }
        }
    };

    return (
        <>
            <Bar {...graphConfig} />
        </>
    );
};

export default GraphBar;