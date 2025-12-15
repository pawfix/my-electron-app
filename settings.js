const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../extraResources/settings.json');

function logColorScheme() {
    const settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const colorScheme = settings.Settings.colorScheme;

    switch (colorScheme) {
        case 'auto':
            styleAuto();
            console.log('Color scheme is: auto');
            break;
        case 'dark':
            styleDark();
            console.log('Color scheme is: dark');
            break;
        case 'light':
            styleLight();
            console.log('Color scheme is: light');
            break;
        default:
            styleAuto();
            console.log('Color scheme is unknown');
    }
}


function styleAuto() {
    let scheme = document.getElementById('htmlStyle');
    scheme.href = 'styles/auto.css';
}
function styleDark() {
    scheme.href = 'styles/dark.css';
    let scheme = document.getElementById('htmlStyle');

}
function styleLight() {
    scheme.href = 'styles/light.css';
    let scheme = document.getElementById('htmlStyle');

}


function setColorSchemeAuto() {
    try {
        const settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        settings.Settings.colorScheme = 'auto';
        fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf8');
        console.log('Color scheme set to auto');
    } catch (err) {
        console.error('Error updating color scheme:', err);
    }
}
function setColorSchemeDark() {
    try {
        const settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        settings.Settings.colorScheme = 'dark';
        fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf8');
        console.log('Color scheme set to dark');
    } catch (err) {
        console.error('Error updating color scheme:', err);
    }
}
function ensureSettings() {
    if (!fs.existsSync(filePath)) {
        const defaults = {
            Settings: {
                colorScheme: 'auto',
                settingDir: 'config/',
                language: 'en'
            }
        };
        fs.writeFileSync(filePath, JSON.stringify(defaults, null, 2), 'utf8');
    }
}

module.exports = {
    logColorScheme,
    setColorSchemeAuto,
    setColorSchemeDark,
    ensureSettings
};