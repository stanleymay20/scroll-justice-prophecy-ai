
// Define a type for our translations object
interface TranslationsMap {
  [key: string]: Record<string, any>;
}

// Fallback translations - these are used if the JSON files fail to load
const fallbackTranslations: TranslationsMap = {
  en: {
    app: {
      title: "ScrollJustice.AI",
      tagline: "Sacred justice through digital scrolls",
      loading: "Loading sacred scrolls..."
    },
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      precedent: "Precedents",
      community: "Community",
      profile: "Profile",
      signin: "Sign In",
      signout: "Sign Out",
      language: "Language"
    },
    language: {
      select: "Select Language",
      extended: "Extended Languages",
      sacred: "Sacred Languages"
    },
    button: {
      submit: "Submit",
      submitting: "Submitting...",
      cancel: "Cancel",
      continue: "Continue",
      back: "Back",
      register: "Register"
    },
    analyzer: {
      sacredIntegrity: "Sacred Integrity Analyzer",
      placeholder: "Enter text to analyze for integrity issues...",
      analyze: "Analyze Integrity",
      analyzing: "Analyzing...",
      noContent: "Please enter content to analyze",
      requireConsent: "AI consent is required for content analysis",
      error: "Error analyzing content: ",
      results: "Integrity Analysis Results",
      score: "Integrity Score",
      issues: "Identified Issues",
      noIssues: "No integrity issues found"
    },
    petition: {
      new: "New Sacred Petition",
      title: "Petition Title",
      titlePlaceholder: "Enter a clear, concise title for your petition",
      titleTooShort: "Title must be at least 10 characters",
      description: "Petition Description",
      descriptionPlaceholder: "Describe your petition in detail, including all relevant information",
      descriptionTooShort: "Description must be at least 50 characters",
      invalidForm: "Invalid Petition",
      checkFields: "Please check all fields and ensure integrity score is sufficient",
      submitted: "Petition Submitted",
      successMessage: "Your petition has been submitted to the sacred scrolls"
    },
    error: {
      submission: "Submission Error",
      tryAgain: "There was a problem submitting your petition. Please try again.",
      authRequired: "Authentication Required",
      loginToRequest: "Please log in to make this request"
    },
    auth: {
      required: "Authentication Required",
      loginRequired: "You must be logged in to submit a petition"
    },
    ai: {
      consentLabel: "I consent to AI analysis",
      consentTooltip: "By enabling this, you agree to allow our AI systems to process your content for integrity analysis. This helps maintain the sacred standards of the scroll court.",
      poweredBy: "Powered by",
      disclosureTitle: "AI-Assisted System",
      disclosureText: "This feature is powered by artificial intelligence ({0}). The system may generate content or perform analysis to assist in the petition process.",
      dataUseTitle: "How Your Data Is Used",
      dataUseItem1: "To evaluate petition integrity and compliance with scroll standards",
      dataUseItem2: "For improving the accuracy and fairness of the AI system",
      dataUseItem3: "For ensuring consistency with sacred principles across the platform",
      yourRightsTitle: "Your Rights",
      yourRightsText: "Under applicable law, you have the right to request deletion of your data from our AI training systems.",
      requestDeletion: "Request Data Deletion",
      dataDeleteRequested: "Deletion Request Received",
      dataDeleteProcessing: "Your request for AI data deletion has been received and is being processed.",
      learnMore: "Learn more",
      showLess: "Show less"
    }
  },
  fr: {
    app: {
      title: "ScrollJustice.AI",
      tagline: "Justice sacrée par parchemins numériques",
      loading: "Chargement des parchemins sacrés..."
    },
    nav: {
      home: "Accueil",
      dashboard: "Tableau de Bord",
      precedent: "Précédents",
      community: "Communauté",
      profile: "Profil",
      signin: "Connexion",
      signout: "Déconnexion",
      language: "Langue"
    },
    language: {
      select: "Choisir la Langue",
      extended: "Langues Étendues",
      sacred: "Langues Sacrées"
    },
    button: {
      submit: "Soumettre",
      submitting: "Soumission en cours...",
      cancel: "Annuler",
      continue: "Continuer",
      back: "Retour",
      register: "S'inscrire"
    },
    analyzer: {
      sacredIntegrity: "Analyseur d'Intégrité Sacrée",
      placeholder: "Entrez du texte à analyser pour les problèmes d'intégrité...",
      analyze: "Analyser l'Intégrité",
      analyzing: "Analyse en cours...",
      noContent: "Veuillez entrer du contenu à analyser",
      requireConsent: "Le consentement IA est requis pour l'analyse de contenu",
      error: "Erreur d'analyse du contenu: ",
      results: "Résultats de l'Analyse d'Intégrité",
      score: "Score d'Intégrité",
      issues: "Problèmes Identifiés",
      noIssues: "Aucun problème d'intégrité trouvé"
    },
    petition: {
      new: "Nouvelle Pétition Sacrée",
      title: "Titre de la Pétition",
      titlePlaceholder: "Entrez un titre clair et concis pour votre pétition",
      titleTooShort: "Le titre doit comporter au moins 10 caractères",
      description: "Description de la Pétition",
      descriptionPlaceholder: "Décrivez votre pétition en détail, y compris toutes les informations pertinentes",
      descriptionTooShort: "La description doit comporter au moins 50 caractères",
      invalidForm: "Pétition Invalide",
      checkFields: "Veuillez vérifier tous les champs et vous assurer que le score d'intégrité est suffisant",
      submitted: "Pétition Soumise",
      successMessage: "Votre pétition a été soumise aux parchemins sacrés"
    },
    error: {
      submission: "Erreur de Soumission",
      tryAgain: "Il y a eu un problème lors de la soumission de votre pétition. Veuillez réessayer.",
      authRequired: "Authentification Requise",
      loginToRequest: "Veuillez vous connecter pour faire cette demande"
    },
    auth: {
      required: "Authentification Requise",
      loginRequired: "Vous devez être connecté pour soumettre une pétition"
    },
    ai: {
      consentLabel: "Je consens à l'analyse par IA",
      consentTooltip: "En activant cette option, vous acceptez de permettre à nos systèmes d'IA de traiter votre contenu pour une analyse d'intégrité. Cela aide à maintenir les normes sacrées du tribunal des parchemins.",
      poweredBy: "Alimenté par",
      disclosureTitle: "Système Assisté par IA",
      disclosureText: "Cette fonctionnalité est alimentée par l'intelligence artificielle ({0}). Le système peut générer du contenu ou effectuer des analyses pour aider dans le processus de pétition.",
      dataUseTitle: "Comment Vos Données Sont Utilisées",
      dataUseItem1: "Pour évaluer l'intégrité de la pétition et sa conformité aux normes des parchemins",
      dataUseItem2: "Pour améliorer la précision et l'équité du système d'IA",
      dataUseItem3: "Pour assurer la cohérence avec les principes sacrés sur la plateforme",
      yourRightsTitle: "Vos Droits",
      yourRightsText: "Selon la loi applicable, vous avez le droit de demander la suppression de vos données de nos systèmes d'entraînement d'IA.",
      requestDeletion: "Demander la Suppression des Données",
      dataDeleteRequested: "Demande de Suppression Reçue",
      dataDeleteProcessing: "Votre demande de suppression des données d'IA a été reçue et est en cours de traitement.",
      learnMore: "En savoir plus",
      showLess: "Afficher moins"
    }
  }
  // Additional languages can be added here
};

export default fallbackTranslations;
