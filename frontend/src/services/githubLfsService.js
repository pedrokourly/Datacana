const GITHUB_MEDIA_URL = 'https://media.githubusercontent.com/media/pedrokourly/Datacana/main/frontend/public';

export const fetchFromGitHub = async (path) => {
    const url = `${GITHUB_MEDIA_URL}${path}`;
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

export const getDownloadUrl = (filename) => {
    return `${GITHUB_MEDIA_URL}/assets/datacana/${filename}`;
};
