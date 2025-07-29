// ==UserScript==
// @name         Neopets Copy Username Icon
// @namespace    https://github.com/builtbypath/neopets
// @version      1.2
// @description  Show a clipboard icon next to usernames on userlookup links and copy to clipboard on click
// @author       You
// @match        https://www.neopets.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    // Create the icon element
    const createCopyIcon = (username) => {
        const icon = document.createElement('div');
        icon.textContent = '📋';
        icon.title = `Copy username: ${username}`;
        icon.style.cssText = `
            position: absolute;
            background: #d6d3f9;
            border: 2px solid #aaa;
            border-radius: 8px;
            padding: 3px 6px;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            z-index: 10000;
            transition: opacity 0.2s;
        `;

        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(username).then(() => {
                icon.textContent = '✅';
                setTimeout(() => {
                    icon.textContent = '📋';
                }, 1000);
            });
        });

        return icon;
    };

    document.addEventListener('mouseover', function (e) {
        const link = e.target.closest('a[href*="userlookup.phtml?user="]');
        if (!link) return;

        const usernameMatch = link.href.match(/user=([^&]+)/);
        if (!usernameMatch) return;
        const username = usernameMatch[1];

        if (link.dataset.copyAttached) return;
        link.dataset.copyAttached = 'true';

        const icon = createCopyIcon(username);
        document.body.appendChild(icon);

        const showIcon = () => {
            const rect = link.getBoundingClientRect();
            icon.style.top = `${window.scrollY + rect.top}px`;
            icon.style.left = `${window.scrollX + rect.right + 6}px`;
            icon.style.display = 'block';
        };

        const hideIcon = () => {
            icon.style.display = 'none';
        };

        let hideTimeout;

        link.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            showIcon();
        });

        link.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(hideIcon, 300);
        });

        icon.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });

        icon.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(hideIcon, 300);
        });
    });
})();
