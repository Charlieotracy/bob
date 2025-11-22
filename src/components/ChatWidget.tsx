import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToBob } from '../services/gemini';
import { Send, Bot, X, MessageSquare, Minimize2 } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'model',
      text: "Hi! I'm Bob, your dedicated financial advisor. I've analyzed your data. How can I help you improve your business today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    // Logic disabled to prevent crash
    console.log("Send button clicked - Action disabled");
    
    /*
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const responseText = await sendMessageToBob(userMsg.text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
    */
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => console.log("Chat toggle clicked - Action disabled")} // setIsOpen(true) removed
        className="fixed bottom-6 right-6 h-16 w-16 bg-teal-600 rounded-full shadow-2xl shadow-teal-600/30 flex items-center justify-center text-white hover:bg-teal-700 hover:scale-105 transition-all z-50 group"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-24px)] h-[600px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-10 duration-300 font-sans">
      {/* Header */}
      <div className="bg-[#191919] p-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-teal-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-teal-500/30">
            <Bot size={24} className="text-teal-400" />
          </div>
          <div>
            <h3 className="font-bold">Bob</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
              Financial Advisor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => console.log("Minimize clicked - Action disabled")} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <Minimize2 size={18} />
          </button>
          <button onClick={() => console.log("Close clicked - Action disabled")} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F7FA]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask Bob about your finances..."
            className="w-full pl-4 pr-12 py-3 bg-[#F5F7FA] border border-slate-100 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-200 outline-none transition-all text-sm text-slate-700"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="absolute right-2 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};