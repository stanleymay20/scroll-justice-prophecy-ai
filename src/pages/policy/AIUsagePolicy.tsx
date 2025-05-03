
import { useState, useEffect } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/advanced-ui/GlassCard';
import { Loader2 } from 'lucide-react';
import { MetaTags } from '@/components/MetaTags';
import { useLanguage } from '@/contexts/language';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function AIUsagePolicy() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [policyContent, setPolicyContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await fetch('/policy/ai-usage.md');
        const text = await response.text();
        setPolicyContent(text);
      } catch (error) {
        console.error('Failed to load AI policy:', error);
        setPolicyContent('Error loading policy. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPolicy();
  }, []);
  
  const renderMarkdown = () => {
    // Very simple markdown renderer
    // In a real app, use a library like react-markdown
    return policyContent
      .split('\n\n')
      .map((paragraph, i) => {
        if (paragraph.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-bold mt-8 mb-4 text-white">{paragraph.substring(2)}</h1>;
        } else if (paragraph.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-semibold mt-6 mb-3 text-white">{paragraph.substring(3)}</h2>;
        } else if (paragraph.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-medium mt-4 mb-2 text-white">{paragraph.substring(4)}</h3>;
        } else if (paragraph.startsWith('- ')) {
          return (
            <ul key={i} className="list-disc pl-5 mb-4">
              {paragraph.split('\n').map((item, j) => (
                <li key={j} className="text-justice-light mb-1">{item.substring(2)}</li>
              ))}
            </ul>
          );
        } else if (paragraph.startsWith('1. ')) {
          return (
            <ol key={i} className="list-decimal pl-5 mb-4">
              {paragraph.split('\n').map((item, j) => {
                const match = item.match(/^\d+\.\s(.+)$/);
                return match ? (
                  <li key={j} className="text-justice-light mb-1">{match[1]}</li>
                ) : null;
              })}
            </ol>
          );
        } else {
          return <p key={i} className="text-justice-light mb-4">{paragraph}</p>;
        }
      });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags 
        title={t("policy.ai.title")} 
        description={t("policy.ai.description")}
      />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <GlassCard className="p-6 md:p-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            {t("common.back")}
          </Button>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-justice-primary" />
            </div>
          ) : (
            <div className="policy-document">
              {renderMarkdown()}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
