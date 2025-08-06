// Import React Router DOM
import { useLocation } from 'react-router-dom';

// Import Components
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';

const Layout = ({ children }) => {
    const location = useLocation();

    const specialRoutes = ['/mapsdata/platform', '/mapsdata/data'];
    const isSpecialRoute = specialRoutes.includes(location.pathname);

    if (isSpecialRoute) {
        return (
            <>
                <main>
                    {children}
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main>
                {children}
            </main>

            <Footer />
        </>
    );
};

export default Layout;