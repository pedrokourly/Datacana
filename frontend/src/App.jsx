// Import Style App
import './App.css'

// Import React Router DOM
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages
import Home from './pages/Home/Home.jsx';
import Contact from './pages/Contact/Contact.jsx';

// Import Components
import Navbar from './components/Navbar/Navbar.jsx';

function App() {
    return (
        <>
            <div className="App">
                <BrowserRouter>
                    <Navbar />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    );
};

export default App;
