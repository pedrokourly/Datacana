// Import Style Component
import './Footer.css';

// Import Images
import Logo from '/assets/images/DataCana.svg';
import LogoUFU from '/assets/images/LogoUFU.png';
import LogoFAPEMIG from '/assets/images/LogoFAPEMIG.png';

// Import React Icons
import { MdOpenInNew } from "react-icons/md";
import { IoIosMail } from "react-icons/io";

// Import React Router DOM
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <>
            <footer className="Footer">
                <div className="container">
                    <div className="logo">
                        <img src={Logo} alt="Logo DataCana" />
                    </div>

                    <div className="links">
                        <ul className="links-list">
                            <li className="links-group">Menu</li>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/metodology/procedures">Procedimentos</Link>
                            </li>
                            <li>
                                <Link to="/terms/">Termos de Uso</Link>
                            </li>
                        </ul>

                        <ul className="links-list">
                            <li className="links-group">Sobre o DataCana</li>
                            <li>
                                <Link to="/about/project">Projeto</Link>
                            </li>
                            <li>
                                <Link to="/about/products">Produtos</Link>
                            </li>
                            <li>
                                <Link to="/about/financing">Fontes de Financiamento</Link>
                            </li>
                            <li>
                                <Link to="/about/team">Equipe</Link>
                            </li>
                        </ul>

                        <ul className="links-list">
                            <li className="links-group">Mapas e Dados</li>
                            <li>
                                <Link to="/mapsdata/platform" target="_blank">Acesso a Plataforma</Link> <MdOpenInNew style={{ fill: "white" }} />
                            </li>
                            <li>
                                <Link to="/mapsdata/data" target="_blank">Acesso aos Dados</Link> <MdOpenInNew style={{ fill: "white" }} />
                            </li>
                            <li>
                                <Link to="/mapsdata/downloads">Downloads</Link>
                            </li>
                        </ul>

                        <ul className="links-list">
                            <li className="links-group">Contato</li>
                            <li>
                                <IoIosMail style={{ fill: "white" }} className="icon-mail" />
                                <Link to="mailto:datacana.ufu@gmail.com">datacana.ufu@gmail.com</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="support">
                        <p>Apoio:</p>
                        <div className="support-logos">
                            <img src={LogoUFU} alt="Logo UFU" />
                            <img src={LogoFAPEMIG} alt="Logo FAPEMIG" />
                        </div>
                    </div>

                    <div className="rule"></div>

                    <div className="license">
                        <p><a href="https://www.datacana.org/">DataCana</a> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0" target="_blank" rel="license noopener noreferrer">CC BY-SA 4.0 </a></p>
                        <div className="license-icons">
                            <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt="" />
                            <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt="" />
                            <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt="" />
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;