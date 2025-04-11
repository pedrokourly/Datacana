// Import Style Component
import './Navheader.css';

// Import React Icons
import { MdOpenInNew } from "react-icons/md";

// Import React Router DOM
import { NavLink } from 'react-router-dom';

const NavHeader = () => {
    return (
        <>
            <nav className="NavHeader">
                <ul className="navHeader-menu">
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about">Sobre o DataCana</NavLink>
                        <ul className="navHeader-subMenu">
                            <li>
                                <NavLink to="/about/projects">Projetos</NavLink>
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
                        <ul className="navHeader-subMenu">
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
                        <ul className="navHeader-subMenu">
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
            </nav>
        </>
    );
};

export default NavHeader;