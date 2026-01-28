// ==UserScript==
// @name         OS Chat BBCode Editor
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    http://tampermonkey.net/
// @version      3
// @description  OS BBcode editor for chat... what else do you need to know???
// @author       Lastie
// @match        https://onlinesequencer.net/forum/chat_frame.php*
// @grant        GM_addStyle
// @run-at       document-end
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osBBcodeEditor.user.js
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osBBcodeEditor.user.js
// ==/UserScript==

(function() {
    'use strict';

    function parseBBCode(text) {
        return text
            .replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>')
            .replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>')
            .replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>')
            .replace(/\[s\](.*?)\[\/s\]/gi, '<strike>$1</strike>')
            .replace(/\[hr\]/gi, '<hr style="border:0; border-top:1px solid rgba(255,113,206,0.5); margin: 8px 0;">')
            .replace(/\[font=(.*?)\](.*?)\[\/font\]/gi, '<span style="font-family:$1">$2</span>')
            .replace(/\[align=(left|center|right)\](.*?)\[\/align\]/gi, '<div style="text-align:$1">$2</div>')
            .replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '<a href="$1" target="_blank" style="color:#ffb7ce; text-shadow: 0 0 5px #ff71ce;">$2</a>')
            .replace(/\[url\](.*?)\[\/url\]/gi, '<a href="$1" target="_blank" style="color:#ffb7ce; text-shadow: 0 0 5px #ff71ce;">$1</a>');
    }

    function updateLivePreview() {
        const textarea = document.getElementById('message');
        const previewDiv = document.getElementById('preview-msg');
        if (textarea && previewDiv) {
            previewDiv.innerHTML = `<span style="color:#ffb7ce; font-size:10px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; text-shadow: 0 0 3px #ff71ce;">Live Preview</span><br><div style="margin-top:5px;">` + parseBBCode(textarea.value) + `</div>`;
        }
    }

    function injectIntoInputField() {
        const inputField = document.querySelector('.input-field');
        const textarea = document.getElementById('message');
        const content = document.getElementById('content');

        if (!inputField || !textarea || !content || document.getElementById('bb-toolbar')) return;

        content.style.marginBottom = "30px";
        content.style.height = "calc(100% - 30px)";

        const toolbar = document.createElement('div');
        toolbar.id = 'bb-toolbar';
        toolbar.style.cssText = `
            display: flex;
            gap: 4px;
            position: absolute;
            top: -28px;
            right: 5px;
            z-index: 1000;
            background: rgba(10, 10, 12, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            padding: 3px 6px;
            border-radius: 5px;
            border: 1px solid rgba(255, 113, 206, 0.15);
        `;

        const buttons = [
            { label: 'B', tag: 'b', type: 'wrap' },
            { label: 'I', tag: 'i', type: 'wrap' },
            { label: 'U', tag: 'u', type: 'wrap' },
            { label: 'S', tag: 's', type: 'wrap' },
            { label: 'Link', tag: 'url', type: 'wrap' },
            { label: 'Font', tag: 'font=Arial', closeTag: 'font', type: 'wrap' },
            { label: 'Align', tag: 'align=center', closeTag: 'align', type: 'wrap' },
            { label: 'HR', tag: 'hr', type: 'independent' }
        ];

        buttons.forEach(btn => {
            const b = document.createElement('button');
            b.type = 'button';
            b.innerText = btn.label;
            b.style.cssText = `
                background: rgba(26, 26, 26, 0.5);
                color: rgba(255, 183, 206, 0.7);
                border: 1px solid rgba(255, 113, 206, 0.2);
                border-radius: 4px;
                padding: 1px 8px;
                cursor: pointer;
                font-family: 'Comfortaa', sans-serif;
                font-size: 10px;
                line-height: 12px;
                transition: 0.3s ease;
            `;

            b.onmouseover = () => {
                b.style.background = "rgba(255, 113, 206, 0.25)";
                b.style.color = "#fff";
                b.style.border = "1px solid rgba(255, 113, 206, 0.8)";
                b.style.boxShadow = "0 0 8px rgba(255, 113, 206, 0.3)";
            };
            b.onmouseout = () => {
                b.style.background = "rgba(26, 26, 26, 0.5)";
                b.style.color = "rgba(255, 183, 206, 0.7)";
                b.style.border = "1px solid rgba(255, 113, 206, 0.2)";
                b.style.boxShadow = "none";
            };

            b.onclick = (e) => {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = textarea.value;
                const selected = text.substring(start, end);

                let replacement = btn.type === 'independent' ? `[${btn.tag}]` : `[${btn.tag}]${selected}[/${btn.closeTag || btn.tag.split('=')[0]}]`;
                let newPos = (btn.type === 'wrap' && start === end) ? start + btn.tag.length + 2 : start + replacement.length;

                textarea.value = text.substring(0, start) + replacement + text.substring(end);
                textarea.focus();
                textarea.setSelectionRange(newPos, newPos);
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                updateLivePreview();
            };
            toolbar.appendChild(b);
        });

        const previewBtn = document.createElement('button');
        previewBtn.innerText = "Preview";
        previewBtn.type = "button";
        previewBtn.style.cssText = `background:rgba(255,113,206,0.35); color:#fff; border:1px solid #ff71ce; border-radius:4px; padding:1px 10px; cursor:pointer; font-family:'Comfortaa',sans-serif; font-size:10px; line-height:12px; margin-left:10px; box-shadow: 0 0 10px rgba(255,113,206,0.4); transition: 0.3s;`;

        previewBtn.onclick = (e) => {
            e.preventDefault();
            const existing = document.getElementById('preview-msg');
            if (existing) {
                existing.remove();
                textarea.removeEventListener('input', updateLivePreview);
            } else {
                const previewDiv = document.createElement('div');
                previewDiv.id = 'preview-msg';
                previewDiv.className = 'message';
                previewDiv.style.cssText = `
                    border-left: 4px solid #ff71ce;
                    background: rgba(12, 12, 15, 0.92);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    margin: 15px 10px;
                    padding: 10px;
                    border-radius: 0 8px 8px 0;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.6);
                    word-wrap: break-word;
                    color: #eee;
                    font-family: inherit;
                    width: 85vw;
                `;
                content.appendChild(previewDiv);
                updateLivePreview();
                textarea.addEventListener('input', updateLivePreview);
                previewDiv.scrollIntoView({ behavior: 'smooth' });
            }
        };
        toolbar.appendChild(previewBtn);

        inputField.appendChild(toolbar);
        inputField.style.overflow = 'visible';
    }

    const observer = new MutationObserver(injectIntoInputField);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(injectIntoInputField, 500);
})();
