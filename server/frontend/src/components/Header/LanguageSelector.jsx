import React, { useState, useEffect, startTransition } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import i18next from 'i18next';

const lngs = [
  { code: 'en', name: 'English', country_code: 'gb' },
  { code: 'hi', name: 'हिन्दी', country_code: 'in' },
  { code: 'bn', name: 'বাংলা', country_code: 'in' },
  { code: 'te', name: 'తెలుగు', country_code: 'in' },
  { code: 'mr', name: 'मराठी', country_code: 'in' },
  { code: 'ta', name: 'தமிழ்', country_code: 'in' },
  { code: 'gu', name: 'ગુજરાતી', country_code: 'in' },
  { code: 'kn', name: 'ಕನ್ನಡ', country_code: 'in' },
  { code: 'ml', name: 'മലയാളം', country_code: 'in' },
  { code: 'or', name: 'ଓଡ଼ିଆ', country_code: 'in' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', country_code: 'in' },
];

const LanguageSelector = () => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  };

  const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  };

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const cookieLanguage = getCookie('i18next');
    return cookieLanguage || 'en';
  });

  useEffect(() => {
    i18next.changeLanguage(selectedLanguage).catch((error) => {
      console.error('Failed to change language:', error);
    });
  }, [selectedLanguage]);

  const changeLng = (e) => {
    const newLanguage = e.target.value;
    startTransition(() => {
      setSelectedLanguage(newLanguage);
      setCookie('i18next', newLanguage, 365);
    });
  };
//hiasdas
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="language-label">Language</InputLabel>
        <Select
          labelId="language-label"
          id="language-select"
          value={selectedLanguage}
          onChange={changeLng}
          label="Language"
          aria-label="Select language"
        >
          {lngs.map((lng) => (
            <MenuItem
              value={lng.code}
              key={lng.code}
              disabled={selectedLanguage === lng.code}
            >
              {lng.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
