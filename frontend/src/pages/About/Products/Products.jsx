// Import Style Page Module
import './Products.css';

// Import Images
import GraficoMeso from '/assets/images/products/GraficoMeso.png';
import GraficoMicro from '/assets/images/products/GraficoMicro.png';
import GraficoMunicipio from '/assets/images/products/GraficoMunicipio.png';
import PlataformaCultura from '/assets/images/products/PlataformaCultura.png';
import PlataformaCulturaItba from '/assets/images/products/PlataformaCultura_Itba.png';
import PlataformaCulturaMG from '/assets/images/products/PlataformaCultura_MG.png';
import PlataformaGeral from '/assets/images/products/PlataformaGeral.png';
import PlataformaMunicipal from '/assets/images/products/PlataformaMunicipal.png';
import PlataformaMunicipalItba from '/assets/images/products/PlataformaMunicipal_Itba.png';
import Tabelas from '/assets/images/products/Tabelas.png';

// Import React Libs
import { useEffect } from 'react';

// Import Components
import Cover from '../../../components/Cover/Cover';

const Products = () => {
    useEffect(() => {
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach((carousel) => {
            new bootstrap.Carousel(carousel, {
                interval: 5000,
                ride: 'carousel',
                pause: false
            });
        });
    }, []);

    return (
        <div className="Products">
            <Cover pageName="Produtos"/>

            <div className="content">
                <div className="container">
                    <article>
                        <h2>Sobre os Produtos DataCana</h2>

                        <p>São vários os produtos que os usuários da plataforma podem consultar e realizar o <i>download</i> para os municípios, regiões imediatas e intermediárias de Minas Gerais, acerca da produção canavieira:</p>

                        <br />
                        <h3>Mapas Temáticos</h3>

                        <div id="carousel-maps" className="carousel carousel-dark slide">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={PlataformaGeral} alt="Plataforma Geral" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Plataforma Geral</h3>
                                            <p className="carton-text">
                                                Visualize dados gerais da produção canavieira em Minas Gerais através de mapas temáticos interativos, permitindo análise espacial da distribuição da cultura em todo o estado.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={PlataformaMunicipal} alt="Plataforma Municipal" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Plataforma Municipal</h3>
                                            <p className="carton-text">
                                                Acesse informações detalhadas sobre a produção canavieira por município, com dados específicos para análise local e tomada de decisão em âmbito municipal.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={PlataformaMunicipalItba} alt="Plataforma Municipal Ituiutaba" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Plataforma Municipal - Ituiutaba</h3>
                                            <p className="carton-text">
                                                Estudo específico do município de Ituiutaba, apresentando análise detalhada da produção canavieira local com dados históricos e tendências regionais.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={PlataformaCultura} alt="Plataforma Cultura" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Plataforma Cultura</h3>
                                            <p className="carton-text">
                                                Explore aspectos culturais e socioeconômicos relacionados à produção canavieira, incluindo impactos locais e características regionais da cultura da cana-de-açúcar.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={PlataformaCulturaItba} alt="Plataforma Cultura Ituiutaba" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Plataforma Cultura - Ituiutaba</h3>
                                            <p className="carton-text">
                                                Análise cultural específica de Ituiutaba, destacando a importância histórica e socioeconômica da cana-de-açúcar na região do Triângulo Mineiro.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={PlataformaCulturaMG} alt="Plataforma Cultura MG" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Plataforma Cultura - Minas Gerais</h3>
                                            <p className="carton-text">
                                                Panorama cultural da produção canavieira em todo o estado de Minas Gerais, abordando tradições, impactos sociais e características regionais da cultura.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carousel-maps" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carousel-maps" data-bs-slide-to="1" aria-current="true" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carousel-maps" data-bs-slide-to="2" aria-current="true" aria-label="Slide 3"></button>
                                <button type="button" data-bs-target="#carousel-maps" data-bs-slide-to="3" aria-current="true" aria-label="Slide 4"></button>
                                <button type="button" data-bs-target="#carousel-maps" data-bs-slide-to="4" aria-current="true" aria-label="Slide 5"></button>
                                <button type="button" data-bs-target="#carousel-maps" data-bs-slide-to="5" aria-current="true" aria-label="Slide 6"></button>
                            </div>
                        </div>

                        <br />
                        <h3>Gráficos</h3>

                        <div id="carousel-graphs" className="carousel carousel-dark slide">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={GraficoMunicipio} alt="Gráfico Município" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Gráficos por Município</h3>
                                            <p className="carton-text">
                                                Visualize dados estatísticos da produção canavieira através de gráficos detalhados por município, facilitando comparações e análises temporais.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={GraficoMicro} alt="Gráfico Microrregião" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Gráficos por Microrregião</h3>
                                            <p className="carton-text">
                                                Analise tendências e padrões da produção canavieira agrupados por microrregiões, oferecendo uma perspectiva regional mais ampla dos dados.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={GraficoMeso} alt="Gráfico Mesorregião" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Gráficos por Mesorregião</h3>
                                            <p className="carton-text">
                                                Explore dados consolidados por mesorregiões de Minas Gerais, proporcionando uma visão macro da distribuição e evolução da produção canavieira.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carousel-graphs" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carousel-graphs" data-bs-slide-to="1" aria-current="true" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carousel-graphs" data-bs-slide-to="2" aria-current="true" aria-label="Slide 3"></button>
                            </div>
                        </div>

                        <br />
                        <h3>Tabelas</h3>

                        <div id="carousel-tables" className="carousel carousel-dark slide">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={Tabelas} alt="Tabelas de Dados" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Tabelas de Dados</h3>
                                            <p className="carton-text">
                                                Acesse dados tabulares completos da produção canavieira em formato organizado e estruturado, ideal para análises estatísticas detalhadas e estudos acadêmicos.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carousel-tables" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default Products;