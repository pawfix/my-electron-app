const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require('fs');
const path = require("path");


const settingJsonPath = (() => {
    const paths = [
        path.join(__dirname, '../extraResources/settings.json'),
        path.join(__dirname, 'extraResources/settings.json'),
        path.join(__dirname, './assets/settings.json'),
        path.join(__dirname, './extraResources/settings.json')
    ];

    for (const p of paths) {
        if (fs.existsSync(p)) {
            return p;
        }
    }

    console.error('Error determining settings.json path: no valid path found');
    return paths[paths.length - 1];
})();

let mainWindow;
let secondWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    //mainWindow.setAspectRatio(3 / 5);
    mainWindow.setMinimumSize(400, 600);
    mainWindow.loadFile(path.join(__dirname, "index.html"));
}

function createSecondWindow() {
    secondWindow = new BrowserWindow({
        width: 600,
        height: 400,
        frame: false,
        title: "Second Window",
        parent: mainWindow,
        modal: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    secondWindow.loadFile(path.join(__dirname, "settings.html"));

    secondWindow.on("closed", () => {
        secondWindow = null;
    });
}

app.whenReady().then(createMainWindow);

ipcMain.on("open-second-window", () => {
    if (secondWindow && !secondWindow.isDestroyed()) {
        secondWindow.focus();
        return;
    }
    createSecondWindow();
});

ipcMain.on("window-minimize", e => {
    BrowserWindow.fromWebContents(e.sender).minimize();
});

ipcMain.on("window-maximize", e => {
    const win = BrowserWindow.fromWebContents(e.sender);
    win.isMaximized() ? win.unmaximize() : win.maximize();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});



// Settings JSON config start 

function logColorScheme() {
    const settings = JSON.parse(fs.readFileSync(settingJsonPath, 'utf8'));
    const colorScheme = settings.Settings.colorScheme;

    switch (colorScheme) {
        case 'auto':
            //console.log('Color scheme is: auto');
            return 'auto';
            break;
        case 'dark':
            //console.log('Color scheme is: dark');
            return 'dark';
            break;
        case 'light':
            //console.log('Color scheme is: light');
            return 'light';
            break;
        default:
            setColorSchemeAuto();
            return 'auto';
        //console.log('Color scheme is unknown');
    }
}

// TEST start

function listenForIpc() {
    //console.log('Listening for testChannel messages')
    ipcMain.on('testChannel', (event, data) => {
        //console.log('Received:', data)
        sendTest('Hello from main process!')
    })
    ipcMain.on('request-color-scheme', (event) => {
        const scheme = logColorScheme();
        sendColorScheme(scheme);
        sendColorScheme();
    })
}

function sendColorScheme() {
    const allWindows = BrowserWindow.getAllWindows()
    allWindows.forEach(win => {
        try {
            win.webContents.send('log-color-scheme', logColorScheme())
        } catch (err) {
            console.error('Error sending color scheme:', err);
        }
    })
}

listenForIpc();

// TEST end

// Apply Color Scheme start


const ALLOWED_SCHEMES = ['auto', 'dark', 'light']

ipcMain.on('set-color-scheme', (event, scheme) => {
    if (!ALLOWED_SCHEMES.includes(scheme)) {
        console.warn('Received invalid scheme from renderer:', scheme)
        return;
    }

    setColorScheme(scheme)
    sendColorScheme()
})

ipcMain.on('ensure-settings', () => {
    ensureSettings()
});

function setColorScheme(scheme) {
    try {
        const settings = JSON.parse(fs.readFileSync(settingJsonPath, 'utf8'));
        settings.Settings.colorScheme = scheme;
        fs.writeFileSync(settingJsonPath, JSON.stringify(settings, null, 2), 'utf8');
        //console.log('Color scheme set to', scheme);
        const allWindows = BrowserWindow.getAllWindows();
        allWindows.forEach(win => {
            win.webContents.send('color-scheme-updated', scheme);
        });
    } catch (err) {
        console.error('Error updating color scheme:', err);
    }
}

// Apply color scheme end

// DEBUG START

// Sets default settings if settings.json does not exist or is corrupted
function ensureSettings() {
    if (!fs.existsSync(settingJsonPath)) {
        const defaults = {
            Settings: {
                colorScheme: 'auto',
                settingDir: 'config/',
                language: 'en'
            }
        };
        fs.writeFileSync(settingJsonPath, JSON.stringify(defaults, null, 2), 'utf8');
    }
}

// DEBUG END

// Settings JSON config end