import I18n from 'react-native-i18n';

// Import all locales
import en from './locales/en.json';
import vi from './locales/vi.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
  vi
};

// The method we'll use instead of a regular string
export function getLabel(name, params = {}) {
  return I18n.t(name, params);
};

export default I18n;