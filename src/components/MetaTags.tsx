
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = "ScrollJustice AI - Sacred Legal AI Platform",
  description = "AI-powered legal analysis and verdict generation platform providing sacred legal wisdom.",
  keywords = "legal AI, artificial intelligence, legal platform, justice, verdicts, petitions, legal analysis",
  url = "https://scrolljustice.ai"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      <meta name="legal-disclaimer" content="All AI-generated verdicts are advisory only and do not constitute professional legal advice" />
    </Helmet>
  );
};
