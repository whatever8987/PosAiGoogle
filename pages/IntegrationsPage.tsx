import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Database, RefreshCw, Trash2, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { API, ApiError } from '../api';
import type { IntegrationResponse } from '../api-types';
import { AddIntegrationModal } from '../components/AddIntegrationModal';

interface IntegrationsPageProps {
  token: string;
}

const integrationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  postgres: Database,
  mysql: Database,
  square: Database,
  clover: Database,
  csv: Database,
  default: Database,
};

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
    const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
        active: { color: 'text-green-500', text: 'Active', icon: <CheckCircle className="w-4 h-4" /> },
        pending: { color: 'text-yellow-500', text: 'Pending', icon: <Loader2 className="w-4 h-4 animate-spin" /> },
        error: { color: 'text-red-500', text: 'Error', icon: <XCircle className="w-4 h-4" /> },
    };
    const currentStatus = statusMap[status.toLowerCase()] || { color: 'text-slate-500', text: 'Unknown', icon: <AlertTriangle className="w-4 h-4" /> };

    return (
        <div className={`flex items-center space-x-2 text-sm font-medium ${currentStatus.color}`}>
            {currentStatus.icon}
            <span className="capitalize">{currentStatus.text}</span>
        </div>
    );
};


const IntegrationCard: React.FC<{ integration: IntegrationResponse, onSync: (id: string) => void, onDelete: (id: string) => void, isSyncing: boolean }> = ({ integration, onSync, onDelete, isSyncing }) => {
    const Icon = integrationIcons[integration.integration_type] || integrationIcons.default;
    
    const formatRelativeTime = (dateString: string | null) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
        
        if (diffSeconds < 60) return `${diffSeconds}s ago`;
        const diffMinutes = Math.round(diffSeconds / 60);
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        const diffHours = Math.round(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.round(diffHours / 24);
        return `${diffDays}d ago`;
    };

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col justify-between transition hover:shadow-lg">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{integration.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{integration.integration_type}</p>
                        </div>
                    </div>
                    <StatusIndicator status={integration.status} />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <p><strong>Last Sync:</strong> {formatRelativeTime(integration.last_sync_at)}</p>
                    {integration.last_error && <p className="text-red-500"><strong>Error:</strong> {integration.last_error}</p>}
                </div>
            </div>
            <div className="flex items-center justify-end space-x-2 mt-6">
                <button
                    onClick={() => onSync(integration.integration_id)}
                    disabled={isSyncing}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    Sync Now
                </button>
                <button
                    onClick={() => onDelete(integration.integration_id)}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </button>
            </div>
        </div>
    );
};

export const IntegrationsPage: React.FC<IntegrationsPageProps> = ({ token }) => {
  const [integrations, setIntegrations] = useState<IntegrationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchIntegrations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await API.integrations.listIntegrations(token);
      setIntegrations(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to fetch integrations.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const handleSync = async (id: string) => {
    if (window.confirm('Are you sure you want to trigger a manual sync?')) {
        setSyncingId(id);
        try {
            await API.integrations.syncIntegration(token, id, { mode: 'incremental' });
            // Optionally, show a success toast/message
            fetchIntegrations(); // Re-fetch to update status
        } catch (err) {
            alert(err instanceof ApiError ? err.message : 'Sync failed.');
        } finally {
            setSyncingId(null);
        }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this integration? This action cannot be undone.')) {
        try {
            await API.integrations.deleteIntegration(token, id);
            setIntegrations(prev => prev.filter(i => i.integration_id !== id));
        } catch (err) {
            alert(err instanceof ApiError ? err.message : 'Deletion failed.');
        }
    }
  };

  const handleIntegrationAdded = () => {
    setIsModalOpen(false);
    fetchIntegrations();
  };

  return (
    <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Data Integrations</h1>
            <p className="text-slate-500 dark:text-slate-400">Connect and manage your data sources.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Integration
        </button>
      </div>

      {isLoading && <div className="text-center p-8"><Loader2 className="w-8 h-8 mx-auto animate-spin" /></div>}
      {error && <div className="text-center p-8 text-red-500">{error}</div>}

      {!isLoading && !error && (
        integrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map(int => (
              <IntegrationCard key={int.integration_id} integration={int} onSync={handleSync} onDelete={handleDelete} isSyncing={syncingId === int.integration_id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
              <Database className="w-12 h-12 mx-auto text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">No integrations found</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by adding a new data source.</p>
          </div>
        )
      )}
      
      {isModalOpen && (
        <AddIntegrationModal
          token={token}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleIntegrationAdded}
        />
      )}
    </div>
  );
};
