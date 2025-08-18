// Import Style Page Module
import './Downloads.css';

// Import Components
import Cover from '../../../components/Cover/Cover';

const Downloads = () => {
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
                                <td><a href="/assets/datacana/Data_2017.csv" download="DataCana Tabela 2017">DC_Table_2017</a></td>
                                <td>Tabela</td>
                                <td>2017</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Data_2017_Resume.csv" download="DataCana Resume 2017">DC_Resume_2017</a></td>
                                <td>Tabela</td>
                                <td>2017</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Cana_2017_Datacana.rar" download="DataCana ShapeFile 2017">DC_ShapeFile_2017</a></td>
                                <td>Compactado</td>
                                <td>2017</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Cana_2017.geojson" download="DataCana GeoJSON 2017">DC_GeoJSON_2017</a></td>
                                <td>GeoJSON</td>
                                <td>2017</td>
                            </tr>

                            <tr>
                                <td><a href="/assets/datacana/Data_2018.csv" download="DataCana Tabela 2018">DC_Table_2018</a></td>
                                <td>Tabela</td>
                                <td>2018</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Data_2018_Resume.csv" download="DataCana Resume 2018">DC_Resume_2018</a></td>
                                <td>Tabela</td>
                                <td>2018</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Cana_2018_Datacana.rar" download="DataCana ShapeFile 2018">DC_ShapeFile_2018</a></td>
                                <td>Compactado</td>
                                <td>2018</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Cana_2018.geojson" download="DataCana GeoJSON 2018">DC_GeoJSON_2018</a></td>
                                <td>GeoJSON</td>
                                <td>2018</td>
                            </tr>
                            
                            <tr>
                                <td><a href="/assets/datacana/Data_2020.csv" download="DataCana Tabela 2020">DC_Table_2020</a></td>
                                <td>Tabela</td>
                                <td>2020</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Data_2020_Resume.csv" download="DataCana Resume 2020">DC_Resume_2020</a></td>
                                <td>Tabela</td>
                                <td>2020</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Cana_2020_Datacana.rar" download="DataCana ShapeFile 2020">DC_ShapeFile_2020</a></td>
                                <td>Compactado</td>
                                <td>2020</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Cana_2020.geojson" download="DataCana GeoJSON 2020">DC_GeoJSON_2020</a></td>
                                <td>GeoJSON</td>
                                <td>2020</td>
                            </tr>

                            <tr>
                                <td><a href="/assets/datacana/Data_2022.csv" download="DataCana Tabela 2022">DC_Table_2022</a></td>
                                <td>Tabela</td>
                                <td>2022</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Data_2022_Resume.csv" download="DataCana Resume 2022">DC_Resume_2022</a></td>
                                <td>Tabela</td>
                                <td>2022</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Cana_2022_Datacana.rar" download="DataCana ShapeFile 2022">DC_ShapeFile_2022</a></td>
                                <td>Compactado</td>
                                <td>2022</td>
                            </tr>
                            <tr>
                                <td><a href="/assets/datacana/Cana_2022.geojson" download="DataCana GeoJSON 2022">DC_GeoJSON_2022</a></td>
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