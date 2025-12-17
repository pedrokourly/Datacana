const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/pedrokourly/Datacana/main/frontend/public';

export const fetchFromGitHub = async (path) => {
    const url = `${GITHUB_RAW_URL}${path}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }
    
    return response;
};

export const fetchGeoJsonFromGitHub = async (filename) => {
    const response = await fetchFromGitHub(`/assets/datacana/${filename}`);
    return response.json();
};

export const fetchCSVFromGitHub = async (filename) => {
    const response = await fetchFromGitHub(`/assets/datacana/${filename}`);
    return response.text();
};

export const getDownloadUrl = (filename) => {
    return `${GITHUB_RAW_URL}/assets/datacana/${filename}`;
};
