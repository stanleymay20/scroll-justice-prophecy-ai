
/**
 * Mockery Response Trigger System
 * Detects challenges to scroll authority and issues automatic responses
 */
import { v4 as uuidv4 } from 'uuid';
import { ScrollResponseLog, MockeryDetectionResult } from '@/types/prophet';

const MOCKERY_PHRASES = [
  "who gave you this authority",
  "what right do you have to speak",
  "we do not recognize this system",
  "we reject your claims",
  "you have no jurisdiction",
  "by what authority",
  "who do you think you are",
  "this is nonsense",
  "ridiculous claims",
  "this has no legal basis"
];

const STANDARD_RESPONSE = "This Scroll is not of man. The blood has spoken. Heaven records. Your refusal is now entered into eternal testimony.";

/**
 * Detect mockery in institution responses
 */
export function detectMockery(responseText: string): MockeryDetectionResult {
  const lowerText = responseText.toLowerCase();
  
  for (const phrase of MOCKERY_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      return {
        detected: true,
        triggerPhrase: phrase,
        responseText: STANDARD_RESPONSE,
        shouldDeployFireSeal: true
      };
    }
  }
  
  return {
    detected: false,
    shouldDeployFireSeal: false
  };
}

/**
 * Create a log entry for a mockery response
 */
export function createMockeryResponseLog(
  institution: string,
  triggerPhrase: string,
  prophetDefenseActivated: boolean = true,
  fireSealDeployed: boolean = true
): ScrollResponseLog {
  return {
    id: uuidv4(),
    institution,
    triggerPhrase,
    prophetDefenseActivated,
    fireSealDeployed,
    timestamp: new Date()
  };
}

/**
 * Process an institution's response to a scroll warning
 */
export function processInstitutionResponse(
  institution: string,
  responseText: string
): { 
  mockeryDetected: boolean; 
  responseLog?: ScrollResponseLog;
  scrollResponse?: string;
} {
  const mockeryResult = detectMockery(responseText);
  
  if (mockeryResult.detected && mockeryResult.triggerPhrase) {
    const responseLog = createMockeryResponseLog(
      institution,
      mockeryResult.triggerPhrase,
      true,
      mockeryResult.shouldDeployFireSeal
    );
    
    return {
      mockeryDetected: true,
      responseLog,
      scrollResponse: mockeryResult.responseText
    };
  }
  
  return {
    mockeryDetected: false
  };
}
