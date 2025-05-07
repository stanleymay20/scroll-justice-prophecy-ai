
import { LanguageCode } from '../types';

// Define minimal translations for languages that might not have full translation files
const minimalTranslations: Record<string, Record<string, any>> = {
  zh: {
    app: {
      title: "ScrollJustice.AI",
      tagline: "通过数字卷轴实现神圣正义",
      loading: "正在加载神圣卷轴..."
    },
    nav: {
      home: "首页",
      dashboard: "控制面板",
      precedent: "先例",
      community: "社区",
      profile: "个人资料",
      signin: "登录",
      signout: "登出",
      language: "语言"
    },
    language: {
      select: "选择语言",
      extended: "扩展语言",
      sacred: "神圣语言"
    },
    button: {
      submit: "提交",
      cancel: "取消",
      continue: "继续"
    },
    common: {
      dismiss: "关闭"
    }
  },
  ar: {
    app: {
      title: "ScrollJustice.AI",
      tagline: "العدالة المقدسة من خلال المخطوطات الرقمية",
      loading: "جاري تحميل المخطوطات المقدسة..."
    },
    nav: {
      home: "الرئيسية",
      dashboard: "لوحة التحكم",
      precedent: "السوابق",
      community: "المجتمع",
      profile: "الملف الشخصي",
      signin: "تسجيل الدخول",
      signout: "تسجيل الخروج",
      language: "اللغة"
    },
    language: {
      select: "اختر اللغة",
      extended: "لغات موسعة",
      sacred: "لغات مقدسة"
    },
    button: {
      submit: "إرسال",
      cancel: "إلغاء",
      continue: "متابعة"
    },
    common: {
      dismiss: "إغلاق"
    }
  },
  hi: {
    app: {
      title: "ScrollJustice.AI",
      tagline: "डिजिटल स्क्रॉल के माध्यम से पवित्र न्याय",
      loading: "पवित्र स्क्रॉल लोड हो रहे हैं..."
    },
    nav: {
      home: "होम",
      dashboard: "डैशबोर्ड",
      precedent: "पूर्वोदाहरण",
      community: "समुदाय",
      profile: "प्रोफ़ाइल",
      signin: "साइन इन",
      signout: "साइन आउट",
      language: "भाषा"
    },
    language: {
      select: "भाषा चुनें",
      extended: "विस्तारित भाषाएँ",
      sacred: "पवित्र भाषाएँ"
    },
    button: {
      submit: "जमा करें",
      cancel: "रद्द करें",
      continue: "जारी रखें"
    },
    common: {
      dismiss: "बंद करें"
    }
  },
  pt: {
    app: {
      title: "ScrollJustice.AI",
      tagline: "Justiça sagrada através de pergaminhos digitais",
      loading: "Carregando pergaminhos sagrados..."
    },
    nav: {
      home: "Início",
      dashboard: "Painel",
      precedent: "Precedentes",
      community: "Comunidade",
      profile: "Perfil",
      signin: "Entrar",
      signout: "Sair",
      language: "Idioma"
    },
    language: {
      select: "Selecionar Idioma",
      extended: "Idiomas Estendidos",
      sacred: "Idiomas Sagrados"
    },
    button: {
      submit: "Enviar",
      cancel: "Cancelar",
      continue: "Continuar"
    },
    common: {
      dismiss: "Fechar"
    }
  },
  he: {
    app: {
      title: "ScrollJustice.AI",
      tagline: "צדק קדוש באמצעות מגילות דיגיטליות",
      loading: "טוען מגילות קדושות..."
    },
    nav: {
      home: "ראשי",
      dashboard: "לוח בקרה",
      precedent: "תקדימים",
      community: "קהילה",
      profile: "פרופיל",
      signin: "התחברות",
      signout: "התנתקות",
      language: "שפה"
    },
    language: {
      select: "בחר שפה",
      extended: "שפות מורחבות",
      sacred: "שפות קדושות"
    },
    button: {
      submit: "שלח",
      cancel: "בטל",
      continue: "המשך"
    },
    common: {
      dismiss: "סגור"
    }
  },
  sw: {
    app: {
      title: "ScrollJustice.AI",
      tagline: "Haki takatifu kupitia hati za kidijitali",
      loading: "Inapakia hati takatifu..."
    },
    nav: {
      home: "Nyumbani",
      dashboard: "Dashibodi",
      precedent: "Vigezo",
      community: "Jumuiya",
      profile: "Wasifu",
      signin: "Ingia",
      signout: "Toka",
      language: "Lugha"
    },
    language: {
      select: "Chagua Lugha",
      extended: "Lugha za Ziada",
      sacred: "Lugha Takatifu"
    },
    button: {
      submit: "Wasilisha",
      cancel: "Ghairi",
      continue: "Endelea"
    },
    common: {
      dismiss: "Funga"
    }
  },
  am: {
    app: {
      title: "ScrollJustice.AI",
      tagline: "በዲጂታል ጥቅሎች በኩል ቅዱስ ፍትህ",
      loading: "ቅዱስ ጥቅሎችን በመጫን ላይ..."
    },
    nav: {
      home: "መነሻ",
      dashboard: "ዳሽቦርድ",
      precedent: "ቀዳሚ ውሳኔዎች",
      community: "ማህበረሰብ",
      profile: "መገለጫ",
      signin: "ግባ",
      signout: "ውጣ",
      language: "ቋንቋ"
    },
    language: {
      select: "ቋንቋ ይምረጡ",
      extended: "ተጨማሪ ቋንቋዎች",
      sacred: "ቅዱስ ቋንቋዎች"
    },
    button: {
      submit: "አስገባ",
      cancel: "ሰርዝ",
      continue: "ቀጥል"
    },
    common: {
      dismiss: "ዝጋ"
    }
  }
};

export default minimalTranslations;
