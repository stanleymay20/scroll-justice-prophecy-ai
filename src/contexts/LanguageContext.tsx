
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  normalizeLanguageCode, 
  isRtlLanguage, 
  getLanguageGroups, 
  getSavedLanguagePreference, 
  getBrowserLanguage, 
  applyLanguageDirection, 
  saveLanguagePreference 
} from "@/utils/languageUtils";

// Define language codes as string literal types
export type LanguageCode = 
  | "en" | "fr" | "es" | "de"  // Primary
  | "zh" | "ar" | "hi" | "pt"  // Extended
  | "he" | "sw" | "am";        // Sacred

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
};

const defaultLanguage: LanguageCode = "en";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations - extending with new language keys
const translations: Record<string, Record<string, string>> = {
  en: {
    // General
    "app.title": "ScrollJustice.AI",
    "app.tagline": "Sacred justice through digital scrolls",
    "app.loading": "Loading sacred scrolls...",
    
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.precedent": "Precedents",
    "nav.community": "Community",
    "nav.profile": "Profile",
    "nav.signin": "Sign In",
    "nav.signout": "Sign Out",
    "nav.language": "Language",
    
    // Language selector
    "language.select": "Select Language",
    "language.extended": "Extended Languages",
    "language.sacred": "Sacred Languages",
    
    // Subscription
    "subscription.title": "Sacred Subscription Plans",
    "subscription.basic": "Basic",
    "subscription.professional": "Professional",
    "subscription.enterprise": "Enterprise",
    "subscription.current": "Current Plan",
    "subscription.subscribe": "Subscribe",
    "subscription.manage": "Manage Subscription",
    
    // Court
    "court.oath": "Sacred Oath",
    "court.simulation": "Simulation Trial",
    "court.emergency": "Emergency Alert",
    "court.feedback": "Sacred Feedback",
    
    // Errors
    "error.general": "A sacred challenge has appeared. Please try again.",
    "error.auth": "Your scroll credentials require verification. Please sign in again.",
    "error.notfound": "This sacred scroll has not yet been written.",
    
    // Success
    "success.general": "The sacred scrolls have been updated.",
    "success.auth": "You have been blessed with access to the sacred scrolls.",
    "success.subscription": "Your sacred subscription has been activated.",
    
    // Sacred Oath
    "oath.title": "Sacred Oath Required",
    "oath.text": "I solemnly swear to uphold the principles of truth and justice in this sacred proceeding.",
    "oath.confirm": "Take Sacred Oath",
    
    // Others
    "button.submit": "Submit",
    "button.cancel": "Cancel",
    "button.continue": "Continue",
    "button.back": "Back"
  },
  fr: {
    // General
    "app.title": "ScrollJustice.AI",
    "app.tagline": "Justice sacrée par parchemins numériques",
    "app.loading": "Chargement des parchemins sacrés...",
    
    // Navigation
    "nav.home": "Accueil",
    "nav.dashboard": "Tableau de Bord",
    "nav.precedent": "Précédents",
    "nav.community": "Communauté",
    "nav.profile": "Profil",
    "nav.signin": "Connexion",
    "nav.signout": "Déconnexion",
    "nav.language": "Langue",
    
    // Language selector
    "language.select": "Choisir la Langue",
    "language.extended": "Langues Étendues",
    "language.sacred": "Langues Sacrées",
    
    // Subscription
    "subscription.title": "Plans d'Abonnement Sacrés",
    "subscription.basic": "Basique",
    "subscription.professional": "Professionnel",
    "subscription.enterprise": "Entreprise",
    "subscription.current": "Plan Actuel",
    "subscription.subscribe": "S'abonner",
    "subscription.manage": "Gérer l'Abonnement",
    
    // Court
    "court.oath": "Serment Sacré",
    "court.simulation": "Simulation de Procès",
    "court.emergency": "Alerte d'Urgence",
    "court.feedback": "Retour Sacré",
    
    // Errors
    "error.general": "Un défi sacré est apparu. Veuillez réessayer.",
    "error.auth": "Vos identifiants de parchemin nécessitent une vérification. Veuillez vous reconnecter.",
    "error.notfound": "Ce parchemin sacré n'a pas encore été écrit.",
    
    // Success
    "success.general": "Les parchemins sacrés ont été mis à jour.",
    "success.auth": "Vous avez été béni avec l'accès aux parchemins sacrés.",
    "success.subscription": "Votre abonnement sacré a été activé.",
    
    // Sacred Oath
    "oath.title": "Serment Sacré Requis",
    "oath.text": "Je jure solennellement de respecter les principes de vérité et de justice dans cette procédure sacrée.",
    "oath.confirm": "Prêter le Serment Sacré",
    
    // Others
    "button.submit": "Soumettre",
    "button.cancel": "Annuler",
    "button.continue": "Continuer",
    "button.back": "Retour"
  },
  es: {
    // General
    "app.title": "ScrollJustice.AI",
    "app.tagline": "Justicia sagrada a través de pergaminos digitales",
    "app.loading": "Cargando pergaminos sagrados...",
    
    // Navigation
    "nav.home": "Inicio",
    "nav.dashboard": "Panel",
    "nav.precedent": "Precedentes",
    "nav.community": "Comunidad",
    "nav.profile": "Perfil",
    "nav.signin": "Iniciar Sesión",
    "nav.signout": "Cerrar Sesión",
    "nav.language": "Idioma",
    
    // Language selector
    "language.select": "Seleccionar Idioma",
    "language.extended": "Idiomas Extendidos",
    "language.sacred": "Idiomas Sagrados",
    
    // Subscription
    "subscription.title": "Planes de Suscripción Sagrados",
    "subscription.basic": "Básico",
    "subscription.professional": "Profesional",
    "subscription.enterprise": "Empresa",
    "subscription.current": "Plan Actual",
    "subscription.subscribe": "Suscribirse",
    "subscription.manage": "Gestionar Suscripción",
    
    // Court
    "court.oath": "Juramento Sagrado",
    "court.simulation": "Simulación de Juicio",
    "court.emergency": "Alerta de Emergencia",
    "court.feedback": "Retroalimentación Sagrada",
    
    // Errors
    "error.general": "Ha aparecido un desafío sagrado. Por favor, inténtelo de nuevo.",
    "error.auth": "Sus credenciales de pergamino requieren verificación. Por favor, inicie sesión de nuevo.",
    "error.notfound": "Este pergamino sagrado aún no ha sido escrito.",
    
    // Success
    "success.general": "Los pergaminos sagrados han sido actualizados.",
    "success.auth": "Ha sido bendecido con acceso a los pergaminos sagrados.",
    "success.subscription": "Su suscripción sagrada ha sido activada.",
    
    // Sacred Oath
    "oath.title": "Juramento Sagrado Requerido",
    "oath.text": "Juro solemnemente defender los principios de verdad y justicia en este procedimiento sagrado.",
    "oath.confirm": "Hacer Juramento Sagrado",
    
    // Others
    "button.submit": "Enviar",
    "button.cancel": "Cancelar",
    "button.continue": "Continuar",
    "button.back": "Atrás"
  },
  de: {
    // General
    "app.title": "ScrollJustice.AI",
    "app.tagline": "Heilige Gerechtigkeit durch digitale Schriftrollen",
    "app.loading": "Laden heiliger Schriftrollen...",
    
    // Navigation
    "nav.home": "Startseite",
    "nav.dashboard": "Dashboard",
    "nav.precedent": "Präzedenzfälle",
    "nav.community": "Gemeinschaft",
    "nav.profile": "Profil",
    "nav.signin": "Anmelden",
    "nav.signout": "Abmelden",
    "nav.language": "Sprache",
    
    // Language selector
    "language.select": "Sprache Auswählen",
    "language.extended": "Erweiterte Sprachen",
    "language.sacred": "Heilige Sprachen",
    
    // Subscription
    "subscription.title": "Heilige Abonnementpläne",
    "subscription.basic": "Basis",
    "subscription.professional": "Professionell",
    "subscription.enterprise": "Unternehmen",
    "subscription.current": "Aktueller Plan",
    "subscription.subscribe": "Abonnieren",
    "subscription.manage": "Abonnement Verwalten",
    
    // Court
    "court.oath": "Heiliger Eid",
    "court.simulation": "Simulationsprozess",
    "court.emergency": "Notfallalarm",
    "court.feedback": "Heiliges Feedback",
    
    // Errors
    "error.general": "Eine heilige Herausforderung ist aufgetreten. Bitte versuche es erneut.",
    "error.auth": "Deine Schriftrollenanmeldedaten erfordern eine Überprüfung. Bitte melde dich erneut an.",
    "error.notfound": "Diese heilige Schriftrolle wurde noch nicht geschrieben.",
    
    // Success
    "success.general": "Die heiligen Schriftrollen wurden aktualisiert.",
    "success.auth": "Du wurdest mit dem Zugang zu den heiligen Schriftrollen gesegnet.",
    "success.subscription": "Dein heiliges Abonnement wurde aktiviert.",
    
    // Sacred Oath
    "oath.title": "Heiliger Eid Erforderlich",
    "oath.text": "Ich schwöre feierlich, die Prinzipien der Wahrheit und Gerechtigkeit in diesem heiligen Verfahren zu wahren.",
    "oath.confirm": "Heiligen Eid Ablegen",
    
    // Others
    "button.submit": "Einreichen",
    "button.cancel": "Abbrechen",
    "button.continue": "Fortfahren",
    "button.back": "Zurück"
  },
  // Add minimal translation sets for all other languages
  zh: {
    "app.title": "ScrollJustice.AI",
    "app.tagline": "通过数字卷轴实现神圣正义",
    "nav.language": "语言",
    "language.select": "选择语言",
    "language.extended": "扩展语言",
    "language.sacred": "神圣语言",
    "nav.home": "首页",
    "nav.dashboard": "仪表板",
    "nav.precedent": "先例",
    "nav.community": "社区",
    "nav.profile": "个人资料",
    "nav.signin": "登录",
    "nav.signout": "登出",
  },
  ar: {
    "app.title": "ScrollJustice.AI",
    "app.tagline": "العدالة المقدسة من خلال المخطوطات الرقمية",
    "nav.language": "اللغة",
    "language.select": "اختر اللغة",
    "language.extended": "اللغات الموسعة",
    "language.sacred": "اللغات المقدسة",
    "nav.home": "الرئيسية",
    "nav.dashboard": "لوحة التحكم",
    "nav.precedent": "السوابق",
    "nav.community": "المجتمع",
    "nav.profile": "الملف الشخصي",
    "nav.signin": "تسجيل الدخول",
    "nav.signout": "تسجيل الخروج",
  },
  hi: {
    "app.title": "ScrollJustice.AI",
    "app.tagline": "डिजिटल स्क्रॉल के माध्यम से पवित्र न्याय",
    "nav.language": "भाषा",
    "language.select": "भाषा चुनें",
    "language.extended": "विस्तारित भाषाएँ",
    "language.sacred": "पवित्र भाषाएँ",
    "nav.home": "होम",
    "nav.dashboard": "डैशबोर्ड",
    "nav.precedent": "पूर्वोदाहरण",
    "nav.community": "समुदाय",
    "nav.profile": "प्रोफ़ाइल",
    "nav.signin": "साइन इन करें",
    "nav.signout": "साइन आउट करें",
  },
  pt: {
    "app.title": "ScrollJustice.AI",
    "app.tagline": "Justiça sagrada através de pergaminhos digitais",
    "nav.language": "Idioma",
    "language.select": "Selecionar Idioma",
    "language.extended": "Idiomas Estendidos",
    "language.sacred": "Idiomas Sagrados",
    "nav.home": "Início",
    "nav.dashboard": "Painel",
    "nav.precedent": "Precedentes",
    "nav.community": "Comunidade",
    "nav.profile": "Perfil",
    "nav.signin": "Entrar",
    "nav.signout": "Sair",
  },
  he: {
    "app.title": "ScrollJustice.AI",
    "app.tagline": "צדק קדוש באמצעות מגילות דיגיטליות",
    "nav.language": "שפה",
    "language.select": "בחר שפה",
    "language.extended": "שפות מורחבות",
    "language.sacred": "שפות קדושות",
    "nav.home": "דף הבית",
    "nav.dashboard": "לוח בקרה",
    "nav.precedent": "תקדימים",
    "nav.community": "קהילה",
    "nav.profile": "פרופיל",
    "nav.signin": "התחברות",
    "nav.signout": "התנתקות",
  },
  sw: {
    "app.title": "ScrollJustice.AI",
    "app.tagline": "Haki takatifu kupitia vitabu vya kidijitali",
    "nav.language": "Lugha",
    "language.select": "Chagua Lugha",
    "language.extended": "Lugha za Ziada",
    "language.sacred": "Lugha Takatifu",
    "nav.home": "Nyumbani",
    "nav.dashboard": "Dashibodi",
    "nav.precedent": "Misaada",
    "nav.community": "Jumuiya",
    "nav.profile": "Wasifu",
    "nav.signin": "Ingia",
    "nav.signout": "Toka",
  },
  am: {
    "app.title": "ScrollJustice.AI",
    "app.tagline": "በዲጂታል ጥቅሎች በኩል ቅዱስ ፍትሕ",
    "nav.language": "ቋንቋ",
    "language.select": "ቋንቋ ይምረጡ",
    "language.extended": "ተጨማሪ ቋንቋዎች",
    "language.sacred": "ቅዱስ ቋንቋዎች",
    "nav.home": "መነሻ",
    "nav.dashboard": "ዳሽቦርድ",
    "nav.precedent": "ቀደምት",
    "nav.community": "ማህበረሰብ",
    "nav.profile": "መገለጫ",
    "nav.signin": "ይግቡ",
    "nav.signout": "ይውጡ",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    // Try to get language from localStorage first
    const savedLanguage = getSavedLanguagePreference();
    if (savedLanguage) {
      return savedLanguage;
    }
    
    // Try to detect browser language if no saved preference
    return getBrowserLanguage();
  });

  // Apply language effects when language changes
  useEffect(() => {
    // Save language preference to localStorage
    saveLanguagePreference(language);
    
    // Update document language attributes for accessibility and RTL
    applyLanguageDirection(language);

    // Dispatch a custom event that components can listen for
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
    
    console.log(`Language set to: ${language}`);
  }, [language]);
  
  // Translation function with fallbacks
  const t = (key: string): string => {
    // Try to get the translation for the current language
    const translation = translations[language]?.[key];
    
    if (translation) {
      return translation;
    }
    
    // Fallback to English if translation doesn't exist
    const englishTranslation = translations.en[key];
    
    // Return the key itself as a last resort
    return englishTranslation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
