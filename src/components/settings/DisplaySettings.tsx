
import React, { useState } from 'react';
import { Moon, Sun, MonitorSmartphone, Layout, SlidersHorizontal } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

export const DisplaySettings: React.FC = () => {
  const [theme, setTheme] = useState("system");
  const [animations, setAnimations] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Display Settings</h2>
        <p className="text-muted-foreground text-sm">
          Customize the appearance and behavior of the interface.
        </p>
      </div>

      <div className="space-y-5">
        <div className="pb-4 border-b">
          <h3 className="text-base font-medium mb-3">Theme Preferences</h3>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => setTheme("light")}
              className={`p-3 border rounded-md flex flex-col items-center gap-2 hover:bg-muted transition-colors ${theme === "light" ? "border-primary bg-primary/5" : ""}`}
            >
              <Sun size={18} />
              <span className="text-sm font-medium">Light</span>
            </button>
            
            <button 
              onClick={() => setTheme("dark")}
              className={`p-3 border rounded-md flex flex-col items-center gap-2 hover:bg-muted transition-colors ${theme === "dark" ? "border-primary bg-primary/5" : ""}`}
            >
              <Moon size={18} />
              <span className="text-sm font-medium">Dark</span>
            </button>
            
            <button 
              onClick={() => setTheme("system")}
              className={`p-3 border rounded-md flex flex-col items-center gap-2 hover:bg-muted transition-colors ${theme === "system" ? "border-primary bg-primary/5" : ""}`}
            >
              <MonitorSmartphone size={18} />
              <span className="text-sm font-medium">System</span>
            </button>
          </div>
        </div>
        
        <div className="pb-4 border-b space-y-4">
          <h3 className="text-base font-medium">Interface Options</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <Layout size={18} />
              </div>
              <div>
                <p className="font-medium">Animations</p>
                <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
              </div>
            </div>
            <Switch checked={animations} onCheckedChange={setAnimations} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <SlidersHorizontal size={18} />
              </div>
              <div>
                <p className="font-medium">Compact Mode</p>
                <p className="text-sm text-muted-foreground">Reduce spacing in the interface</p>
              </div>
            </div>
            <Switch checked={compactMode} onCheckedChange={setCompactMode} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <SlidersHorizontal size={18} />
              </div>
              <div>
                <p className="font-medium">High Contrast</p>
                <p className="text-sm text-muted-foreground">Increase contrast for better readability</p>
              </div>
            </div>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
        </div>
        
        <div className="pb-4 space-y-3">
          <h3 className="text-base font-medium">Chart Display</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Chart Animation Speed</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="fast">Fast</option>
                <option value="normal" selected>Normal</option>
                <option value="slow">Slow</option>
                <option value="none">None</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Default View</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="daily" selected>Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Color Scheme</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="default" selected>Default</option>
                <option value="monochrome">Monochrome</option>
                <option value="colorful">Colorful</option>
                <option value="pastel">Pastel</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
