// ==UserScript==
// @name         OS Chat Name Styler
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2026.5.21.1
// @description  Customizable name styles
// @author       LastieOS
// @match        *://*.onlinesequencer.net/forum/chat_frame.php*
// @match        *://seq.onl/forum/chat_frame.php*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osChatNameStyler.user.js
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osChatNameStyler.user.js
// ==/UserScript==

(function () {
    let userStyles = JSON.parse(localStorage.getItem('osChatUserStyles') || '{}');
    
    let savedPos = JSON.parse(localStorage.getItem('osStylerPos')) || { top: '20%', left: '75%' };
    let isMinimized = JSON.parse(localStorage.getItem('osStylerMinimized')) === true;
    let activeUser = localStorage.getItem('osStylerActiveUser') || '';

    const styleEngine = document.createElement('style');
    styleEngine.id = 'os-chat-custom-css';
    document.documentElement.appendChild(styleEngine);

    const escapeCSS = (str) => str.replace(/([!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~])/g, "\\$1");

    const rebuildCSS = () => {
        let css = '';
        for (const [user, config] of Object.entries(userStyles)) {
            const escapedUser = escapeCSS(user);
            const glow = config.glow ? `text-shadow: 0 0 ${config.size / 3}px ${config.color} !important;` : 'text-shadow: none !important;';
            const fontRule = config.font ? `font-family: "${config.font}", sans-serif !important;` : '';
            css += `
                a[data-user="${escapedUser}"],
                a[data-user="${escapedUser}"] span,
                .user-${escapedUser} {
                    color: ${config.color} !important;
                    -webkit-text-fill-color: ${config.color} !important;
                    ${fontRule}
                    font-size: ${config.size}px !important;
                    font-weight: bold !important;
                    ${glow}
                }\n`;
        }
        styleEngine.textContent = css;
    };

    const host = document.createElement('div');
    host.id = 'os-styler-host';
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
            --border-glass: rgba(255, 255, 255, 0.1);
        }

        #draggable-window {
            position: fixed; 
            z-index: 1000000;
            top: ${savedPos.top}; 
            left: ${savedPos.left};
            background: var(--bg-glass); 
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid var(--border-glass);
            padding: 12px; 
            color: white; 
            font-family: 'PT Sans', sans-serif; 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); 
            transition: width 0.2s ease-in-out;
            box-sizing: border-box;
            opacity: .85;
            display: flex;
            flex-direction: column;
            gap: 12px;
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
            text-transform: uppercase;
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
        
        #min-toggle:hover {
            background: #66676a;
        }

        label {
            font-size: 10px; 
            color: #eee; 
            text-transform: uppercase; 
            letter-spacing: 1px;
        }

        input[type="text"] {
            width: 100%; 
            background: var(--input-bg); 
            color: var(--glow); 
            border: 1px solid var(--border-glass); 
            padding: 6px; 
            fontSize: '11px'; 
            font-family: inherit;
            outline: none; 
            box-sizing: border-box;
        }

        input[type="text"]:focus {
            border-color: rgba(255, 255, 255, 0.3);
        }

        .bloom-row {
            display: flex; 
            gap: 10px; 
            align-items: center;
        }

        input[type="color"] {
            width: 45px; 
            height: 30px; 
            border: none; 
            background: none; 
            cursor: pointer;
        }

        .glow-wrap {
            font-size: 10px; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            gap: 4px; 
            color: #eee;
        }

        input[type="checkbox"] { 
            cursor: pointer; 
            accent-color: var(--glow); 
            width: 14px; 
            height: 14px; 
        }

        input[type="range"] {
            cursor: pointer; 
            accent-color: var(--glow);
            width: 100%;
            margin: 4px 0;
        }

        .action-row {
            display: flex; 
            gap: 8px; 
            width: 100%; 
            box-sizing: border-box;
        }

        button {
            background: var(--btn-bg);
            color: white; 
            border: 1px solid var(--border-glass); 
            padding: 10px; 
            cursor: pointer; 
            font-size: 11px;
            letter-spacing: 1px;
            font-family: 'PT Sans', sans-serif;
            text-transform: uppercase;
            transition: 0.2s;
        }
        
        #os-btn-save { flex: 2; }
        #os-btn-save:hover { background: #66676a; }

        #os-btn-reset { 
            flex: 1; 
            background: rgba(255, 107, 107, 0.15); 
            color: #ff6b6b; 
            border: 1px solid rgba(255, 107, 107, 0.2); 
        }
        #os-btn-reset:hover { background: rgba(255, 107, 107, 0.25); }
    `;
    shadow.appendChild(shadowStyle);

    const container = document.createElement('div');
    container.id = 'draggable-window';

    const header = document.createElement('div');
    header.id = 'header';
    const title = document.createElement('span');
    title.id = 'window-title';
    const minToggle = document.createElement('span');
    minToggle.id = 'min-toggle';
    header.append(title, minToggle);

    const aliasLabel = document.createElement('label');
    aliasLabel.className = 'window-content';
    aliasLabel.textContent = 'Name Override';
    const aliasInput = document.createElement('input');
    aliasInput.type = 'text';
    aliasInput.className = 'window-content';

    const fontLabel = document.createElement('label');
    fontLabel.className = 'window-content';
    fontLabel.textContent = 'Font Family';
    const fontInput = document.createElement('input');
    fontInput.type = 'text';
    fontInput.className = 'window-content';

    const bloomLabel = document.createElement('label');
    bloomLabel.className = 'window-content';
    bloomLabel.textContent = 'Color & Bloom';

    const bloomRow = document.createElement('div');
    bloomRow.className = 'bloom-row window-content';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    const glowWrapper = document.createElement('label');
    glowWrapper.className = 'glow-wrap';
    const glowCheckbox = document.createElement('input');
    glowCheckbox.type = 'checkbox';
    glowWrapper.append(glowCheckbox, document.createTextNode(' Enable Glow'));
    bloomRow.append(colorInput, glowWrapper);

    const sizeLabel = document.createElement('label');
    sizeLabel.className = 'window-content';
    const sizeSpan = document.createElement('span');
    sizeLabel.append(document.createTextNode('Text Size: '), sizeSpan, document.createTextNode('px'));
    const sizeInput = document.createElement('input');
    sizeInput.type = 'range';
    sizeInput.className = 'window-content';
    sizeInput.min = '8';
    sizeInput.max = '30';

    const actionRow = document.createElement('div');
    actionRow.className = 'action-row window-content';
    const saveBtn = document.createElement('button');
    saveBtn.id = 'os-btn-save';
    saveBtn.textContent = 'Close';
    const resetBtn = document.createElement('button');
    resetBtn.id = 'os-btn-reset';
    resetBtn.textContent = 'Reset';
    actionRow.append(saveBtn, resetBtn);

    container.append(header, aliasLabel, aliasInput, bloomLabel, bloomRow, fontLabel, fontInput, sizeLabel, sizeInput, actionRow);
    shadow.appendChild(container);

    const updateUIState = (min) => {
        const contents = container.querySelectorAll('.window-content');
        contents.forEach(el => el.style.display = min ? 'none' : '');
        container.style.width = min ? '150px' : '240px';
        minToggle.innerText = min ? '+' : '-';
    };

    const loadUserInPanel = (username) => {
        if (!username) {
            title.textContent = 'Styling: None';
            container.style.display = 'none';
            return;
        }
        activeUser = username;
        localStorage.setItem('osStylerActiveUser', username);
        container.style.display = 'flex';
        title.textContent = `Styling: ${username}`;

        const conf = userStyles[username] || { color: '#eeeeee', font: '', size: 13, glow: true, alias: '' };
        
        aliasInput.value = conf.alias || '';
        aliasInput.placeholder = username;
        fontInput.value = conf.font || '';
        fontInput.placeholder = "e.g. 'PT Sans'";
        colorInput.value = conf.color;
        glowCheckbox.checked = conf.glow;
        sizeInput.value = conf.size;
        sizeSpan.textContent = conf.size;

        updateUIState(isMinimized);
    };

    const writeStylesFromPanel = () => {
        if (!activeUser) return;
        userStyles[activeUser] = {
            color: colorInput.value,
            font: fontInput.value,
            size: parseInt(sizeInput.value),
            glow: glowCheckbox.checked,
            alias: aliasInput.value
        };
        sizeSpan.innerText = sizeInput.value;
        localStorage.setItem('osChatUserStyles', JSON.stringify(userStyles));
        rebuildCSS();
        processElements();
    };

    container.oninput = writeStylesFromPanel;
    minToggle.onclick = () => {
        isMinimized = !isMinimized;
        localStorage.setItem('osStylerMinimized', isMinimized);
        updateUIState(isMinimized);
    };
    saveBtn.onclick = () => {
        activeUser = '';
        localStorage.removeItem('osStylerActiveUser');
        loadUserInPanel('');
    };

    resetBtn.onclick = () => {
        if (!activeUser) return;
        const userToReset = activeUser;
        delete userStyles[userToReset];
        localStorage.setItem('osChatUserStyles', JSON.stringify(userStyles));
        
        document.querySelectorAll(`a[data-user="${escapeCSS(userToReset)}"]`).forEach(link => {
            const target = link.querySelector('span') || link;
            target.textContent = userToReset; 
        });

        rebuildCSS();
        saveBtn.click(); 
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
            localStorage.setItem('osStylerPos', JSON.stringify({
                top: container.style.top,
                left: container.style.left
            }));
        }
    });

    const processElements = () => {
        const userLinks = document.querySelectorAll('a[data-user]');
        userLinks.forEach(link => {
            const username = link.getAttribute('data-user');
            const config = userStyles[username];

            if (config && config.alias) {
                const target = link.querySelector('span') || link;
                if (target.textContent !== config.alias) {
                    target.textContent = config.alias;
                }
            }

            if (link.closest('#user_list') && !link.classList.contains('os-styler-applied')) {
                const icon = document.createElement('span');
                const inner = document.createElement('small');
                
                inner.style.cssText = 'display:inline-block !important; padding: 0 4px !important; margin-left: 6px !important; background: rgba(222, 171, 193, 0.15) !important; color: #eee !important; font-size: 10px !important; cursor: pointer !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; font-family: "PT Sans", sans-serif; vertical-align: middle;';
                inner.textContent = 'style';
                
                icon.appendChild(inner);

                icon.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    loadUserInPanel(username);
                };
                link.after(icon);
                link.classList.add('os-styler-applied');
            }
        });
    };

    rebuildCSS();
    loadUserInPanel(activeUser); 
    const nameObserver = new MutationObserver(() => processElements());
    nameObserver.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', processElements);
}());
