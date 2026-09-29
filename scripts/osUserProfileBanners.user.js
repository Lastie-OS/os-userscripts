// ==UserScript==
// @name        Online Sequencer Theme Members
// @version     2026.9.28.5
// @match       https://onlinesequencer.net/members/*
// @author      LastieOS || Maddie
// @description Adds a cool background banner image thingy!
// @downloadURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osUserProfileBanners.user.js
// @updateURL      https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osUserProfileBanners.user.js
// ==/UserScript==

(function() {
  'use strict';

  /*                                        ONLY THIS SHOULD BE MODIFIED!!!!                                           */
  const myBannerImageURL = "";

  /* Here's a little utility i made so you can upload images for your banner! 
                  https://file.wintersawakening.site/image-uploader/
              THE TRAILING SLASH IS IMPORTANT!!!
  */








  // No touchie, unless you know what you're doing!
  const match = window.location.pathname.match(/\/members\/(\d+)/);
  const profileUid = parseInt(match[1], 10);
  const currentUid = settings.uid;

  function applyBanner(url) {
    const newCSS = `
    .profile_header_right {
      background: rgba(72, 79, 87, 0.62) !important;
      backdrop-filter: blur(1px) !important;
    }

    .profile_header {
      font-weight: bolder !important;
      background: rgba(72, 79, 87, 0.62) !important;
      backdrop-filter: blur(1px) !important;
    }

    .profile_banner {
      background-image: url(${url}) !important;
      background-position: center !important;
      background-size: cover !important;
    }`;

    const cssElement = document.createElement('style');
    cssElement.innerHTML = newCSS;

    document.head.appendChild(cssElement);
  }

  if (currentUid == profileUid) {
    if (myBannerImageURL && myBannerImageURL.trim() !== "") {
        fetch("https://file.wintersawakening.site/api/profile_banner/index.php", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: currentUid, banner: myBannerImageURL })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) applyBanner(myBannerImageURL);
        })
        .catch(err => {
            console.error("Error saving banner:", err);
            applyBanner(myBannerImageURL);
        });
    } else {
        fetch(`${"https://file.wintersawakening.site/api/profile_banner/index.php"}?uid=${currentUid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.banner) {
                applyBanner(data.banner);
            }
        })
        .catch(err => console.error("Error fetching banner:", err));
    }
  }
  else {
    fetch(`${"https://file.wintersawakening.site/api/profile_banner/index.php"}?uid=${profileUid}`)
    .then(response => response.json())
    .then(data => {
        if (data.success && data.banner) {
            applyBanner(data.banner);
        }
    })
    .catch(err => console.error("Error fetching banner:", err));
  }
})();
