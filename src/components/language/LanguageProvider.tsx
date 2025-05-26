
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'de' | 'fr' | 'es' | 'ar' | 'zh' | 'hi' | 'pt' | 'sw' | 'am' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.petitions': 'Petitions',
    'nav.court': 'ScrollCourt',
    'nav.analytics': 'Analytics',
    'petition.title': 'Petition Title',
    'petition.description': 'Petition Description',
    'petition.submit': 'Submit Sacred Petition',
    'verdict.delivered': 'Verdict Delivered',
    'app.title': 'ScrollJustice',
    'app.subtitle': 'Divine Justice Through AI'
  },
  de: {
    'nav.dashboard': 'Dashboard',
    'nav.petitions': 'Petitionen',
    'nav.court': 'ScrollGericht',
    'nav.analytics': 'Analytik',
    'petition.title': 'Petition Titel',
    'petition.description': 'Petition Beschreibung',
    'petition.submit': 'Heilige Petition Einreichen',
    'verdict.delivered': 'Urteil Verkündet',
    'app.title': 'ScrollJustice',
    'app.subtitle': 'Göttliche Gerechtigkeit durch KI'
  },
  fr: {
    'nav.dashboard': 'Tableau de Bord',
    'nav.petitions': 'Pétitions',
    'nav.court': 'TribunalScroll',
    'nav.analytics': 'Analytiques',
    'petition.title': 'Titre de la Pétition',
    'petition.description': 'Description de la Pétition',
    'petition.submit': 'Soumettre Pétition Sacrée',
    'verdict.delivered': 'Verdict Rendu',
    'app.title': 'ScrollJustice',
    'app.subtitle': 'Justice Divine par IA'
  },
  es: {
    'nav.dashboard': 'Panel',
    'nav.petitions': 'Peticiones',
    'nav.court': 'TribunalScroll',
    'nav.analytics': 'Analíticas',
    'petition.title': 'Título de Petición',
    'petition.description': 'Descripción de Petición',
    'petition.submit': 'Enviar Petición Sagrada',
    'verdict.delivered': 'Veredicto Entregado',
    'app.title': 'ScrollJustice',
    'app.subtitle': 'Justicia Divina por IA'
  },
  ar: {
    'nav.dashboard': 'لوحة التحكم',
    'nav.petitions': 'العرائض',
    'nav.court': 'محكمة السكرول',
    'nav.analytics': 'التحليلات',
    'petition.title': 'عنوان العريضة',
    'petition.description': 'وصف العريضة',
    'petition.submit': 'تقديم العريضة المقدسة',
    'verdict.delivered': 'تم تسليم الحكم',
    'app.title': 'عدالة السكرول',
    'app.subtitle': 'العدالة الإلهية من خلال الذكاء الاصطناعي'
  },
  zh: {
    'nav.dashboard': '仪表板',
    'nav.petitions': '请愿书',
    'nav.court': '卷轴法庭',
    'nav.analytics': '分析',
    'petition.title': '请愿书标题',
    'petition.description': '请愿书描述',
    'petition.submit': '提交神圣请愿书',
    'verdict.delivered': '判决已交付',
    'app.title': '卷轴正义',
    'app.subtitle': '通过人工智能实现神圣正义'
  },
  hi: {
    'nav.dashboard': 'डैशबोर्ड',
    'nav.petitions': 'याचिकाएं',
    'nav.court': 'स्क्रॉल न्यायालय',
    'nav.analytics': 'विश्लेषण',
    'petition.title': 'याचिका का शीर्षक',
    'petition.description': 'याचिका का विवरण',
    'petition.submit': 'पवित्र याचिका जमा करें',
    'verdict.delivered': 'फैसला सुनाया गया',
    'app.title': 'स्क्रॉल न्याय',
    'app.subtitle': 'AI के माध्यम से दिव्य न्याय'
  },
  pt: {
    'nav.dashboard': 'Painel',
    'nav.petitions': 'Petições',
    'nav.court': 'TribunalScroll',
    'nav.analytics': 'Análises',
    'petition.title': 'Título da Petição',
    'petition.description': 'Descrição da Petição',
    'petition.submit': 'Enviar Petição Sagrada',
    'verdict.delivered': 'Veredicto Entregue',
    'app.title': 'ScrollJustice',
    'app.subtitle': 'Justiça Divina através de IA'
  },
  sw: {
    'nav.dashboard': 'Dashibodi',
    'nav.petitions': 'Maombi',
    'nav.court': 'MahakamaNdogo',
    'nav.analytics': 'Uchanganuzi',
    'petition.title': 'Kichwa cha Ombi',
    'petition.description': 'Maelezo ya Ombi',
    'petition.submit': 'Wasilisha Ombi Takatifu',
    'verdict.delivered': 'Hukumu Imetolewa',
    'app.title': 'ScrollJustice',
    'app.subtitle': 'Haki ya Kimungu kupitia AI'
  },
  am: {
    'nav.dashboard': 'ዳሽቦርድ',
    'nav.petitions': 'አቤቶታዎች',
    'nav.court': 'ስክሮል ፍርድ ቤት',
    'nav.analytics': 'ትንታኔዎች',
    'petition.title': 'የአቤቱታ ርዕስ',
    'petition.description': 'የአቤቱታ መግለጫ',
    'petition.submit': 'ቅዱስ አቤቱታ አስረክብ',
    'verdict.delivered': 'ፍርድ ተሰጥቷል',
    'app.title': 'ስክሮል ፍትህ',
    'app.subtitle': 'በ AI በኩል መለኮታዊ ፍትህ'
  },
  he: {
    'nav.dashboard': 'לוח מחוונים',
    'nav.petitions': 'עצומות',
    'nav.court': 'בית המשפט סקרול',
    'nav.analytics': 'אנליטיקה',
    'petition.title': 'כותרת העצומה',
    'petition.description': 'תיאור העצומה',
    'petition.submit': 'הגש עצומה קדושה',
    'verdict.delivered': 'פסק הדין נמסר',
    'app.title': 'צדק הסקרול',
    'app.subtitle': 'צדק אלוהי באמצעות AI'
  }
};

const rtlLanguages: Language[] = ['ar', 'he'];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('scrolljustice-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scrolljustice-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const isRTL = rtlLanguages.includes(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
