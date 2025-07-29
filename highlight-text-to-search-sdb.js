// ==UserScript==
// @name         Neopets SDB Search Icon (Fixed)
// @namespace    https://github.com/builtbypath/neopets
// @version      1.4
// @description  Show a yellow magnifying icon when highlighting text on Neopets; click to search it in SDB
// @match        https://www.neopets.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let selectedText = "";

    // Create the search icon
    const icon = document.createElement("div");
    icon.innerHTML = "🔍";
    icon.title = "Search in SDB";
    icon.style.position = "absolute";
    icon.style.zIndex = "9999";
    icon.style.fontSize = "24px";
    icon.style.cursor = "pointer";
    icon.style.background = "#ffdc3b"; // Neopets yellow
    icon.style.border = "3px solid black";
    icon.style.borderRadius = "12px";
    icon.style.padding = "8px";
    icon.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
    icon.style.userSelect = "none";
    icon.style.display = "none";

    document.body.appendChild(icon);

    // Store the selection
    document.addEventListener("mouseup", function (e) {
        const text = window.getSelection().toString().trim();
        if (text.length > 0) {
            selectedText = text;
            icon.style.top = (e.pageY + 10) + "px";
            icon.style.left = (e.pageX + 10) + "px";
            icon.title = `Search "${selectedText}" in SDB`;
            icon.style.display = "block";
        } else {
            icon.style.display = "none";
        }
    });

    // Prevent clearing text selection before click triggers
    icon.addEventListener("mousedown", function (e) {
        e.preventDefault(); // Prevent deselection
    });

    // On click, open the SDB search in a new tab
    icon.addEventListener("click", function () {
        if (selectedText) {
            const sdbUrl = `https://www.neopets.com/safetydeposit.phtml?obj_name=${encodeURIComponent(selectedText)}&category=0`;
            window.open(sdbUrl, '_blank');
            icon.style.display = "none";
        }
    });

    // Optional: hide icon on scroll or new clicks elsewhere
    document.addEventListener("scroll", () => icon.style.display = "none");
})();
