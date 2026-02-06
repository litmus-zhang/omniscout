
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { ICONS } from '../constants';

const LiveScout: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [transcript, setTranscript] = useState('');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are OmniScout, a high-precision field agent. You assist users with real-time site inspections, provider background checks, and quality logs. Be concise and professional.'
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setHistory(prev => [...prev, "OmniScout System Online. How can I assist with your site inspection?"]);
          },
          onmessage: async (msg) => {
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                // Play audio logic (shortened for brevity in this mock-capable UI)
                console.log("Model response received (audio data)");
            }
            if (msg.serverContent?.turnComplete) {
              setHistory(prev => [...prev, "Observation logged."]);
            }
          },
          onerror: () => setIsActive(false),
          onclose: () => setIsActive(false)
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto">
       <div className="flex-1 bg-[#111827] rounded-t-[40px] border-x border-t border-gray-800 p-8 overflow-y-auto space-y-6 relative">
          <div className="absolute inset-0 bg-blue-600/5 pointer-events-none opacity-30"></div>
          
          {history.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
               <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
                  <ICONS.Mic className="w-8 h-8 text-blue-500" />
               </div>
               <p className="text-gray-400">Initiate Field Comms to speak with your autonomous agent.</p>
            </div>
          )}

          {history.map((h, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
               <div className={`max-w-[80%] px-6 py-4 rounded-2xl border text-sm ${
                 i % 2 === 0 
                  ? 'bg-gray-900 border-gray-800 text-gray-100 rounded-bl-none' 
                  : 'bg-blue-600 border-blue-500 text-white rounded-br-none shadow-lg shadow-blue-600/10'
               }`}>
                  {h}
               </div>
            </div>
          ))}
       </div>

       <div className="bg-gray-900 border border-gray-800 rounded-b-[40px] p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`}></div>
             <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{isActive ? 'Session Active' : 'Radio Silent'}</span>
          </div>

          <button 
            onClick={isActive ? stopSession : startSession}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
              isActive 
                ? 'bg-red-500 hover:bg-red-400 text-white shadow-xl shadow-red-500/20' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20'
            }`}
          >
            {isActive ? (
              <><div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> END COMMS</>
            ) : (
              <><ICONS.Mic className="w-5 h-5" /> START FIELD COMMS</>
            )}
          </button>

          <div className="flex gap-2">
             <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 border border-gray-700 cursor-pointer hover:text-white transition-colors">
               <ICONS.Shield className="w-5 h-5" />
             </div>
          </div>
       </div>

       <div className="mt-6 grid grid-cols-3 gap-4">
          {['Check License', 'Analyze Site', 'Call Provider'].map(tool => (
            <div key={tool} className="bg-[#111827] border border-gray-800 p-4 rounded-2xl text-[10px] mono text-gray-500 flex items-center justify-between group cursor-pointer hover:border-blue-500/50">
               <span>TOOL: {tool}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-blue-500"></div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default LiveScout;
