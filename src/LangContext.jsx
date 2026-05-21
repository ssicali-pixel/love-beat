import { createContext, useContext, useState } from 'react';
import { STRINGS, WEEKENDS } from './i18n';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');
  const toggle = () => setLang(l => l === 'en' ? 'it' : 'en');
  return (
    <LangContext.Provider value={{ lang, t: STRINGS[lang], weekends: WEEKENDS[lang], toggle, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
