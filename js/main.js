const loader = document.getElementById('loader');
const mainContent = document.getElementById('main-content');
const loaderWaveText = document.querySelector('.loader-content h2:nth-child(2)');
const waveCanvas = document.getElementById('waveCanvas');
const images = document.querySelectorAll('.skill-image');

const loaderDuration = 4000;
const loaderVisibleDuration = 2000;

let loaderAnimationFrameId = null;
let waveContext = null;
let waveOffset = 0;
let waveAnimationFrameId = null;

const loaderWaveStart = [
    [0, 45],
    [16, 44],
    [33, 50],
    [54, 60],
    [70, 61],
    [84, 59],
    [100, 52],
    [100, 100],
    [0, 100]
];

const loaderWaveMid = [
    [0, 60],
    [15, 65],
    [34, 66],
    [51, 62],
    [67, 50],
    [84, 45],
    [100, 46],
    [100, 100],
    [0, 100]
];

function animateLoaderWaveText(now) {
    if (!loaderWaveText) {
        return;
    }

    const progress = (now % loaderDuration) / loaderDuration;
    const eased = (1 - Math.cos(progress * Math.PI * 2)) / 2;
    const points = loaderWaveStart.map((startPoint, index) => {
        const endPoint = loaderWaveMid[index];
        const x = startPoint[0] + (endPoint[0] - startPoint[0]) * eased;
        const y = startPoint[1] + (endPoint[1] - startPoint[1]) * eased;
        return `${x}% ${y}%`;
    });

    loaderWaveText.style.clipPath = `polygon(${points.join(', ')})`;
    loaderAnimationFrameId = window.requestAnimationFrame(animateLoaderWaveText);
}

window.addEventListener('load', () => {
    if (loaderWaveText) {
        loaderAnimationFrameId = window.requestAnimationFrame(animateLoaderWaveText);
    }

    window.setTimeout(() => {
        if (loader) {
            loader.classList.add('is-hidden');
        }

        if (mainContent) {
            mainContent.classList.add('is-show');
        }

        if (loaderAnimationFrameId !== null) {
            window.cancelAnimationFrame(loaderAnimationFrameId);
            loaderAnimationFrameId = null;
        }
    }, loaderVisibleDuration);
});

function resizeWaveCanvas() {
    if (!waveCanvas) {
        return;
    }

    waveCanvas.width = waveCanvas.offsetWidth;
    waveCanvas.height = waveCanvas.offsetHeight;
}

function drawWaveLayer(amplitude, wavelength, speed, color, verticalOffset) {
    const width = waveCanvas.width;
    const height = waveCanvas.height;
    const baseY = height - verticalOffset - amplitude;

    waveContext.beginPath();
    waveContext.moveTo(0, height);

    for (let x = 0; x <= width; x += 8) {
        const y =
            baseY +
            Math.sin(x / wavelength + waveOffset * speed) * amplitude;
        waveContext.lineTo(x, y);
    }

    waveContext.lineTo(width, height);
    waveContext.closePath();
    waveContext.fillStyle = color;
    waveContext.fill();
}

function renderWave() {
    if (!waveContext) {
        return;
    }

    const progress = (performance.now() % loaderDuration) / loaderDuration;
    waveOffset = progress * Math.PI * 2;

    waveContext.clearRect(0, 0, waveCanvas.width, waveCanvas.height);

    drawWaveLayer(34, 150, 0.4, 'rgba(255, 255, 255, 0.92)', 62);
    drawWaveLayer(30, 120, 0.3, 'rgba(107, 167, 235, 0.55)', 20);
    drawWaveLayer(26, 110, 0.5, 'rgba(227, 242, 253, 0.96)', 38);

    waveAnimationFrameId = window.requestAnimationFrame(renderWave);
}

function initWave() {
    if (!waveCanvas) {
        return;
    }

    waveContext = waveCanvas.getContext('2d');
    resizeWaveCanvas();

    if (waveAnimationFrameId !== null) {
        window.cancelAnimationFrame(waveAnimationFrameId);
    }

    renderWave();
}

initWave();
window.addEventListener('resize', resizeWaveCanvas);

images.forEach((image) => {
    image.addEventListener('mousemove', (event) => {
        const rect = image.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        image.style.transform = `perspective(900px) rotateX(${-y * 0.08}deg) rotateY(${x * 0.08}deg) scale(1.03)`;
    });

    image.addEventListener('mouseleave', () => {
        image.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
});
