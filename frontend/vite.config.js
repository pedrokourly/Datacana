import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const excludeLargeFiles = () => {
    return {
        name: 'exclude-large-files',
        generateBundle(options, bundle) {
            for (const fileName in bundle) {
                if (fileName.endsWith('.geojson') || fileName.endsWith('.rar')) {
                    delete bundle[fileName];
                }
            }
        }
    };
};

export default defineConfig({
    plugins: [react(), excludeLargeFiles()],
    base: '/',
    publicDir: 'public',
    build: {
        assetsInlineLimit: 0,
        copyPublicDir: true,
        rollupOptions: {
            output: {
                manualChunks: undefined
            }
        }
    }
})
