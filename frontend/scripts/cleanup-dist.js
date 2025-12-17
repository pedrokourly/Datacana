import { unlink, readdir, access } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDatacanaPath = join(__dirname, '..', 'dist', 'assets', 'datacana');

async function cleanupLargeFiles() {
    try {
        await access(distDatacanaPath);
        const files = await readdir(distDatacanaPath);
        
        for (const file of files) {
            if (file.endsWith('.geojson') || file.endsWith('.rar')) {
                await unlink(join(distDatacanaPath, file));
                console.log(`Removed: ${file}`);
            }
        }
        
        console.log('Cleanup completed successfully');
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Error during cleanup:', error);
        } else {
            console.log('No datacana directory found in dist, skipping cleanup');
        }
    }
}

cleanupLargeFiles();
