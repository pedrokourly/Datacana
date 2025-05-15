// Import Style Page Module
import './Financing.css';

// Import Images
import LogoFAPEMIG from '/assets/images/LogoFAPEMIG.png';

// Import Components
import Cover from '../../../components/Cover/Cover';

const Financing = () => {
    return (
        <div className="Financing">
            <Cover pageName="Fontes de Financiamento"/>

            <div className="content">
                <div className="container">
                    <article>
                        <h2>Sobre as Fontes de Financiamento do DataCana</h2>

                        <div className="carton">
                            <div className="carton-image">
                                <img src={LogoFAPEMIG} alt="Logo FAPEMIG" />
                            </div>
                            <div className="carton-body">
                                <h3>Fundação de Amparo à Pesquisa do Estado de Minas Gerais</h3>
                                <p className="carton-text">
                                    O projeto DataCana conta com o apoio da Fundação de Amparo à Pesquisa do Estado de Minas Gerais (FAPEMIG), APQ-01102-22, Demanda Universal (Edital 01/2022).
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default Financing;