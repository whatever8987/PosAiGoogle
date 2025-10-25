import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Star, Check, X, Wand2 } from 'lucide-react';
import { API, ApiError } from '../api';
import type { GenerateAllRecommendationsResponse, RecommendationResponse } from '../api-types';

interface RecommendationsPageProps {
  token: string;
}

type RecommendationCategory = keyof GenerateAllRecommendationsResponse;

const priorityConfig = {
    critical: { label: 'Critical', color: 'bg-red-500 border-red-500' },
    high: { label: 'High', color: 'bg-orange-500 border-orange-500' },
    medium: { label: 'Medium', color: 'bg-yellow-500 border-yellow-500' },
    low: { label: 'Low', color: 'bg-blue-500 border-blue-500' },
};

const RecommendationCard: React.FC<{
    recommendation: RecommendationResponse;
    onStatusUpdate: (id: string, status: 'accepted' | 'rejected') => void;
}> = ({ recommendation, onStatusUpdate }) => {
    const { label, color } = priorityConfig[recommendation.priority];
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (status: 'accepted' | 'rejected') => {
        setIsUpdating(true);
        await onStatusUpdate(recommendation.id, status);
        setIsUpdating(false);
    }

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm transition hover:shadow-lg">
            <div className={`p-5 border-l-4 ${color.replace('bg', 'border')}`}>
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{recommendation.title}</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${color}`}>{label}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{recommendation.description}</p>
                
                <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2 text-slate-700 dark:text-slate-200">Action Items:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-500 dark:text-slate-400">
                        {recommendation.action_items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Expected Impact: <span className="font-normal text-green-600 dark:text-green-400">{recommendation.expected_impact}</span>
                </p>
            </div>
             <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Status: <span className="font-semibold capitalize">{recommendation.status}</span></span>
                {recommendation.status === 'pending' && (
                     <div className="flex items-center space-x-2">
                        <button onClick={() => handleUpdate('accepted')} disabled={isUpdating} className="flex items-center px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/80 rounded-lg">
                            <Check className="w-4 h-4 mr-1"/> Accept
                        </button>
                        <button onClick={() => handleUpdate('rejected')} disabled={isUpdating} className="flex items-center px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/80 rounded-lg">
                            <X className="w-4 h-4 mr-1"/> Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ token }) => {
    const [recommendations, setRecommendations] = useState<GenerateAllRecommendationsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<RecommendationCategory>('promotions');

    const fetchRecommendations = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await API.recommendations.generateAllRecommendations(token);
            setRecommendations(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to fetch recommendations.');
        } finally {
            setIsLoading(false);
        }
    }, [token]);
    
    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    const handleStatusUpdate = async (id: string, status: 'accepted' | 'rejected') => {
        try {
            const updatedRec = await API.recommendations.updateRecommendationStatus(token, id, { status });
            
            setRecommendations(prev => {
                if (!prev) return null;
                const newRecs = { ...prev };
                const category = updatedRec.type.toLowerCase() + 's' as keyof typeof newRecs;
                if (newRecs[category]) {
                    const index = newRecs[category].findIndex(r => r.id === id);
                    if (index !== -1) {
                         newRecs[category][index] = updatedRec;
                    }
                }
                return newRecs;
            });

        } catch (err) {
            alert('Failed to update recommendation status.');
        }
    };

    const tabs: { key: RecommendationCategory, label: string }[] = recommendations ? (Object.keys(recommendations) as RecommendationCategory[]).map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1)
    })) : [];

    const activeRecommendations = recommendations ? recommendations[activeTab] : [];

    return (
        <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">AI-Powered Recommendations</h1>
                <p className="text-slate-500 dark:text-slate-400">Actionable advice to grow your business.</p>
            </div>
            
            {isLoading && <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin" /></div>}
            {error && <div className="text-center p-8 text-red-500">{error}</div>}
            
            {!isLoading && !error && recommendations && (
                <div>
                    <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`${
                                        activeTab === tab.key
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {tab.label} ({recommendations[tab.key].length})
                                </button>
                            ))}
                        </nav>
                    </div>

                    {activeRecommendations.length > 0 ? (
                        <div className="space-y-6">
                           {activeRecommendations.map(rec => <RecommendationCard key={rec.id} recommendation={rec} onStatusUpdate={handleStatusUpdate} />)}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                            <Wand2 className="w-12 h-12 mx-auto text-slate-400" />
                            <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">No recommendations here</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">All clear in the {activeTab} category!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
