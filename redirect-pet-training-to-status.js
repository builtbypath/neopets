// ==UserScript==
// @name         Redirect Training & Academy Pages to Status View
// @namespace    https://github.com/builtbypath/neopets
// @version      1.2
// @description  Redirects training and academy pages to their ?type=status view by default on Neopets
// @author       You
// @match        https://www.neopets.com/island/training.phtml*
// @match        https://www.neopets.com/island/process_training.phtml*
// @match        https://www.neopets.com/pirates/academy.phtml*
// @match        https://www.neopets.com/pirates/process_academy.phtml*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  const redirects = [
    {
      matchPath: '/island/training.phtml',
      exact: true,
      redirectTo: 'https://www.neopets.com/island/training.phtml?type=status',
      onlyIfNoParams: true
    },
    {
      matchPath: '/island/process_training.phtml',
      redirectTo: 'https://www.neopets.com/island/training.phtml?type=status'
    },
    {
      matchPath: '/pirates/academy.phtml',
      exact: true,
      redirectTo: 'https://www.neopets.com/pirates/academy.phtml?type=status',
      onlyIfNoParams: true
    },
    {
      matchPath: '/pirates/process_academy.phtml',
      redirectTo: 'https://www.neopets.com/pirates/academy.phtml?type=status'
    }
  ];

  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;

  for (const rule of redirects) {
    if (
      currentPath === rule.matchPath &&
      (!rule.onlyIfNoParams || currentSearch === '')
    ) {
      window.location.replace(rule.redirectTo);
      break;
    }
  }
})();
