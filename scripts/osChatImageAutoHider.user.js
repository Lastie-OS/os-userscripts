// ==UserScript==
// @name         OS Chat Image Auto Hider
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2.3.2026.1
// @description  Hides those annoying giant images that ocassionally get put in chat
// @author       Lastie
// @match        *://*.onlinesequencer.net/forum/chat_frame.php*
// @match        *://seq.onl/forum/chat_frame.php*
// @grant        GM_addStyle
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osChatImageAutoHider.user.js
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osChatImageAutoHider.user.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceImages() {
        const images = document.querySelectorAll('.mycode_img');

        images.forEach(img => {
            const altText = img.getAttribute('alt') || '[Image]';
            const replacement = document.createElement('span');

            replacement.textContent = altText;
            replacement.style.fontStyle = 'italic';
            replacement.style.color = '#888';
            replacement.className = 'mycode_img_replaced';

            img.parentNode.replaceChild(replacement, img);
        });
    }

    replaceImages();

    const observer = new MutationObserver((mutations) => {
        replaceImages();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
