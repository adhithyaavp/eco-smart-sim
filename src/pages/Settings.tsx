
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { SystemSettings } from '../components/settings/SystemSettings';
import { DisplaySettings } from '../components/settings/DisplaySettings';
import { DataSettings } from '../components/settings/DataSettings';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure your application preferences.</p>
        </div>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
      
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Tabs 
          defaultValue="profile" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full justify-start px-6 pt-4 bg-muted/30 border-b">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          
          <div className="px-6 py-6">
            <TabsContent value="profile" className="mt-0">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="system" className="mt-0">
              <SystemSettings />
            </TabsContent>

            <TabsContent value="display" className="mt-0">
              <DisplaySettings />
            </TabsContent>

            <TabsContent value="data" className="mt-0">
              <DataSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
