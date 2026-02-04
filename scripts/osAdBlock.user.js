// ==UserScript==
// @name          OS Adblock
// @icon          https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @version       2.3.2026
// @description   Removes pesky ads on OS by deleting all add iframes on ad generation
// @author        Lastie
// @match         *://*.onlinesequencer.net/*
// @match         *.://seq.onl/*
// @grant         GM_addStyle
// @updateURL     https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osAdBlock.user.js
// @downloadURL   https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osAdBlock.user.js
// ==/UserScript==

(function() {
    'use strict';

    function deleteAds() {
        const ads = document.querySelectorAll('iframe');

        ads.forEach(ad => {
            if (ad.id === 'mira-player-frame') {
                return;
            }

            if (ad.id === 'chat_frame' || ad.src.includes('googleads') || ad.id.includes('ad')) {
                ad.remove();
            }
        });
    };

    deleteAds();
    const observer = new MutationObserver(deleteAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();
