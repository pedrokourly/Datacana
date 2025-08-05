// Import Style Page Module
import './Data.css';

// Import Images
import Logo from '/assets/images/DataCana.svg';

// Import React Libs
import { useState, useEffect, useCallback } from 'react';

// Import React Router DOM
import { NavLink } from 'react-router-dom';

// Import DataTable
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net-dt';
import Papa from 'papaparse';

// Import DataGraphs
import GraphBar from '../../../components/GraphBar/GraphBar.jsx';

const Data = () => {
    // State Management
    const [availableYears] = useState([2017, 2022]);
    const [selectedYear, setSelectedYear] = useState(2022);
    const [isLoading, setIsLoading] = useState(true);

    // DataGraph Management
    const [dataGraph, setDataGraph] = useState(null);
    const [dataGraphMeso, setDataGraphMeso] = useState(null);
    const [dataGraphMicro, setDataGraphMicro] = useState(null);

    // DataTables Configuration
    const getDataTableConfig = useCallback(() => ({
        responsive: true,
        destroy: true,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
        order: [[0, 'asc']],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json',
            search: '',
            searchPlaceholder: 'Pesquisar...',
            lengthMenu: 'Exibir _MENU_ Registros',
            info: 'Exibindo _START_ a _END_ de _TOTAL_ Registros',
            zeroRecords: 'Nenhum Registro Encontrado'
        }
    }), []);

    // DataTables Columns
    const getColumns = useCallback(() => [
        { data: 'MUNICIPIO', title: 'Município', className: 'text-left' },
        { data: 'TOTAL_AREA', title: 'Área (ha)', className: 'text-left',
            render: function (data) {
                const numValue = parseFloat(data);

                return numValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        },
        { data: 'COD_MUNICIPIO', title: 'Código IBGE', className: 'text-center', orderable: false },
        { data: 'MESO', title: 'Mesorregião', className: 'text-left' },
        { data: 'MICRO', title: 'Microrregião', className: 'text-left' }
    ], []);

    // Clean and Process Main Data
    const processDataTable = useCallback((data) => {
        if (!Array.isArray(data) || data.length === 0) {
            return [];
        }

        // Remove Empty Rows
        let cleanedData = data.filter(row =>
            row && typeof row === 'object' &&
            Object.values(row).some(val => val !== null && val !== undefined && val !== '')
        );

        // Validate Required Fields
        cleanedData = cleanedData.filter(row =>
            row.MUNICIPIO && row.MUNICIPIO.toString().trim() !== ''
        );

        return cleanedData;
    }, []);

    // DataGraph (Municipalities)
    const processDataGraph = (data) => {
        if (!data || data.length === 0) {
            setDataGraph(null);
            return;
        }

        // Sort Top 20 by Total Area
        const sortedData = [...data].sort((a, b) => b.TOTAL_AREA - a.TOTAL_AREA);
        const top20 = sortedData.slice(0, 20);

        const chartLabels = top20.map(item => item.MUNICIPIO);
        const chartValues = top20.map(item => item.TOTAL_AREA);

        // Undefined Data Color
        const chartColors = top20.map(item =>
            item.MUNICIPIO === 'Não encontrado' ? '#808080' : '#03A65A'
        );

        setDataGraph({
            labels: chartLabels,
            data: chartValues,
            colors: chartColors
        });
    };

    // DataGraph (Mesoregions)
    const processDataGraphMeso = (data) => {
        if (!data || data.length === 0) {
            setDataGraphMeso(null);
            return;
        }

        const mesoData = data.reduce((acc, curr) => {
            const meso = curr.MESO;
            const area = parseFloat(curr.TOTAL_AREA) || 0;

            if (meso) {
                if (!acc[meso]) {
                    acc[meso] = 0;
                }
                acc[meso] += area;
            }

            return acc;
        }, {});

        // Sort by Mesoregion
        const mesoArray = Object.keys(mesoData).map(meso => ({
            MESO: meso,
            TOTAL_AREA: mesoData[meso]
        }));
        const sortedData = mesoArray.sort((a, b) => b.TOTAL_AREA - a.TOTAL_AREA);

        const chartLabels = sortedData.map(item => item.MESO);
        const chartValues = sortedData.map(item => item.TOTAL_AREA);

        // Undefined Data Color
        const chartColors = sortedData.map(item =>
            item.MESO === 'Não encontrado' ? '#808080' : '#03A65A'
        );

        setDataGraphMeso({
            labels: chartLabels,
            data: chartValues,
            colors: chartColors
        });
    };

    // DataGraph (Microregions)
    const processDataGraphMicro = (data) => {
        if (!data || data.length === 0) {
            setDataGraphMicro(null);
            return;
        }

        const microData = data.reduce((acc, curr) => {
            const micro = curr.MICRO;
            const area = parseFloat(curr.TOTAL_AREA) || 0;

            if (micro) {
                if (!acc[micro]) {
                    acc[micro] = 0;
                }
                acc[micro] += area;
            }

            return acc;
        }, {});

        // Sort by Microregion
        const microArray = Object.keys(microData).map(micro => ({
            MICRO: micro,
            TOTAL_AREA: microData[micro]
        }));
        const sortedData = microArray.sort((a, b) => b.TOTAL_AREA - a.TOTAL_AREA);
        const top20 = sortedData.slice(0, 20);

        const chartLabels = top20.map(item => item.MICRO);
        const chartValues = top20.map(item => item.TOTAL_AREA);

        // Undefined Data Color
        const chartColors = top20.map(item =>
            item.MICRO === 'Não encontrado' ? '#808080' : '#03A65A'
        );

        setDataGraphMicro({
            labels: chartLabels,
            data: chartValues,
            colors: chartColors
        });
    };

    // Fetch DataTable and DataGraph
    const setupData = useCallback(async (year) => {
        setIsLoading(true);
        setDataGraph(null);
        setDataGraphMeso(null);
        setDataGraphMicro(null);

        try {
            if ($.fn.DataTable.isDataTable('#dataCane')) {
                $('#dataCane').DataTable().destroy();
                $('#dataCane').empty();
            }

            const response = await fetch(`/assets/datacana/Data_${year}_Resume.csv`);
            const csvText = await response.text();

            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                transformHeader: (header) => header.trim(),
                complete: (results) => {
                    try {
                        if (results.errors && results.errors.length > 0) {
                            console.warn('Avisos ao processar CSV:', results.errors);
                        }

                        const cleanedData = processDataTable(results.data);

                        // Initialize DataTable
                        $('#dataCane').DataTable({
                            data: cleanedData,
                            columns: getColumns(),
                            ...getDataTableConfig()
                        });

                        // Initialize DataGraph (Municipalities)
                        processDataGraph(cleanedData);

                        // Initialize DataGraph (Mesoregions)
                        processDataGraphMeso(cleanedData);

                        // Initialize DataGraph (Microregions)
                        processDataGraphMicro(cleanedData);

                        setIsLoading(false);
                    } catch (tableError) {
                        console.error('Error in DataTable:', tableError);
                        setIsLoading(false);
                    }
                },
                error: (parseError) => {
                    console.error('Error Parsing CSV:', parseError);
                    setIsLoading(false);
                }
            });

        } catch (fetchError) {
            console.error('Error Loading data:', fetchError);
            setIsLoading(false);
        }

    }, [processDataTable, getColumns, getDataTableConfig]);

    // CleanUp DataTable
    useEffect(() => {
        return () => {
            if ($.fn.DataTable.isDataTable('#dataCane')) {
                $('#dataCane').DataTable().destroy();
            }
        };
    }, []);

    // Load Data on Change
    useEffect(() => {
        setupData(selectedYear);
    }, [selectedYear, setupData]);

    // Handle Year Change
    const handleYearChange = useCallback((year) => {
        if (year !== selectedYear && !isLoading) {
            setSelectedYear(year);
        }
    }, [selectedYear, isLoading]);

    return (
        <div className="Data">
            <div className="navBar">
                <NavLink className="logo" to="/">
                    <img src={Logo} alt="Logo DataCana" />
                </NavLink>
            </div>

            <div className="container">
                <article>
                    <h2>Dados da <span>cana-de-açúcar</span> em Minas Gerais</h2>
                </article>
                <div className="yearSelector">
                    {availableYears.map(year => (
                        <label key={year} className="radioYear-label">
                            <input type="radio" name="year-selector" value={year} checked={selectedYear === year} onChange={() => handleYearChange(year)} disabled={isLoading}/>
                            <span className="radioYear-text">{year}</span>
                        </label>
                    ))}
                </div>

                <div className="dataTable">
                    <article>
                        <h2>Área(ha) ocupada com cana-de-açúcar em Minas Gerais <span style={{ color: 'var(--color01)' }}>({selectedYear})</span></h2>
                    </article>

                    <table id="dataCane" className="display" style={{ width: "100%" }}></table>

                    {isLoading && (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <span>Carregando Dados...</span>
                        </div>
                    )}
                </div>

                <div className="dataGraph">
                    <article>
                        <h2>Área (ha) ocupada com cana-de-açúcar nos Municípios de MG <span style={{ color: 'var(--color01)' }}>({selectedYear})</span></h2>
                    </article>

                    <GraphBar data={dataGraph} year={selectedYear} />

                    {isLoading && (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <span>Carregando Dados...</span>
                        </div>
                    )}
                </div>

                <div className="dataGraph">
                    <article>
                        <h2>Área (ha) ocupada com cana-de-açúcar por Mesorregião de MG <span style={{ color: 'var(--color01)' }}>({selectedYear})</span></h2>
                    </article>

                    <GraphBar data={dataGraphMeso} year={selectedYear} />

                    {isLoading && (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <span>Carregando Dados...</span>
                        </div>
                    )}
                </div>

                <div className="dataGraph">
                    <article>
                        <h2>Área(ha) ocupada com cana-de-açúcar nas Microrregiões de MG <span style={{ color: 'var(--color01)' }}>({selectedYear})</span></h2>
                    </article>

                    <GraphBar data={dataGraphMicro} year={selectedYear} />

                    {isLoading && (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <span>Carregando Dados...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Data;