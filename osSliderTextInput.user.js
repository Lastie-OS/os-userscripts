// ==UserScript==
// @name          OS Slider Text Input
// @icon          https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace     https://lastie-os.github.io/os-userscripts/
// @version       2.2.2026
// @description   OS slider text input (damn, why are you guys so picky?)
// @author        Lastie
// @match         https://onlinesequencer.net/*
// @updateURL     https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osSliderTextInput.user.js
// @downloadURL   https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osSliderTextInput.user.js
// @grant         GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .os-input-tooltip {
            position: fixed; z-index: 10000;
            background: #35363A; border: 1px solid #444; padding: 10px;
            border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            display: flex; align-items: center; gap: 8px;
        }
        .os-input-field {
            width: 85px; text-align: center; color: white;
            background: transparent; border: none; outline: none;
            font-family: monospace; font-size: 14px;
        }
        .os-close-btn {
            cursor: pointer; color: #ff4d4d; font-weight: bold;
            font-size: 18px; padding: 0 4px; line-height: 1;
        }
    `);

    let activeTooltip = null;

    const propertyMap = {
        'instrument_options_advanced_volume': 'volume',
        'instrument_options_advanced_pan': 'pan',
        'instrument_options_advanced_detune': 'detune',
        'instrument_options_advanced_reverb_volume': 'reverb',
        'instrument_options_advanced_distort_volume': 'distort',
        'instrument_options_advanced_eq_high': 'eq',
        'instrument_options_advanced_eq_mid': 'eq',
        'instrument_options_advanced_eq_low': 'eq',
        'instrument_options_advanced_bitcrusher_level': 'bitcrusherLevelValue',
        'instrument_options_synth_filter': 'filterCutoff',
        'instrument_options_synth_filter_q': 'filterQ',
        'instrument_options_synth_lfo_intensity': 'lfoIntensity',
        'instrument_options_synth_attack': 'attack',
        'instrument_options_synth_decay': 'decay',
        'instrument_options_synth_sustain': 'sustain',
        'instrument_options_synth_release': 'release'
    };

    const crashProneSliders = new Set([
        'instrument_options_advanced_volume',
        'instrument_options_advanced_reverb_volume',
        'instrument_options_advanced_distort_volume',
        'instrument_options_advanced_bitcrusher_level',
        'instrument_options_synth_filter',
        'instrument_options_synth_filter_q'
    ]);

    function createTooltip(slider, x, y) {
        if (activeTooltip) activeTooltip.remove();

        const id = slider.id;
        let currentValue = parseFloat(slider.value);

        try {
            if (typeof audioSystem !== 'undefined' && typeof instrument !== 'undefined') {
                const instData = audioSystem.loadInstrument(instrument);
                switch (true) {
                    case id.includes('pan'):
                        currentValue = instData.pan.pan; break;
                    case id.includes('reverb_volume'):
                        currentValue = instData.reverb.volume; break;
                    case id.includes('distort_volume'):
                        currentValue = instData.distort.volume; break;
                    case id.includes('eq_'):
                        if (instData.eq) {
                            if (id.includes('high')) currentValue = instData.eq.high;
                            else if (id.includes('mid')) currentValue = instData.eq.mid;
                            else if (id.includes('low')) currentValue = instData.eq.low;
                        }
                        break;
                    default: currentValue = instData[propertyMap[id]] ?? currentValue;
                }
            }
        } catch (e) { console.warn("Engine read failed."); }

        const tooltip = document.createElement('div');
        tooltip.className = 'os-input-tooltip';
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'os-input-field';

        switch (true) {
            case id.includes('detune'):
                input.step = '100'; break;
            case (id.includes('filter') && !id.includes('_q')):
                input.step = '200'; break;
            case (id.includes('attack') || id.includes('decay') || id.includes('sustain') || id.includes('release')):
                input.step = '0.02'; break;
            case (id.includes('volume') || id.includes('pan') || id.includes('reverb') || id.includes('distort') || id.includes('bitcrusher')):
                input.step = '0.1'; break;
            default:
                input.step = 'any';
        }

        input.value = currentValue;

        const hazard = document.createElement('span');
        hazard.style.cssText = "cursor: help; display: none;";

        const closeBtn = document.createElement('div');
        closeBtn.className = 'os-close-btn';
        closeBtn.innerText = '×';
        closeBtn.onclick = () => tooltip.remove();

        const updateEngine = (val) => {
            if (isNaN(val)) return;

            const isCrashRisk = crashProneSliders.has(id) && val < 0;
            const max = parseFloat(slider.getAttribute('max'));
            const min = parseFloat(slider.getAttribute('min'));

            switch (true) {
                case isCrashRisk:
                    input.style.backgroundColor = '#c0392b';
                    hazard.innerText = ' ❗';
                    hazard.style.display = 'inline';
                    return;
                case (val > max || val < min):
                    input.style.backgroundColor = '#d35400';
                    hazard.innerText = ' ⚠️';
                    hazard.style.display = 'inline';
                    break;
                default:
                    input.style.backgroundColor = 'transparent';
                    hazard.style.display = 'none';
            }

            slider.value = val;
            slider.dispatchEvent(new Event('input', { bubbles: true }));

            const oninputAttr = slider.getAttribute('oninput');
            if (oninputAttr) {
                const funcName = oninputAttr.split('(')[0];
                if (typeof window[funcName] === 'function') {
                    window[funcName](instrument, val);
                }
            }
        };

        input.oninput = () => updateEngine(parseFloat(input.value));
        input.onkeydown = (e) => { if (e.key === 'Enter') tooltip.remove(); };

        tooltip.append(input, hazard, closeBtn);
        document.body.appendChild(tooltip);

        activeTooltip = tooltip;
        setTimeout(() => input.select(), 10);
    }

    document.addEventListener('contextmenu', (e) => {
        const slider = e.target.closest('.slider, .slider_v');
        if (slider && propertyMap[slider.id]) {
            e.preventDefault();
            createTooltip(slider, e.clientX, e.clientY);
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (activeTooltip && !activeTooltip.contains(e.target)) {
            activeTooltip.remove();
            activeTooltip = null;
        }
    });

})();
