// Import Style Page Module
import './Project.css';

// Import React Icons
import { MdOpenInNew } from "react-icons/md";

// Import React Router DOM
import { Link } from 'react-router-dom';

// Import Components
import Cover from '../../../components/Cover/Cover';

const Project = () => {
    return (
        <div className="Projeto">
            <Cover pageName="Projeto"/>

            <div className="content">
                <div className="container">
                    <article>
                        <h2>Sobre o Projeto DataCana</h2>

                        <p>O DataCana consiste em um banco de dados digital para disponibilização de informações geradas através do mapeamento do cultivo da cana-de-açúcar em Minas Gerais.</p>
                        <p>O projeto surgiu em 2018 fomentado pelo interesse nos impactos socioambientais e econômicos da expansão da cana-de-açúcar no estado mineiro. Em 2022, contou com recursos financeiros da <strong>Fundação de Amparo à Pesquisa do Estado de Minas Gerais (FAPEMIG)</strong>, por meio da aprovação da proposta no Edital Universal, projeto de Auxílio à Pesquisa (APQ) <strong>APQ-01102-22</strong>, o que possibilitou a implementação da plataforma <i>web</i>.</p>
                        <p>Seu principal objetivo é monitorar a expansão canavieira por meio de técnicas de <strong>geoprocessamento</strong> e produtos de <strong>sensoriamento remoto</strong>, em Minas Gerais. A importância do DataCana está no fato do Brasil ser o maior produtor mundial de cana-de-açúcar, dado que o <i>ranking</i> da produção é liderado por São Paulo, seguido de Goiás e Minas Gerais.</p>
                        <p>Durante o período de 2003 a 2014, o <Link to="http://www.dsr.inpe.br/canasat/mapa/ajuda/" target="_blank" rel="external">CANASAT<MdOpenInNew /></Link> monitorou as safras no Centro-Sul do Brasil, porém, o encerramento de sua versão pública deixou uma lacuna no fornecimento dessas estimativas.</p>
                        <p></p>
                        <p>Atualmente, o MapBiomas tem feito um trabalho de excelência ao divulgar os dados do uso da terra em todo o Brasil, detalhando, inclusive, a produção canavieira. Foi com base na utilização e análise destes dados que surgiu o DataCana, pois verificou-se que a metodologia de aquisição dos dados disponibilizados pelo MapBiomas, no estado de Minas Gerais, incorreu em uma subestimativa da área ocupada pela cana.</p>
                        <p>Assim, a <strong>plataforma <i>web</i> DataCana</strong> surge como mais uma alternativa à disponibilização de dados da produção de cana-de-açúcar em escala estadual, contribuindo à divulgação científica, à geração de dados, ao fornecimento de estimativas anuais e no auxílio às políticas públicas para o setor.</p>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default Project;