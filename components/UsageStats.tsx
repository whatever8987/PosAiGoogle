
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Target } from 'lucide-react';
import type { UsageStats } from '../types';

interface UsageStatsDisplayProps {
  stats: UsageStats;
}

export const UsageStatsDisplay: React.FC<UsageStatsDisplayProps> = ({ stats }) => {
  const { queriesUsed, monthlyLimit } = stats;
  const remaining = Math.max(0, monthlyLimit - queriesUsed);
  const usagePercentage = Math.round((queriesUsed / monthlyLimit) * 100);

  const data = [
    { name: 'Used', value: queriesUsed },
    { name: 'Remaining', value: remaining },
  ];

  const COLORS = ['#6366f1', '#374151']; // indigo-500, gray-700

  return (
    <div>
      <div className="flex items-center mb-4 text-gray-400">
        <Target className="w-5 h-5 mr-3" />
        <h2 className="text-lg font-semibold">Monthly Usage</h2>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-current text-white text-xl font-bold"
              >
                {`${usagePercentage}%`}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2">
            <p className="text-lg font-semibold text-white">{queriesUsed} / {monthlyLimit}</p>
            <p className="text-sm text-gray-400">Queries Used</p>
        </div>
      </div>
    </div>
  );
};
