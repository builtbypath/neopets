// ==UserScript==
// @name         Neoboard Minimum Font Size (12pt)
// @namespace    http://your.homepage/
// @version      1.0
// @description  Enforce minimum font size of 12pt on Neopets Neoboards
// @match        https://www.neopets.com/neoboards/topic.phtml?topic=*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
  GM_addStyle(`
    * {
      /* Force minimum 12pt (~16px) font size */
      font-size: min(max(0.75rem, 1rem), 100rem) !important;
      /* Explanation: assumes root 16px = 12pt (12/96in = 0.75rem)
         Any element styled smaller than 0.75rem will be bumped up */
    }
  `);
})();
