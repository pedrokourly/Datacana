// Import Style Component
import './Navbar.css';

// Import Images
import Logo from '/assets/images/DataCana.svg';

// Import React Router DOM
import { NavLink } from 'react-router-dom';

// Import Components
import NavHeader from '../NavHeader/NavHeader.jsx';
import NavCanvas from '../NavCanvas/NavCanvas.jsx';

const Navbar = () => {
    return (
        <>
            <div className="Navbar">
                <div className="container">
                    <NavLink className="logo" to="/">
                        <img src={Logo} alt="Logo DataCana" />
                    </NavLink>

                    <NavHeader />
                    
                    <NavCanvas />
                </div>
            </div>
        </>
    );
};

export default Navbar;