// ==UserScript==
// @name         OS Bpm Tapper
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    https://lastie-os.github.io/os-userscripts/
// @version      2026.5.21.1
// @description  Adds a BPM tapper to OS!
// @author       LastieOS
// @match        *://onlinesequencer.net/forum/chat_frame.php*
// @match        *://seq.onl/forum/chat_frame.php*
// @grant        none
// @run-at       document-end
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osBpmTapper.user.js
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osBpmTapper.user.js
// ==/UserScript==

(function () {
    const style = `
        #os-tapper-container {
            position: absolute;
            background: rgba(26, 26, 26, 0.85);
            backdrop-filter: blur(10px);
            border: none;
            border-radius: 0px;
            padding: 12px;
            z-index: 10001;
            width: 220px;
            display: none;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            color: #eee;
            font-family: 'PT Sans', sans-serif;
            box-sizing: border-box;
            opacity: 0.9;
        }

        .os-tapper-title {
            font-family: 'PT Sans', sans-serif;
            font-size: 11px;
            font-weight: normal;
            color: #eee;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-shadow: none;
            margin: -12px -12px 12px -12px;
            padding: 8px 12px;
            background: rgba(43, 44, 47, 0.6);
            align-self: stretch;
            text-align: left;
        }

        #os-tapper-val {
            font-size: 32px;
            font-weight: bold;
            color: #eee;
            letter-spacing: 2px;
            margin-top: 4px;
            margin-bottom: 2px;
            font-family: 'PT Sans', sans-serif;
        }

        .os-tapper-box {
            width: 100%;
            box-sizing: border-box;
            border: none;
            border-radius: 0px;
            padding: 30px 10px;
            margin: 4px 0 12px 0;
            cursor: pointer;
            text-align: center;
            background: rgba(0, 0, 0, 0.3);
            color: #eee;
            user-select: none;
            font-weight: normal;
            font-size: 12px;
            animation: none;
        }

        .os-tapper-btns {
            display: flex;
            gap: 8px;
            width: 100%;
        }

        .os-tapper-btn {
            flex: 1;
            background: #545558;
            color: white;
            border: none;
            border-radius: 0px;
            padding: 10px;
            cursor: pointer;
            font-weight: normal;
            font-size: 11px;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-family: 'PT Sans', sans-serif;
        }

        .os-tapper-btn.secondary {
            background: rgba(43, 44, 47, 0.6);
        }

        #btn_bpm_tapper {
            display: inline-block;
            cursor: pointer;
            padding: 0 6px;
            background: rgba(222, 171, 193, 0.15);
            border-radius: 0px;
            border: none;
            margin-left: 6px;
            height: 18px;
            line-height: 18px;
            vertical-align: middle;
            color: #eee;
            font-family: 'PT Sans', sans-serif;
            font-size: 11px;
        }
    `;

    let taps = [];
    let currentBpm = 0;

    function handleTapLogic() {
        const now = Date.now();
        taps.push(now);
        if (taps.length > 8) taps.shift();

        const display = document.getElementById('os-tapper-val');
        if (taps.length > 1 && display) {
            const intervals = [];
            for (let i = 1; i < taps.length; i++) intervals.push(taps[i] - taps[i - 1]);
            const avg = intervals.reduce((a, b) => a + b) / intervals.length;
            currentBpm = Math.round(60000 / avg);
            display.innerText = currentBpm.toString().padStart(3, '0');
        }
    }

    function createTapperUI() {
        if (document.getElementById('os-tapper-container')) return;

        const s = document.createElement('style');
        s.textContent = style;
        document.head.appendChild(s);

        const container = document.createElement('div');
        container.id = 'os-tapper-container';

        const titleBar = document.createElement('div');
        titleBar.className = 'os-tapper-title';
        titleBar.textContent = 'BPM TAPPER';

        const valDisplay = document.createElement('div');
        valDisplay.id = 'os-tapper-val';
        valDisplay.textContent = '000';

        const bpmLabel = document.createElement('div');
        bpmLabel.style.cssText = 'color: #eee; letter-spacing: 2px; font-size: 10px; margin-bottom: 8px; font-weight: normal; opacity: 0.7;';
        bpmLabel.textContent = 'BEATS PER MINUTE';

        const tapArea = document.createElement('div');
        tapArea.id = 'os-tapper-area';
        tapArea.className = 'os-tapper-box';
        tapArea.textContent = 'TAP SPACE OR CLICK';
        tapArea.onmousedown = (e) => {
            e.preventDefault();
            handleTapLogic();
        };

        const btnRow = document.createElement('div');
        btnRow.className = 'os-tapper-btns';

        const applyBtn = document.createElement('button');
        applyBtn.id = 'os-tapper-apply';
        applyBtn.className = 'os-tapper-btn';
        applyBtn.textContent = 'Apply';
        applyBtn.onclick = () => {
            const bpmInput = document.getElementById('bpm');
            if (bpmInput && currentBpm > 0) {
                bpmInput.value = currentBpm;
                bpmInput.dispatchEvent(new Event('input', { bubbles: true }));
                bpmInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
            container.style.display = 'none';
        };

        const resetBtn = document.createElement('button');
        resetBtn.id = 'os-tapper-reset';
        resetBtn.className = 'os-tapper-btn secondary';
        resetBtn.textContent = 'Reset';
        resetBtn.onclick = () => {
            taps = []; currentBpm = 0;
            valDisplay.innerText = '000';
        };

        btnRow.append(applyBtn, resetBtn);
        container.append(titleBar, valDisplay, bpmLabel, tapArea, btnRow);
        document.body.appendChild(container);

        window.addEventListener('keydown', (e) => {
            if (container.style.display === 'flex' && e.code === 'Space') {
                e.preventDefault();
                handleTapLogic();
            }
        });
    }

    const checkExist = setInterval(() => {
        const toolbar = document.querySelector('#toolbar_element');
        if (toolbar) {
            createTapperUI();
            if (!document.getElementById('btn_bpm_tapper')) {
                const tapBtn = document.createElement('div');
                tapBtn.id = 'btn_bpm_tapper';

                const tapSpan = document.createElement('span');
                tapSpan.style.cssText = "color: #eee; font-size: 11px; font-weight: normal;";
                tapSpan.textContent = 'TAP';
                tapBtn.appendChild(tapSpan);

                const bpmLabel = document.querySelector('.box_label');
                if (bpmLabel) bpmLabel.after(tapBtn);

                tapBtn.onclick = () => {
                    const container = document.getElementById('os-tapper-container');
                    const isVisible = container.style.display === 'flex';
                    container.style.display = isVisible ? 'none' : 'flex';

                    const rect = tapBtn.getBoundingClientRect();
                    container.style.left = (rect.left - 100) + 'px';
                    container.style.top = (rect.bottom + 10) + 'px';
                };
            }
            clearInterval(checkExist);
        }
    }, 500);
})();
