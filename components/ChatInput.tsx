import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Mic, Plus } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
  };
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="bg-white dark:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-600/80 shadow-sm overflow-hidden flex items-end p-2 space-x-2">
        <button type="button" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg self-end transition-colors" aria-label="Add attachment">
            <Plus className="w-5 h-5" />
        </button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Assign a task or ask anything..."
          className="flex-1 max-h-48 bg-transparent p-2 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 resize-none border-none focus:outline-none focus:ring-0"
          rows={1}
          disabled={isLoading}
        />
        <button type="button" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg self-end transition-colors" aria-label="Use microphone">
            <Mic className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-2 rounded-lg bg-blue-600 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors self-end"
          aria-label="Send message"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};