const loader = document.getElementById('loader');
const mainContent = document.getElementById('main-content');
const loaderWaveText = document.querySelector('.loader-content h2:nth-child(2)');
const waveCanvases = [
    {
        element: document.getElementById('waveCanvas'),
        layers: [
            [34, 150, 0.4, 'rgba(255, 255, 255, 0.92)', 62],
            [30, 120, 0.3, 'rgba(107, 167, 235, 0.55)', 20],
            [26, 110, 0.5, 'rgba(227, 242, 253, 0.96)', 38]
        ]
    },
    {
        element: document.getElementById('snsWaveCanvas'),
        layers: [
            [28, 140, 0.35, 'rgba(255, 255, 255, 0.82)', 52],
            [22, 108, 0.26, 'rgba(203, 227, 233, 0.96)', 20],
            [18, 90, 0.46, 'rgba(207, 216, 220, 0.9)', 30]
        ]
    }
].filter((wave) => wave.element);
const hamburgerButton = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
const newsImageLinks = document.querySelectorAll('.news-image-link');
const images = document.querySelectorAll('.skill-image');

const loaderDuration = 4000;
const loaderVisibleDuration = 2000;

let loaderAnimationFrameId = null;
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

function setMobileMenuState(isOpen) {
    if (!hamburgerButton || !mobileMenu) {
        return;
    }

    hamburgerButton.classList.toggle('is-open', isOpen);
    mobileMenu.classList.toggle('is-open', isOpen);
    hamburgerButton.setAttribute('aria-expanded', String(isOpen));
    hamburgerButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

if (hamburgerButton && mobileMenu) {
    hamburgerButton.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('is-open');
        setMobileMenuState(isOpen);
    });

    mobileMenuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            setMobileMenuState(false);
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 767) {
            setMobileMenuState(false);
        }
    });
}

function resizeWaveCanvas() {
    waveCanvases.forEach((wave) => {
        wave.element.width = wave.element.offsetWidth;
        wave.element.height = wave.element.offsetHeight;
        wave.context = wave.element.getContext('2d');
    });
}

function drawWaveLayer(wave, amplitude, wavelength, speed, color, verticalOffset) {
    const width = wave.element.width;
    const height = wave.element.height;
    const baseY = height - verticalOffset - amplitude;

    wave.context.beginPath();
    wave.context.moveTo(0, height);

    for (let x = 0; x <= width; x += 8) {
        const y =
            baseY +
            Math.sin(x / wavelength + waveOffset * speed) * amplitude;
        wave.context.lineTo(x, y);
    }

    wave.context.lineTo(width, height);
    wave.context.closePath();
    wave.context.fillStyle = color;
    wave.context.fill();
}

function renderWave() {
    if (!waveCanvases.length) {
        return;
    }

    const progress = (performance.now() % loaderDuration) / loaderDuration;
    waveOffset = progress * Math.PI * 2;

    waveCanvases.forEach((wave) => {
        wave.context.clearRect(0, 0, wave.element.width, wave.element.height);
        wave.layers.forEach((layer) => {
            drawWaveLayer(wave, ...layer);
        });
    });

    waveAnimationFrameId = window.requestAnimationFrame(renderWave);
}

function initWave() {
    if (!waveCanvases.length) {
        return;
    }

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

newsImageLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
        link.classList.add('is-active');
    });

    link.addEventListener('mouseleave', () => {
        link.classList.remove('is-active');
    });

    link.addEventListener('focus', () => {
        link.classList.add('is-active');
    });

    link.addEventListener('blur', () => {
        link.classList.remove('is-active');
    });
});
