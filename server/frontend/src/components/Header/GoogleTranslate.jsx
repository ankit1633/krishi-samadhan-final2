// GoogleTranslator.tsx

import { useEffect } from 'react';

const GoogleTranslator = ({ show }: { show: boolean }) => {
    useEffect(() => {
        if (show) {
            // Check if the initialization function already exists
            if (!window.googleTranslateElementInit) {
                window.googleTranslateElementInit = () => {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en',
                            includedLanguages: 'en,es,fr,de,it,hi,ta,te,ml,kn,gu,pa,or,bn,as,ur,mr',
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        },
                        'google_translate_element',
                    );
                };
            }

            // Load the Google Translate script only if it's not already loaded
            if (!document.querySelector('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]')) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                script.async = true;
                document.body.appendChild(script);
            }

            // Add styles for the translation element
            if (!document.querySelector("style[data-google-translate-style]")) {
                const style = document.createElement('style');
                style.setAttribute('data-google-translate-style', 'true');
                style.innerHTML = `
                    .goog-te-gadget-simple {background-color:#FFF; border:none; font-size:11px;}
                    .goog-te-gadget-simple img {display:none;}
                `;
                document.head.appendChild(style);
            }
        }
    }, [show]);

    return show ? <div id="google_translate_element"></div> : null;
};

export default GoogleTranslator;
