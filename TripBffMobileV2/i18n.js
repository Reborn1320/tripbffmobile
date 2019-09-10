// Import all locales
import en from './locales/en.json';
import vi from './locales/vi.json';
  
import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

i18n
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',

    resources: {
      en: en,
      vi: vi
    },

    //debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },
  });

export function getLabel(name, params = {}) {
  return i18n.t(name, params);
};

export default i18n;
