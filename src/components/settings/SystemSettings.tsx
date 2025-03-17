
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Sliders, RefreshCw, HardDrive, Timer, BarChart, BatteryCharging } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [dataBackup, setDataBackup] = useState(true);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [enhancedLogging, setEnhancedLogging] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">System Settings</h2>
        <p className="text-muted-foreground text-sm">
          Configure system behavior and operational parameters.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <RefreshCw size={18} />
            </div>
            <div>
              <p className="font-medium">Automatic Updates</p>
              <p className="text-sm text-muted-foreground">Keep the system updated with latest optimizations</p>
            </div>
          </div>
          <Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} />
        </div>
        
        <div className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <HardDrive size={18} />
            </div>
            <div>
              <p className="font-medium">Automatic Data Backup</p>
              <p className="text-sm text-muted-foreground">Backup sensor and simulation data daily</p>
            </div>
          </div>
          <Switch checked={dataBackup} onCheckedChange={setDataBackup} />
        </div>
        
        <div className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <BatteryCharging size={18} />
            </div>
            <div>
              <p className="font-medium">Low Power Mode</p>
              <p className="text-sm text-muted-foreground">Reduce system resource usage during inactive periods</p>
            </div>
          </div>
          <Switch checked={lowPowerMode} onCheckedChange={setLowPowerMode} />
        </div>
        
        <div className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <BarChart size={18} />
            </div>
            <div>
              <p className="font-medium">Enhanced Logging</p>
              <p className="text-sm text-muted-foreground">Collect detailed system performance data</p>
            </div>
          </div>
          <Switch checked={enhancedLogging} onCheckedChange={setEnhancedLogging} />
        </div>
        
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-medium">Data Collection Interval</h3>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <Timer size={18} />
            </div>
            <div className="flex-1">
              <input 
                type="range" 
                min={1} 
                max={60} 
                step={1} 
                defaultValue={5}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1s</span>
                <span>30s</span>
                <span>60s</span>
              </div>
            </div>
            <div className="w-12 text-center">
              <span className="text-sm font-medium">5s</span>
            </div>
          </div>
        </div>
        
        <div className="pt-4 space-y-4">
          <h3 className="text-base font-medium">System Maintenance</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-muted hover:bg-muted/80 transition-colors rounded-md text-sm font-medium">
              Clear Cache
            </button>
            <button className="px-4 py-2 bg-muted hover:bg-muted/80 transition-colors rounded-md text-sm font-medium">
              Reset Defaults
            </button>
            <button className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors rounded-md text-sm font-medium">
              Factory Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
