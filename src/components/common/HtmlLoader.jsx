import React, { useEffect } from 'react';

const HtmlLoader = ({ file }) => {
    useEffect(() => {
        const url = window.location.href;

        // CSS Preloader
        const loadCSS = (href) => {
            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });
        };

        // Get HTML
        const loadContent = async () => {
            try {
                const response = await fetch(file);
                const html = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const linkTags = doc.querySelectorAll('link[rel="stylesheet"][href]');
                const cssHrefs = Array.from(linkTags).map(link => link.getAttribute('href'));
                
                // Load all
                await Promise.all(cssHrefs.map(loadCSS));

                // Replace document
                document.open();
                document.write(html);
                document.close();
            } catch (error) {
                console.error('Error loading HTML:', error);
            }
        };
        
        loadContent();
    }, [file]);

    return null;
};

export default HtmlLoader;