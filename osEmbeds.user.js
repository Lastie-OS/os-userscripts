// ==UserScript==
// @name         OS Embeds
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2.1.2026.84
// @description  Floating os media embedder (made to specifically work with chat, but works in other places too)
// @author       Lastie
// @match        *://*.onlinesequencer.net/*
// @match        *://seq.onl/*
// @grant        GM_addStyle
// @run-at       document-idle
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osEmbeds.user.js
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osEmbeds.user.js
// ==/UserScript==

// update 2.1.2026.83 was the publish

(function() {
    'use strict';

    if (window.location.search.includes('os_embed=true')) return;

    GM_addStyle(`
        :root { --pink-neon: #ff0080; --pink-glow: rgba(255, 0, 128, 0.5); }
        .os-embed-window {
            position: fixed; top: 15%; left: 15%; width: 450px; height: 300px;
            background: rgba(10, 10, 12, 0.98); backdrop-filter: blur(15px);
            border: 2px solid var(--pink-neon); box-shadow: 0 0 20px var(--pink-glow);
            z-index: 99999; display: flex; flex-direction: column; border-radius: 12px; overflow: hidden;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

    function createEmbedWindow(url) {
        let win = document.getElementById('os-floating-window');
        if (!win) {
            win = document.createElement('div');
            win.id = 'os-floating-window';
            win.className = 'os-embed-window';
            document.body.appendChild(win);
        }

        const h = url.toLowerCase();
        const isYTPlaylist = h.includes('list=');
        const isYT = (h.includes('youtube.com/watch?v=') || h.includes('youtu.be/') || h.includes('music.youtube.com/watch')) && !isYTPlaylist;
        const isAudio = h.match(/\.(mp3|wav|ogg|m4a)(\?|$)/i);
        const isVideo = h.match(/\.(mp4|webm|mov)(\?|$)/i);
        const isImage = h.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i);
        const isSC = h.includes('soundcloud.com');
        const isSpot = h.includes('spotify.com');
        const isVocaroo = h.includes('voca.ro') || h.includes('vocaroo.com');
        const isBandcamp = h.includes('bandcamp.com');
        const isApple = h.includes('music.apple.com');
        const isTidal = h.includes('tidal.com');
        const isDeezer = h.includes('deezer.com');

        let contentHtml = "";
        win.classList.remove('os-scaled');

        switch (true) {
            case isYTPlaylist: {
                win.style.width = "560px"; win.style.height = "350px";
                let listId = new URL(url).searchParams.get('list');
                contentHtml = `<iframe src="https://www.youtube.com/embed/videoseries?list=${listId}&autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
                break;
            }
            case isYT: {
                win.style.width = "560px"; win.style.height = "350px";
                let videoId = url.includes('watch?v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop().split('?')[0];
                contentHtml = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
                break;
            }
            case isDeezer: {
                win.style.width = "450px"; win.style.height = "335px";
                let deezerEmbed = url.replace("deezer.com/track/", "widget.deezer.com/widget/dark/track/");
                contentHtml = `<iframe src="${deezerEmbed}" allowtransparency="true" allow="encrypted-media; clipboard-write"></iframe>`;
                break;
            }
            case isTidal: {
                win.style.width = "500px"; win.style.height = "155px";
                let tidalEmbed = url.replace("tidal.com/tracks/", "embed.tidal.com/tracks/").replace("tidal.com/browse/track/", "embed.tidal.com/tracks/");
                contentHtml = `<iframe src="${tidalEmbed}" allow="encrypted-media; fullscreen; clipboard-write" sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe>`;
                break;
            }
            case isApple: {
                win.style.width = "600px"; win.style.height = "210px";
                let appleEmbed = url.replace("music.apple.com", "embed.music.apple.com");
                contentHtml = `<iframe allow="autoplay *; encrypted-media *; fullscreen *" src="${appleEmbed}"></iframe>`;
                break;
            }
            case isBandcamp: {
                win.style.width = "400px"; win.style.height = "309px";
                contentHtml = `<iframe src="https://bandcamp.com/EmbeddedPlayer/url=${encodeURIComponent(url)}/size=large/bgcol=333333/linkcol=fe7eaf/artwork=small/transparent=true/" seamless></iframe>`;
                break;
            }
            case isVocaroo: {
                win.style.width = "320px"; win.style.height = "95px";
                let vocId = url.split('/').pop().split('?')[0];
                contentHtml = `<div class="os-centered-content"><iframe src="https://vocaroo.com/embed/${vocId}?autoplay=1" allow="autoplay"></iframe></div>`;
                break;
            }
            case isSpot: {
                win.style.width = "400px"; win.style.height = "187px";
                let spotUrl = url.replace("open.spotify.com/", "open.spotify.com/embed/");
                contentHtml = `<iframe src="${spotUrl}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
                break;
            }
            case isSC: {
                win.style.width = "450px"; win.style.height = "335px";
                const scEmbedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff0080&auto_play=true&visual=true`;
                contentHtml = `<iframe scrolling="no" frameborder="no" allow="autoplay" src="${scEmbedUrl}"></iframe>`;
                break;
            }
            case isAudio: {
                win.style.width = "400px"; win.style.height = "120px";
                const playerHtml = `<html><body style="background:#000; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;"><audio controls autoplay style="width:90%; filter: hue-rotate(110deg) brightness(1.2);"><source src="${url}"></audio></body></html>`;
                contentHtml = `<div class="os-centered-content"><iframe src="${URL.createObjectURL(new Blob([playerHtml], {type: 'text/html'}))}"></iframe></div>`;
                break;
            }
            case isImage: {
                win.style.width = "300px"; win.style.height = "300px";
                contentHtml = `<div class="os-centered-content"><img src="${url}" style="max-width:100%; max-height:100%; object-fit: contain;"></div>`;
                break;
            }
            default: {
                win.classList.add('os-scaled');
                win.style.width = "800px"; win.style.height = "500px";
                const sep = url.includes('?') ? '&' : '?';
                contentHtml = `<iframe id="os-player-frame" src="${url + sep}os_embed=true" allowfullscreen></iframe>`;
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
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = (e) => {
                p1 = p3 - e.clientX; p2 = p4 - e.clientY;
                p3 = e.clientX; p4 = e.clientY;
                win.style.top = (win.offsetTop - p2) + "px";
                win.style.left = (win.offsetLeft - p1) + "px";
            };
        };
    }

    const scanLinks = () => {
        const chatMessages = document.querySelectorAll('.message a:not(.os-btn-added)');
        chatMessages.forEach(link => {
            const h = link.href.toLowerCase();
            const valid = h.includes('youtube.com/') || h.includes('youtu.be/') || h.includes('onlinesequencer.net/') ||
                          h.includes('soundcloud.com') || h.includes('voca.ro') || h.includes('vocaroo.com') ||
                          h.includes('spotify.com') || h.includes('apple.com') || h.includes('bandcamp.com') ||
                          h.match(/\.(mp3|wav|ogg|m4a|mp4|webm|mov|jpg|jpeg|png|gif|webp|bmp)(\?|$)/i);

            if (valid) {
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
