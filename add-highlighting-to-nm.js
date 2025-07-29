// ==UserScript==
// @name         Neomail Enhancer: Status + NC Subject Highlighter
// @namespace    https://github.com/builtbypath/neopets
// @version      1.2
// @description  Highlights Neomail status cells and specific Neocash gift subjects
// @match        https://www.neopets.com/neomessages.phtml*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("📬 Neomail enhancer script is running");

    function highlightAndAlignStatusCells() {
        const cells = document.querySelectorAll('td.medText[align="right"]');
        cells.forEach(cell => {
            const text = cell.textContent.trim();
            if (text === "Replied" || text === "Read") {
                cell.style.backgroundColor = text === "Replied" ? "#d6f5d6" : "#fffac8";
                cell.style.color = "black";
                cell.align = "left";
                cell.innerHTML = `<div style="text-align: left;">${text}</div>`;
            }
        });
    }

    function highlightNCSubjectRows() {
        const links = document.querySelectorAll('a[href*="neomessages.phtml?type=read_message"]');
        links.forEach(link => {
            const text = link.textContent.trim();
            if (text === "Neocash Item Gift" || text === "Neocash Item Gift Status: Received") {
                const td = link.closest('td');
                if (td) {
                    td.style.backgroundColor = "#ffe5e5"; // soft red
                    td.style.color = "black";
                }
            }
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            highlightAndAlignStatusCells();
            highlightNCSubjectRows();
        }, 500);
    });
})();
