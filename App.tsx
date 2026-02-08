
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ScoutDashboard from '@/components/ScoutDashboard';
import VisualAuditor from '@/components/VisualAuditor';
import LiveScout from '@/components/LiveScout';
import VibeSim from '@/components/VibeSim';
import { AppTab } from '@/types';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from './components/ui/badge';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <ScoutDashboard />;
      case AppTab.AUDITOR:
        return <VisualAuditor />;
      case AppTab.LIVE_SCOUT:
        return <LiveScout />;
      case AppTab.VIBE_SIM:
        return <VibeSim />;
      case AppTab.LOGS:
        return (
          <div className="space-y-4">
            <div className="bg-blue-600/10 border border-blue-600/20 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Historical Verification Ledger</h3>
              <p className="text-gray-400 text-sm">Long-context reasoning logs from previous scouting missions.</p>
            </div>
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#111827] border border-gray-800 p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-blue-500 mono font-bold border border-gray-800">#{i}</div>
                    <div>
                      <h4 className="font-bold">Mission: Local Plumbing Audit</h4>
                      <p className="text-xs text-gray-500">2024-05-2{i} • Gemini-3-Pro Analysis</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20">VERIFIED</span>
                  {/* <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    Verified
                  </Badge> */}
                </div>
               
              ))}
            </div>
          </div>
        );
      default:
        return <ScoutDashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
