function calc() {
    let input = document.getElementById('calc').value;

    input = factorProces(input);

    if (!/^[0-9+\-*/().!\s]+$/.test(input)) {
        console.log('Invalid input!');
        return;
    }

    try {
        const output = eval(input);
        document.getElementById('result').textContent = output;
        document.getElementById('result').style.cssText = "color: black; transform: scale(1);";
    } catch {
        console.log('error with= ' + input)
        document.getElementById('result').style.cssText = "color: red; transform: scale(1.1);";
    }
}

function factorial(n) {
    if (n < 0) return NaN;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function factorProces(input) {
    return input.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));
}
function calcBtn() {
    const input = document.getElementById('calc');
    const value = this.querySelector('span').textContent.trim();
    input.value += value;
    calc();
}
function calcClear() {
    document.getElementById('calc').value = "";
    document.getElementById('result').innerText = "";
}
document.addEventListener('keydown', function (event) {
    const key = event.key;
    const code = event.code;
    const clearBtn = document.getElementById('clearBtn');
    const solveBtn = document.getElementById('solveBtn');
    const input = document.getElementById('calc');
    const buttons = document.querySelectorAll('.calcDiv');
    let matchedButton = null;

    buttons.forEach(btn => {
        const text = btn.querySelector('span').textContent.trim();
        if (text === key) {
            matchedButton = btn;
        }
    });

    if (code === "Enter" || code === "NumpadEnter") {
        solveBtn.style.backgroundColor = "rgb(255, 242, 199)";
        setTimeout(() => {
            solveBtn.style.backgroundColor = "wheat";
        }, 200);
        if (typeof calc === 'function') calc();
    }

    if (code === "Delete" || code === "NumpadDecimal") {
        clearBtn.style.backgroundColor = "rgba(245, 20, 20, 0.5)";
        setTimeout(() => {
            clearBtn.style.backgroundColor = "wheat";
        }, 200);
        if (typeof calcClear === 'function') calcClear();
    }

    if (matchedButton) {
        matchedButton.classList.add('calcFlash');
        setTimeout(() => {
            matchedButton.classList.remove('calcFlash');
        }, 100);

        input.value += key;
        if (typeof calc === 'function') calc();

        event.preventDefault();
    }
});
