
import React from 'react';
import { User, Mail, Building, MapPin } from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Profile Settings</h2>
        <p className="text-muted-foreground text-sm">
          Manage your personal information and account preferences.
        </p>
      </div>

      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <span className="text-2xl font-medium">AT</span>
        </div>
        <div>
          <h3 className="font-medium">Admin User</h3>
          <p className="text-sm text-muted-foreground">Factory Administrator</p>
        </div>
        <button className="ml-auto px-3 py-1 text-sm border rounded-md hover:bg-muted transition-colors">
          Change Avatar
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                value="Admin Tester"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="email" 
                className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                value="admin@factory.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                value="Smart Factory Inc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                value="Industrial Zone A"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-base font-medium mb-4">Security</h3>
        <button className="px-4 py-2 bg-muted hover:bg-muted/80 transition-colors rounded-md text-sm font-medium">
          Change Password
        </button>
      </div>
    </div>
  );
};
