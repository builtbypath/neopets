// ==UserScript==
// @name         Redirect Impress-2020 to DTI Using Username
// @namespace    https://github.com/builtbypath/neopets
// @version      1.1
// @description  Redirects impress-2020.openneo.net user pages to correct impress.openneo.net URLs by extracting username from <h1>
// @match        *://impress-2020.openneo.net/user/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Wait for the page to load (in case of delayed render)
  const interval = setInterval(() => {
    const header = document.querySelector('h1.chakra-heading');

    if (header && header.textContent.includes("'s")) {
      clearInterval(interval);

      // Extract user ID from the URL
      const match = window.location.pathname.match(/\/user\/(\d+)/);
      if (!match) return;
      const userId = match[1];

      // Extract username from the header text
      const raw = header.textContent.trim(); // e.g., "Sarabear's lists"
      const username = raw.split("'s")[0];

      // Build new URL and redirect
      const newUrl = `https://impress.openneo.net/user/${userId}-${username}/closet`;
      window.location.replace(newUrl);
    }
  }, 100); // Check every 100ms
})();
