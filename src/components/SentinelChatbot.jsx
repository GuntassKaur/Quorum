import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, MessageSquare, Sparkles, MapPin, Zap } from 'lucide-react';

/**
 * SentinelChatbot Component v7.0
 * The simplified but powerful AI assistant for Quorum OS.
 */
export default function SentinelChatbot({ zones, userZone, emergency }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to Quorum. I am Sentinel. How can I help you find your way?", sender: 'ai' },
        { id: 2, text: "कोरुम में आपका स्वागत है। मैं सेंटिनल हूँ। मैं आपकी कैसे मदद कर सकता हूँ?", sender: 'ai' }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    const quickReplies = [
        { en: "Where should I go?", action: "where" },
        { en: "Nearest exit?", action: "exit" },
        { en: "Is my zone safe?", action: "safety" }
    ];

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const getAIResponse = (query) => {
        setIsTyping(true);
        setTimeout(() => {
            let response = "";
            const q = query.toLowerCase();
            const currentZoneData = zones.find(z => z.id === userZone) || { density: 0 };

            if (q.includes('exit')) {
                response = emergency ? "EMERGENCY: Please proceed to Gate E1 (North) immediately." : "The fastest exit from your sector is Gate E1. The path is clear.";
            } else if (q.includes('washroom') || q.includes('toilet')) {
                response = "The nearest washroom is in Sector B (East Wing). Follow the blue line on your map.";
            } else if (q.includes('safe') || q.includes('density') || q.includes('crowd')) {
                response = currentZoneData.density > 75 
                    ? `Sector ${userZone} is currently busy (${Math.round(currentZoneData.density)}%). Please move carefully.` 
                    : `Your area (Sector ${userZone}) is safe. Occupancy is at ${Math.round(currentZoneData.density)}%.`;
            } else if (q.includes('where')) {
                response = `You are in Sector ${userZone}. You can use the buttons on your screen to find the exit, washrooms, or food.`;
            } else {
                response = "I'm here to help you navigate. Try asking for the 'nearest exit' or 'washroom'.";
            }

            setMessages(prev => [...prev, { id: Date.now(), text: response, sender: 'ai' }]);
            setIsTyping(false);
        }, 1500); 
    };

    const handleSend = (text) => {
        if (!text.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
        setInput("");
        getAIResponse(text);
    };

    return (
        <>
            {/* FLOATING CHAT BUTTON */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[600] group"
            >
                <div className="absolute inset-0 bg-[#10b981] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-14 h-14 md:w-20 md:h-20 bg-[#10b981] rounded-3xl shadow-2xl flex flex-col items-center justify-center text-black overflow-hidden border-4 border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1 hidden md:block">Ask Quorum</span>
                </div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed inset-0 sm:inset-auto sm:bottom-32 sm:right-10 z-[600] sm:w-[400px] h-full sm:h-[600px] bg-black/80 backdrop-blur-3xl border-0 sm:border border-white/10 rounded-0 sm:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* HEADER */}
                        <div className="p-8 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#10b981]/10 flex items-center justify-center border border-[#10b981]/20">
                                    <Bot size={24} className="text-[#10b981]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-black tracking-widest uppercase">Sentinel</h3>
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                    </div>
                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mt-0.5">Safety Assistant</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white p-2"><X size={20} /></button>
                        </div>

                        {/* MESSAGES */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[85%] p-5 rounded-2xl text-[13px] leading-relaxed ${
                                        msg.sender === 'ai' 
                                        ? 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none font-medium' 
                                        : 'bg-[#10b981] text-black font-black rounded-tr-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-1">
                                        <div className="w-1 h-1 bg-[#10b981] rounded-full animate-bounce" />
                                        <div className="w-1 h-1 bg-[#10b981] rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1 h-1 bg-[#10b981] rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* QUICK REPLIES */}
                        <div className="px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-t border-white/5 bg-black/20">
                            {quickReplies.map((reply, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => handleSend(reply.en)} 
                                    className="shrink-0 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-[#10b981]/40 transition-all whitespace-nowrap"
                                >
                                    {reply.en}
                                </button>
                            ))}
                        </div>

                        {/* INPUT */}
                        <div className="p-8 bg-white/5 border-t border-white/10">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                                    placeholder="Type a message..."
                                    className="w-full bg-black/40 border-2 border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#10b981]/50 transition-all pr-16"
                                />
                                <button 
                                    onClick={() => handleSend(input)} 
                                    className="absolute right-4 w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center text-black hover:brightness-110 transition-all"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
