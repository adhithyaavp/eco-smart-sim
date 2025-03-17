
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell, Search, Menu, X } from 'lucide-react';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between bg-card border-b z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="hidden md:flex items-center h-9 w-64 rounded-md bg-muted px-3 text-muted-foreground">
              <Search size={16} className="mr-2" />
              <input 
                type="search" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none w-full placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleNotifications}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-destructive"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
              <span className="text-xs font-medium">AT</span>
            </div>
          </div>
        </header>

        {/* Notifications Panel (conditionally rendered) */}
        {notificationsOpen && (
          <div className="absolute right-4 top-16 w-96 bg-card shadow-lg rounded-lg border p-4 z-20 animate-slide-in-top">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Notifications</h3>
              <button 
                onClick={toggleNotifications}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2 hover:bg-muted rounded-md transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-destructive"></div>
                <div>
                  <p className="text-sm font-medium">Temperature sensor offline</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 hover:bg-muted rounded-md transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-warning"></div>
                <div>
                  <p className="text-sm font-medium">Energy usage above threshold</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 hover:bg-muted rounded-md transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-success"></div>
                <div>
                  <p className="text-sm font-medium">Simulation completed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
            <button className="w-full text-center text-sm text-primary mt-3">
              View all notifications
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 px-6 py-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
