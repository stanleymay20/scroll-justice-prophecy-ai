
import { base } from './minimal-translations';

export const en = {
  ...base,
  // Add new translations for AI compliance
  ai: {
    disclosure: {
      banner: "ScrollJustice.AI uses artificial intelligence to assist in various processes. All AI systems have human oversight.",
      learnMore: "Learn more about how we use AI",
    },
    consent: {
      judge: "Use AI-generated draft suggestions",
      petitioner: "I understand this content may be reviewed by AI",
      general: "Allow AI assistance for this feature",
      judgeTooltip: "When enabled, AI will suggest verdict language based on precedent. You maintain full authority to modify or disregard AI suggestions.",
      petitionerTooltip: "Your content may be analyzed by AI for integrity assessment. All AI processes include human oversight.",
      generalTooltip: "AI features assist but do not replace human judgment. You can opt out, but some features may be limited.",
    },
  },
  policy: {
    ai: {
      title: "AI Usage Policy",
      description: "How ScrollJustice.AI uses artificial intelligence with transparency and accountability",
    },
  },
  analyzer: {
    sacredIntegrity: "Sacred Integrity Analysis",
    placeholder: "Enter text to analyze for sacred integrity...",
    analyzing: "Analyzing",
    analyze: "Analyze Integrity",
    results: "Analysis Results",
    score: "Integrity Score",
    issues: "Potential Issues",
    noIssues: "No integrity issues detected",
    noContent: "Please enter content to analyze",
    requireConsent: "AI consent is required for content analysis",
    error: "Failed to analyze content: ",
  },
  verdict: {
    sacred: "Sacred Verdict",
    reasoning: "Reasoning",
    reasoningPlaceholder: "Explain the reasoning behind your verdict...",
    consultingAi: "Consulting AI",
    getAiSuggestion: "Get AI Suggestion",
    approvePetition: "Approve Petition",
    rejectPetition: "Reject Petition",
    aiConsentRequired: "AI Consent Required",
    enableAiConsent: "Please enable AI consent to use this feature",
    aiSuggested: "AI Verdict Suggestion",
    aiConsideredCase: "The sacred algorithms have considered this case and provided guidance.",
    aiSuggestionFailed: "The AI could not provide a suggestion at this time.",
    aiError: "Failed to receive AI guidance: ",
    missingReasoning: "Missing Information",
    provideReasoning: "Please provide reasoning for your verdict.",
    approved: "Petition Approved",
    rejected: "Petition Rejected",
    recorded: "The sacred verdict has been recorded in the scrolls.",
    submissionError: "Failed to submit verdict: ",
  },
  common: {
    back: "Back",
    dismiss: "Dismiss",
  }
};
