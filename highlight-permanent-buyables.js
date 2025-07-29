// ==UserScript==
// @name         Highlight Permanent Buyable (Button Blue Style)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Highlights "Permanent Buyable" to match Neopets button styling (blue background, white bold text)
// @author       You
// @match        *://www.neopets.com/*
// @match        *://impress.openneo.net/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const highlight = () => {
    const xpath = "//text()[contains(., 'Permanent Buyable')]";
    const results = document.evaluate(xpath, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < results.snapshotLength; i++) {
      const node = results.snapshotItem(i);
      const parent = node.parentNode;

      if (parent && !parent.dataset.permBuyHighlight) {
        const span = document.createElement('span');
        span.textContent = node.nodeValue;
        span.style.backgroundColor = '#007cb5'; // match Neopets button blue
        span.style.color = '#ffffff'; // white text
        span.style.fontWeight = 'bold';
        span.style.borderRadius = '6px';
        span.style.padding = '2px 6px';
        span.style.display = 'inline-block';

        span.dataset.permBuyHighlight = 'true';
        parent.replaceChild(span, node);
      }
    }
  };

  const observer = new MutationObserver(highlight);
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('load', highlight);
})();
