import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) 
  .init({
    resources: {
      en: {
        translation: {
            'title': 'Money Matters',
            'email': 'EMAIL',
            'password': 'PASSWORD',
            'login': 'LOGIN',
            'emailPlaceHolder': 'Enter your email',
            'passwordPlaceHolder': 'Enter your password',
        },
      },
      te: {
        translation: {
            'title': 'మనీ మేటర్స్',
            'email': 'ఇమెయిల్',
            'password': 'పాస్వర్డ్',
            'login': 'ప్రవేశించండి',
            'emailPlaceHolder': 'మీ ఇమెయిల్‌ను నమోదు చేయండి',
            'passwordPlaceHolder': 'మీ పాస్వర్డ్ ని నమోదుచేయండి',
        },
      },
      hi: {
        translation: {
            'title': 'पैसा माइने रखता है',
            'email': 'ईमेल',
            'password': 'पासवर्ड',
            'login': 'लॉग इन करें',
            'emailPlaceHolder': 'अपना ईमेल दर्ज करें ',
            'passwordPlaceHolder': 'अपना ईमेल दर्ज करें',
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
