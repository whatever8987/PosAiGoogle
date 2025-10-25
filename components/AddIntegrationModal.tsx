import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { API, ApiError } from '../api';

interface AddIntegrationModalProps {
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

const INTEGRATION_CONFIG: Record<string, { label: string; fields: { name: string; label: string; type: string; placeholder?: string, required: boolean }[] }> = {
    postgres: {
        label: "PostgreSQL",
        fields: [
            { name: "host", label: "Host", type: "text", placeholder: "localhost", required: true },
            { name: "port", label: "Port", type: "number", placeholder: "5432", required: true },
            { name: "database", label: "Database", type: "text", placeholder: "mydatabase", required: true },
            { name: "username", label: "Username", type: "text", placeholder: "user", required: true },
            { name: "password", label: "Password", type: "password", required: true },
        ],
    },
    // Define other integration types here as needed
};

export const AddIntegrationModal: React.FC<AddIntegrationModalProps> = ({ token, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [supportedTypes, setSupportedTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await API.integrations.getSupportedIntegrations();
        setSupportedTypes(types);
      } catch {
        setError("Could not load supported integration types.");
      }
    };
    fetchTypes();
  }, []);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setFormData({ name: `${INTEGRATION_CONFIG[type]?.label || type} Connection` });
    setStep(2);
    setTestResult(null);
    setTestMessage(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setTestResult(null);
    setTestMessage(null);
  };

  const handleTestConnection = async () => {
    if (!selectedType) return;
    setIsTesting(true);
    setTestResult(null);
    setTestMessage(null);
    setError(null);

    const config = INTEGRATION_CONFIG[selectedType];
    const credentials: Record<string, any> = {};
    config.fields.forEach(f => {
        credentials[f.name] = f.type === 'number' ? Number(formData[f.name]) : formData[f.name];
    });

    try {
        const res = await API.integrations.testIntegration(token, {
            integration_type: selectedType,
            credentials,
        });
        if (res.success) {
            setTestResult('success');
            setTestMessage(res.message || 'Connection successful!');
        } else {
            setTestResult('error');
            setTestMessage(res.error || 'Connection failed.');
        }
    } catch (err) {
        setTestResult('error');
        setTestMessage(err instanceof ApiError ? err.message : 'An unknown error occurred.');
    } finally {
        setIsTesting(false);
    }
  };

  const handleSave = async () => {
    if (!selectedType || testResult !== 'success') return;
    setIsSaving(true);
    setError(null);
    
    const config = INTEGRATION_CONFIG[selectedType];
    const credentials: Record<string, any> = {};
    config.fields.forEach(f => {
        credentials[f.name] = f.type === 'number' ? Number(formData[f.name]) : formData[f.name];
    });

    try {
        await API.integrations.createIntegration(token, {
            name: formData.name,
            integration_type: selectedType,
            credentials,
        });
        onSuccess();
    } catch(err) {
        setError(err instanceof ApiError ? err.message : 'Failed to save integration.');
    } finally {
        setIsSaving(false);
    }
  };
  
  const currentConfig = selectedType ? INTEGRATION_CONFIG[selectedType] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
           {step === 2 && (
             <button onClick={() => setStep(1)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ArrowLeft className="w-5 h-5" /></button>
           )}
           <h2 className="text-lg font-bold text-center flex-1">{step === 1 ? 'Choose Integration Type' : `Configure ${currentConfig?.label}`}</h2>
           <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            {step === 1 && (
                <div className="grid grid-cols-2 gap-4">
                    {supportedTypes.map(type => (
                        <button key={type} onClick={() => handleTypeSelect(type)} className="p-6 border border-slate-300 dark:border-slate-600 rounded-lg text-center hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-500">
                           <span className="font-semibold capitalize">{INTEGRATION_CONFIG[type]?.label || type}</span>
                        </button>
                    ))}
                </div>
            )}
            {step === 2 && currentConfig && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Connection Name</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg" />
                    </div>
                    {currentConfig.fields.map(field => (
                        <div key={field.name} className="space-y-2">
                            <label htmlFor={field.name} className="text-sm font-medium">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                required={field.required}
                                value={formData[field.name] || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg"
                            />
                        </div>
                    ))}
                    {testMessage && (
                        <div className={`flex items-center space-x-2 p-3 rounded-lg text-sm ${testResult === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           {testResult === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                           <span>{testMessage}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
        {step === 2 && (
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl">
                <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50"
                >
                    {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                    Test Connection
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving || testResult !== 'success'}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                    Save
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
