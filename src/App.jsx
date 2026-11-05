
import './App.css';
import { useCallback, useLayoutEffect, useState } from 'react';


import { Hero } from './components/Hero';
import { MyProject } from './components/MyProject';
import { AboutMe } from './components/AboutMe';
import { ConnectMe } from './components/ConnectMe';
import { Footer } from './components/Footer';
import { useLenisScroll } from './hooks/useLenisScroll';

function App() {
  useLenisScroll();
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = window.localStorage.getItem('portfolio-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (error) {
      console.error('Unable to read the saved portfolio theme.', error);
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#202020' : '#F1EEE8'
    );
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem('portfolio-theme', nextTheme);
      } catch (error) {
        console.error('Unable to save the portfolio theme preference.', error);
      }
      return nextTheme;
    });
  }, []);

  return (
    <>
      <main>
        <Hero theme={theme} onToggleTheme={toggleTheme} />
        <MyProject />
        <AboutMe />
        <ConnectMe />
      </main>
      <Footer />
    </>
  );
}

export default App;
