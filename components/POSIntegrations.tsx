
import React from 'react';
import { Zap, Square, ShoppingCart, Store } from 'lucide-react';
import type { POSIntegration } from '../types';

interface POSIntegrationsDisplayProps {
  integrations: POSIntegration[];
}

const providerIcons: Record<POSIntegration['provider'], React.ReactNode> = {
  square: <Square className="w-5 h-5" />,
  clover: <Store className="w-5 h-5" />,
  shopify: <ShoppingCart className="w-5 h-5" />,
};

export const POSIntegrationsDisplay: React.FC<POSIntegrationsDisplayProps> = ({ integrations }) => {
  return (
    <div>
      <div className="flex items-center mb-4 text-gray-400">
        <Zap className="w-5 h-5 mr-3" />
        <h2 className="text-lg font-semibold">POS Integrations</h2>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-3">
        {integrations.map((integration) => (
          <div key={integration.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-gray-700 rounded-md mr-3">
                {providerIcons[integration.provider]}
              </div>
              <div>
                <p className="font-semibold text-white">{integration.name}</p>
                <p className="text-xs text-gray-400">Last sync: {integration.lastSync}</p>
              </div>
            </div>
            <div
              className={`flex items-center text-xs px-2 py-1 rounded-full ${
                integration.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-1.5 ${integration.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
