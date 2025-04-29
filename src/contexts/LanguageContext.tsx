import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "fr" | "es";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const defaultLanguage: Language = "en";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations
const translations: Record<Language, Record<string, string>> = {
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
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem("scrollJustice-language");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr" || savedLanguage === "es")) {
      return savedLanguage;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === "fr" || browserLang === "es") {
      return browserLang;
    }
    
    return defaultLanguage;
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem("scrollJustice-language", language);
  }, [language]);
  
  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
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
