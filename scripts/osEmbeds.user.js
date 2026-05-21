// ==UserScript==
// @name         OS Embeds
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2026.5.21.1
// @description  Floating os media embedder (made with OS Chat in mind, but works in other places)
// @author       LastieOS
// @match        *://*.onlinesequencer.net/*
// @match        *://seq.onl/*
// @grant        GM_addStyle
// @run-at       document-idle
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osEmbeds.user.js
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osEmbeds.user.js
// ==/UserScript==

// ver 2.1.2026.83 was the initial release

(function() {
    let initosEmbedWindowSize = {
    width: 0,
    height: 0
};

const osEmbedStyles = `
    :root { 
        --bg-glass: rgba(26, 26, 26, 0.85);
        --accent: #eee; 
        --glow: #eee;
    }
    .os-embed-window {
        position: fixed; width: 450px; height: 300px;
        background: var(--bg-glass); 
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        z-index: 999999; display: flex; flex-direction: column; 
        box-sizing: border-box;
        opacity: .85;
    }
    .os-embed-header {
        background: rgba(43, 44, 47, .6);
        padding: 8px 12px; cursor: move; display: flex; justify-content: space-between;
        align-items: center; 
        color: var(--glow); 
        font-family: 'PT Sans', sans-serif; 
        font-size: 11px; 
        letter-spacing: 1px;
        user-select: none;
    }
    .os-controls { display: flex; gap: 8px; }
    .os-btn { 
        cursor: pointer; width: 22px; height: 22px; 
        display: flex; align-items: center; justify-content: center; 
        background: #545558;
        font-family: 'PT Sans', sans-serif;
        color: white;
    }
    .os-close { color: #ff6b6b !important; }
    .os-embed-body { flex: 1; background: rgba(0, 0, 0, 0.2); position: relative; overflow: hidden; }
    .os-embed-body iframe, .os-embed-body img { width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0; }
    .os-centered-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
    .os-themed-audio { width: 90%; filter: hue-rotate(280deg) brightness(1.1) saturate(1.2); }
    .os-launch-btn {
        display: inline-block !important; width: 18px !important; height: 18px !important; 
        line-height: 18px !important; text-align: center !important; 
        margin-left: 6px !important; background: rgba(222, 171, 193, 0.15) !important;
        color: var(--glow) !important; 
        font-size: 11px !important; cursor: pointer !important;
        border: 1px solid var(--border-glass) !important;
        vertical-align: middle;
    }
    `;

const embedsStyleElement = document.createElement("style");
embedsStyleElement.textContent = osEmbedStyles;
document.head.appendChild(embedsStyleElement);

function getLinkType(url) {
    const h = url.toLowerCase();
    if (h.includes('list=')) return 2;
    if (h.includes('youtube.com/') || h.includes('youtu.be/')) return 1;
    if (h.includes('soundcloud.com')) return 3;
    if (h.includes('voca.ro') || h.includes('vocaroo.com')) return 5;
    if (h.match(/\.(mp3|wav|ogg|m4a)(\?|$)/i)) return 10;
    if (h.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i)) return 11;
    if (h.includes('onlinesequencer.net/')) return 0;
    return -1;
}

function createEmbedWindow(url) {
    let osEmbedWindow = document.getElementById('os-floating-window');
    if (!osEmbedWindow) {
        osEmbedWindow = document.createElement('div');
        osEmbedWindow.id = 'os-floating-window';
        osEmbedWindow.className = 'os-embed-window';
        osEmbedWindow.style.top = localStorage.getItem('os-embed-top') || '15%';
        osEmbedWindow.style.left = localStorage.getItem('os-embed-left') || '15%';
        document.body.appendChild(osEmbedWindow);
    } else {
        osEmbedWindow.replaceChildren();
    }

    const typeId = getLinkType(url);
    osEmbedWindow.classList.remove('os-scaled');

    const header = document.createElement('div');
    header.className = 'os-embed-header';
    header.id = 'os-drag-handle';

    const title = document.createElement('span');
    title.textContent = 'Embed Window';

    const controls = document.createElement('div');
    controls.className = 'os-controls';

    const minBtn = document.createElement('div');
    minBtn.className = 'os-btn';
    minBtn.id = 'os-min';
    minBtn.textContent = '—';
    minBtn.onclick = () => { osEmbedWindow.style.width = '300px'; osEmbedWindow.style.height = '150px'; };

    const resetBtn = document.createElement('div');
    resetBtn.className = 'os-btn';
    resetBtn.id = 'os-reset';
    resetBtn.textContent = '⟳';
    resetBtn.onclick = () => { osEmbedWindow.style.width = `${initosEmbedWindowSize.width}`; osEmbedWindow.style.height = `${initosEmbedWindowSize.height}`; };

    const maxBtn = document.createElement('div');
    maxBtn.className = 'os-btn';
    maxBtn.id = 'os-max';
    maxBtn.textContent = '⛶';
    maxBtn.onclick = () => { osEmbedWindow.style.width = '90vw'; osEmbedWindow.style.height = '85vh'; };

    const closeBtn = document.createElement('div');
    closeBtn.className = 'os-btn os-close';
    closeBtn.id = 'os-close';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => osEmbedWindow.remove();

    controls.append(minBtn, resetBtn, maxBtn, closeBtn);
    header.append(title, controls);

    const body = document.createElement('div');
    body.className = 'os-embed-body';

    const createIframe = (src, allow = "") => {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        if (allow) iframe.setAttribute('allow', allow);
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allowtransparency', 'true');
        return iframe;
    };

    switch (typeId) {
        case 1: { // YouTube
            osEmbedWindow.style.width = "560px"; osEmbedWindow.style.height = "350px";
            let vId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop().split('?')[0];
            body.appendChild(createIframe(`https://www.youtube.com/embed/${vId}?autoplay=1`, "autoplay; encrypted-media"));
            break;
        }
        case 2: { // YT Playlist
            osEmbedWindow.style.width = "560px"; osEmbedWindow.style.height = "350px";
            let lId = new URL(url).searchParams.get('list');
            body.appendChild(createIframe(`https://www.youtube.com/embed/videoseries?list=${lId}&autoplay=1`));
            break;
        }
        case 3: { // SoundCloud
            osEmbedWindow.style.width = "450px"; osEmbedWindow.style.height = "335px";
            body.appendChild(createIframe(`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&visual=true`));
            break;
        }
        case 4: { // Spotify
            osEmbedWindow.style.width = "400px"; osEmbedWindow.style.height = "187px";
            let spotUrl = url.replace("spotify.com", "open.spotify.com/embed/");
            body.appendChild(createIframe(spotUrl, "autoplay; encrypted-media"));
            break;
        }
        case 5: { // Vocaroo
            osEmbedWindow.style.width = "320px"; osEmbedWindow.style.height = "95px";
            let vocId = url.split('/').pop().split('?')[0];
            body.appendChild(createIframe(`https://vocaroo.com/embed/${vocId}?autoplay=1`));
            break;
        }
        case 10: { // Audio
            osEmbedWindow.style.width = "400px"; osEmbedWindow.style.height = "120px";
            const container = document.createElement('div');
            container.className = 'os-centered-content';
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.autoplay = true;
            audio.src = url;
            audio.className = 'os-themed-audio';
            container.appendChild(audio);
            body.appendChild(container);
            break;
        }
        case 11: { // Image
            osEmbedWindow.style.width = "300px"; osEmbedWindow.style.height = "300px";
            const container = document.createElement('div');
            container.className = 'os-centered-content';
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = "90%";
            img.style.maxHeight = "90%";
            img.style.objectFit = "contain";
            container.appendChild(img);
            body.appendChild(container);
            break;
        }
        case 0: { // Online Sequencer
            osEmbedWindow.classList.add('os-scaled');
            osEmbedWindow.style.width = "800px"; osEmbedWindow.style.height = "500px";
            const sep = url.includes('?') ? '&' : '?';
            body.appendChild(createIframe(`${url}${sep}os_embed=true`));
            break;
        }
    }

    initosEmbedWindowSize.width = osEmbedWindow.style.width; initosEmbedWindowSize.height = osEmbedWindow.style.height;

    osEmbedWindow.append(header, body);

    let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
    header.onmousedown = (e) => {
        if (e.target.classList.contains('os-btn')) return;

        p3 = e.clientX;
        p4 = e.clientY;

        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
            localStorage.setItem('os-embed-top', osEmbedWindow.style.top);
            localStorage.setItem('os-embed-left', osEmbedWindow.style.left);
        };

        document.onmousemove = (e) => {
            p1 = p3 - e.clientX;
            p2 = p4 - e.clientY;
            p3 = e.clientX;
            p4 = e.clientY;
            osEmbedWindow.style.top = (osEmbedWindow.offsetTop - p2) + "px";
            osEmbedWindow.style.left = (osEmbedWindow.offsetLeft - p1) + "px";
        };
    };
}

const scanLinks = () => {
    document.querySelectorAll('.message a:not(.os-btn-added)').forEach(link => {
        if (getLinkType(link.href) !== -1) {
            const btn = document.createElement('span');
            btn.className = 'os-launch-btn';
            btn.textContent = '↗';
            btn.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                createEmbedWindow(link.href);
            };
            link.after(btn);
        }
        link.classList.add('os-btn-added');
    });
};

new MutationObserver(scanLinks).observe(document.body, { childList: true, subtree: true });
scanLinks();
})();
