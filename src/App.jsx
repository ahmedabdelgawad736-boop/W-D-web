import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './ThemeContext/ThemeContext';
import { LanguageProvider } from './Translation/LanguageContext';
import LandingPage from './Pages/LandingPage';
import Form from './Pages/Form';

/* The project has no router dependency: navigation is hash based
   (e.g. "#about" scrolls to a landing page section). "#/quote" opens the
   dedicated quote request form page, everything else shows the landing page. */
const getRoute = () =>
  typeof window !== 'undefined' && window.location.hash.startsWith('#/quote') ? 'quote' : 'home';

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHashChange = () => {
      const next = getRoute();
      setRoute((prev) => {
        if (prev !== next) window.scrollTo({ top: 0 });
        return next;
      });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        {route === 'quote' ? <Form /> : <LandingPage />}
      </LanguageProvider>
    </ThemeProvider>
  );
}
