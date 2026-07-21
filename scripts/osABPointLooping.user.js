// ==UserScript==
// @name        Online Sequencer AB-Point Looping!
// @namespace   Meowmeowmeowmeowmeow.org
// @version     2026.7.21.1
//
// @match       https://onlinesequencer.net/*
// @grant       none
//
// @author      LastieOS
// @description A little userscript to add AB Point-Looping to OS!

// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osABPointLooping.user.js
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/scripts/osABPointLooping.user.js
// ==/UserScript==

/* ----------------------------------------------------------------------------------------------------------------------


                                       hi hi! Thamks for using my userscript :3.

                                             Instructons on how to use:
                 Basically just shift-click on one spot of a measure for point A, and another spot for point B.
                   In order to stop the AB-loop, you simply need to shift-click on the measure bar again :P




                                    Don't touchy unless you know what you're doing :3

    ----------------------------------------------------------------------------------------------------------------------*/

(function () {

    let ABLoopPoints = {
        a: null,
        b: null,
        active: false
    };

    const workerCode = `setInterval(() => postMessage('tick'), 16);`;
    const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
    const workerClock = new Worker(URL.createObjectURL(workerBlob));

    workerClock.onmessage = function (event) {
        if (event.data === 'tick' && ABLoopPoints.active && ABLoopPoints.a !== null && ABLoopPoints.b !== null && playTime >= ABLoopPoints.b) {
            playTime = ABLoopPoints.a;
        }
    };

    const measures = document.querySelector('#sequencer_timeline_measures');

    measures.addEventListener('click', function (event) {
        if (!event.shiftKey) { return }

        const measureElement = event.target.closest('.measure');
        if (!measureElement) { return }

        event.preventDefault();

        const preciseTime = lastPlayTime;

        if (preciseTime > song.loopTime) { return }

        if (ABLoopPoints.a === null) {
            song.stop();
            ABLoopPoints.a = preciseTime;
            ABLoopPoints.active = false;

            message('Point A set', 1, true)


        } else if (ABLoopPoints.b === null) {
            if (preciseTime <= ABLoopPoints.a) { return }

            song.stop();
            ABLoopPoints.b = preciseTime;
            ABLoopPoints.active = true;

            message('Point B set', 1, true)

        } else {
            ABLoopPoints.a = null;
            ABLoopPoints.b = null;
            ABLoopPoints.active = false;

            message('AB loop off', 1, true)
        }
    });

    window.addEventListener("beforeunload", () => {
        workerClock.terminate();
    });
}());
