import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Paperclip, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Multimodal States
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chatHistory, setChatHistory] = useState<any[]>([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! You can ask me questions or send me photos of your crops for analysis!'
    }
  ]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen, chatHistory, isTyping]);

  // Handle File Selection (creates a preview before sending)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setAttachmentPreview(URL.createObjectURL(file));
      } else {
        setAttachmentPreview('document'); // Generic document preview
      }
    }
    // Reset the input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
  };

  // Send Message & File to Django
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !attachment) return; // Allow sending just an image

    // 1. Add User's message & image preview to the Chat UI immediately
    const userText = message;
    const currentPreview = attachmentPreview;
    const currentFileType = attachment?.type;
    
    setChatHistory((prev) => [...prev, { 
      id: Date.now(), 
      type: 'user', 
      text: userText,
      mediaUrl: currentPreview,
      mediaType: currentFileType
    }]);

    // 2. Prepare the Payload (FormData handles both Text and Files natively)
    const formData = new FormData();
    formData.append('message', userText);
    if (attachment) {
      formData.append('media', attachment);
    }

    // 3. Clear inputs and show typing indicator
    setMessage('');
    removeAttachment();
    setIsTyping(true);

    // 4. Send to Backend
    try {
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/chat/', {
        method: 'POST',
        body: formData, // Notice we don't set Content-Type; the browser handles the multipart boundary automatically
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setChatHistory((prev) => [...prev, { id: Date.now() + 1, type: 'bot', text: data.reply }]);
      } else {
        toast.error("AI Error: " + data.error);
      }
    } catch (err) {
      toast.error('Failed to connect to AI server.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <div className={`fixed bottom-24 right-6 w-[300px] sm:w-[350px] h-[500px] max-h-[70vh] flex flex-col rounded-2xl shadow-2xl z-[100] transition-all duration-300 origin-bottom-right bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-emerald-200 dark:border-emerald-900/40 overflow-hidden ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-12 pointer-events-none'}`}>
        
        {/* Header (Upload button removed from here) */}
        <div className="flex items-center justify-between p-4 bg-emerald-600 border-b border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full"><Bot className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="font-semibold text-white">AI Chatbot</h3>
              {/* <p className="text-emerald-100 text-xs">Multimodal Assistant</p> */}
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'bot' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200"><Bot className="w-4 h-4 text-emerald-600" /></div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm flex flex-col gap-2 ${msg.type === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white dark:bg-stone-800 border border-emerald-100 text-stone-700 dark:text-stone-200 rounded-tl-sm'}`}>
                
                {/* RENDER MEDIA UPLOADS IN THE CHAT BUBBLE */}
                {msg.mediaUrl && msg.mediaType?.startsWith('image/') && (
                  <img src={msg.mediaUrl} alt="upload preview" className="w-full rounded-lg object-cover max-h-40" />
                )}
                {msg.mediaUrl && msg.mediaType?.startsWith('video/') && (
                  <video src={msg.mediaUrl} controls className="w-full rounded-lg max-h-40" />
                )}
                {msg.mediaUrl === 'document' && (
                  <div className="flex items-center gap-2 bg-black/10 p-2 rounded-lg"><FileText className="w-4 h-4" /><span>Document Attached</span></div>
                )}
                
                {/* Text Message */}
                {msg.text && <span>{msg.text}</span>}
              </div>

              {msg.type === 'user' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center border border-stone-300"><User className="w-4 h-4 text-stone-600" /></div>
              )}
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-3 justify-start">
               <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><Bot className="w-4 h-4 text-emerald-600" /></div>
               <div className="bg-white border border-emerald-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white/50 dark:bg-stone-900/50 border-t border-emerald-100 dark:border-stone-800 flex flex-col gap-2">
          
          {/* ATTACHMENT PREVIEW BADGE */}
          {attachment && (
            <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 rounded-lg p-2 max-w-[80%]">
              <div className="flex items-center gap-2 overflow-hidden">
                {attachmentPreview === 'document' ? <FileText className="w-4 h-4 text-emerald-600 shrink-0" /> : <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />}
                <span className="text-xs truncate text-emerald-700 dark:text-emerald-300">{attachment.name}</span>
              </div>
              <button onClick={removeAttachment} className="text-stone-400 hover:text-red-500 shrink-0"><X className="w-4 h-4" /></button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            
            {/* HIDDEN FILE INPUT */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*,video/*,.pdf,.csv,.txt" 
              className="hidden" 
            />
            
            {/* ATTACH PAPERCLIP BUTTON */}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message or upload image..."
              className="flex-1 bg-white dark:bg-stone-800 border border-emerald-200 dark:border-stone-700 rounded-full pl-4 pr-12 py-2.5 text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              type="submit"
              disabled={(!message.trim() && !attachment) || isTyping}
              className="absolute right-1 p-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 disabled:dark:bg-stone-700 text-white rounded-full transition-colors"
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
