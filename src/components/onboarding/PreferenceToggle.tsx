
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface PreferenceToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const PreferenceToggle = ({ 
  label, 
  checked, 
  onChange,
  disabled = false 
}: PreferenceToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <label className="text-justice-light">
        {label}
      </label>
      <Switch 
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default PreferenceToggle;
