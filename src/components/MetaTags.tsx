
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
  const fullTitle = title ? `${title} | ${t("app.title")}` : t("app.title");
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      {imageUrl && <meta property="twitter:image" content={imageUrl} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Favicon - updated with the sacred logo */}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </Helmet>
  );
}
