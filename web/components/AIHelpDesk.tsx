'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap } from 'lucide-react';

interface Message {
    id: string;
    role: 'ai' | 'user' | 'model'; // 'model' is used for Gemini history compatibility
    content: string;
    timestamp: Date;
}

export default function AIHelpDesk() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: "Hello! I'm the GridFlow AI Support Agent. I've analyzed your current node status. How can I assist with your extractions today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        try {
            // Prepare history for Gemini (roles must be 'user' or 'model')
            const history = messages.map(m => ({
                role: m.role === 'ai' ? 'model' : m.role,
                parts: [{ text: m.content }]
            }));

            const response = await fetch('/api/ai/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: currentInput,
                    history,
                    context: {
                        platform: 'web_dashboard',
                        current_tier: 'Free',
                        session_id: 'GF-99-BETA'
                    }
                })
            });

            if (!response.ok) throw new Error('Network desync');

            const data = await response.json();

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: data.text,
                timestamp: new Date()
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "System Alert: Momentary neural desync. Please re-initialize query.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl overflow-hidden flex flex-col h-[500px] transition-all duration-500 hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5">
            {/* Header */}
            <div className="p-4 border-b border-slate-100/50 dark:border-slate-800/50 bg-linear-to-r from-indigo-500/5 to-purple-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200/50 dark:shadow-none relative">
                        <Bot className="w-5 h-5" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-slate-50 flex items-center gap-2 tracking-tight uppercase">
                            Support_Agent_V2
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Neural_Relay_Active</p>
                    </div>
                </div>
                <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-mono font-bold text-slate-500">
                    BETA_TEST_MODE
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20 dark:bg-black/10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800" ref={scrollRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[88%] rounded-2xl p-3.5 text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-br-none shadow-lg shadow-indigo-500/20'
                                : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 rounded-bl-none shadow-sm'
                            }`}>
                            {msg.content}
                            <div className={`text-[9px] mt-1.5 font-mono uppercase tracking-tighter opacity-50 ${msg.role === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // {msg.role === 'user' ? 'CLIENT' : 'NODE_SUPPORT'}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-[10px] font-black font-mono text-indigo-500 uppercase tracking-widest">Processing...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-100/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 group">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Initialize query..."
                        className="w-full pl-5 pr-14 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 text-sm transition-all font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 p-2.5 bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-30 disabled:grayscale transition-all"
                    >
                        <Send className="w-4.5 h-4.5" />
                    </button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <p className="text-[9px] font-mono uppercase tracking-widest text-slate-300 dark:text-slate-600">
                        Neural_Logic_V2 • Context_Aware_Mode
                    </p>
                </div>
            </form>
        </div>
    );
}
