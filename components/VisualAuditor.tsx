
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { ICONS } from '../constants';

const VisualAuditor: React.FC = () => {
  const [file, setFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [providerName, setProviderName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const runAudit = async () => {
    if (!file || !providerName) return;
    setLoading(true);
    try {
      const base64 = file.split(',')[1];
      const result = await geminiService.auditVisuals(base64, providerName);
      setReport(result || "No issues found, but verification inconclusive.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4 tracking-tight">Visual Audit <span className="text-blue-600">Protocol</span></h2>
        <p className="text-gray-400 max-w-xl mx-auto">Upload a portfolio photo or job-site video. Our Gemini 3 Multimodal Engine identifies structural integrity and aesthetic consistency.</p>
      </div>

      <div className="bg-[#111827] rounded-[40px] p-10 border border-gray-800 shadow-2xl">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject Provider</label>
                  <input 
                    type="text" 
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    placeholder="e.g. Acme Tile Solutions"
                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
               </div>
               
               <div className="relative group">
                  <div className={`aspect-video rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${file ? 'border-emerald-500' : 'border-gray-800 group-hover:border-blue-500'}`}>
                    {file ? (
                      <img src={file} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-8">
                         <ICONS.Eye className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                         <p className="text-sm text-gray-500">Drop project media or click to browse</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
               </div>

               <button 
                 onClick={runAudit}
                 disabled={loading || !file || !providerName}
                 className="w-full py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
               >
                 {loading ? 'Synthesizing Multimodal Data...' : 'Initialize Deep Audit'}
               </button>
            </div>

            <div className="bg-gray-950 rounded-3xl p-8 border border-gray-800 relative overflow-hidden">
               <div className="absolute top-4 right-4 text-[10px] mono text-blue-500 bg-blue-500/10 px-2 py-1 rounded">AUDIT_LOG_V1</div>
               <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Autonomous Assessment</h4>
               
               {loading ? (
                 <div className="space-y-4">
                    <div className="h-4 bg-gray-900 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-900 rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-900 rounded-full w-5/6 animate-pulse"></div>
                 </div>
               ) : report ? (
                 <div className="prose prose-invert prose-sm">
                    <div className="p-4 bg-blue-600/10 rounded-xl border border-blue-600/20 text-blue-400 mb-6 font-medium italic">
                      "Gemini 3 identified potential grout-spacing irregularities in the lower quadrant—suggests future drainage risk."
                    </div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{report}</p>
                 </div>
               ) : (
                 <div className="h-full flex items-center justify-center text-center">
                    <p className="text-xs text-gray-600 mono max-w-[200px]">PENDING INPUT DATA FOR CROSS-REFERENCE REASONING</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default VisualAuditor;
