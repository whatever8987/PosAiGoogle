import React from 'react';
import type { Message, Theme } from '../types';
import { SqlDisplay } from './SqlDisplay';
import { ChartDisplay } from './ChartDisplay';
import { ChevronRight } from 'lucide-react';


interface MessageBubbleProps {
  message: Message;
  onSendMessage: (text: string) => void;
  theme: Theme;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onSendMessage, theme }) => {
  const { sender, text, Icon, queryResult } = message;
  const isUser = sender === 'user';

  if (isUser) {
    return (
        <div className="flex items-start justify-end space-x-4">
            <div className="max-w-xl">
                <div className="inline-block p-4 rounded-2xl bg-blue-600 text-white rounded-br-none shadow-md">
                    <p>{text}</p>
                </div>
            </div>
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0 flex items-center justify-center">
                <Icon className="w-5 h-5 text-slate-500 dark:text-slate-300" />
            </div>
        </div>
    );
  }

  // AI Message Bubble
  return (
    <div className="flex items-start space-x-4">
        <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1 max-w-xl space-y-4">
            {/* Text explanation bubble */}
            <div>
                <div className="p-4 rounded-2xl bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-bl-none">
                    <p>{text}</p>
                </div>
            </div>

            {/* SQL and Chart container */}
            {queryResult && (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-md">
                    <SqlDisplay sql={queryResult.sql} theme={theme} />
                    <ChartDisplay result={queryResult} theme={theme} />
                </div>
            )}
            
            {/* Follow-up questions */}
            {queryResult?.followUps && queryResult.followUps.length > 0 && (
                <div className="space-y-2">
                    {queryResult.followUps.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => onSendMessage(q)}
                            className="w-full flex justify-between items-center text-left px-4 py-3 text-sm text-slate-700 bg-white dark:text-slate-300 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                        >
                            <span>{q}</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-400" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};