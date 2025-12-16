const { ipcRenderer } = require('electron')

const ALLOWED_SCHEMES = ['auto', 'dark', 'light']

// Request the current color scheme from main
ipcRenderer.send('request-color-scheme')

// Request once on start
ipcRenderer.once('log-color-scheme', (event, scheme) => {
    console.log('Current color scheme is:', scheme)
    applyColorSchemeLocally(scheme)
})

// Request call on demand
function requestColorScheme() {
    ipcRenderer.send('request-color-scheme')
    ipcRenderer.once('log-color-scheme', (event, scheme) => {
        //console.log('Current color scheme is:', scheme)
        applyColorSchemeLocally(scheme)
    })
}

// Apply, ale bez wysyłania do main
function applyColorSchemeLocally(scheme) {
    switch (scheme) {
        case 'auto':
            styleAuto()
            break
        case 'dark':
            styleDark()
            break
        case 'light':
            styleLight()
            break
        default:
            console.error('Unknown color scheme received:', scheme)
            styleAuto()
    }
}

ipcRenderer.on('color-scheme-updated', (event, scheme) => {
    //console.log('Color scheme updated to:', scheme);
    switch (scheme) {
        case 'auto':
            styleAuto();
            break;
        case 'dark':
            styleDark();
            break;
        case 'light':
            styleLight();
            break;
        default:
            styleAuto();
        //console.error('Unknown color scheme received:', scheme);
    }
});

// Apply scheme and optionally send update to main
function applyColorScheme(scheme) {
    if (!ALLOWED_SCHEMES.includes(scheme)) {
        //console.error('Invalid color scheme:', scheme)
        return
    }
    ipcRenderer.send('set-color-scheme', scheme)
    //console.log('Requested to set color scheme to:', scheme)
}

// Apply style to HTML
let colorScheme = document.getElementById('htmlStyle')

function styleAuto() {
    //console.log('Applying auto style')
    colorScheme.href = 'styles/auto.css'
}
function styleDark() {
    //console.log('Applying dark style')
    colorScheme.href = 'styles/dark.css'
}
function styleLight() {
    //console.log('Applying light style')
    colorScheme.href = 'styles/light.css'
}

// Optional: ensure settings at startup
function ensureSettings() {
    ipcRenderer.send('ensure-settings')
}

// Export
module.exports = {
    applyColorScheme,
    styleAuto,
    styleDark,
    styleLight,
    ensureSettings
}
