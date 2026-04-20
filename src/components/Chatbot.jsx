import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';

const RESPONSES = {
  en: {
    seat: (seat, zone, gate) => `You are currently assigned to seat ${seat || 'A1-102'} in Sector ${zone}. Your primary routing exit is ${gate}.`,
    exit: (gate, zone, density) => `From Sector ${zone}, your optimal evacuation route is ${gate}. Current sector load is ${Math.round(density * 100)}%. ETA: ~2 mins.`,
    safe: (density, zone, gate) => `Sector ${zone} is ${density < 0.8 ? 'operating safely' : 'at HIGH CAPACITY'}. Density is ${Math.round(density * 100)}%. If needed, your nearest exit is ${gate}.`,
    urgent: (gate) => `🚨 SYSTEM RED: EVACUATE TO ${gate} IMMEDIATELY. FOLLOW OVERHEAD LIGHTS.`,
    default: "I am QUORUM AI. I am monitoring your entire sector. Ask me about your seat, safety, or nearest exit.",
    greet: "Real-time feed established. I am tracking your zone. How can I assist?"
  },
  hi: {
    seat: (seat) => `आपकी सीट ${seat || 'A1-102'} है। कृपया डैशबोर्ड पर हाइलाइट किए गए क्षेत्र का पालन करें।`,
    exit: (gate) => `आपके स्थान से सबसे सुरक्षित निकास ${gate} है। समय: लगभग 2 मिनट।`,
    safe: (density) => `आपका क्षेत्र अभी ${density < 0.7 ? 'सुरक्षित' : 'भीड़भाड़ वाला'} है। घनत्व: ${Math.round(density * 100)}%।`,
    urgent: "🚨 सिस्टम रेड: कृपया तुरंत नज़दीकी निकास की ओर बढ़ें।",
    default: "मैं कोरम एआई हूँ। स्थिति रिपोर्ट के लिए 'exit', 'seat' या 'safety' टाइप करें।",
    greet: "सैटेलाइट फीड से कनेक्टेड। मैं आपका मार्गदर्शन कैसे कर सकता हूँ?"
  }
};

const ZONE_EXIT_MAP = {
  'A1': 'Gate 4', 'B2': 'Gate 6', 'C3': 'Gate 2', 'D4': 'Gate 8', 'F6': 'Gate 5', 'Central': 'Gate 4'
};

const detectLanguage = (text) => {
  const lower = text.toLowerCase();
  if (lower.match(/[\u0900-\u097F]/) || lower.match(/\b(namaste|kya|kaise|rasta|nikas)\b/)) return 'hi';
  return 'en';
};

export default function Chatbot({ emergency, userZone, zones, userSeatId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: 'greet', text: RESPONSES.en.greet, sender: 'bot' }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const handleSend = (textOverride = null) => {
    const rawInput = textOverride || input;
    if (!rawInput.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), text: rawInput, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lang = detectLanguage(rawInput);
      const query = rawInput.toLowerCase();
      const zoneData = (zones || []).find(z => z.label?.includes(userZone)) || { density: 0.4 };
      const gate = ZONE_EXIT_MAP[userZone] || 'Gate 4';

      let reply = RESPONSES.en.default;
      if (emergency) reply = RESPONSES.en.urgent(gate);
      else if (query.includes('seat')) reply = RESPONSES.en.seat(userSeatId, userZone, gate);
      else if (query.includes('exit') || query.includes('gate') || query.includes('naka')) reply = RESPONSES.en.exit(gate, userZone, zoneData.density);
      else if (query.includes('safe') || query.includes('risk') || query.includes('bheed')) reply = RESPONSES.en.safe(zoneData.density, userZone, gate);

      setMessages(prev => [...prev, { id: Date.now(), text: reply, sender: 'bot', urgent: emergency }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 z-[500] w-16 h-16 bg-[#00ffc8] rounded-full flex items-center justify-center text-black shadow-2xl hover:scale-110 transition-transform">
        <MessageSquare size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 z-[600] w-96 h-[550px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className={`p-6 border-b border-white/10 flex justify-between items-center ${emergency ? 'bg-red-900/50' : 'bg-white/5'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00ffc8] flex items-center justify-center text-black font-black italic">Q</div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Quorum AI</h3>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest">Satellite Active</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] font-medium leading-relaxed ${m.sender === 'user' ? 'bg-[#00ffc8] text-black rounded-br-sm' : m.urgent ? 'bg-red-600 border border-red-500 text-white rounded-bl-sm' : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 px-4 py-5 rounded-3xl rounded-bl-sm flex gap-1.5">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-[#00ffc8] rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#00ffc8] rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#00ffc8] rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-6 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
              {['Find Exit', 'Is it Safe?', 'My Seat'].map(btn => (
                <button 
                  key={btn} 
                  onClick={() => handleSend(btn)} 
                  className="whitespace-nowrap px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[11px] text-white/70 hover:bg-[#00ffc8]/10 hover:text-[#00ffc8] hover:border-[#00ffc8]/30 transition-all font-bold tracking-widest uppercase"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask exit, seat, safety..."
                className="flex-1 bg-black/50 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-[#00ffc8]" 
              />
              <button onClick={() => handleSend()} className="w-12 h-12 rounded-full bg-[#00ffc8] flex items-center justify-center text-black"><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
