
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, AlertTriangle, Zap, Server, AlertCircle } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);
  
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [powerAlerts, setPowerAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Notification Settings</h2>
        <p className="text-muted-foreground text-sm">
          Control how you receive alerts and notifications from the system.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-base font-medium">Notification Methods</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                </div>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <BellOff size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">SMS Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive alerts via SMS</p>
                </div>
              </div>
              <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive alerts in application</p>
                </div>
              </div>
              <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t space-y-4">
          <h3 className="text-base font-medium">Alert Types</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-destructive/10 flex items-center justify-center text-destructive">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">Critical Alerts</p>
                  <p className="text-xs text-muted-foreground">System failures and errors</p>
                </div>
              </div>
              <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-warning/10 flex items-center justify-center text-warning">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">Power Alerts</p>
                  <p className="text-xs text-muted-foreground">Energy usage and efficiency warnings</p>
                </div>
              </div>
              <Switch checked={powerAlerts} onCheckedChange={setPowerAlerts} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <Server size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">System Notifications</p>
                  <p className="text-xs text-muted-foreground">Updates and system changes</p>
                </div>
              </div>
              <Switch checked={systemAlerts} onCheckedChange={setSystemAlerts} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">Maintenance Reminders</p>
                  <p className="text-xs text-muted-foreground">Scheduled maintenance and updates</p>
                </div>
              </div>
              <Switch checked={maintenanceAlerts} onCheckedChange={setMaintenanceAlerts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
