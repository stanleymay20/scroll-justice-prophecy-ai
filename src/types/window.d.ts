
interface SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((ev: Event) => any) | null;
  onsoundstart: ((ev: Event) => any) | null;
  onspeechstart: ((ev: Event) => any) | null;
  onspeechend: ((ev: Event) => any) | null;
  onsoundend: ((ev: Event) => any) | null;
  onaudioend: ((ev: Event) => any) | null;
  onresult: ((ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((ev: SpeechRecognitionError) | ((ev: Event) => any)) | null;
  onstart: ((ev: Event) => any) | null;
  onend: ((ev: Event) => any) | null;
}

interface SpeechRecognitionEventInit extends EventInit {
  resultIndex?: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface Window {
  supabase: any;
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}
