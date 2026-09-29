import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Brain,
  Shield,
  Lock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Database,
  Terminal
} from 'lucide-react';
import { api } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `I am **Memory Forge AI**, your security operations and organizational memory agent. I maintain continuous recall across our 1,284 historical incident investigations, root causes, control mappings, and verified audit evidence in Hindsight.

How can I assist your investigation or audit inquiry today?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const sampleQuestions = [
    'Have we seen this type of storage incident before?',
    'What is our most frequent recurring security finding?',
    'What evidence exists for Access Control remediation?',
    'Summarize our audit posture for SOC 2 CC6.1.'
  ];

  const handleSend = async (textToSend?: string) => {
    const message = textToSend || input;
    if (!message.trim() || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await api.sendChatMessage(message);
      const botMsg: Message = {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>Memory Forge AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Grounded in Hindsight
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Strictly grounded in verified historical incidents. Zero fabrication.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Chips */}
      <div className="flex flex-wrap gap-1.5">
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 text-xs font-bold font-mono">
                MF
              </div>
            )}

            <div
              className={`max-w-2xl rounded-xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white font-medium ml-12'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 mr-12'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70 font-mono">
                <span>{m.role === 'user' ? 'You' : 'Memory Forge AI'}</span>
                <span>{m.timestamp}</span>
              </div>
              <div className="font-sans">{m.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800 w-fit">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Recalling from Hindsight organizational memory...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything about past incidents, remediation playbooks, or controls..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-950/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
