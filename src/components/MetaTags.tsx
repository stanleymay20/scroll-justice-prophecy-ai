
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/language";

interface MetaTagsProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  keywords?: string;
}

export function MetaTags({ 
  title, 
  description,
  imageUrl = "/lovable-uploads/54136c6b-c4a6-40ac-9c48-47c0ecd617e9.png",
  keywords
}: MetaTagsProps) {
  const { t, language } = useLanguage();
  
  const siteTitle = t("app.title");
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDescription = description || t("app.tagline");

  return (
    <Helmet>
      <html lang={language} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
