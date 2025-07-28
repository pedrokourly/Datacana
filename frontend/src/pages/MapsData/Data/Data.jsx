// Import Style Page Module
import './Data.css';

// Import Images
import Logo from '/assets/images/DataCana.svg';

// Import React Router DOM
import { NavLink } from 'react-router-dom';

const Data = () => {
    return (
        <div className="Data">
            <div className="navBar">
                <NavLink className="logo" to="/">
                    <img src={Logo} alt="Logo DataCana" />
                </NavLink>
            </div>

            {/* Data (Tables, Graphs) */}
        </div>
    );
};

export default Data;