
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { ICONS } from '../constants';

const VibeSim: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [simImage, setSimImage] = useState<string | null>(null);
  const [style, setStyle] = useState('Desert Modern Landscaping');
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setBaseImage(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const generateVibe = async () => {
    if (!baseImage) return;
    setLoading(true);
    try {
      const b64 = baseImage.split(',')[1];
      const result = await geminiService.generateSimulation(b64, style);
      setSimImage(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-[#111827] rounded-[40px] p-8 border border-gray-800 shadow-2xl">
             <h3 className="text-2xl font-black mb-2">Vibe Engineering</h3>
             <p className="text-gray-400 text-sm mb-8 italic">Simulate a provider's specific aesthetic signature on your own property before hiring.</p>
             
             <div className="space-y-4">
                <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-gray-800 group hover:border-blue-500 transition-all cursor-pointer">
                   {baseImage ? (
                     <img src={baseImage} className="w-full h-full object-cover" />
                   ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ICONS.Layers className="w-10 h-10 text-gray-700 mb-2" />
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Upload Target Site</span>
                     </div>
                   )}
                   <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                <div>
                   <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Provider's Aesthetic Style</label>
                   <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-600 outline-none appearance-none"
                   >
                     <option>Desert Modern Landscaping</option>
                     <option>Scandinavian Minimalist Kitchen</option>
                     <option>Industrial Loft Restoration</option>
                     <option>High-Gloss Automotive Detailing</option>
                   </select>
                </div>

                <button 
                  disabled={loading || !baseImage}
                  onClick={generateVibe}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? 'Projecting Future Reality...' : 'Generate Simulation Loop'}
                </button>
             </div>
          </div>
        </div>

        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[45px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
           <div className="relative bg-[#111827] rounded-[40px] border border-gray-800 h-full overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                 <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Multimodal Projection</span>
                 <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                 </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-4">
                 {loading ? (
                   <div className="space-y-4 w-full px-12">
                      <div className="h-64 bg-gray-900 rounded-3xl animate-pulse"></div>
                      <div className="text-center">
                         <p className="text-sm text-blue-500 mono animate-bounce">RENDERING SUB-PIXEL TRANSFORMATIONS...</p>
                      </div>
                   </div>
                 ) : simImage ? (
                   <div className="space-y-4">
                      <img src={simImage} className="w-full rounded-3xl shadow-2xl border border-white/10" />
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400 text-xs text-center font-medium">
                        "Visualizing {style} signature. Integration successful."
                      </div>
                   </div>
                 ) : (
                   <div className="text-center opacity-30 px-20">
                      <ICONS.Activity className="w-20 h-20 mx-auto mb-6 text-gray-700" />
                      <p className="text-sm mono uppercase font-bold tracking-tighter">Simulation data stream empty. Awaiting site telemetry.</p>
                   </div>
                 )}
              </div>

              <div className="p-6 bg-gray-950/50 flex items-center justify-center border-t border-gray-800">
                 <p className="text-[10px] text-gray-600 mono">Gemini 2.5 Flash Image Engine • Adaptive Upscaling ACTIVE</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VibeSim;
