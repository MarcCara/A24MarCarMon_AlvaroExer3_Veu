import { app, BrowserWindow, session } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win

function createWindow() {
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            spellcheck: true
        },
    })

    // Set a standard User-Agent to improve compatibility with Google services
    win.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    // Test active push message to Electron-Renderer.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
        // Auto-open devtools for debugging white screen issues
        win.webContents.openDevTools()
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }

    // Error handling for white screen issues
    win.webContents.on('did-fail-load', (errorCode, errorDescription) => {
        console.error('Failed to load window:', errorCode, errorDescription);
    })
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(() => {
    // --- PERMISSION HANDLER (REQUIREMENT) ---
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        console.log("🔒 Sol·licitud de permís:", permission);
        // 'media' includes microphone and camera. 
        // Adding more just in case debugging relies on them
        const allowedPermissions = ['media', 'accessibility-events'];

        if (allowedPermissions.includes(permission)) {
            // Automatically approve
            console.log("✅ Permís concedit:", permission);
            callback(true);
        } else {
            // Deny others
            console.warn("🚫 Permís denegat:", permission);
            callback(false);
        }
    });

    createWindow()
})
