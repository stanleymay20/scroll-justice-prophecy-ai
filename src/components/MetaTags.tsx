
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/language";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  imageUrl?: string;
  canonicalUrl?: string;
}

export function MetaTags({
  title,
  description = "Sacred justice through digital scrolls - Access legal precedents, secure court sessions, and AI-powered insights.",
  keywords = "justice, legal, court, scroll, sacred justice, digital justice, legal tech, legal AI",
  imageUrl = "/scrolljustice-social.jpg",
  canonicalUrl,
}: MetaTagsProps) {
  const { language, t } = useLanguage();
  
  const fullTitle = title ? `${title} | ${t("app.title")}` : t("app.title");
  
  // Get language-specific meta descriptions
  const getLocalizedDescription = () => {
    switch(language) {
      case 'fr':
        return "Justice sacrée par parchemins numériques - Accédez aux précédents juridiques, sessions de tribunal sécurisées et analyses IA.";
      case 'es':
        return "Justicia sagrada a través de pergaminos digitales - Acceda a precedentes legales, sesiones judiciales seguras y análisis impulsados por IA.";
      case 'de':
        return "Heilige Gerechtigkeit durch digitale Schriftrollen - Zugang zu Rechtsprechung, sichere Gerichtssitzungen und KI-gestützte Einsichten.";
      default:
        return description;
    }
  };
  
  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={getLocalizedDescription()} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={getLocalizedDescription()} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:locale" content={language} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={getLocalizedDescription()} />
      {imageUrl && <meta property="twitter:image" content={imageUrl} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Favicon - updated with the sacred logo */}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </Helmet>
  );
}
