// ==UserScript==
// @name         OS Chat Name Styler
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      1.28.2026.8
// @description  Name styles
// @author       Lastie
// @match        https://onlinesequencer.net/forum/chat_frame.php*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let userStyles = JSON.parse(localStorage.getItem('osChatUserStyles') || '{}');

    const styleEngine = document.createElement('style');
    styleEngine.id = 'os-chat-custom-css';
    document.documentElement.appendChild(styleEngine);

    const rebuildCSS = () => {
        let css = '';
        for (const [user, config] of Object.entries(userStyles)) {
            const glow = config.glow ? `text-shadow: 0 0 ${config.size/3}px ${config.color} !important;` : 'text-shadow: none !important;';
            const fontRule = config.font ? `font-family: "${config.font}", sans-serif !important;` : '';
            css += `
                a[data-user="${user}"],
                a[data-user="${user}"] span,
                .user-${user} {
                    color: ${config.color} !important;
                    -webkit-text-fill-color: ${config.color} !important;
                    ${fontRule}
                    font-size: ${config.size}px !important;
                    font-weight: bold !important;
                    ${glow}
                }\n`;
        }
        styleEngine.innerHTML = css;
    };

    const showPicker = (username) => {
        const old = document.getElementById('os-styler-popup');
        if (old) old.remove();

        const conf = userStyles[username] || { color: '#ffb7ce', font: '', size: 13, glow: true };

        const popup = document.createElement('div');
        popup.id = 'os-styler-popup';
        Object.assign(popup.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1a1a1a',
            border: '2px solid #ffb7ce',
            padding: '15px',
            zIndex: '1000000',
            borderRadius: '12px',
            fontFamily: 'sans-serif',
            color: 'white',
            boxShadow: '0 0 25px rgba(255, 183, 206, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '220px'
        });

        popup.innerHTML = `
            <div style="font-weight:bold; color:#ffb7ce; border-bottom:1px solid #333; padding-bottom:5px; text-align:center;">Editing: ${username}</div>
            <label style="font-size:10px;">Color & Bloom</label>
            <div style="display:flex; gap:10px; align-items:center;">
                <input type="color" id="os-input-color" value="${conf.color}" style="width:45px; height:25px; border:none; background:none; cursor:pointer;">
                <label style="font-size:10px;"><input type="checkbox" id="os-input-glow" ${conf.glow ? 'checked' : ''}> Enable Glow</label>
            </div>
            <label style="font-size:10px;">Font Family</label>
            <input type="text" id="os-input-font" value="${conf.font}" placeholder="Inherit site font" style="background:#222; color:white; border:1px solid #ffb7ce; border-radius:4px; padding:5px; font-size:11px;">
            <label style="font-size:10px;">Text Size: <span id="os-val-size">${conf.size}</span>px</label>
            <input type="range" id="os-input-size" min="8" max="30" value="${conf.size}" style="cursor:pointer; accent-color:#ffb7ce;">
            <button id="os-btn-save" style="margin-top:10px; background:#ffb7ce; color:#1a1a1a; border:none; border-radius:6px; padding:8px; font-weight:bold; cursor:pointer;">Save & Exit</button>
        `;
        document.body.appendChild(popup);

        const updateStyles = () => {
            userStyles[username] = {
                color: document.getElementById('os-input-color').value,
                font: document.getElementById('os-input-font').value,
                size: parseInt(document.getElementById('os-input-size').value),
                glow: document.getElementById('os-input-glow').checked
            };
            document.getElementById('os-val-size').innerText = userStyles[username].size;
            localStorage.setItem('osChatUserStyles', JSON.stringify(userStyles));
            rebuildCSS();
        };

        popup.oninput = updateStyles;
        document.getElementById('os-btn-save').onclick = () => popup.remove();
    };

    const inject = () => {
        const userLinks = document.querySelectorAll('a[data-user]:not(.os-styler-applied)');
        userLinks.forEach(link => {
            const username = link.getAttribute('data-user');
            const icon = document.createElement('span');
            icon.innerHTML = ' <small>style</small>';
            icon.style.cssText = 'cursor:pointer; font-size:12px; margin-left:4px; vertical-align:middle; filter: drop-shadow(0 0 2px pink);';
            icon.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                showPicker(username);
            };
            link.after(icon);
            link.classList.add('os-styler-applied');
        });
    };

    rebuildCSS();
    const observer = new MutationObserver(inject);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', inject);
})();
