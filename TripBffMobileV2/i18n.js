// Import all locales
import en from './locales/en.json';
import vi from './locales/vi.json';
  
import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

import { DATE_FORMAT, TIME_FORMAT } from "./src/screens/_services/SystemConstants";
import moment from 'moment';

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
      
      format: function(value, format, lng) {  
        if(value instanceof moment) {    
          let formats = format.split(',');
          format = formats[0] === 'dateFormat' ? DATE_FORMAT : TIME_FORMAT;

          var localLocale = moment(value);
          localLocale.locale(lng);

          return localLocale.format(format);
        }          

        return value;
      },
      formatSeparator: ','
    },
  });  

export function getLabel(name, params = {}) {
  return i18n.t(name, params);
};

export default i18n;
