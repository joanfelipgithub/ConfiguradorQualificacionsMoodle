// ==UserScript==
// @name         Overlay Text Box with ID Extraction
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a big overlay text box on the page and extracts [[...]] IDs
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Check if overlay already exists
    if (document.getElementById('myOverlayTextBox')) return;

    // Create overlay div
    const overlay = document.createElement('div');
    overlay.id = 'myOverlayTextBox';
    overlay.style.position = 'fixed';
    overlay.style.top = '50px';
    overlay.style.left = '50px';
    overlay.style.width = '600px';
    overlay.style.height = '400px';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    overlay.style.zIndex = 10000;
    overlay.style.border = '2px solid #fff';
    overlay.style.borderRadius = '8px';
    overlay.style.padding = '10px';
    overlay.style.boxShadow = '0 0 10px #000';
    overlay.style.resize = 'both';
    overlay.style.overflow = 'auto';

    // Create textarea inside overlay
    const textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '100%';
    textarea.style.background = 'transparent';
    textarea.style.color = 'white';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.fontSize = '16px';
    textarea.placeholder = 'Paste your lines here...';

    overlay.appendChild(textarea);
    document.body.appendChild(overlay);

    // Make overlay draggable
    let isDragging = false;
    let offsetX, offsetY;

    overlay.addEventListener('mousedown', function(e) {
        if (e.target !== textarea) {
            isDragging = true;
            offsetX = e.clientX - overlay.offsetLeft;
            offsetY = e.clientY - overlay.offsetTop;
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            overlay.style.left = (e.clientX - offsetX) + 'px';
            overlay.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Close overlay with Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            overlay.remove();
        }
    });

    // Extract IDs from textarea when content changes
    textarea.addEventListener('input', function() {
        const text = textarea.value;
        // Match [[...]] including brackets
        const id_activity = [...text.matchAll(/\[\[.*?\]\]/g)].map(m => m[0]);
        console.log('Extracted IDs:', id_activity);
        // You can now use `id_activity` as needed
    });

})();
