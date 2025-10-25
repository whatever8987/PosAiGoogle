import React, { useState } from 'react';
import { Database, Mail, Lock, Loader2, User, Building2 } from 'lucide-react';
import type { Page } from '../types';
import { API, ApiError } from '../api';

interface RegisterPageProps {
    onNavigate: (page: Page) => void;
    onAuthSuccess: (token: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onAuthSuccess }) => {
    const [salonName, setSalonName] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await API.auth.register({
                salon_name: salonName,
                full_name: fullName,
                owner_email: email,
                password: password,
            });
            onAuthSuccess(response.access_token);
        } catch (err) {
            if (err instanceof ApiError) {
                 setError(err.message || 'Registration failed. Please try again.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
                        <Database className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Your Account</h1>
                    <p className="text-slate-500 dark:text-slate-400">Get started with your AI-powered salon assistant</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Salon Name"
                                value={salonName}
                                onChange={(e) => setSalonName(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                            />
                        </div>
                         <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                            />
                        </div>
                        
                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 transition-colors"
                            >
                                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
                
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
                    Already have an account?{' '}
                    <button onClick={() => onNavigate('login')} className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};
