import React from 'react';
import { ThemeProvider } from './ThemeContext/ThemeContext';
import { LanguageProvider } from './Translation/LanguageContext';
import LandingPage from './Pages/LandingPage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LandingPage />
      </LanguageProvider>
    </ThemeProvider>
  );
}
