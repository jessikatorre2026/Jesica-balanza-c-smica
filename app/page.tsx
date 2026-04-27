'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Activity } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: 'Saludos, viajero del conocimiento. Soy el artefacto que custodia el equilibrio. Mis platillos detectan una anomalía en el sector de aritmética. ¿Estás listo para restaurar la igualdad?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'En línea' | 'Silencio cósmico' | 'Error de señal'>('En línea');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);
    setStatus('En línea');
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };
    setMessages((prev) => [...prev, newUserMsg]);

    try {
      const apiMessages = [...messages, newUserMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error en comunicación cósmica.');
      }

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply
      }]);
    } catch (err: any) {
      console.error(err);
      setStatus('Error de señal');
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ [SISTEMA FALLANDO]: ${err.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-deep)] text-[var(--text-main)] font-sans relative">
      {/* HEADER */}
      <header className="glass-panel p-4 shadow-xl border-b border-slate-700/50 flex items-center justify-between shrink-0 z-20 relative">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-400/50 shadow-[0_0_15px_var(--glow)]">
            <Activity className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tighter uppercase text-sky-400 glitch-text">La Balanza Cósmica</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-mono">
              Estado: <span className={status === 'En línea' ? 'text-green-400' : 'text-red-400'}>{status}</span>
            </p>
          </div>
        </div>
        <div className="hidden md:block px-4 py-1 border border-sky-500/30 bg-sky-500/5 rounded text-sky-400 text-xs font-bold uppercase animate-[pulse-slow_3s_infinite_ease-in-out]">
          ESTABILIDAD UNIVERSAL
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-40 scrollbar-thin scrollbar-thumb-[var(--border-color)] scrollbar-track-transparent">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
              <div
                className={`max-w-[85%] md:max-w-xl p-4 md:p-5 rounded-xl shadow-lg border ${
                  isUser
                    ? 'bg-sky-900/40 border-sky-500/30 message-user rounded-tr-none'
                    : 'bg-slate-800/80 border-slate-700 message-bot rounded-tl-none'
                }`}
              >
                <div 
                  className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    isUser ? 'text-sky-100' : 'text-slate-300'
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }}
                />
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="mb-2 flex items-center space-x-2 text-[10px] text-slate-500 uppercase font-mono pulse pl-4">
              <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_var(--glow)]"></span>
              <span>Balanza procesando masas...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* INPUT BAR */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent shrink-0 pointer-events-none z-10">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto w-full pointer-events-auto">
          <input
            type="text"
            autoFocus
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Introduce el valor de la carga estelar..."
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-6 py-4 pr-32 text-sky-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-2xl disabled:opacity-50 backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-[50%] -translate-y-[50%] bg-sky-500 hover:bg-sky-400 text-slate-900 p-2 md:px-4 md:py-2 rounded-lg transition-colors flex items-center shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
          >
            <span className="hidden md:inline mr-2 font-bold text-sm">ENVIAR</span>
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
