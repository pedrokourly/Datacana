// Import Style Page Module
import './Platform.css';

// Import Images
import Logo from '/assets/images/DataCana.svg';

// Import React Router DOM
import { NavLink } from 'react-router-dom';

const Platform = () => {
    return (
        <div className="Platform">
            <div className="navBar">
                <NavLink className="logo" to="/">
                    <img src={Logo} alt="Logo DataCana" />
                </NavLink>
            </div>

            {/* Leaflet Map */}
        </div>
    );
};

export default Platform;