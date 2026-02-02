// ==UserScript==
// @name         OS Embeds
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2.1.2026.91
// @description  Floating os media embedder (made with OS Chat in mind, but works in other places)
// @author       Lastie
// @match        *://*.onlinesequencer.net/*
// @match        *://seq.onl/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.search.includes('os_embed=true')) return;

    GM_addStyle(`
        :root { --pink-neon: #ff0080; --pink-glow: rgba(255, 0, 128, 0.5); }
        .os-embed-window {
            position: fixed; width: 450px; height: 300px;
            background: rgba(10, 10, 12, 0.98); backdrop-filter: blur(15px);
            border: 2px solid var(--pink-neon); box-shadow: 0 0 20px var(--pink-glow);
            z-index: 99999; display: flex; flex-direction: column; border-radius: 12px; overflow: hidden;
            transition: width 0.3s ease, height 0.3s ease;
        }
        .os-embed-header {
            background: linear-gradient(90deg, var(--pink-neon), #ff71ce);
            padding: 6px 12px; cursor: move; display: flex; justify-content: space-between;
            align-items: center; color: white; font-family: sans-serif; font-size: 13px; user-select: none;
        }
        .os-controls { display: flex; gap: 8px; }
        .os-btn { cursor: pointer; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 4px; background: rgba(0,0,0,0.2); }
        .os-close { color: #ff4040; }
        .os-embed-body { flex: 1; background: #000; position: relative; overflow: hidden; }
        .os-embed-body iframe { width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0; }
        .os-scaled iframe { width: 200%; height: 200%; transform: scale(0.5); transform-origin: 0 0; }
        .os-centered-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        .os-launch-btn {
            display: inline-block !important; width: 16px !important; height: 16px !important; line-height: 16px !important;
            text-align: center !important; margin-left: 5px !important; background: var(--pink-neon) !important;
            color: white !important; border-radius: 3px !important; font-size: 10px !important; cursor: pointer !important;
            box-shadow: 0 0 5px var(--pink-glow) !important; border: none !important;
        }
    `);

    function getLinkType(url) {
        const h = url.toLowerCase();
        if (h.includes('list=')) return 2;
        if (h.includes('youtube.com/') || h.includes('youtu.be/')) return 1;
        if (h.includes('soundcloud.com')) return 3;
        if (h.includes('spotify.com')) return 4;
        if (h.includes('voca.ro') || h.includes('vocaroo.com')) return 5;
        if (h.includes('bandcamp.com')) return 6;
        if (h.includes('music.apple.com')) return 7;
        if (h.includes('tidal.com')) return 8;
        if (h.includes('deezer.com')) return 9;
        if (h.match(/\.(mp3|wav|ogg|m4a)(\?|$)/i)) return 10;
        if (h.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i)) return 11;
        if (h.includes('onlinesequencer.net/')) return 0;
        return -1;
    }

    function createEmbedWindow(url) {
        let win = document.getElementById('os-floating-window');
        if (!win) {
            win = document.createElement('div');
            win.id = 'os-floating-window';
            win.className = 'os-embed-window';
            win.style.top = localStorage.getItem('os-embed-top') || '15%';
            win.style.left = localStorage.getItem('os-embed-left') || '15%';
            document.body.appendChild(win);
        }

        const typeId = getLinkType(url);
        let contentHtml = "";
        win.classList.remove('os-scaled');

        switch (typeId) {
            case 1: { // YouTube
                win.style.width = "560px"; win.style.height = "350px";
                let vId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop().split('?')[0];
                contentHtml = `<iframe src="https://www.youtube.com/embed/${vId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                break;
            }
            case 2: { // YT Playlist
                win.style.width = "560px"; win.style.height = "350px";
                let lId = new URL(url).searchParams.get('list');
                contentHtml = `<iframe src="https://www.youtube.com/embed/videoseries?list=${lId}&autoplay=1" allowfullscreen></iframe>`;
                break;
            }
            case 3: { // SoundCloud
                win.style.width = "450px"; win.style.height = "335px";
                contentHtml = `<iframe src="https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&visual=true"></iframe>`;
                break;
            }
            case 4: { // Spotify
                win.style.width = "400px"; win.style.height = "187px";
                let spotUrl = url.replace("spotify.com", "open.spotify.com/embed/");
                contentHtml = `<iframe src="${spotUrl}" allow="autoplay; encrypted-media"></iframe>`;
                break;
            }
            case 5: { // Vocaroo
                win.style.width = "320px"; win.style.height = "95px";
                let vocId = url.split('/').pop().split('?')[0];
                contentHtml = `<iframe src="https://vocaroo.com/embed/${vocId}?autoplay=1"></iframe>`;
                break;
            }
            case 10: { // Audio
                win.style.width = "400px"; win.style.height = "120px";
                contentHtml = `<div class="os-centered-content"><audio controls autoplay src="${url}" style="width:90%; filter: hue-rotate(110deg) brightness(1.2);"></audio></div>`;
                break;
            }
            case 11: { // Image
                win.style.width = "300px"; win.style.height = "300px";
                contentHtml = `<div class="os-centered-content"><img src="${url}" style="max-width:100%; max-height:100%; object-fit: contain;"></div>`;
                break;
            }
            case 0:
            default: {
                win.classList.add('os-scaled');
                win.style.width = "800px"; win.style.height = "500px";
                const sep = url.includes('?') ? '&' : '?';
                contentHtml = `<iframe src="${url + sep}os_embed=true" allowfullscreen></iframe>`;
                break;
            }
        }

        win.innerHTML = `
            <div class="os-embed-header" id="os-drag-handle">
                <span>Media Player</span>
                <div class="os-controls">
                    <div class="os-btn" id="os-min">—</div>
                    <div class="os-btn" id="os-max">+</div>
                    <div class="os-btn os-close" id="os-close">×</div>
                </div>
            </div>
            <div class="os-embed-body">${contentHtml}</div>
        `;

        win.querySelector('#os-close').onclick = () => win.remove();
        win.querySelector('#os-max').onclick = () => { win.style.width = '90vw'; win.style.height = '85vh'; };
        win.querySelector('#os-min').onclick = () => { win.style.width = '300px'; win.style.height = '200px'; };

        let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
        const handle = win.querySelector('#os-drag-handle');
        handle.onmousedown = (e) => {
            p3 = e.clientX; p4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null; document.onmousemove = null;
                localStorage.setItem('os-embed-top', win.style.top);
                localStorage.setItem('os-embed-left', win.style.left);
            };
            document.onmousemove = (e) => {
                p1 = p3 - e.clientX; p2 = p4 - e.clientY;
                p3 = e.clientX; p4 = e.clientY;
                win.style.top = (win.offsetTop - p2) + "px";
                win.style.left = (win.offsetLeft - p1) + "px";
            };
        };
    }

    const scanLinks = () => {
        document.querySelectorAll('.message a:not(.os-btn-added)').forEach(link => {
            const type = getLinkType(link.href);
            if (type !== -1) {
                const btn = document.createElement('span');
                btn.className = 'os-launch-btn';
                btn.innerText = '↗';
                btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); createEmbedWindow(link.href); };
                link.after(btn);
            }
            link.classList.add('os-btn-added');
        });
    };

    new MutationObserver(scanLinks).observe(document.body, { childList: true, subtree: true });
    scanLinks();
})();
