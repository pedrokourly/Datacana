// Import Style Component
import './NavCanvas.css';

// Import React Icons
import { MdMenuOpen, MdOpenInNew } from "react-icons/md";

// Import React Router DOM
import { NavLink } from 'react-router-dom';

const NavCanvas = () => {
    return (
        <>
            <button className="btn-canvas" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                <MdMenuOpen style={{ fontSize: "28px"}}/>
            </button>

            <div className="offcanvas offcanvas-end" id="offcanvasRight" tabIndex="-1" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">MENU</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cose"></button>
                </div>

                <div className="offcanvas-body">
                    <ul className="offcanvas-menu">
                        <li>
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/about">Sobre o DataCana</NavLink>
                            <ul className="offcanvas-subMenu">
                                <li>
                                    <NavLink to="/about/project">Projeto</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/about/products">Produtos</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/about/financing">Fontes de Financiamento</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/about/team">Equipe</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/terms/">Termos de Uso</NavLink>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to="/mapsdata">Mapas e Dados</NavLink>
                            <ul className="offcanvas-subMenu">
                                <li>
                                    <NavLink to="/mapsdata/plataform" target="_blank">Acesso a Plataforma</NavLink> <MdOpenInNew style={{ fill: "white" }} />
                                </li>
                                <li>
                                    <NavLink to="/mapsdata/data" target="_blank">Acesso aos Dados</NavLink> <MdOpenInNew style={{ fill: "white" }} />
                                </li>
                                <li>
                                    <NavLink to="/mapsdata/downloads">Downloads</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/terms/">Termos de Uso</NavLink>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to="/metodology">Metodologia</NavLink>
                            <ul className="offcanvas-subMenu">
                                <li>
                                    <NavLink to="/metodology/procedures">Procedimentos</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/terms/">Termos de Uso</NavLink>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to="/contact">Contato</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default NavCanvas;