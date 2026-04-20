import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Sparkles, Cpu, Activity, Database, Shield } from 'lucide-react';

export default function NeuralCommand({ onExecute, emergency }) {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef(null);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { id: Date.now(), text, type }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmd = input.toUpperCase().trim();
    setInput('');
    setIsProcessing(true);
    addLog(`> ${cmd}`, 'cmd');

    setTimeout(() => {
      processCommand(cmd);
      setIsProcessing(false);
    }, 800);
  };

  const processCommand = async (cmd) => {
    // Check for local hardcoded overrides first
    if (cmd.includes('EMERGENCY') || cmd.includes('RED')) {
      addLog('!!! CRITICAL OVERRIDE DETECTED !!!', 'error');
      addLog('EXECUTING SYSTEM_RED PROTOCOLS...', 'error');
      onExecute('EMERGENCY');
      return;
    } 
    
    if (cmd.includes('CLEAR') || cmd.includes('RESET')) {
      setLogs([]);
      addLog('System logs purged.', 'info');
      return;
    }

    try {
      // API call to VeriMind Backend
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: cmd,
          context: `Current status: ${emergency ? 'EMERGENCY_RED' : 'NOMINAL'}. Stadium simulation active.`,
        }),
      });

      if (!response.ok) throw new Error('Neural link failure.');

      const result = await response.json();
      if (result.success && result.data?.reply) {
        addLog(result.data.reply, 'info');
      } else {
        throw new Error('Signal malformed.');
      }
    } catch (err) {
      addLog(`AI_SYNC_ERROR: ${err.message}`, 'error');
      // Fallback behavior
      if (cmd.includes('STATUS')) {
        addLog('Telemetry: All MESH nodes operational.', 'success');
        addLog('Density Index: 42% (NOMINAL).', 'info');
      } else if (cmd.includes('PATH') || cmd.includes('ROUTE')) {
        addLog('Vector resolved. Check Map HUD.', 'success');
        onExecute('PATH');
      } else {
        addLog('AI Logic: Command processed locally due to sync failure.', 'info');
      }
    }
  };

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[600px] pointer-events-auto">
      <div className={`obsidian-card rounded-[2rem] border-2 transition-all duration-700 overflow-hidden ${
        emergency ? 'border-red-500/50 shadow-[0_0_50px_rgba(255,0,0,0.2)]' : 'border-cyan-500/30 shadow-[0_0_50px_rgba(0,243,255,0.1)]'
      }`}>
        
        {/* Terminal Header */}
        <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Terminal size={14} className={emergency ? 'text-red-500' : 'text-cyan-400'} />
              <span className={`text-[10px] font-black tracking-[0.3em] uppercase italic ${emergency ? 'text-red-500' : 'text-white/60'}`}>
                QUORUM_NEURAL_SHELL_v4.2
              </span>
           </div>
           <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
           </div>
        </div>

        {/* Console Output */}
        <div 
          ref={scrollRef}
          className="h-32 p-4 overflow-y-auto font-mono text-[9px] space-y-2 bg-black/40 custom-scrollbar"
        >
          {logs.length === 0 && (
            <div className="text-white/20 italic select-none">
              Awaiting neural input directive... Type "STATUS" or "ACTIVATE RED"
            </div>
          )}
          {logs.map(log => (
            <div key={log.id} className={`flex gap-3 ${
              log.type === 'error' ? 'text-red-500' : 
              log.type === 'success' ? 'text-emerald-400' : 
              log.type === 'cmd' ? 'text-white' : 'text-cyan-400/60'
            }`}>
               <span className="shrink-0 opacity-30">[{new Date(log.id).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
               <span className="leading-relaxed">{log.text}</span>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-white/40">
               <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
               <span>AI_THINKING...</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-2 bg-white/[0.03] border-t border-white/5 flex items-center gap-4">
           <div className="pl-4">
              <Sparkles size={16} className={emergency ? 'text-red-500' : 'text-cyan-400'} />
           </div>
           <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="QUORUM, ANALYZE STADIUM LOGISTICS..."
              className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-white placeholder:text-white/10 uppercase tracking-widest"
              autoFocus
           />
           <button 
             type="submit"
             className={`p-3 rounded-2xl transition-all ${
               emergency ? 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white'
             }`}
           >
              <Send size={16} />
           </button>
        </form>
      </div>

      {/* Floating System Badges */}
      <div className="flex justify-center gap-8 mt-4 opacity-40">
         <div className="flex items-center gap-2">
            <Cpu size={10} className="text-cyan-400" />
            <span className="text-[7px] font-mono tracking-widest text-white italic">NEURAL_LOAD: 12%</span>
         </div>
         <div className="flex items-center gap-2">
            <Database size={10} className="text-emerald-400" />
            <span className="text-[7px] font-mono tracking-widest text-white italic">DATA_INTEGRITY: 100%</span>
         </div>
         <div className="flex items-center gap-2">
            <Shield size={10} className="text-orange-400" />
            <span className="text-[7px] font-mono tracking-widest text-white italic">ENCRYPTION: LATTICE_v6</span>
         </div>
      </div>
    </div>
  );
}
