
import type { EmergencyAlert as EmergencyAlertType } from '@/types/database';

export interface EmergencyAlertProps {
  sessionId: string;
  onClose?: () => void;
}

export interface AlertSubmissionData {
  message: string;
  sessionId: string;
  userId?: string;
}
