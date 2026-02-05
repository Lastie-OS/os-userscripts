// ==UserScript==
// @name         OS Multi Solo
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2.5.2026
// @description  Multi-solo support for Online Sequencer
// @author       Lastie
// @match        https://onlinesequencer.net/*
// @grant        GM_addStyle
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osMultiSolo.user.js
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osMultiSolo.user.js
// ==/UserScript==

(function () {
    'use strict';

    function syncSoloButtonState() {
        const advancedTab = document.getElementById('instrument_options_tab_advanced');
        const soloBtn = document.getElementById('instrument_options_solo');

        if (!soloBtn || !advancedTab || typeof audioSystem === 'undefined' || typeof instrument === 'undefined') {
            return;
        }

        const isAdvancedSelected = advancedTab.classList.contains('selected');
        const isCurrentSoloed = audioSystem.hasSolo && audioSystem.hasSolo(instrument);

        if (isAdvancedSelected && isCurrentSoloed) {
            soloBtn.classList.add('enabled');
        } else if (!isCurrentSoloed) {
            soloBtn.classList.remove('enabled');
        }
    }

    function updateUI() {
        const resetBtn = document.getElementById('instrument_options_reset');

        if (resetBtn && !document.getElementById('instrument_options_clearSolo')) {
            const clearSoloBtn = document.createElement('div');
            clearSoloBtn.id = 'instrument_options_clearSolo';

            const hasActiveSolos = audioSystem.soloingSet && audioSystem.soloingSet.size > 0;
            clearSoloBtn.className = hasActiveSolos ? 'button enabled' : 'button';

            clearSoloBtn.innerHTML = 'Clear Solo <i class="fa-solid fa-x"></i>';

            clearSoloBtn.onclick = function () {
                if (typeof audioSystem !== 'undefined' && audioSystem.clearSolo) {
                    audioSystem.clearSolo();
                }
            };

            resetBtn.parentNode.insertAdjacentElement('afterend', clearSoloBtn);
        }

        syncSoloButtonState();
    }

    const checkExist = setInterval(function () {
        if (typeof audioSystem !== 'undefined' && audioSystem.instruments) {

            audioSystem.soloingSet = new Set();

            audioSystem.addSolo = function (instId) {
                this.soloingSet.add(instId);
                this.applyMultiSolo();
            };

            audioSystem.removeSolo = function (instId) {
                this.soloingSet.delete(instId);
                this.applyMultiSolo();
            };

            audioSystem.clearSolo = function () {
                this.soloingSet.clear();
                this.applyMultiSolo();
            };

            audioSystem.toggleSolo = function (instId) {
                if (this.soloingSet.has(instId)) {
                    this.removeSolo(instId);
                } else {
                    this.addSolo(instId);
                }
            };

            audioSystem.hasSolo = function (instId) {
                return this.soloingSet.has(instId);
            };

            const soloButton = document.querySelector('#instrument_options_solo');
            if (soloButton) {
                soloButton.onclick = function () {
                    if (typeof instrument !== 'undefined') {
                        audioSystem.toggleSolo(instrument);
                    }
                };
            }

            audioSystem.applyMultiSolo = function () {
                const hasActiveSolos = this.soloingSet.size > 0;

                for (const inst of this.instruments.values()) {
                    if (!hasActiveSolos) {
                        inst.disabledBySolo = false;
                    } else {
                        inst.disabledBySolo = !this.soloingSet.has(inst.instId);
                    }
                    if (inst.updateVolume) inst.updateVolume();
                }

                syncSoloButtonState();

                const clearSoloBtn = document.getElementById('instrument_options_clearSolo');
                if (clearSoloBtn) {
                    clearSoloBtn.className = hasActiveSolos ? 'button enabled' : 'button';
                }

                console.log("Active Solos:", Array.from(this.soloingSet));
            };

            console.log("Multi-Solo injection successful.");
            clearInterval(checkExist);
        }
    }, 500);

    setInterval(updateUI, 20);
})();
