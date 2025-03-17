
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Radio, FlaskConical, BarChart3, Settings } from 'lucide-react';

interface SidebarProps {
  open: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
  
  const navItems = [
    { 
      icon: LayoutDashboard,
      label: 'Dashboard', 
      path: '/dashboard'
    },
    { 
      icon: Radio,
      label: 'Sensors', 
      path: '/sensors'
    },
    { 
      icon: FlaskConical,
      label: 'Simulation', 
      path: '/simulation'
    },
    { 
      icon: BarChart3,
      label: 'Reports', 
      path: '/reports'
    },
    { 
      icon: Settings,
      label: 'Settings', 
      path: '/settings'
    }
  ];

  return (
    <aside 
      className={`${open ? 'w-64' : 'w-16'} bg-card border-r border-border flex flex-col h-screen sticky top-0 transition-all duration-300 ease-spring z-20`}
    >
      {/* Logo */}
      <div className="h-16 border-b flex items-center px-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">E</span>
          </div>
          {open && (
            <span className="ml-3 font-semibold text-xl tracking-tight animate-fade-in">
              EcoTwin
            </span>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 pt-6 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-md transition-colors group
                    ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}
                  `}
                >
                  <Icon className={`
                    w-5 h-5 
                    ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}
                  `} />
                  {open && (
                    <span className="ml-3 text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Version info */}
      <div className="p-4 text-xs text-muted-foreground mt-auto">
        {open ? 'Version 1.0.0' : 'v1.0'}
      </div>
    </aside>
  );
};
