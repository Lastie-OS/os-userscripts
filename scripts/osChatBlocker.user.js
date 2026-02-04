// ==UserScript==
// @name         OS Floating Chat Blocker
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2.3.2026
// @description  A thingy to block idoit's messages in chat
// @author       LastieOS
// @match        *://onlinesequencer.net/forum/chat_frame.php*
// @match        *://seq.onl/forum/chat_frame.php*
// @grant        none
// @run-at       document-end
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osChatBlocker.user.js
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osChatBlocker.user.js
// ==/UserScript==

(function() {
    'use strict';

    let blockedIds = JSON.parse(localStorage.getItem('blockedMemberIds')) || ["9812"];
    let blockPMs = JSON.parse(localStorage.getItem('blockPMs')) === true;
    let savedPos = JSON.parse(localStorage.getItem('blockerButtonPos')) || { top: '50px', left: '50px' };
    let isMinimized = JSON.parse(localStorage.getItem('blockerMinimized')) === true;

    const blockUser = (id) => {
        if (!blockedIds.includes(id)) {
            blockedIds.push(id);
            localStorage.setItem('blockedMemberIds', JSON.stringify(blockedIds));
            location.reload();
        }
    };

    const style = document.createElement('style');
    style.textContent = `
        .os-block-btn {
            cursor: pointer;
            color: #ff71ce;
            font-size: 10px;
            margin-left: 6px;
            text-shadow: 0 0 5px rgba(255, 113, 206, 0.5);
            font-family: 'Comfortaa', sans-serif;
            font-weight: bold;
            display: inline-block;
            vertical-align: middle;
        }
        .os-block-btn:hover { color: #fff; text-shadow: 0 0 8px #ff71ce; }

        /* Sidebar specific button styling */
        .user .os-block-sidebar {
            display: none;
            color: #ff0080;
            font-size: 9px;
            margin-top: 2px;
        }
        .user:hover .os-block-sidebar { display: block; }
    `;
    document.head.appendChild(style);

    const host = document.createElement('div');
    host.id = 'blocker-host';
    document.body.appendChild(host);
    const shadow = host.attachShadow({mode: 'open'});

    const container = document.createElement('div');
    container.id = 'draggable-window';

    const updateUIState = (min) => {
        const contents = shadow.querySelectorAll('.window-content');
        contents.forEach(el => el.style.display = min ? 'none' : 'block');
        container.style.width = min ? '110px' : '230px';
        shadow.getElementById('min-toggle').innerText = min ? '[+]' : '[−]';
    };

    container.innerHTML = `
        <style>
            #draggable-window {
                position: fixed;
                z-index: 999999;
                top: ${savedPos.top};
                left: ${savedPos.left};
                background: rgba(10, 10, 12, 0.9);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 113, 206, 0.4);
                border-radius: 10px;
                padding: 10px;
                color: white;
                font-family: 'Comfortaa', sans-serif;
                box-shadow: 0 5px 20px rgba(0,0,0,0.6);
                transition: width 0.2s ease-in-out;
            }
            #header {
                cursor: move;
                font-weight: bold;
                color: #ff71ce;
                font-size: 11px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            }
            #min-toggle { cursor: pointer; padding-left: 10px; }
            .divider { border-bottom: 1px solid rgba(255, 113, 206, 0.2); margin: 8px 0; }
            textarea {
                width: 100%; height: 60px; background: #111; color: #ffb7ce;
                border: 1px solid rgba(255, 113, 206, 0.3); border-radius: 5px;
                padding: 5px; font-family: monospace; resize: none; margin-bottom: 8px;
                box-sizing: border-box; font-size: 11px;
            }
            .opt { font-size: 10px; margin-bottom: 8px; display: flex; align-items: center; gap: 5px; }
            #save-btn {
                width: 100%; background: linear-gradient(to right, #ff0080, #ff71ce);
                color: white; border: none; border-radius: 5px; padding: 6px;
                font-weight: bold; cursor: pointer; font-size: 10px;
            }
        </style>
        <div id="header">
            <span>CHAT BLOCKER</span>
            <span id="min-toggle">[−]</span>
        </div>
        <div class="window-content divider"></div>
        <textarea id="ids" class="window-content" placeholder="IDs here...">${blockedIds.join(', ')}</textarea>
        <div class="opt window-content">
            <input type="checkbox" id="pmCheck" ${blockPMs ? 'checked' : ''}>
            <span>BLOCK PMS</span>
        </div>
        <button id="save-btn" class="window-content">SAVE & RELOAD</button>
    `;

    shadow.appendChild(container);
    updateUIState(isMinimized);

    shadow.getElementById('min-toggle').onclick = () => {
        isMinimized = !isMinimized;
        localStorage.setItem('blockerMinimized', isMinimized);
        updateUIState(isMinimized);
    };

    shadow.getElementById('save-btn').onclick = () => {
        const val = shadow.getElementById('ids').value;
        const list = val.split(',').map(s => s.trim()).filter(s => s);
        localStorage.setItem('blockedMemberIds', JSON.stringify(list));
        localStorage.setItem('blockPMs', shadow.getElementById('pmCheck').checked);
        location.reload();
    };

    let dragging = false, relX = 0, relY = 0;
    shadow.getElementById('header').onmousedown = (e) => {
        dragging = true;
        relX = e.clientX - container.getBoundingClientRect().left;
        relY = e.clientY - container.getBoundingClientRect().top;
    };

    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        container.style.left = (e.clientX - relX) + 'px';
        container.style.top = (e.clientY - relY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (dragging) {
            dragging = false;
            localStorage.setItem('blockerButtonPos', JSON.stringify({ top: container.style.top, left: container.style.left }));
        }
    });

    const applyFilters = (node) => {
        if (!node || node.nodeType !== 1) return;

        const chats = node.classList?.contains('chat') ? [node] : node.querySelectorAll('.chat');
        chats.forEach(c => {
            const link = c.querySelector('a[href*="/members/"]');
            if (link) {
                const id = link.getAttribute('href').split('/').pop();
                if (blockedIds.includes(id)) {
                    c.style.display = 'none';
                    return;
                }
                if (!c.querySelector('.os-block-btn')) {
                    const b = document.createElement('span');
                    b.className = 'os-block-btn';
                    b.innerText = '[✖]';
                    b.onclick = () => blockUser(id);
                    link.parentNode.insertBefore(b, link.nextSibling);
                }
            }
            if (blockPMs) {
                const text = c.querySelector('.message')?.innerText || "";
                if (text.includes('->') || text.includes('(whisper)')) c.style.display = 'none';
            }
        });

        const users = node.classList?.contains('user') ? [node] : node.querySelectorAll('.user');
        users.forEach(u => {
            const link = u.querySelector('a[href*="/members/"]');
            if (link && !u.querySelector('.os-block-sidebar')) {
                const id = link.getAttribute('href').split('/').pop();
                const b = document.createElement('div');
                b.className = 'os-block-btn os-block-sidebar';
                b.innerText = 'BLOCK USER';
                b.onclick = () => blockUser(id);
                u.appendChild(b);
            }
        });
    };

    const obs = new MutationObserver(recs => recs.forEach(r => r.addedNodes.forEach(applyFilters)));
    obs.observe(document.body, { childList: true, subtree: true });
    applyFilters(document.body);

})();
