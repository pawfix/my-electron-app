let scheme = document.getElementById('htmlStyle');

function styleAuto() {
    scheme.href = 'styles/auto.css';
}
function styleDark() {
    scheme.href = 'styles/dark.css';
}
function styleLight() {
    scheme.href = 'styles/light.css';
}

module.exports = { styleAuto, styleDark, styleLight };