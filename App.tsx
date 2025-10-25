import React, { useState, useCallback, useEffect } from 'react';
import { SidebarLeft } from './components/SidebarLeft';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import type { Message, Theme, Page } from './types';
import { Bot, User } from 'lucide-react';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { InsightsPage } from './pages/InsightsPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { LandingPage } from './pages/LandingPage';
import { API, ApiError } from './api';
import type { QueryResponse } from './api-types';


const inferChartType = (data: Record<string, any>[] | null): 'bar' | 'line' | 'pie' => {
  if (!data || data.length === 0) return 'bar';
  const keys = Object.keys(data[0]);
  if (keys.length < 2) return 'bar';

  const firstColValues = data.map(row => row[keys[0]]);
  const secondColValues = data.map(row => row[keys[1]]);
  
  const isCategorical = typeof firstColValues[0] === 'string' && secondColValues.every(v => typeof v === 'number');

  if (isCategorical) {
      const isDateLike = typeof firstColValues[0] === 'string' && firstColValues.some(v => v && v.match && v.match(/^\d{4}-\d{2}-\d{2}/));
      if (isDateLike) {
        return 'line';
      }
      if (data.length <= 5) {
        return 'pie';
      }
      return 'bar';
  }

  return 'bar';
};

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
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
  const [currentPage, setCurrentPage] = useState<Page>(token ? 'assistant' : 'landing');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleAuthSuccess = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setCurrentPage('assistant');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentPage('landing');
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  const handleNavigate = (page: Page) => {
     if (!token) {
        if (page === 'login' || page === 'register' || page === 'landing') {
            setCurrentPage(page);
        }
        return;
    }
    
    if (page === 'assistant' || page === 'appointments' || page === 'integrations' || page === 'insights' || page === 'predictions' || page === 'recommendations') {
        setCurrentPage(page);
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    }
  };

  const handleSendMessage = useCallback(async (question: string) => {
    if (!question.trim() || isLoading || !token) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      Icon: User,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result: QueryResponse = await API.query.generateQuery(token, {
          question,
          execute: true,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      const chartType = inferChartType(result.results);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Here is the generated SQL and a visualization of the data.',
        Icon: Bot,
        queryResult: {
            sql: result.sql,
            chartType: chartType,
            data: result.results || [],
        },
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      let errorMessage = 'An unknown error occurred.';
      if (error instanceof ApiError) {
          errorMessage = error.message;
      } else if (error instanceof Error) {
          errorMessage = error.message;
      }
      
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
  }, [isLoading, token]);
  
  if (!token) {
    if (currentPage === 'landing') {
      return <LandingPage onLoginClick={() => setCurrentPage('login')} onRegisterClick={() => setCurrentPage('register')} />;
    }
    if (currentPage === 'login') {
      return <LoginPage onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />;
    }
    if (currentPage === 'register') {
      return <RegisterPage onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />;
    }
    // Fallback to landing page if state is inconsistent
    return <LandingPage onLoginClick={() => setCurrentPage('login')} onRegisterClick={() => setCurrentPage('register')} />;
  }


  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 font-sans relative">
      <SidebarLeft isSidebarOpen={isSidebarOpen} currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} />
      {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/30 z-30 md:hidden"></div>}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onMenuClick={toggleSidebar} theme={theme} onThemeToggle={toggleTheme} currentPage={currentPage}/>
        {currentPage === 'assistant' && <ChatPanel messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} theme={theme} />}
        {currentPage === 'appointments' && <AppointmentsPage theme={theme} onNavigate={handleNavigate}/>}
        {currentPage === 'integrations' && token && <IntegrationsPage token={token} />}
        {currentPage === 'insights' && token && <InsightsPage token={token} />}
        {currentPage === 'predictions' && token && <PredictionsPage token={token} />}
        {currentPage === 'recommendations' && token && <RecommendationsPage token={token} />}
      </main>
    </div>
  );
};

export default App;