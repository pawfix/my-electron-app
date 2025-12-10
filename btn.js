const { ipcRenderer } = require('electron');

function openSecondWindow() {
    ipcRenderer.send('open-second-window');
}
function closeCurrentWindow() {
    window.close();
}
function minimizeWindow() {
    ipcRenderer.send('window-minimize')
}
function maximizeWindow() {
    ipcRenderer.send('window-maximize')
}