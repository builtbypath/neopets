// ==UserScript==
// @name         Neopets - Mark Books Read (Auto Update)
// @version      2025-07-27
// @description  Automatically fetch books read and mark them in inventory, shops, SDB, etc.
// @author       senerio + GPT, modified by https://github.com/builtbypath/neopets to auto-update (versus manually checking site)
// @match        *://*.neopets.com/*
// @connect      itemdb.com.br
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  // ==== SET YOUR PET'S NAME HERE ====
  const petName = 'PETNAMEHERE';

  // ===== STORAGE UTILITIES =====
  const booksReadStorage = {
    key: 'np_booksread',
    get: () => JSON.parse(localStorage.getItem('np_booksread')) || {},
    set: (arr) => {
      const books = booksReadStorage.get();
      arr.forEach(i => {
        if (!i.append) books[i.key] = [];
        (books[i.key] ??= []).push(...i.books);
      });
      localStorage.setItem('np_booksread', JSON.stringify(books));
    },
    all: () => {
      const books = booksReadStorage.get();
      return [...(books.neopian || []), ...(books.booktastic || [])];
    }
  };

  // ===== ITEMDB FETCH =====
  function itemdbGetItemName(imageIds) {
    return new Promise((resolve, reject) => {
      if (imageIds.length === 0) return resolve([]);
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://itemdb.com.br/api/v1/items/many',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ image_id: imageIds }),
        onload: (res) => {
          if (res.status === 200) {
            const itemData = [];
            Object.entries(JSON.parse(res.responseText)).forEach(([k, v]) => {
              itemData.push(v.name);
            });
            resolve(itemData);
          } else {
            console.error('[itemdb] Failed to fetch item data', res);
            reject(res);
          }
        },
        onerror: reject
      });
    });
  }

  // ===== AUTO FETCH FUNCTION =====
  function autoFetchBooks(petName) {
    const urls = [
      { url: `https://www.neopets.com/books_read.phtml?pet_name=${petName}`, type: 'neopian' },
      { url: `https://www.neopets.com/moon/books_read.phtml?pet_name=${petName}`, type: 'booktastic' }
    ];

    urls.forEach(({ url, type }) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: async (response) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, "text/html");

          let booksOnPage = [];
          if (type === 'neopian') {
            doc.querySelectorAll("table tr:not(:first-child) td:last-child").forEach(td => {
              booksOnPage.push(td.textContent.split(': \u00a0')[0].trim());
            });
            booksReadStorage.set([{ books: booksOnPage, key: 'neopian', append: false }]);
          } else if (type === 'booktastic') {
            const booksImg = [];
            doc.querySelectorAll("table tr:not(:first-child) img").forEach(img => {
              const match = img.src.match(/.*\/(.*)\..*/);
              if (match) booksImg.push(match[1]);
            });
            const booksStored = booksReadStorage.get();
            const newBooks = booksImg.filter(i => !booksStored.booktasticImg?.includes(i));
            const names = await itemdbGetItemName(newBooks);
            booksReadStorage.set([
              { books: booksImg, key: 'booktasticImg', append: false },
              { books: names, key: 'booktastic', append: true }
            ]);
          }

          console.log(`[AutoFetch] Updated ${type} books`);
        },
        onerror: (err) => {
          console.error(`[AutoFetch] Failed to fetch ${type} books`, err);
        }
      });
    });
  }

  // ===== MARK READ BOOKS =====
  function markBooks() {
    const books = booksReadStorage.all();
    const selectors = [
      '.item-name',
      'a[href*=buy_item] + br + b',
      '.content form>table tr:not(:first-child):not(:last-child) td:nth-child(2) > b',
      'form[name=quickstock] tr:not(:nth-last-child(2)) td:first-child:not([colspan])',
      '.content a[href*=auction_id]:not(:has(img))',
      '.contentModule:has(td.contentModuleHeader:contains("Books")) .contentModuleContent .item-title',
      '.jnflex-grid p a.no-link-icon:nth-of-type(2)'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel)?.forEach(el => {
        const name = el.textContent.split('(')[0].trim();
        if (books.includes(name)) {
          el.style.textDecoration = 'line-through';
          el.parentElement.style.opacity = '0.5';
          if (el.closest('tr')) {
            const img = el.closest('tr').querySelector('img');
            if (img) img.style.opacity = '0.5';
          }
        }
      });
    });
  }

  // ===== MAIN =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      autoFetchBooks(petName);
      markBooks();
    });
  } else {
    autoFetchBooks(petName);
    markBooks();
  }

})();
