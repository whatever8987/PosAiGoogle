import React, { useState, useCallback, useEffect } from 'react';
import { SidebarLeft } from './components/SidebarLeft';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import type { Message, Theme, Page } from './types';
import { generateSqlAndChart } from './services/geminiService';
import { Bot, User } from 'lucide-react';
import { AppointmentsPage } from './pages/AppointmentsPage';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'ai',
      text: "Hello! I'm your AI SQL Assistant. Ask me a question about your nail salon data, and I'll generate the SQL query and visualize the results for you.",
      Icon: Bot,
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [currentPage, setCurrentPage] = useState<Page>('assistant');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (isSidebarOpen) {
        setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = useCallback(async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      Icon: User,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await generateSqlAndChart(question);

      if ('error' in result) {
         const aiErrorMessage: Message = {
            id: `ai-error-${Date.now()}`,
            sender: 'ai',
            text: `Sorry, I encountered an error: ${result.error}`,
            Icon: Bot,
        };
        setMessages(prev => [...prev, aiErrorMessage]);
      } else {
        const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: result.explanation ?? 'Here is the generated SQL and a visualization of the data.',
            Icon: Bot,
            queryResult: result,
        };
        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      const aiErrorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        sender: 'ai',
        text: `Sorry, I couldn't process your request. ${errorMessage}`,
        Icon: Bot,
      };
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 font-sans relative">
      <SidebarLeft isSidebarOpen={isSidebarOpen} currentPage={currentPage} onNavigate={handleNavigate} />
      {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/30 z-30 md:hidden"></div>}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onMenuClick={toggleSidebar} theme={theme} onThemeToggle={toggleTheme} currentPage={currentPage}/>
        {currentPage === 'assistant' && <ChatPanel messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} theme={theme} />}
        {currentPage === 'appointments' && <AppointmentsPage theme={theme} onNavigate={handleNavigate}/>}
      </main>
    </div>
  );
};

export default App;