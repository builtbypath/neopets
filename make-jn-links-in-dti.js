// ==UserScript==
// @name         Converts JN wishlists to links in DTI
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Converts Jellyneo wishlist text to clickable links in the "Trading Info" section on DTI closet pages only where expected
// @author       You
// @match        *://impress.openneo.net/user/*/closet*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const container = document.querySelector('#closet-list-358363 .closet-list-content');
  const jellyneoRegex = /(?:https?:\/\/)?items\.jellyneo\.net\/mywishes\/[\w-]+\/\d{5,}/gi;

  function linkifyNode(node) {
    const text = node.textContent;
    if (!jellyneoRegex.test(text)) return;

    const span = document.createElement("span");
    let lastIndex = 0;

    text.replace(jellyneoRegex, (match, offset) => {
      // Add text before the match
      span.appendChild(document.createTextNode(text.slice(lastIndex, offset)));

      // Create clickable link
      const url = match.startsWith("http") ? match : "https://" + match;
      const a = document.createElement("a");
      a.href = url;
      a.textContent = match;
      a.target = "_blank";
      a.style.color = "#1a73e8";
      a.style.textDecoration = "underline";

      span.appendChild(a);
      lastIndex = offset + match.length;
    });

    // Add remaining text
    span.appendChild(document.createTextNode(text.slice(lastIndex)));
    node.replaceWith(span);
  }

  function linkifyClosetList() {
    if (!container) return;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(linkifyNode);
  }

  // Run on initial load
  linkifyClosetList();
})();
