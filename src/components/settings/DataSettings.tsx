
import React, { useState } from 'react';
import { FileOutput, Import, Database, Download, Upload, Trash } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

export const DataSettings: React.FC = () => {
  const [autoExport, setAutoExport] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Data Management</h2>
        <p className="text-muted-foreground text-sm">
          Control how sensor and simulation data is stored and managed.
        </p>
      </div>

      <div className="space-y-5">
        <div className="pb-4 border-b">
          <h3 className="text-base font-medium mb-3">Data Export & Import</h3>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 transition-colors rounded-md text-sm font-medium">
              <Download size={16} />
              Export Sensor Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 transition-colors rounded-md text-sm font-medium">
              <Download size={16} />
              Export Simulations
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 transition-colors rounded-md text-sm font-medium">
              <Upload size={16} />
              Import Data
            </button>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <FileOutput size={18} />
              </div>
              <div>
                <p className="font-medium">Automatic Daily Export</p>
                <p className="text-sm text-muted-foreground">Export data daily to local storage</p>
              </div>
            </div>
            <Switch checked={autoExport} onCheckedChange={setAutoExport} />
          </div>
        </div>
        
        <div className="pb-4 border-b space-y-4">
          <h3 className="text-base font-medium">Data Storage</h3>
          
          <div className="rounded-md border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Storage Usage</h4>
              <span className="text-sm text-muted-foreground">67% used</span>
            </div>
            
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '67%' }}></div>
            </div>
            
            <div className="mt-2 flex text-xs text-muted-foreground justify-between">
              <span>0 GB</span>
              <span>20 GB / 30 GB</span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-primary rounded-full"></div>
                  Sensor Data
                </span>
                <span>12.5 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-info rounded-full"></div>
                  Simulation Data
                </span>
                <span>5.8 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-warning rounded-full"></div>
                  Reports
                </span>
                <span>1.7 GB</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base font-medium">Data Retention</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Keep Sensor Data For</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="30days">30 Days</option>
                <option value="90days" selected>90 Days</option>
                <option value="180days">180 Days</option>
                <option value="1year">1 Year</option>
                <option value="forever">Forever</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Keep Simulation History For</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="30days">30 Days</option>
                <option value="90days">90 Days</option>
                <option value="180days" selected>180 Days</option>
                <option value="1year">1 Year</option>
                <option value="forever">Forever</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors rounded-md text-sm font-medium">
              <Trash size={16} />
              Clear All Sensor Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors rounded-md text-sm font-medium">
              <Trash size={16} />
              Clear All Simulation Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
