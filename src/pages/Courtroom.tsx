
import { useParams } from 'react-router-dom';
import { NavBar } from '@/components/layout/NavBar';
import { CourtroomInterface } from '@/components/courtroom/CourtroomInterface';
import { PetitionDetail } from '@/components/courtroom/PetitionDetail';
import { MetaTags } from '@/components/MetaTags';
import { useLanguage } from '@/contexts/language';

export default function Courtroom() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <MetaTags title={id ? t("court.feedback") : t("court.oath")} />
      <NavBar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        {id ? <PetitionDetail /> : <CourtroomInterface />}
      </div>
    </div>
  );
}
