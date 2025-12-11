const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'settings.json');

function logColorScheme() {
    const settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const colorScheme = settings.Settings.colorScheme;

    switch (colorScheme) {
        case 'blue':
            console.log('Color scheme is: blue');
            break;
        case 'black':
            console.log('Color scheme is: black');
            break;
        case 'white':
            console.log('Color scheme is: white');
            break;
        default:
            console.log('Color scheme is unknown');
    }
}

function setColorSchemeBlue() {
    try {
        const settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        settings.Settings.colorScheme = 'blue';
        fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf8');
        console.log('Color scheme set to blue');
    } catch (err) {
        console.error('Error updating color scheme:', err);
    }
}
function setColorSchemeBlack() {
    try {
        const settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        settings.Settings.colorScheme = 'black';
        fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf8');
        console.log('Color scheme set to black');
    } catch (err) {
        console.error('Error updating color scheme:', err);
    }
}