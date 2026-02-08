
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

        {hasKey === false || hasKey === null ? (
          // <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6 text-center">

          <div className="p-6">
            <div className="flex w-full max-w-lg flex-col gap-6">

              <Item variant="outline">
                <ItemMedia variant="icon">
                   <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Activate OmniScout Vision</ItemTitle>
                  <ItemDescription>
                    You need to connect an API key.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button size="sm" variant="outline" onClick={handleSelectKey}
                  >
                    Connect
                  </Button>
                  {/* <APIKeyDialog title='Connect'/> */}
                </ItemActions>
              </Item>
            </div>
            {/* <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-8">
              <ICONS.Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase">Activate OmniScout Vision</h1>
            <p className="text-gray-400 max-w-md mb-12 leading-relaxed">
              To enable High-Quality Visual Simulations and Deep Audits (Gemini 3 Pro), you must connect a professional API key from a paid GCP project.
            </p>
            <button
              onClick={handleSelectKey}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 transition-all active:scale-95"
            >
              CONNECT SECURE API KEY
            </button>
            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 text-xs text-gray-600 hover:text-gray-400 underline mono"
            >
              View Billing Documentation &rarr;
            </a> */}
          </div>
        ) : (
          <div className="p-6 border-t border-gray-800">
            <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Gemini 3 Pro Active
              </div>
              <div className="text-[10px] text-gray-600 mono">Node: L-Alpha-7</div>
            </div>
          </div>
        )
        }


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
