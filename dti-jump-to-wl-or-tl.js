// ==UserScript==
// @name         DTI: Wishlist + Jump to Compare Button
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Adds floating Wishlist and Back buttons to DTI user pages. "Back to Top" now jumps to the "Compare with Your Items" section for precise navigation. Clean styling, no text shadow, instant anchor jumps included.
// @author       You
// @match        https://impress.openneo.net/user/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function addFloatingButtons() {
    const match = window.location.pathname.match(/\/user\/(\d+)-?([\w_-]*)?/);
    if (!match) return;

    const userId = match[1];
    const username = match[2];
    const userSlug = username ? `${userId}-${username}` : `${userId}`;
    const wishlistURL = `https://impress.openneo.net/user/${userSlug}/closet#closet-hangers-group-false`;

    const createButton = ({ id, label, top, bgColor, hoverColor, onClick }) => {
      if (document.querySelector(`#${id}`)) return;

      const btn = document.createElement('button');
      btn.id = id;
      btn.textContent = label;

      Object.assign(btn.style, {
        position: 'fixed',
        top: `${top}px`,
        right: '20px',
        backgroundColor: bgColor,
        color: '#000',
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        textShadow: 'none',
        zIndex: '99999',
        cursor: 'pointer'
      });

      btn.addEventListener('mouseenter', function () {
        this.style.backgroundColor = hoverColor;
      });

      btn.addEventListener('mouseleave', function () {
        this.style.backgroundColor = bgColor;
      });

      btn.addEventListener('click', onClick);

      document.body.appendChild(btn);
    };

    // ⭐ Wishlist button
    createButton({
      id: 'floating-wishlist-button',
      label: '⭐ Wishlist',
      top: 50,
      bgColor: '#FFD700',
      hoverColor: '#FFC300',
      onClick: (e) => {
        e.preventDefault();
        window.location.replace(wishlistURL);
      }
    });

    // ⬆️ Back to Compare button
    createButton({
      id: 'floating-top-button',
      label: '⬆️ Back to TL',
      top: 110,
      bgColor: '#3399FF',
      hoverColor: '#1e88e5',
      onClick: (e) => {
        e.preventDefault();
        const target = document.getElementById('toggle-compare');
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFloatingButtons);
  } else {
    addFloatingButtons();
  }
})();
