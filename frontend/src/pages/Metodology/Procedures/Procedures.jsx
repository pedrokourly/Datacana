// Import Style Page Module
import './Procedures.css';

// Import Components
import Cover from '../../../components/Cover/Cover';

const Procedures = () => {
    return (
        <div className="Procedures">
            <Cover pageName="Procedimentos"/>

            <div className="content">
                <div className="container">
                    <article>
                        <h2>Metodologia Procedimental</h2>
                        <p>A estratégia experimental adotada foi dividida nas seguintes etapas:</p>

                        <br />
                        <h2>1. Fundamentação Teórica</h2>
                        <p>1.1. A busca por referencial teórico englobou a expansão canavieira e os impactos a ela associados; a consulta aos dados de órgãos oficiais, e; as técnicas de geoprocessamento e sensoriamento mais eficientes para se alcançar os osbjetivos propostas.</p>

                        <br />
                        <h2>2. Mapeamento da Cana-de-açúcar</h2>
                        <p>2.1. Acesso ao <i>asset</i> de dados no <i>Google Earth Engine</i> do MapBiomas, download e conversão dos dados no formato <i>shapefile</i>;</p>
                        <p>2.2. Conferência de todos os polígonos classificados como cana-de-açúcar;</p>
                        <p>2.3. Correção dos erros de omissão e comissão de polígonos;</p>
                        <p>Trabalhos de campo nas áreas produtoras para validação do mapeamento;</p>
                        <p>Elaboração dos mapas de cana-de-açúcar a partir do ano 2016, e da expansão das áreas cultivadas nos anos subsequentes.</p>

                        <br />
                        <h2>3. Organização do Banco de Dados Digital DataCana</h2>
                        <p>3.1. A estruturação do DataCana deverá garantir fácil acesso às estimativas elaboradas;</p>
                        <p>3.2. A disponibilização gratuita dos dados na forma de mapas, tabelas e gráficos, por qualquer usuário com acesso à plataforma ocorre para o recorte espacial dos municípios, regiões imediatas e intermediárias de Minas Gerais;</p>
                        <p>3.3. O Banco de Dados Digital DataCana se resume no agrupamento de arquivos <i>shapefile</i> obtidos, convertidos e representados pelos formatos GeoJSON e CSV.</p>

                        <br />
                        <h2>4. Publicação dos Resultados e Confecção do Relatório Final</h2>
                        <p>4.1. A publicação dos dados no DataCana ocorre à medida em que os resultados de mapeamento vão sendo validados;</p>
                        <p>4.2. Outra fase de publicação consiste na divulgação das estimativas realizadas em periódicos científicos, congressos e palestras;</p>
                        <p>4.3. O relatório final elaborado contemplará a síntese dos resultados alcançados com o projeto e a demonstração do funcionamento do DataCana, previsto para ser concluído em julho de 2025.</p>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default Procedures;