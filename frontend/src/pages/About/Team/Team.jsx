// Import Style Page Module
import './Team.css';

// Import Images
import CoordJussara from '/assets/images/team/CoordJussara.jpg';
import DevGustavo from '/assets/images/team/DevGustavo.jpg';
import DevPedro from '/assets/images/team/DevPedro.jpg';
import DevLeandro from '/assets/images/team/DevLeandro.jpg';
import MapBruna from '/assets/images/team/MapBruna.jpg';
import MapErik from '/assets/images/team/MapErik.jpg';
import MapBruno from '/assets/images/team/MapBruno.jpg';
import MapJessica from '/assets/images/team/MapJessica.jpg';
import MapPedro from '/assets/images/team/MapPedro.jpg';

// Import React Libs
import { useEffect } from 'react';

// Import Components
import Cover from '../../../components/Cover/Cover';

const Team = () => {
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
        <div className="Team">
            <Cover pageName="Equipe" />

            <div className="content">
                <div className="container">
                    <article>
                        <h2>Coordenação</h2>

                        <div id="carousel-coord" className="carousel carousel-dark slide">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={CoordJussara} alt="Coordenação Jussara" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Prof.ª Dr.ª Jussara dos Santos Rosendo</h3>
                                            <p className="carton-text">
                                                Doutora em Geografia e docente do curso de Geografia e do Programa de Pós-Graduação em Geografia do Pontal (PPEGP) da Universidade Federal de Uberlândia (UFU), campus Pontal.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carousel-coord" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            </div>
                        </div>

                        <h2>Equipe de Desenvolvimento</h2>

                        <div id="carousel-dev" className="carousel carousel-dark slide">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={DevGustavo} alt="Desenvolvedor Pedro" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Gustavo Martins Corrêa dos Santos</h3>
                                            <p className="carton-text">
                                                Graduando em Engenharia da Computação pela Universidade do Estado de Minas Gerais (UEMG), campus Ituiutaba.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={DevPedro} alt="Desenvolvedor Pedro" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Pedro Henrique Assis Kourly</h3>
                                            <p className="carton-text">
                                                Graduando em Ciência da Computação pelo Instituto Federal do Triângulo Mineiro (IFTM), campus Ituiutaba.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={DevLeandro} alt="Desenvolvedor Pedro" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Leandro Guimarães Medeiros</h3>
                                            <p className="carton-text">
                                                Técnico em Tecnologia da Informação pela Universidade Federal de Uberlândia (UFU), campus Pontal, e Graduando em Engenharia Agronômica pela Universidade do Estado de Minas Gerais (UEMG), campus Ituiutaba.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carousel-dev" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carousel-dev" data-bs-slide-to="1" aria-current="true" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carousel-dev" data-bs-slide-to="2" aria-current="true" aria-label="Slide 3"></button>
                            </div>
                        </div>

                        <h2>Equipe de Mapeamento</h2>

                        <div id="carousel-map" className="carousel carousel-dark slide">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={MapBruna} alt="Mapeamento Bruna" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Dr.ª Bruna Aparecida Silva Dias</h3>
                                            <p className="carton-text">
                                                Doutora e Mestra em Geografia pelo Programa de Pós-graduação em Geografia do Pontal (PPGEP) da Universidade Federal de Uberlândia (UFU), campus Pontal.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={MapErik} alt="Mapeamento Érik" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Érik Donis de Melo</h3>
                                            <p className="carton-text">
                                                Graduando em Geografia pela Universidade Federal de Uberlândia (UFU), campus Pontal, e Bolsista de Iniciação Científica do Conselho Nacional de Desenvolvimento Científico e Tecnológico (CNPq).
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={MapBruno} alt="Mapeamento Bruno" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Bruno José Figueiredo Parreira</h3>
                                            <p className="carton-text">
                                                Graduando em Geografia pela Universidade Federal de Uberlândia (UFU), campus Pontal, e Bolsista de Iniciação Científica da Fundação de Amparo à Pesquisa de Minas Gerais (FAPEMIG).
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={MapJessica} alt="Mapeamento Jéssica" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Jéssica da Silva Ribeiro</h3>
                                            <p className="carton-text">
                                                Graduanda em Geografia pela Universidade Federal de Uberlândia (UFU), campus Pontal, e Bolsista de Iniciação Científica do Conselho Nacional de Desenvolvimento Científico e Tecnológico (CNPq).
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="carousel-item">
                                    <div className="carton">
                                        <div className="carton-image">
                                            <img src={MapPedro} alt="Mapeamento Pedro" />
                                        </div>
                                        <div className="carton-body">
                                            <h3>Pedro Trevisan de Oliveira</h3>
                                            <p className="carton-text">
                                                Graduando em Ciência da Computação pela Faculdade de Computação (FACOM) da Universidade Federal de Uberlândia (UFU), campus Santa Mônica.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carousel-map" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carousel-map" data-bs-slide-to="1" aria-current="true" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carousel-map" data-bs-slide-to="2" aria-current="true" aria-label="Slide 3"></button>
                                <button type="button" data-bs-target="#carousel-map" data-bs-slide-to="3" aria-current="true" aria-label="Slide 4"></button>
                                <button type="button" data-bs-target="#carousel-map" data-bs-slide-to="4" aria-current="true" aria-label="Slide 5"></button>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default Team;