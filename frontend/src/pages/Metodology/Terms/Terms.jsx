// Import Style Page Module
import './Terms.css';

// Import React Icons
import { MdOpenInNew } from "react-icons/md";

// Import React Router DOM
import { Link } from 'react-router-dom';

// Import Components
import Cover from '../../../components/Cover/Cover';

const Terms = () => {
    return (
        <div className="Terms">
            <Cover pageName="Termos de Uso"/>

            <div className="content">
                <div className="container">
                    <article>
                        <h2>Termos de Uso</h2>

                        <p>Todos os dados disponibilizados na plataforma DataCana são <strong>públicos, abertos e gratuitos</strong>, e estão registrados pela licença <Link to="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="external">Create Commons CC-BY-SA<MdOpenInNew /></Link> desde que o DataCana seja citado como a fonte de referência de dados, conforme modelo abaixo: <b><i>(Substituir o texto em negrito)</i></b></p>
                        <p>"DataCana - Monitoramento da cana-de-açúcar por meio do sensoriamento remoto e geoprocessamento. Dados no formato de <b>(tabela/gráfico/mapa)</b> do <b>(município, região imediata/região intermediária)</b> de Minas Gerais, Brasil, <b>(ano)</b>. Disponível em: www.datacana.org. Acesso em: <b>XX mês </b> 20<b>XX</b>."</p>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default Terms;