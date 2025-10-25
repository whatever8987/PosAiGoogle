
import React from 'react';
import type { UsageStats, POSIntegration } from '../types';
import { UsageStatsDisplay } from './UsageStats';
import { POSIntegrationsDisplay } from './POSIntegrations';

interface SidebarRightProps {
  usageStats: UsageStats;
  integrations: POSIntegration[];
}

export const SidebarRight: React.FC<SidebarRightProps> = ({ usageStats, integrations }) => {
  return (
    <aside className="w-72 bg-gray-900 border-l border-gray-700/50 p-4 flex-col hidden lg:flex">
      <div className="flex-1 space-y-8">
        <UsageStatsDisplay stats={usageStats} />
        <POSIntegrationsDisplay integrations={integrations} />
      </div>
    </aside>
  );
};
