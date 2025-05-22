
export type ScrollWitnessRecord = {
  id: string;
  institution: string;
  type: 'Government' | 'Bank' | 'Museum' | 'Church' | 'Corporation';
  warning_issued: boolean;
  warning_date?: string;
  response_received?: boolean;
  repentance_filed?: boolean;
  judgment_timestamp?: string;
  status: 'Observed' | 'Ignored' | 'Repented' | 'Sealed for Judgment';
  created_at: string;
  updated_at: string;
  tribunal_case_id?: string;
};
