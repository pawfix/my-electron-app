const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let secondWindow;


function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

function createSecondWindow() {
    secondWindow = new BrowserWindow({
        width: 600,
        height: 400,
        title: 'Second Window',
        parent: mainWindow,
        modal: false,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    secondWindow.loadFile('settings.html');
}

app.whenReady().then(createMainWindow);

ipcMain.on('open-second-window', () => {
    createSecondWindow();
});

ipcMain.on('window-minimize', e => {
    const win = BrowserWindow.fromWebContents(e.sender);
    win.minimize();
});
ipcMain.on('window-maximize', e => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});

win.setAspectRatio(1 / 2)
win.setMinimumSize(200, 400);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
