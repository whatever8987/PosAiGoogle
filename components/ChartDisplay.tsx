import React from 'react';
import { Bar, Pie, Line, BarChart, PieChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BarChart2 } from 'lucide-react';
import type { QueryResult, Theme } from '../types';

interface ChartDisplayProps {
  result: QueryResult;
  theme: Theme;
}

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']; // Blue shades

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ result, theme }) => {
  const { chartType, data } = result;

  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const tooltipStyle = {
      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
      border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
      borderRadius: '0.5rem',
      color: theme === 'dark' ? '#d1d5db' : '#374151'
  };
  
  if (!data || data.length === 0) {
    return (
        <div className="bg-slate-50 dark:bg-slate-800 p-4 text-center text-slate-500 dark:text-slate-500 text-sm">
            No data available to visualize.
        </div>
    );
  }

  const keys = Object.keys(data[0]);
  const nameKey = keys[0];
  const valueKey = keys[1];

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={nameKey} stroke={tickColor} tick={{ fontSize: 12, fill: tickColor }} />
            <YAxis stroke={tickColor} tick={{ fontSize: 12, fill: tickColor }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{fill: theme === 'dark' ? 'rgba(100, 116, 139, 0.1)' : 'rgba(203, 213, 225, 0.3)'}}/>
            <Bar dataKey={valueKey} fill="#3b82f6" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={nameKey} stroke={tickColor} tick={{ fontSize: 12, fill: tickColor }}/>
            <YAxis stroke={tickColor} tick={{ fontSize: 12, fill: tickColor }}/>
            <Tooltip contentStyle={tooltipStyle} cursor={{fill: theme === 'dark' ? 'rgba(100, 116, 139, 0.1)' : 'rgba(203, 213, 225, 0.3)'}}/>
            <Line type="monotone" dataKey={valueKey} stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6, stroke: '#3b82f6' }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            {/* FIX: Explicitly type the label props to 'any' to resolve type inference issues with recharts. */}
            <Pie data={data} dataKey={valueKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
                        {`${(percent * 100).toFixed(0)}%`}
                    </text>
                );
            }}>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{fontSize: "12px", color: tickColor }} />
          </PieChart>
        );
      default:
        return <p>Unsupported chart type: {chartType}</p>;
    }
  };

  return (
    <div>
      <div className="flex items-center p-3 border-t border-slate-200 dark:border-slate-700">
        <BarChart2 className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Visualization</h3>
      </div>
      <div className="p-4 h-80 w-full bg-slate-50 dark:bg-slate-900">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};