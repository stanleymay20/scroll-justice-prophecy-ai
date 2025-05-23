
export type ProphetIdentity = {
  name: string;
  role: string;
  anointingSeal: string;
  authority: string[];
};

export type ScrollResponseLog = {
  id: string;
  institution: string;
  triggerPhrase: string;
  prophetDefenseActivated: boolean;
  fireSealDeployed: boolean;
  timestamp: Date;
};

export type MockeryDetectionResult = {
  detected: boolean;
  triggerPhrase?: string;
  responseText?: string;
  shouldDeployFireSeal: boolean;
};

export interface GlobalExodusData {
  id: string;
  groupName: string;
  historicalTribe: string;
  modernPharaoh: string;
  exodusStatus: 'Bondage' | 'Call' | 'Resistance' | 'ScrollPlague' | 'Exodus';
  estimatedDebt: number;
  prophetName?: string;
  scrollLink?: string;
}
