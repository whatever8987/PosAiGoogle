import React, { useRef, useEffect } from 'react';
import type { Message, Theme } from '../types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Bot } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  theme: Theme;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading, theme }) => {
  const isInitialState = messages.length <= 1;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isInitialState) {
        scrollToBottom();
    }
  }, [messages, isInitialState]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100 dark:bg-slate-800">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {isInitialState ? (
           <div className="flex flex-col justify-center items-center h-full text-center -mt-16 relative">
             <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]"></div>
             <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
               <Bot className="w-8 h-8 text-white" />
             </div>
             <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-50 mb-2">AI SQL Assistant</h1>
             <p className="text-base md:text-lg text-slate-500 dark:text-slate-400">Your personal data analyst. Ask anything about your business.</p>
           </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.slice(1).map((msg) => (
              <MessageBubble key={msg.id} message={msg} onSendMessage={onSendMessage} theme={theme} />
            ))}
            {isLoading && (
              <div className="flex items-start space-x-4">
                 <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0">
                    <Bot className="w-6 h-6 text-blue-500"/>
                </div>
                <div className="flex items-center space-x-2 pt-3">
                    <span className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto">
           {isInitialState && (
            <div className="flex items-center justify-center flex-wrap gap-3 mb-4">
                {['Top 5 Customers by spending', 'Show monthly revenue trend', 'Which services are most popular?'].map(text => (
                    <button
                        key={text}
                        onClick={() => onSendMessage(text)}
                        className="px-4 py-2 text-sm bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        aria-label={`Ask: ${text}`}
                    >
                        {text}
                    </button>
                ))}
            </div>
          )}
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};