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
                                <td><a href="#" download="DataCana Tabela 2022">DC_Table_2022</a></td>
                                <td>Tabela</td>
                                <td>2022</td>
                            </tr>
                            <tr>
                                <td><a href="#" download="DataCana Resume 2022">DC_Resume_2022</a></td>
                                <td>Tabela</td>
                                <td>2022</td>
                            </tr>
                            <tr>
                                <td><a href="#" download="DataCana ShapeFile 2022">DC_ShapeFile_2022</a></td>
                                <td>Compactado</td>
                                <td>2022</td>
                            </tr>
                            <tr>
                                <td><a href="#" download="DataCana GeoJSON 2022">DC_GeoJSON_2022</a></td>
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