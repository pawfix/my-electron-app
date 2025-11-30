const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

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
    mainWindow.setAspectRatio(3 / 5);
    mainWindow.setMinimumSize(300, 500);
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

// Quit behavior
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
