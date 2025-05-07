
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from "@/contexts/language";

export const AIDisclosureBanner = () => {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-justice-primary/20 text-justice-light rounded-md p-3 mb-4 flex justify-between items-center text-sm">
      <div>
        {t("ai.disclosure.banner") || 
          "This application uses AI technologies to assist in legal processes. All AI-generated content is subject to human review."}
        {" "}
        <a href="/policy/ai-usage" className="underline">
          {t("ai.disclosure.learnMore") || "Learn more"}
        </a>
      </div>
      <button 
        onClick={() => setDismissed(true)}
        className="ml-2 text-justice-light hover:text-white"
        aria-label={t("common.dismiss") || "Dismiss"}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
