// ==UserScript==
// @name         OS Adblock
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2.1.2026
// @description  Removes pesky ads on OS by deleting all add iframes on ad generation
// @author       Lastie
// @match        *://*.onlinesequencer.net/*
// @grant        GM_addStyle
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osAdBlock.user.js
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osAdBlock.user.js
// ==/UserScript==

(function() {
    'use strict';

    function deleteAds() {
        const ads = document.querySelectorAll('iframe');

        ads.forEach(ad => {
            if (ad.id === 'chat_frame') {
                ad.remove();
            }
        });
    };

    deleteAds();

    const observer = new MutationObserver(deleteAds);
    observer.observe(document.body, { childList: true, subtree: true });

})();
