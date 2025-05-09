
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface PreferenceToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const PreferenceToggle = ({ label, checked, onChange }: PreferenceToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <label className="text-justice-light">
        {label}
      </label>
      <Switch 
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
};

export default PreferenceToggle;
