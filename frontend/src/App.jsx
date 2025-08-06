// Import Style App
import './App.css'

// Import React Router DOM
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Home from './pages/Home/Home.jsx';

import Project from './pages/About/Project/Project.jsx';
import Financing from './pages/About/Financing/Financing.jsx';
import Products from './pages/About/Products/Products.jsx';
import Team from './pages/About/Team/Team.jsx';

import Platform from './pages/MapsData/Platform/Platform.jsx';
import Data from './pages/MapsData/Data/Data.jsx';
import Downloads from './pages/MapsData/Downloads/Downloads.jsx';

import Procedures from './pages/Metodology/Procedures/Procedures.jsx';
import Terms from './pages/Metodology/Terms/Terms.jsx';

import Contact from './pages/Contact/Contact.jsx';

// Import Components
import Layout from './components/Layout/Layout.jsx';

function App() {
    return (
        <>
            <div className="App">
                <HashRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />

                            <Route path="/about" element={<Navigate to="/about/project" replace />} />
                            <Route path="/about/project" element={<Project />} />
                            <Route path="/about/products" element={<Products />} />
                            <Route path="/about/financing" element={<Financing />} />
                            <Route path="/about/team" element={<Team />} />

                            <Route path="/mapsdata" element={<Navigate to="/mapsdata/downloads" replace />} />
                            <Route path="/mapsdata/platform" element={<Platform />} />
                            <Route path="/mapsdata/data" element={<Data />} />
                            <Route path="/mapsdata/downloads" element={<Downloads />} />

                            <Route path="/metodology" element={<Navigate to="/metodology/procedures" replace />} />
                            <Route path="/metodology/procedures" element={<Procedures />} />
                            <Route path="/terms" element={<Terms />} />

                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </Layout>
                </HashRouter>
            </div>
        </>
    );
};

export default App;
