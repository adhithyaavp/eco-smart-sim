
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your application preferences.</p>
      </div>
      
      <div className="bg-card border rounded-xl p-16 shadow-sm flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Settings module coming soon.</p>
        <p className="text-sm text-muted-foreground mt-1">This feature is under development.</p>
      </div>
    </div>
  );
};

export default Settings;
