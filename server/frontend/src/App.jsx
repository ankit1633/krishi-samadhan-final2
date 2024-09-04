// src/App.js
import React from 'react';
import './App.css';
import './i18n'; // Import your i18n configuration
import { CookiesProvider } from 'react-cookie';
import Header from './components/Header/Header';
import Home from './components/home/Home';
import DataProvider from './context/DataProvider';

function App() {
  return (
    <CookiesProvider>
      <div className="App">
        <DataProvider>
          <Header />
          <Home />
        </DataProvider>
      </div>
    </CookiesProvider>
  );
}

export default App;
