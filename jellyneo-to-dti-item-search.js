// ==UserScript==
// @name         Jellyneo to DTI Item Search
// @namespace    https://github.com/builtbypath/neopets
// @version      1.0
// @description  Highlight text on Jellyneo to search on Dress to Impress
// @match        https://items.jellyneo.net/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let selectedText = "";

    // Create the search icon
    const icon = document.createElement("div");
    icon.innerHTML = "🔍";
    icon.title = "Search on Dress to Impress";
    icon.style.position = "absolute";
    icon.style.zIndex = "9999";
    icon.style.fontSize = "20px";
    icon.style.cursor = "pointer";
    icon.style.background = "#fceaff";
    icon.style.border = "2px solid #c47aff";
    icon.style.borderRadius = "8px";
    icon.style.padding = "6px";
    icon.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
    icon.style.userSelect = "none";
    icon.style.display = "none";

    document.body.appendChild(icon);

    // Show icon when text is selected
    document.addEventListener("mouseup", function (e) {
        const text = window.getSelection().toString().trim();
        if (text.length > 0) {
            selectedText = text;
            icon.style.top = (e.pageY + 10) + "px";
            icon.style.left = (e.pageX + 10) + "px";
            icon.title = `Search "${selectedText}" on DTI`;
            icon.style.display = "block";
        } else {
            icon.style.display = "none";
        }
    });

    // Prevent deselection before click
    icon.addEventListener("mousedown", function (e) {
        e.preventDefault();
    });

    // Go to DTI search
    icon.addEventListener("click", function () {
        if (selectedText) {
            const searchUrl = `https://impress.openneo.net/items?q=${encodeURIComponent(selectedText)}`;
            window.open(searchUrl, '_blank');
            icon.style.display = "none";
        }
    });

    // Hide on scroll
    document.addEventListener("scroll", () => icon.style.display = "none");
})();
