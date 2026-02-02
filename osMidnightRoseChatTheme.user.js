// ==UserScript==
// @name         Online Sequencer: Midnight Rose (Chat)
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2.1.2026.1
// @description  OS pink chat theme thingy
// @author       Lastie
// @match        *://*.onlinesequencer.net/forum/chat_frame.php*
// @match        *://seq.onl/forum/chat_frame.php*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const messageInput = document.getElementById('message');
    if (messageInput && messageInput.tagName === 'INPUT') {
        const textarea = document.createElement('textarea');
        textarea.id = 'message';
        textarea.name = messageInput.name;
        textarea.placeholder = messageInput.placeholder + " (Ctrl+Enter to send)";
        textarea.autocomplete = "off";

        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        textarea.addEventListener('keydown', function(e) {
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
}

html, body, #chat_container {
    height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    background-color: var(--bg-charcoal) !important;
}

html, body {
    background-color: var(--bg-charcoal) !important;
    background-image:
        radial-gradient(circle at 5% 5%, rgba(255, 0, 128, 0.3) 0%, transparent 60%),
        radial-gradient(circle at 95% 95%, rgba(255, 113, 206, 0.2) 0%, transparent 50%) !important;
    background-attachment: fixed !important;
}

#messages {
    flex: 1 1 auto !important;
    overflow-y: auto !important;
    padding: 10px !important;
    background: transparent !important;
}

.tborder, #chat_table, #user_list {
    background: rgba(15, 15, 20, 0.8) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid var(--border-rose) !important;
}

#chat_form_container, .chat_form {
    flex: 0 0 auto !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-end !important;
    gap: 10px !important;
    padding: 15px !important;
    background: rgba(10, 10, 12, 0.95) !important;
    border-top: 1px solid var(--border-rose) !important;
}

#message {
    background: rgba(0, 0, 0, 0.8) !important;
    border: 1px solid var(--border-rose) !important;
    color: #fff !important;
    border-radius: 8px !important;
    padding: 12px !important;
    flex: 1 !important;
    font-family: inherit;
    line-height: 1.5 !important;
    position: fixed;
    bottom: 2px;
    left: 2px;

    field-sizing: content !important;
    min-height: 45px !important;
    max-height: 250px !important;
    width: ;
}

#chatbutton {
    background: linear-gradient(135deg, var(--pink-neon), var(--pink-light)) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 8px !important;
    font-weight: 900 !important;
    box-shadow: 0 4px 15px var(--pink-glow) !important;
    height: 45px !important;
    padding: 0 25px !important;
    cursor: pointer;
    flex-shrink: 0 !important;
    text-transform: uppercase;
    bottom: 2px;
    right: 2px;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: var(--pink-neon); border-radius: 10px; }
:root {
    --bg-charcoal: #0a0a0c;
    --pink-light: #ffb7ce; /* A softer "cute" light pink */
    --border-rose: rgba(255, 113, 206, 0.3);
}

@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap');

span[data-user="Lastie"],
span[data-user="FemaleChara"],
span[data-user="MiraDev"],
.user-Lastie, .user-FemaleChara, .user-MiraDev {
    color: var(--pink-light) !important;
    font-family: 'Comfortaa', 'Comic Sans MS', cursive !important;
    text-shadow: 0 0 5px rgba(255, 183, 206, 0.4) !important;
    font-weight: bold !important;
}

span[data-user="Geekgazer"],
.user-Geekgazer {
    color: rgb(255, 0, 85) !important;
    font-family: serif !important;
    text-shadow: 0 0 5px rgba(255, 183, 206, 0.4) !important;
    font-weight: bold !important;
}

body, #chat_container {
    display: flex !important;
    flex-direction: column !important;
    height: 100vh !important;
    overflow: hidden !important;
}

#messages { flex: 1 1 auto !important; overflow-y: auto !important; min-height: 0 !important; }

#message {
    background: rgba(0, 0, 0, 0.7) !important;
    border: 1px solid var(--border-rose) !important;
    color: #fff !important;
    border-radius: 8px !important;
    padding: 12px !important;
    field-sizing: content !important;
    min-height: 45px !important;
    max-height: 300px !important;
}
a.robo-label {
    color: #a0ffa0 !important;
}
    `;

    const style = document.createElement('style');
    style.innerHTML = themeCSS;
    document.head.appendChild(style);

    const colorizeNames = () => {
    const spans = document.querySelectorAll('span');
    const targetNames = ["Lastie", "FemaleChara", "MiraDev", "Geekgazer"];

    const nameStyles = [
        ["#ffb7ce", "'Comfortaa', cursive", "bold"],
        ["#ffb7ce", "'Comfortaa', cursive", "bold"],
        ["#ffb7ce", "'Comfortaa', cursive", "bold"],
        ["rgb(255, 0, 85)", "serif", "bold"]
    ];

    spans.forEach(span => {
        const nameIndex = targetNames.indexOf(span.textContent.trim());

        if (nameIndex !== -1) {
            const [color, font, weight] = nameStyles[nameIndex];
            span.style.color = color;
            span.style.fontFamily = font;
            span.style.fontWeight = weight;
        }
    });
};

    const observer = new MutationObserver(colorizeNames);
    observer.observe(document.body, { childList: true, subtree: true });

    const sounds = {
        default: new Audio('https://lastie-os.github.io/typingSfx/Key.wav'),
        space: new Audio('https://lastie-os.github.io/typingSfx/Space.wav'),
        backspace: new Audio('https://lastie-os.github.io/typingSfx/Backspace.wav'),
        enter: new Audio('https://lastie-os.github.io/typingSfx/Del.wav'),
        default2: new Audio('https://lastie-os.github.io/typingSfx/Key2.wav'),
        space2: new Audio('https://lastie-os.github.io/typingSfx/Space2.wav'),
        backspace2: new Audio('https://lastie-os.github.io/typingSfx/Backspace2.wav3'),
        enter2: new Audio('https://lastie-os.github.io/typingSfx/Del2.wav')
    };

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const audioBuffers = {};
async function loadSound(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffers[name] = await audioCtx.decodeAudioData(arrayBuffer);
}

loadSound('default', 'https://lastie-os.github.io/typingSfx/Key.wav');
loadSound('space', 'https://lastie-os.github.io/typingSfx/Space.wav');
loadSound('backspace', 'https://lastie-os.github.io/typingSfx/Backspace.wav');
loadSound('enter', 'https://lastie-os.github.io/typingSfx/Del.wav');
loadSound('bing', 'https://lastie-os.github.io/typingSfx/Bing.wav');

const playSound = (name, isSpecial = false) => {
    if (!audioBuffers[name]) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffers[name];

    const reverb = audioCtx.createConvolver();

    const verbGain = audioCtx.createGain();
    verbGain.gain.value = 0.3; // Reverb volume

    let lastNode = source;

    if (isSpecial) {
        const delay = audioCtx.createDelay();
        const feedback = audioCtx.createGain();

        delay.delayTime.value = 0.12;
        feedback.gain.value = 0.8;

        delay.connect(feedback);
        feedback.connect(delay);

        source.connect(delay);
        delay.connect(audioCtx.destination);
    }

    source.connect(audioCtx.destination);
    source.start(0);
};

window.addEventListener('keydown', (e) => {
    const el = document.activeElement;
    const isInput = el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text');

    if (isInput) {
        if (e.key === 'Enter' && e.ctrlKey) {
            playSound('enter', true);
            if (typeof sendChat === 'function') {
                sendChat();
                if (el.id === 'message') el.style.height = '45px';
            }
            return;
        }

        switch (e.key) {
            case ' ': playSound('space'); break;
            case 'Backspace': playSound('backspace'); break;
            case 'Enter': playSound('enter'); break;
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                playSound('default');
                break;
            default:
                if (e.key.length === 1) playSound('default');
                break;
        }
    }
});



})();
