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