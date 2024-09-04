// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18n instance
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .use(HttpApi) // Loads translations from your backend
  .use(LanguageDetector) // Detects user language
  .init({
    debug: true, // Enable debug mode
    supportedLngs: ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'or', 'pa'],
    fallbackLng: 'en', // Default language if user language is not supported
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'], // Order of language detection
      caches: ['cookie', 'localStorage'], // Caches to store language
    },
    backend: {
      loadPath: './assests/locales/{{lng}}/translation.json', // Path to translation files
    },
    react: {
      useSuspense: false, // Enable if using Suspense
    },
    // Additional debug configuration
    initImmediate: false, // Ensure initialization happens immediately
  });

// Custom debugging
i18n.on('debug', (msg) => {
  console.log('i18next debug:', msg); // Custom debug output
});

i18n.on('error', (error) => {
  console.error('i18next error:', error); // Log any errors
});

export default i18n;
