let current = 0;
const images = document.querySelectorAll('.slider-img');
const dotsContainer = document.getElementById('slider-dots');

// Crear dots
dotsContainer.innerHTML = '';
images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    dot.onclick = () => {
        current = i;
        showSlide(current);
        resetAutoSlide();
    };
    dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll('.slider-dot');

function showSlide(idx) {
    images.forEach((img, i) => {
        img.classList.toggle('active', i === idx);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
    });
}

function moveSlide(dir) {
    current += dir;
    if (current < 0) current = images.length - 1;
    if (current >= images.length) current = 0;
    showSlide(current);
    resetAutoSlide();
}

// Drag/Touch support
let startX = 0;
let isDragging = false;
const track = document.getElementById('slider-track');

track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
});
track.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    let diff = e.pageX - startX;
    if (diff > 50) moveSlide(-1);
    else if (diff < -50) moveSlide(1);
    isDragging = false;
});
track.addEventListener('mouseleave', () => { isDragging = false; });

track.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
});
track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    let endX = e.changedTouches[0].clientX;
    let diff = endX - startX;
    if (diff > 50) moveSlide(-1);
    else if (diff < -50) moveSlide(1);
    isDragging = false;
});

// Auto slide cada 3 segundos
let autoSlide = setInterval(() => {
    moveSlide(1);
}, 3000);

function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
        moveSlide(1);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    var video1 = document.getElementById('video-container');

    function checkScroll(video, offset = 0) {
        if (!video) return; // <-- Añade esta línea
        var rect = video.getBoundingClientRect();
        var isVisible = (rect.top >= -offset && rect.bottom <= window.innerHeight + offset);
        if (isVisible) {
            video.play();
        } else {
            video.pause();
        }
    }

    function checkScrollForAllVideos() {
        checkScroll(video1, 0);
    }

    window.addEventListener('scroll', checkScrollForAllVideos);
    window.addEventListener('resize', checkScrollForAllVideos);
    checkScrollForAllVideos();
});

document.getElementById('menu-hamburguesa').addEventListener('click', function () {
    const navbar = document.getElementById('navbar');
    if (navbar.style.display === 'flex') {
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'flex';
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const ytIframe = document.querySelector('#video-container iframe');
    let autoplayed = false;

    if (ytIframe) {
        const originalSrc = ytIframe.getAttribute('src');
        const srcWithAutoplay = originalSrc.includes('autoplay=1')
            ? originalSrc
            : originalSrc + (originalSrc.includes('?') ? '&' : '?') + 'autoplay=1';

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !autoplayed) {
                        ytIframe.setAttribute('src', srcWithAutoplay);
                        autoplayed = true;
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );
        observer.observe(ytIframe);
    }
});

// --- Reproducción automática del primer video de YouTube al hacer scroll ---
if (!window.YT) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
}

let ytPlayer;
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('main-youtube');
}

function waitForPlayerReady(callback) {
    if (window.YT && window.YT.Player && ytPlayer && ytPlayer.playVideo) {
        callback();
    } else {
        setTimeout(() => waitForPlayerReady(callback), 200);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const ytIframe = document.getElementById('main-youtube');
    if (!ytIframe) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                waitForPlayerReady(() => {
                    if (entry.isIntersecting) {
                        ytPlayer.playVideo();
                    } else {
                        ytPlayer.pauseVideo();
                    }
                });
            });
        },
        { threshold: 0.5 }
    );
    observer.observe(ytIframe);
});

// --- Reproducción automática en hover para TikTok (video local) y segundo video de YouTube ---
document.addEventListener('DOMContentLoaded', function () {
    // TikTok local video
    const tiktokCard = document.querySelector('.card-tiktok');
    if (tiktokCard) {
        const tiktokVideo = tiktokCard.querySelector('video');
        tiktokCard.addEventListener('mouseenter', () => {
            tiktokVideo && tiktokVideo.play();
        });
        tiktokCard.addEventListener('mouseleave', () => {
            tiktokVideo && tiktokVideo.pause();
        });
    }

    // Segundo video de YouTube
    const yt2Card = document.querySelector('.card-youtube');
    if (yt2Card) {
        const yt2Iframe = yt2Card.querySelector('iframe');
        let yt2Player;

        function playYT2() {
            if (yt2Player && yt2Player.playVideo) yt2Player.playVideo();
        }
        function pauseYT2() {
            if (yt2Player && yt2Player.pauseVideo) yt2Player.pauseVideo();
        }

        function createYT2Player() {
            if (window.YT && window.YT.Player) {
                yt2Player = new YT.Player(yt2Iframe, {
                    events: {
                        'onReady': function () {
                            yt2Card.addEventListener('mouseenter', playYT2);
                            yt2Card.addEventListener('mouseleave', pauseYT2);
                        }
                    }
                });
            } else {
                setTimeout(createYT2Player, 200);
            }
        }

        // Manejo correcto de la API de YouTube para múltiples reproductores
        if (window.YT && window.YT.Player) {
            createYT2Player();
        } else {
            const prevReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = function () {
                prevReady && prevReady();
                createYT2Player();
            };
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                document.head.appendChild(tag);
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-hamburguesa');
    const mainMenu = document.getElementById('main-menu');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function () {
            mainMenu.classList.toggle('menu-open');
        });

        // Opcional: cerrar menú al hacer click en un enlace
        mainMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainMenu.classList.remove('menu-open');
            });
        });
    }
});

// Inicializar
showSlide(current);