// ==UserScript==
// @name         OS Midi Map Fix
// @icon         https://github.com/Lastie-OS/os-userscripts/blob/main/icon.png?raw=true
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixes the OS Midi Export by setting the midiInstrumentMap variable to match General MIDI standards (1-128)
// @author       Lastie
// @match        *://*.onlinesequencer.net/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osMidiMapFix.user.js
// @downloadURL  https://github.com/Lastie-OS/os-userscripts/raw/refs/heads/main/osMidiMapFix.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Updated Map based on GM 1-128 standards
    const newMap = [
        5,   // Elec. Piano (Classic) -> Electric Piano 1
        26,  // Acoustic Gtr (Classic) -> Acoustic Guitar (steel)
        1,   // Drum Kit -> Standard Kit (GM Program 1 on Ch 10)
        91,  // Smooth Synth (Classic) -> Polysynth Pad
        28,  // Electric Guitar -> Electric Guitar (clean)
        34,  // Bass Guitar (Classic) -> Electric Bass (finger)
        85,  // Synth Pluck -> Lead 5 (charang)
        104, // Scifi -> FX 8 (sci-fi)
        1,   // Grand Piano (Classic) -> Acoustic Grand Piano
        61,  // French Horn (Classic) -> French Horn
        58,  // Trombone (Classic) -> Trombone
        41,  // Violin (Classic) -> Violin
        43,  // Cello (Classic) -> Cello
        81,  // 8-Bit Sine -> Lead 1 (square)
        81,  // 8-Bit Square -> Lead 1 (square)
        82,  // 8-Bit Sawtooth -> Lead 2 (sawtooth)
        81,  // 8-Bit Triangle -> Lead 1 (square/sub)
        7,   // Harpsichord -> Harpsichord
        47,  // Concert Harp -> Orchestral Harp
        14,  // Xylophone -> Xylophone
        46,  // Pizzicato -> Pizzicato Strings
        115, // Steel Drums -> Steel Drums
        105, // Sitar -> Sitar
        74,  // Flute -> Flute
        67,  // Saxophone -> Tenor Sax
        4,   // Ragtime Piano -> Honky-tonk Piano
        11,  // Music Box -> Music Box
        39,  // Synth Bass (Classic) -> Synth Bass 1
        20,  // Church Organ -> Church Organ
        37,  // Slap Bass -> Slap Bass 1
        89,  // Pop Synth (Classic) -> Pad 1 (new age)
        119, // Electric Drum Kit -> Synth Drum
        27,  // Jazz Guitar -> Electric Guitar (jazz)
        108, // Koto -> Koto
        12,  // Vibraphone -> Vibraphone
        29,  // Muted E-Guitar -> Electric Guitar (muted)
        1,   // 808 Drum Kit -> Standard Kit (Fallback)
        39,  // 808 Bass -> Synth Bass 1
        31,  // Dist. Guitar (Classic) -> Distortion Guitar
        1,   // 8-Bit Drum Kit -> Standard Kit (Fallback)
        1,   // 2013 Drum Kit -> Standard Kit (Fallback)
        1,   // Grand Piano -> Acoustic Grand Piano
        1,   // 909 Drum Kit -> Standard Kit (Fallback)
        6,   // Electric Piano -> Electric Piano 2
        31,  // Distortion Guitar -> Distortion Guitar
        43,  // Cello -> Cello
        41,  // Violin -> Violin
        49,  // Strings -> String Ensemble 1
        33,  // Bass -> Acoustic Bass
        28,  // Clean Guitar -> Electric Guitar (clean)
        61,  // French Horn -> French Horn
        58,  // Trombone -> Trombone
        91,  // Smooth Synth -> Polysynth Pad
        1,   // 2023 Drum Kit -> Standard Kit (Fallback)
        34,  // Bass Guitar -> Electric Bass (finger)
        91,  // Synthesizer -> 91 Pad 3 (polysynth)
        40,  // Synth Bass -> Synth Bass 2
        91,  // Pop Synth -> Polysynth Pad
        25,  // Acoustic Guitar -> Acoustic Guitar (nylon)
        53,  // Lucent Choir -> Choir Aahs
        1,   // EDM Kit (E) -> Standard Kit (Fallback)
        62,  // Brass -> Brass Section
        5    // Rhodes -> Electric Piano 1
    ];

    function applyMidiSettings() {
        if (window.settings) {
            window.settings.midiInstrumentMap = newMap;
            console.log("MIDI Instrument Map has been updated to GM standards.");
        } else {
            console.log("Settings object not found yet, retrying...");
            setTimeout(applyMidiSettings, 1000);
        }
    }

    applyMidiSettings();
})();
