// ==UserScript==
// @name         OS Floating Chat Blocker
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2026.5.21.1
// @description  A thingy to block idoit's messages in chat
// @author       LastieOS
// @match        *://onlinesequencer.net/forum/chat_frame.php*
// @match        *://seq.onl/forum/chat_frame.php*
// @grant        none
// @run-at       document-end
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osChatBlocker.user.js
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osChatBlocker.user.js
// ==/UserScript==

(function () {
    let blockedIds = JSON.parse(localStorage.getItem('blockedMemberIds')) || [""];
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

    const globalStyle = document.createElement('style');
    globalStyle.textContent = `
    .os-block-btn {
        display: inline-block !important; 
        width: 18px !important; 
        height: 18px !important; 
        line-height: 18px !important; 
        text-align: center !important; 
        margin-left: 6px !important; 
        background: rgba(222, 171, 193, 0.15) !important;
        color: #eee !important; 
        font-size: 11px !important; 
        cursor: pointer !important;
        border: none;
        vertical-align: middle;
        font-family: 'PT Sans', sans-serif; 
    }
`;
    document.head.appendChild(globalStyle);

    const host = document.createElement('div');
    host.id = 'blocker-host';
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    const shadowStyle = document.createElement('style');
    shadowStyle.textContent = `
    :host {
        --bg-glass: rgba(26, 26, 26, 0.85);
        --header-bg: rgba(43, 44, 47, 0.6);
        --input-bg: rgba(0, 0, 0, 0.3);
        --btn-bg: #545558;
        --glow: #eee;
    }

    #draggable-window {
        position: fixed; 
        z-index: 999999;
        top: ${savedPos.top}; 
        left: ${savedPos.left};
        background: var(--bg-glass); 
        border: none;
        padding: 12px; 
        color: white; 
        font-family: 'PT Sans', sans-serif; 
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); 
        transition: width 0.2s ease-in-out;
        box-sizing: border-box;
        opacity: .85;
    }

    #header { 
        background: var(--header-bg);
        margin: -12px -12px 12px -12px;
        padding: 8px 12px; 
        cursor: move; 
        display: flex; 
        justify-content: space-between; 
        align-items: center;
        color: var(--glow); 
        font-family: 'PT Sans', sans-serif; 
        font-size: 11px;
        user-select: none; 
        letter-spacing: 1px; 
    }

    #min-toggle { 
        cursor: pointer; 
        width: 22px; 
        height: 22px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background: var(--btn-bg);
        color: white;
        font-family: 'PT Sans', sans-serif;
        font-size: 14px; 
    }

    textarea {
        width: 100%; 
        height: 70px; 
        background: var(--input-bg); 
        color: var(--glow); 
        border: none; 
        padding: 8px; 
        font-family: 'PT Sans', sans-serif; 
        resize: none; 
        margin-bottom: 8px; 
        box-sizing: border-box; 
        font-size: 12px; 
        outline: none;
    }
    
    .opt { 
        font-size: 10px; 
        margin-bottom: 12px; 
        display: flex; 
        align-items: center; 
        gap: 8px; 
        color: var(--glow); 
    }

    input[type="checkbox"] { 
        cursor: pointer; 
        accent-color: var(--glow); 
        width: 14px; 
        height: 14px; 
    }

    #save-btn {
        width: 100%; 
        background: var(--btn-bg);
        color: white; 
        border: none; 
        padding: 10px; 
        cursor: pointer; 
        font-size: 11px;
        letter-spacing: 1px;
        font-family: 'PT Sans', sans-serif;
    }
`;
    shadow.appendChild(shadowStyle);

    const container = document.createElement('div');
    container.id = 'draggable-window';

    const updateUIState = (min) => {
        const contents = container.querySelectorAll('.window-content');
        contents.forEach(el => el.style.display = min ? 'none' : '');
        container.style.width = min ? '140px' : '250px';
        const toggleBtn = container.querySelector('#min-toggle');
        if (toggleBtn) toggleBtn.innerText = min ? '+' : '-';
    };

    const header = document.createElement('div');
    header.id = 'header';
    const title = document.createElement('span');
    title.textContent = 'Chat Blocker';
    const minToggle = document.createElement('span');
    minToggle.id = 'min-toggle';
    minToggle.textContent = '-';
    header.append(title, minToggle);

    const textarea = document.createElement('textarea');
    textarea.id = 'ids';
    textarea.className = 'window-content';
    textarea.placeholder = 'Comma separated IDs...';
    textarea.value = blockedIds.join(', ');

    const opt = document.createElement('div');
    opt.className = 'opt window-content';
    const pmCheck = document.createElement('input');
    pmCheck.type = 'checkbox';
    pmCheck.id = 'pmCheck';
    pmCheck.checked = blockPMs;
    const pmLabel = document.createElement('span');
    pmLabel.textContent = 'FILTER PRIVATE MESSAGES';
    opt.append(pmCheck, pmLabel);

    const saveBtn = document.createElement('button');
    saveBtn.id = 'save-btn';
    saveBtn.className = 'window-content';
    saveBtn.textContent = 'APPLY & REFRESH';

    container.append(header, textarea, opt, saveBtn);
    shadow.appendChild(container);

    updateUIState(isMinimized);

    minToggle.onclick = () => {
        isMinimized = !isMinimized;
        localStorage.setItem('blockerMinimized', isMinimized);
        updateUIState(isMinimized);
    };

    saveBtn.onclick = () => {
        const list = textarea.value.split(',').map(s => s.trim()).filter(s => s);
        localStorage.setItem('blockedMemberIds', JSON.stringify(list));
        localStorage.setItem('blockPMs', pmCheck.checked);
        location.reload();
    };

    let dragging = false, relX = 0, relY = 0;
    header.addEventListener('mousedown', (e) => {
        dragging = true;
        const rect = container.getBoundingClientRect();
        relX = e.clientX - rect.left;
        relY = e.clientY - rect.top;
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        container.style.left = (e.clientX - relX) + 'px';
        container.style.top = (e.clientY - relY) + 'px';
    });

    window.addEventListener('mouseup', () => {
        if (dragging) {
            dragging = false;
            localStorage.setItem('blockerButtonPos', JSON.stringify({
                top: container.style.top,
                left: container.style.left
            }));
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
                    b.innerText = '✖';
                    b.color = '#ff0000';
                    b.onclick = (e) => { e.stopPropagation(); blockUser(id); };
                    link.parentNode.insertBefore(b, link.nextSibling);
                }
            }
        });
    };

    const obs = new MutationObserver(recs => recs.forEach(r => r.addedNodes.forEach(applyFilters)));
    obs.observe(document.body, { childList: true, subtree: true });
    applyFilters(document.body);
})();
