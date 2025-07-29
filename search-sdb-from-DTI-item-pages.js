// ==UserScript==
// @name         DTI Item Page → SDB Search Button (Persistent)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds an SDB 🔍 button next to the item name on DTI item pages, and keeps it there even after TL edits or soft reloads.
// @author       You
// @match        https://impress.openneo.net/items/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function insertButtonIfNeeded() {
    const nameElement = document.querySelector('h2.item-name');
    if (!nameElement || nameElement.querySelector('.sdb-search-button')) return;

    const itemName = nameElement.textContent.trim();
    if (!itemName) return;

    const sdbUrl = `https://www.neopets.com/safetydeposit.phtml?obj_name=${encodeURIComponent(itemName)}&category=0`;

    const button = document.createElement('span');
    button.textContent = ' 🔍';
    button.className = 'sdb-search-button';
    button.title = `Search "${itemName}" in your SDB`;
    button.style.marginLeft = '10px';
    button.style.cursor = 'pointer';
    button.style.background = '#ffe066';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '6px';
    button.style.padding = '2px 6px';
    button.style.fontSize = '16px';
    button.style.userSelect = 'none';

    button.addEventListener('click', () => {
      window.open(sdbUrl, '_blank');
    });

    nameElement.appendChild(button);
  }

  // Run initially and on changes
  const observer = new MutationObserver(() => {
    insertButtonIfNeeded();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Run just in case
  window.addEventListener('load', insertButtonIfNeeded);
  setTimeout(insertButtonIfNeeded, 1000);
})();
