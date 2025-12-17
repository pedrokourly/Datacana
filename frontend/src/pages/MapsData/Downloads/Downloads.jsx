import './Downloads.css';
import Cover from '../../../components/Cover/Cover';
import { getDownloadUrl } from '../../../services/githubLfsService';

const Downloads = () => {
    const handleDownload = async (filename, displayName) => {
        const url = getDownloadUrl(filename);
        const link = document.createElement('a');
        link.href = url;
        link.download = displayName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="Downloads">
            <Cover pageName="Downloads"/>

            <div className="content">
                <div className="container">
                    <table className="table">
                        <thead className="align-middle">
                            <tr>
                                <th scope="col">Arquivo <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#000000ff" style={{ width: 20, height: 20, paddingBottom: 2 }}><path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z"></path></svg></th>
                                <th scope="col">Tipo</th>
                                <th scope="col">Ano</th>
                            </tr>
                        </thead>
                        <tbody className="align-middle">
                            <tr>
                                <td><button onClick={() => handleDownload('Data_2017.csv', 'DataCana_Tabela_2017.csv')} className="download-link">DC_Table_2017</button></td>
                                <td>Tabela</td>
                                <td>2017</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Data_2017_Resume.csv', 'DataCana_Resume_2017.csv')} className="download-link">DC_Resume_2017</button></td>
                                <td>Tabela</td>
                                <td>2017</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2017_Datacana.rar', 'DataCana_ShapeFile_2017.rar')} className="download-link">DC_ShapeFile_2017</button></td>
                                <td>Compactado</td>
                                <td>2017</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2017.geojson', 'DataCana_GeoJSON_2017.geojson')} className="download-link">DC_GeoJSON_2017</button></td>
                                <td>GeoJSON</td>
                                <td>2017</td>
                            </tr>

                            <tr>
                                <td><button onClick={() => handleDownload('Data_2018.csv', 'DataCana_Tabela_2018.csv')} className="download-link">DC_Table_2018</button></td>
                                <td>Tabela</td>
                                <td>2018</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Data_2018_Resume.csv', 'DataCana_Resume_2018.csv')} className="download-link">DC_Resume_2018</button></td>
                                <td>Tabela</td>
                                <td>2018</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2018_Datacana.rar', 'DataCana_ShapeFile_2018.rar')} className="download-link">DC_ShapeFile_2018</button></td>
                                <td>Compactado</td>
                                <td>2018</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2018.geojson', 'DataCana_GeoJSON_2018.geojson')} className="download-link">DC_GeoJSON_2018</button></td>
                                <td>GeoJSON</td>
                                <td>2018</td>
                            </tr>

                            <tr>
                                <td><button onClick={() => handleDownload('Data_2019.csv', 'DataCana_Tabela_2019.csv')} className="download-link">DC_Table_2019</button></td>
                                <td>Tabela</td>
                                <td>2019</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Data_2019_Resume.csv', 'DataCana_Resume_2019.csv')} className="download-link">DC_Resume_2019</button></td>
                                <td>Tabela</td>
                                <td>2019</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2019_Datacana.rar', 'DataCana_ShapeFile_2019.rar')} className="download-link">DC_ShapeFile_2019</button></td>
                                <td>Compactado</td>
                                <td>2019</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2019.geojson', 'DataCana_GeoJSON_2019.geojson')} className="download-link">DC_GeoJSON_2019</button></td>
                                <td>GeoJSON</td>
                                <td>2019</td>
                            </tr>
                            
                            <tr>
                                <td><button onClick={() => handleDownload('Data_2020.csv', 'DataCana_Tabela_2020.csv')} className="download-link">DC_Table_2020</button></td>
                                <td>Tabela</td>
                                <td>2020</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Data_2020_Resume.csv', 'DataCana_Resume_2020.csv')} className="download-link">DC_Resume_2020</button></td>
                                <td>Tabela</td>
                                <td>2020</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2020_Datacana.rar', 'DataCana_ShapeFile_2020.rar')} className="download-link">DC_ShapeFile_2020</button></td>
                                <td>Compactado</td>
                                <td>2020</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2020.geojson', 'DataCana_GeoJSON_2020.geojson')} className="download-link">DC_GeoJSON_2020</button></td>
                                <td>GeoJSON</td>
                                <td>2020</td>
                            </tr>

                            <tr>
                                <td><button onClick={() => handleDownload('Data_2021.csv', 'DataCana_Tabela_2021.csv')} className="download-link">DC_Table_2021</button></td>
                                <td>Tabela</td>
                                <td>2021</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Data_2021_Resume.csv', 'DataCana_Resume_2021.csv')} className="download-link">DC_Resume_2021</button></td>
                                <td>Tabela</td>
                                <td>2021</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2021_Datacana.rar', 'DataCana_ShapeFile_2021.rar')} className="download-link">DC_ShapeFile_2021</button></td>
                                <td>Compactado</td>
                                <td>2021</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2021.geojson', 'DataCana_GeoJSON_2021.geojson')} className="download-link">DC_GeoJSON_2021</button></td>
                                <td>GeoJSON</td>
                                <td>2021</td>
                            </tr>

                            <tr>
                                <td><button onClick={() => handleDownload('Data_2022.csv', 'DataCana_Tabela_2022.csv')} className="download-link">DC_Table_2022</button></td>
                                <td>Tabela</td>
                                <td>2022</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Data_2022_Resume.csv', 'DataCana_Resume_2022.csv')} className="download-link">DC_Resume_2022</button></td>
                                <td>Tabela</td>
                                <td>2022</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2022_Datacana.rar', 'DataCana_ShapeFile_2022.rar')} className="download-link">DC_ShapeFile_2022</button></td>
                                <td>Compactado</td>
                                <td>2022</td>
                            </tr>
                            <tr>
                                <td><button onClick={() => handleDownload('Cana_2022.geojson', 'DataCana_GeoJSON_2022.geojson')} className="download-link">DC_GeoJSON_2022</button></td>
                                <td>GeoJSON</td>
                                <td>2022</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Downloads;