// Import Style Main
import './index.css';

// Import React Libs
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import Component
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
