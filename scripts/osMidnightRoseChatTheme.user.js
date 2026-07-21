// ==UserScript==
// @name         Online Sequencer: Midnight Rose (Chat)
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2026.7.21.1
// @description  OS pink chat theme thingy
// @author       Lastie
// @match        *://*.onlinesequencer.net/forum/chat_frame.php*
// @match        *://seq.onl/forum/chat_frame.php*
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osMidnightRoseChatTheme.user.js
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osMidnightRoseChatTheme.user.js
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
    const currentScript = document.currentScript;
    const settings = currentScript?.dataset.settings ? JSON.parse(currentScript.dataset.settings) : {};

    const messageInput = document.getElementById('message');
    if (messageInput && messageInput.tagName === 'INPUT') {
        const textarea = document.createElement('textarea');
        textarea.id = 'message';
        textarea.name = messageInput.name;
        textarea.placeholder = messageInput.placeholder + " (Ctrl+Enter to send)";
        textarea.autocomplete = "off";

        textarea.addEventListener('input', function () {
            this.style.height = '45px';
            const newHeight = this.scrollHeight;
            this.style.height = (newHeight > 45 ? newHeight : 45) + 'px';
        });

        textarea.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                if (typeof sendChat === 'function') {
                    sendChat();
                    this.style.height = '45px';
                }
            }
        });

        messageInput.parentNode.replaceChild(textarea, messageInput);
    }

    const themeCSS = `
    :root {
        --bg-charcoal: #0a0a0c;
        --pink-neon: #ff0080;
        --pink-light: #ff71ce;
        --pink-glow: rgba(255, 0, 128, 0.5);
        --border-rose: rgba(255, 113, 206, 0.3);
        --glass-bg: rgba(28, 20, 39, 0.75);
    }

    html, body, #chat_container {
        height: 100vh !important;
        margin: 0 !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        background-color: var(--bg-charcoal) !important;
    }

    #messages {
        flex: 1 !important;
        overflow-y: auto !important;
        background: transparent !important;
        padding: 10px !important;
    }

    .tborder, #chat_table, #user_list {
        background: var(--glass-bg) !important;
        backdrop-filter: blur(12px) !important;
        border: 1px solid var(--border-rose) !important;
        border-radius: 8px !important;
    }

    #chat_form_container {
        padding: 10px !important;
        background: rgba(10, 10, 12, 0.9) !important;
        border-top: 1px solid var(--border-rose) !important;
        z-index: 100;
        position: relative; 
    }

    .chat_form {
        display: flex !important;
        align-items: flex-end !important;
        gap: 8px !important;
    }

    #message {
        background: rgba(0, 0, 0, 0.6) !important;
        border: 1px solid var(--border-rose) !important;
        color: #fff !important;
        border-radius: 6px !important;
        padding: 10px !important;
        flex: 1 !important;
        font-family: 'Inconsolata', monospace !important;
        line-height: 1.4 !important;
        min-height: 45px !important;
        max-height: 200px !important;
        resize: none !important;
        outline: none !important;
        box-sizing: border-box !important;
        overflow-y: hidden !important;
        position: absolute;
        bottom: -7%;
        left: .4%;
    }

    #message:focus {
        border-color: var(--pink-neon) !important;
        box-shadow: 0 0 8px var(--pink-glow) !important;
    }

    #chatbutton {
        background: linear-gradient(135deg, var(--pink-neon), var(--pink-light)) !important;
        color: white !important;
        border: none !important;
        border-radius: 6px !important;
        font-weight: 900 !important;
        height: 45px !important;
        padding: 0 20px !important;
        cursor: pointer !important;
        text-transform: uppercase;
        flex-shrink: 0 !important;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: var(--pink-neon); border-radius: 10px; }

    @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap');
    .user-Lastie, .user-FemaleChara, .user-MiraDev {
        color: var(--pink-light) !important;
        font-family: 'Comfortaa', cursive !important;
        text-shadow: 0 0 5px rgba(255, 113, 206, 0.4) !important;
    }
    `;

    const themeStyle = document.createElement('style');
    themeStyle.textContent = themeCSS;
    document.head.appendChild(themeStyle);

    const colorizeNames = () => {
        const spans = document.querySelectorAll('span');
        const targetNames = ["Lastie", "FemaleChara", "MiraDev", "Geekgazer"];
        spans.forEach(span => {
            if (targetNames.includes(span.textContent.trim())) {
                span.style.color = "#ffb7ce";
                span.style.fontFamily = "'Comfortaa', cursive";
                span.style.fontWeight = "bold";
            }
        });
    };

    const obs = new MutationObserver(colorizeNames);
    obs.observe(document.body, { childList: true, subtree: true });
    colorizeNames();
})();
