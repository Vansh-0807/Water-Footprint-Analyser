import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I am your AI Agronomist. Ask me anything about crop water requirements, soil retention, or climate analysis.'
    }
  ]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, chatHistory, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const newUserMsg = { id: Date.now(), type: 'user', text: message };
    setChatHistory((prev) => [...prev, newUserMsg]);
    setMessage('');
    setIsTyping(true);

    // Mock AI Response (Later will be replaced by RAG backend)
    setTimeout(() => {
      const newBotMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: 'This is a mocked response from the RAG system. Once the Django backend is integrated, I will analyze agricultural datasets to give you highly accurate advice!' 
      };
      setChatHistory((prev) => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center 
          bg-emerald-600 hover:bg-emerald-500 text-white
          ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:scale-110'}
        `}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 w-[300px] sm:w-[320px] h-[400px] max-h-[60vh] flex flex-col rounded-2xl shadow-2xl z-[100] transition-all duration-300 origin-bottom-right
          bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-emerald-200 dark:border-emerald-900/40 overflow-hidden
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-12 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-emerald-600 dark:bg-stone-800/80 border-b border-emerald-700/50 dark:border-stone-700/50 transition-colors duration-500">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 dark:bg-emerald-500/20 p-2 rounded-full">
              <Bot className="w-5 h-5 text-white dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Agronomist</h3>
              <p className="text-emerald-100 dark:text-stone-400 text-xs">RAG Assistant</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-white/80 hover:text-white dark:text-stone-400 dark:hover:text-stone-200 hover:bg-white/10 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'bot' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-700/30">
                  <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.type === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-stone-800 border border-emerald-100 dark:border-stone-700/50 text-stone-700 dark:text-stone-200 rounded-tl-sm transition-colors duration-500'
                }`}
              >
                {msg.text}
              </div>

              {msg.type === 'user' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center border border-stone-300 dark:border-stone-700 transition-colors duration-500">
                  <User className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-700/30">
                <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="bg-white dark:bg-stone-800 border border-emerald-100 dark:border-stone-700/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm transition-colors duration-500 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/50 dark:bg-stone-900/50 border-t border-emerald-100 dark:border-stone-800 transition-colors duration-500">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-white dark:bg-stone-800 border border-emerald-200 dark:border-stone-700 rounded-full pl-4 pr-12 py-3 text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-500"
            />
            <button 
              type="submit"
              disabled={!message.trim() || isTyping}
              className="absolute right-2 p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white rounded-full transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chatbot;

