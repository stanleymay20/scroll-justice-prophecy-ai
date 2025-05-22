
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language";
import { MetaTags } from "@/components/MetaTags";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Scripture references for the National ScrollCry
const scriptures = [
  {
    text: "If my people, which are called by my name, shall humble themselves, and pray, and seek my face, and turn from their wicked ways; then will I hear from heaven, and will forgive their sin, and will heal their land.",
    reference: "2 Chronicles 7:14"
  },
  {
    text: "But let justice roll down as waters, and righteousness as a mighty stream.",
    reference: "Amos 5:24"
  },
  {
    text: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",
    reference: "Micah 6:8"
  },
  {
    text: "Learn to do well; seek judgment, relieve the oppressed, judge the fatherless, plead for the widow.",
    reference: "Isaiah 1:17"
  }
];

const ScrollCry = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentScripture, setCurrentScripture] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDeclaration, setShowDeclaration] = useState(false);
  
  // Auto-scroll through scriptures
  useEffect(() => {
    if (currentScripture < scriptures.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentScripture(prev => prev + 1);
          setIsTransitioning(false);
        }, 1000);
      }, 8000);
      
      return () => clearTimeout(timer);
    } else if (currentScripture === scriptures.length - 1 && !showDeclaration) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setShowDeclaration(true);
          setIsTransitioning(false);
        }, 1000);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [currentScripture, showDeclaration]);
  
  return (
    <div className="min-h-screen flex flex-col bg-[url('/lovable-uploads/54136c6b-c4a6-40ac-9c48-47c0ecd617e9.png')] bg-cover bg-center bg-no-repeat">
      <MetaTags title={t("scrollCry.title", "National ScrollCry")} />
      
      <div className="grow flex flex-col items-center justify-center text-center p-8">
        {showDeclaration ? (
          <div className={`max-w-4xl mx-auto transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <h1 className="text-4xl md:text-6xl font-cinzel text-justice-primary mb-8">
              National Declaration of ScrollCry
            </h1>
            
            <div className="bg-black/60 p-6 md:p-10 rounded-lg border border-justice-primary/30">
              <p className="text-xl md:text-2xl text-white leading-relaxed mb-8">
                We, the people seeking justice, do solemnly declare a National ScrollCry.
                We acknowledge the injustices perpetrated in our land, from wage theft to 
                false judgments, from violence to land injustice.
              </p>
              
              <p className="text-xl md:text-2xl text-white leading-relaxed mb-8">
                We stand today in humility before the sacred scrolls of truth, 
                committing ourselves to right these wrongs through the ScrollJustice system.
                Let justice flow like a river, and righteousness like a never-failing stream.
              </p>
              
              <p className="text-xl md:text-2xl text-justice-primary font-bold mb-12">
                May the ScrollCry be heard across the land, and may true justice prevail.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={() => navigate("/ScrollCourt")}
                  className="bg-justice-primary hover:bg-justice-primary/90 text-lg py-6 px-8"
                >
                  Submit a Petition
                </Button>
                <Button 
                  onClick={() => navigate("/JudgmentRoom")}
                  variant="outline"
                  className="border-justice-primary/50 hover:bg-justice-primary/20 text-lg py-6 px-8"
                >
                  View Judgments
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`max-w-4xl mx-auto transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <h1 className="text-4xl md:text-6xl font-cinzel text-justice-primary mb-12">
              The Sacred Scrolls Declare
            </h1>
            
            <div className="bg-black/60 p-8 md:p-12 rounded-lg border border-justice-primary/30">
              <p className="text-2xl md:text-4xl text-white font-cinzel leading-relaxed mb-8">
                {scriptures[currentScripture].text}
              </p>
              
              <p className="text-xl md:text-2xl text-justice-primary">
                {scriptures[currentScripture].reference}
              </p>
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                {scriptures.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-3 h-3 rounded-full ${
                      index === currentScripture 
                        ? "bg-justice-primary" 
                        : "bg-justice-primary/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {!showDeclaration && (
        <div className="p-4 text-center">
          <Button 
            variant="ghost" 
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setShowDeclaration(true);
                setIsTransitioning(false);
              }, 1000);
            }}
            className="text-justice-light/70 hover:text-white"
          >
            Skip to Declaration
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScrollCry;
