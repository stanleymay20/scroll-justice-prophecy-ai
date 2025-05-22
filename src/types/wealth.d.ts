
export type ScrollWealthDebt = {
  id: string;
  debtor_nation: string;
  owed_to_nation: string;
  category: 'Labor' | 'Gold' | 'Artifacts' | 'Land' | 'Wages';
  estimated_value_usd: number;
  last_updated: string;
  tribunal_case_id?: string;
};
