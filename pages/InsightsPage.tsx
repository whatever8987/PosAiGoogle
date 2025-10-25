import React, { useState, useEffect, useCallback } from 'react';
import { Lightbulb, CheckCircle, XCircle, Archive, FolderCheck, Loader2, Plus, AlertTriangle, ChevronDown } from 'lucide-react';
import { API, ApiError } from '../api';
import type { InsightResponse } from '../api-types';

interface InsightsPageProps {
  token: string;
}

const severityConfig = {
    critical: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    high: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    medium: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    low: { icon: AlertTriangle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    info: { icon: Lightbulb, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-700' },
};

const statusConfig = {
    new: { text: 'New', color: 'text-blue-600 dark:text-blue-400' },
    viewed: { text: 'Viewed', color: 'text-slate-600 dark:text-slate-400' },
    acknowledged: { text: 'Acknowledged', color: 'text-purple-600 dark:text-purple-400' },
    resolved: { text: 'Resolved', color: 'text-green-600 dark:text-green-400' },
    dismissed: { text: 'Dismissed', color: 'text-slate-500' }
};

const InsightCard: React.FC<{ insight: InsightResponse; onStatusUpdate: (id: string, status: 'acknowledged' | 'resolved' | 'dismissed') => void }> = ({ insight, onStatusUpdate }) => {
    const { icon: Icon, color, bg } = severityConfig[insight.severity];
    const statusInfo = statusConfig[insight.status];
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (status: 'acknowledged' | 'resolved' | 'dismissed') => {
        setIsUpdating(true);
        await onStatusUpdate(insight.insight_id, status);
        setIsUpdating(false);
    }
    
    return (
        <div className={`border rounded-xl overflow-hidden transition hover:shadow-md ${bg}`}>
            <div className={`p-4 border-l-4 ${color.replace('text', 'border')}`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${color}`} />
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{insight.title}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{insight.description}</p>
                {insight.recommendation && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 italic">Recommendation: {insight.recommendation}</p>}
                <div className="flex items-center space-x-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>Severity: <span className="font-semibold capitalize">{insight.severity}</span></span>
                    <span>Source: <span className="font-semibold">{insight.data_source}</span></span>
                </div>
            </div>
            <div className="px-4 py-2 bg-black/5 flex items-center justify-end space-x-2">
                <button disabled={isUpdating} onClick={() => handleUpdate('acknowledged')} className="px-2 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/30 rounded-md flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Acknowledge
                </button>
                <button disabled={isUpdating} onClick={() => handleUpdate('resolved')} className="px-2 py-1 text-xs font-semibold text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/30 rounded-md flex items-center">
                    <FolderCheck className="w-3 h-3 mr-1" /> Resolve
                </button>
                 <button disabled={isUpdating} onClick={() => handleUpdate('dismissed')} className="px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600 rounded-md flex items-center">
                    <Archive className="w-3 h-3 mr-1" /> Dismiss
                </button>
            </div>
        </div>
    );
};

export const InsightsPage: React.FC<InsightsPageProps> = ({ token }) => {
    const [insights, setInsights] = useState<InsightResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        status_filter: undefined,
        severity_filter: undefined,
    });

    const fetchInsights = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await API.insights.listInsights(token, filters);
            setInsights(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to fetch insights.');
        } finally {
            setIsLoading(false);
        }
    }, [token, filters]);

    useEffect(() => {
        fetchInsights();
    }, [fetchInsights]);
    
    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            await API.insights.generateInsights(token);
            fetchInsights(); // Refresh list after generating
        } catch (err) {
             setError(err instanceof ApiError ? err.message : 'Failed to generate new insights.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleStatusUpdate = async (id: string, status: 'acknowledged' | 'resolved' | 'dismissed') => {
        try {
            const updatedInsight = await API.insights.updateInsightStatus(token, id, { status });
            setInsights(prev => prev.map(i => i.insight_id === id ? updatedInsight : i));
        } catch (err) {
            alert("Failed to update status.");
        }
    };
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value === 'all' ? undefined : e.target.value }));
    };

    return (
        <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">AI-Generated Insights</h1>
                    <p className="text-slate-500 dark:text-slate-400">Discover key trends and anomalies in your data.</p>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
                  Generate New Insights
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 <select name="status_filter" onChange={handleFilterChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg">
                    <option value="all">All Statuses</option>
                    {Object.entries(statusConfig).map(([key, {text}]) => <option key={key} value={key}>{text}</option>)}
                </select>
                <select name="severity_filter" onChange={handleFilterChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg">
                    <option value="all">All Severities</option>
                    {Object.keys(severityConfig).map(key => <option key={key} value={key} className="capitalize">{key}</option>)}
                </select>
            </div>

            {isLoading && <div className="text-center p-8"><Loader2 className="w-8 h-8 mx-auto animate-spin" /></div>}
            {error && <div className="text-center p-8 text-red-500">{error}</div>}

            {!isLoading && !error && (
                insights.length > 0 ? (
                    <div className="space-y-4">
                        {insights.map(insight => <InsightCard key={insight.insight_id} insight={insight} onStatusUpdate={handleStatusUpdate}/>)}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                        <Lightbulb className="w-12 h-12 mx-auto text-slate-400" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">No insights found</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Generate new insights or adjust your filters.</p>
                    </div>
                )
            )}
        </div>
    );
};
