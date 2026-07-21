// ==UserScript==
// @name        Online Sequencer Progress Bar :3
// @namespace   Meowmeowmeowmeowmeow.org
// @version     2026.7.21.2
//
// @match       https://onlinesequencer.net/*
// @grant       none
//
// @author      LastieOS
// @description Got the impulse to make this (it was worth it :3)

// @updateURL     https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osSequenceProgressBar.user.js
// @downloadURL   https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osSequenceProgressBar.user.js
// ==/UserScript==

(function() {
  /*
   * hi hi! i know im stating the obvious, but config is below :3!
   * */

  const barConfig = {
    opacity:                0.9,            // default 0.6
    color:                  '#254d88',      // default '#254d88'
    background:             'transparent',  // default 'transparent'
    height:                 '2.5%',         // default '2.5%'
    width:                  '100%'         // default '100%' (100% is the width of the sequencer)
  }

  /*            DONT TOUCH (unless you know what you're doing, then be my guest :3)           */

  const progress_selector = document.querySelector('#sequencer_panel_right');

  const progress = document.createElement('progress')
  progress.id = "sequence_progress_tracker"
  progress.max = 100;
  progress.value = 0;

  progress_selector.append(progress);

  const progress_styles =  document.createElement('style')

  progress_styles.textContent = `
  #sequence_progress_tracker {
    -webkit-appearance: none;
    appearance: none;
    border: none !important;
    background: ${barConfig.background};
    position: absolute;
    width: ${barConfig.width};
    height: ${barConfig.height};
    top:  0px;
    left: 50%;
    transform: translateX(-50%);
    opacity: ${barConfig.opacity};
    pointer-events: none;
  }

  #sequence_progress_tracker::-moz-progress-bar {
    background: ${barConfig.color};
  }

  #sequence_progress_tracker::-webkit-progress-value {
    background: ${barConfig.color};
  }`

  document.head.append(progress_styles)

  function updateProgress() {

    if (song.playing) {
      progress.value = (playTime / song.loopTime) * 100;
    } else {
      progress.value = 0;
    }

    requestAnimationFrame(updateProgress);
  }

  requestAnimationFrame(updateProgress);
}());
