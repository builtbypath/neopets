// ==UserScript==
// @name         Neopets: Make Neoboard Links Clickable (Extended)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Makes DTI, Jellyneo, Petpages, Userlookups, Gallery, and full Neopets URLs (including query strings) clickable on Neoboards, even if not already hyperlinked.
// @author       Nyu + ChatGPT
// @match        *://*.neopets.com/neoboards/topic.phtml?topic=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const posts = document.getElementsByClassName("boardPostMessage");

    // Updated regex to include optional query strings (e.g., ?gu=araeofhope)
    const regex = /\b(?:https?:\/\/)?(?:(?:impress(?:-\d+)?\.openneo\.net|items\.jellyneo\.net|jellyneo\.net)\/[^\s<>"']+|www\.neopets\.com\/(?:~[\w\d_\-]+|[\w\d_\-\/]*(?:\?[^\s<>"']*)?))/gi;

    for (const post of posts) {
        const walker = document.createTreeWalker(post, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];

        let node;
        while ((node = walker.nextNode())) {
            if (!node.parentNode.closest('a')) {
                textNodes.push(node);
            }
        }

        for (const node of textNodes) {
            const originalText = node.nodeValue;

            const replaced = originalText.replace(regex, (match) => {
                let url = match;
                if (!url.startsWith('http')) {
                    url = 'https://' + url;
                }
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${match}</a>`;
            });

            if (replaced !== originalText) {
                const span = document.createElement('span');
                span.innerHTML = replaced;
                node.parentNode.replaceChild(span, node);
            }
        }
    }
})();
