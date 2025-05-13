
import { LanguageCode } from '../types';

type MinimalTranslations = {
  [key in LanguageCode]?: Record<string, string | Record<string, any>>;
};

// Basic translations for languages without full translation files
const minimalTranslations: MinimalTranslations = {
  zh: {
    app: {
      title: "滚动公正",
      loading: "加载中...",
      error: "错误",
    },
  },
  ar: {
    app: {
      title: "عدالة السكرول",
      loading: "جار التحميل...",
      error: "خطأ",
    },
  },
  hi: {
    app: {
      title: "स्क्रॉल जस्टिस",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
    },
  },
  pt: {
    app: {
      title: "Justiça de Rolagem",
      loading: "Carregando...",
      error: "Erro",
    },
  },
  he: {
    app: {
      title: "צדק הגלילה",
      loading: "טוען...",
      error: "שגיאה",
    },
  },
  sw: {
    app: {
      title: "Haki ya Scroll",
      loading: "Inapakia...",
      error: "Hitilafu",
    },
  },
  am: {
    app: {
      title: "ስክሮል ፍትህ",
      loading: "በመጫን ላይ...",
      error: "ስህተት",
    },
  },
};

export default minimalTranslations;
