
import React, { useState, useEffect } from 'react';
import { AppTab } from '../types';
import { ICONS, COLORS } from '../constants';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from './ui/item';
import { Button } from './ui/button';
import { Shield, ShieldAlertIcon } from 'lucide-react';
import { APIKeyDialog } from './key-dialog';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    // Assume success as per race condition mitigation rules
    setHasKey(true);
  };
  const menuItems = [
    { id: AppTab.DASHBOARD, label: 'OmniScout Dashboard', icon: ICONS.Layers },
    { id: AppTab.AUDITOR, label: 'Visual Auditor', icon: ICONS.Eye },
    { id: AppTab.LIVE_SCOUT, label: 'Gemini Live Agent', icon: ICONS.Mic },
    { id: AppTab.VIBE_SIM, label: 'Simulation Loop', icon: ICONS.Activity },
    { id: AppTab.LOGS, label: 'Trust Logs', icon: ICONS.Shield },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
            OMNISCOUT <span className="text-blue-500">AI</span>
          </h1>
          <p className="text-[10px] text-gray-500 mt-1 mono uppercase tracking-widest">Autonomous Service Verification</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                : 'text-gray-400 hover:bg-gray-800'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0a0a0b]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mono">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
