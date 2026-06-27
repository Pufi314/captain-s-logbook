import { createContext, useContext, useState, useCallback } from 'react';
import sk from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const t = useCallback((key) => {
    if (language === 'sk' && sk[key]) return sk[key];
    return key;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'sk' : 'en');
  }, []);

  const translateTitle = useCallback((title) => {
    if (language === 'sk' && title?.startsWith('Sailing trip from ')) {
      return 'Plavba z ' + title.slice(18);
    }
    return title;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, translateTitle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider');
  return ctx;
}
