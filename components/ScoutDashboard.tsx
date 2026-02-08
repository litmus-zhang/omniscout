
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ICONS, COLORS } from '../constants';
import * as d3 from 'd3';
import { Search } from 'lucide-react';

const ScoutDashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [resultData, setResultData] = useState<{ text: string, links: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      }, () => {
        console.log("Could not get location. Using default location.");
      });
    }
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setThoughts([
      "Initiating Long-Context Retrieval...",
      "Connecting to Google Maps API for spatial alignment...",
      "Analyzing localized trust signals...",
      "Synthesizing verification data via Gemini 2.5 Flash..."
    ]);

    try {
      const data = await geminiService.searchProviders(query, latitude, longitude);
      setResultData(data);
    } catch (error) {
      console.error(error);
      alert("Verification failed. Please ensure the project settings are correct.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resultData) {
      drawHeatmap();
    }
  }, [resultData]);

  const drawHeatmap = () => {
    const svg = d3.select("#heatmap-svg");
    svg.selectAll("*").remove();
    const width = 600;
    const height = 400;

    const data = Array.from({ length: 400 }, (_, i) => ({
      x: (i % 20) * (width / 20),
      y: Math.floor(i / 20) * (height / 20),
      value: Math.random() * 100
    }));

    const color = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", width / 20)
      .attr("height", height / 20)
      .attr("fill", d => color(d.value))
      .attr("opacity", 0.4);

    // Random markers to represent identified zones
    for(let i=0; i<5; i++) {
      svg.append("circle")
        .attr("cx", Math.random() * width)
        .attr("cy", Math.random() * height)
        .attr("r", 8)
        .attr("fill", COLORS.primary)
        .attr("stroke", "white")
        .attr("stroke-width", 2);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#111827] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 animate-gradient-x"></div>
           <h3 className="text-2xl font-bold mb-2">Multimodal Agent Search</h3>
           <p className="text-gray-400 text-sm mb-6">Enter a service category to begin autonomous verification and trust synthesis.</p>
           
           <div className="flex gap-3">
             <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Master Carpenter for Victorian Restoration"
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
             </div>
             <button 
               onClick={handleSearch}
               disabled={loading}
               className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-2xl font-semibold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
             >
               {loading ? 'Scouting...' : 'Scout AI'}
             </button>
           </div>
        </div>

        {loading ? (
          <div className="bg-[#111827] rounded-3xl p-8 border border-gray-800 h-96 flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <div className="space-y-1 text-center">
                {thoughts.map((t, i) => (
                  <p key={i} className="text-xs text-blue-400 mono animate-pulse">{t}</p>
                ))}
             </div>
          </div>
        ) : resultData ? (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-xl">
               <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <ICONS.Shield className="w-4 h-4 text-blue-500" />
                 Verification Summary
               </h4>
               <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                  <div className="whitespace-pre-wrap">{resultData.text}</div>
               </div>
               
               {resultData.links.length > 0 && (
                 <div className="mt-8 pt-8 border-t border-gray-800">
                    <h5 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Grounding Sources</h5>
                    <div className="flex flex-wrap gap-2">
                       {resultData.links.map((link: any, idx: number) => (
                         <a 
                           key={idx} 
                           href={link.uri} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-blue-400 flex items-center gap-2 transition-colors"
                         >
                           <ICONS.Layers className="w-3 h-3" />
                           {link.title || 'Source'}
                         </a>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/30 border-2 border-dashed border-gray-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center opacity-50">
             <ICONS.Layers className="w-12 h-12 text-gray-700 mb-4" />
             <p className="text-gray-500">Search results will appear here with dynamic heatmap visualization.</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-[#111827] rounded-3xl p-6 border border-gray-800 h-[500px] flex flex-col">
           <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold uppercase text-xs tracking-widest text-gray-400">Quality Heatmap</h4>
              <div className="text-[10px] mono text-emerald-500">LIVE FEED ACTIVE</div>
           </div>
           <div className="flex-1 bg-gray-950 rounded-2xl overflow-hidden relative border border-gray-800">
              <svg id="heatmap-svg" className="w-full h-full"></svg>
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-[10px] mono space-y-1">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> High Verification
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-300 opacity-50"></div> Surface Discovery
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-emerald-500/20 rounded-3xl p-6 border border-white/5">
           <h4 className="font-bold mb-2 flex items-center gap-2">
             <ICONS.Shield className="w-4 h-4 text-emerald-500" />
             Trust Synthesis Protocol
           </h4>
           <p className="text-sm text-gray-400 leading-relaxed mb-4">
             OmniScout identifies "Cause & Effect" patterns in localized service delivery. We ingest years of project metadata to detect grout-to-tiling consistency and drainage integrity.
           </p>
           <div className="grid grid-cols-2 gap-2 text-[10px] mono uppercase text-gray-500">
              <div className="bg-black/20 p-2 rounded">Video Analysis: ON</div>
              <div className="bg-black/20 p-2 rounded">Govt Sync: ACTIVE</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutDashboard;