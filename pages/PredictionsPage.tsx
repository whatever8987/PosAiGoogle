import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, TrendingUp, TrendingDown, Users, Calendar, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { API, ApiError } from '../api';
import type { DashboardPredictionsResponse, RevenueForecastDataPoint, BookingDemandDataPoint } from '../api-types';

interface PredictionsPageProps {
  token: string;
}

const ChartCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
            {icon}
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>
        <div className="h-64 w-full">
            {children}
        </div>
    </div>
);

const TrendCard: React.FC<{ title: string; data: { service_name: string; change: number }[], icon: React.ReactNode, isUp: boolean }> = ({ title, data, icon, isUp }) => (
     <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
            {icon}
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>
        <ul className="space-y-3">
            {data.map(item => (
                <li key={item.service_name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">{item.service_name}</span>
                    <span className={`font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {isUp ? '+' : ''}{item.change.toFixed(1)}%
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

export const PredictionsPage: React.FC<PredictionsPageProps> = ({ token }) => {
    const [predictions, setPredictions] = useState<DashboardPredictionsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const data = await API.predictions.getDashboardPredictions(token);
                setPredictions(data);
            } catch (err) {
                setError(err instanceof ApiError ? err.message : "Failed to load predictions.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPredictions();
    }, [token]);
    
    const revenueData = useMemo(() => predictions?.revenue_forecasts?.['30_day']?.forecast, [predictions]);
    const bookingData = useMemo(() => predictions?.booking_demand?.forecast, [predictions]);

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;
    }

    if (error) {
        return <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>;
    }
    
    if (!predictions) {
        return <div className="flex-1 flex items-center justify-center text-slate-500">No prediction data available.</div>;
    }

    return (
        <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Revenue Forecast */}
                <div className="xl:col-span-2">
                    <ChartCard title="30-Day Revenue Forecast" icon={<DollarSign className="w-6 h-6 text-green-500" />}>
                        <ResponsiveContainer>
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem' }} />
                                <Area type="monotone" dataKey="prediction" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
                
                {/* Booking Demand */}
                <div>
                     <ChartCard title="Booking Demand Forecast" icon={<Calendar className="w-6 h-6 text-blue-500" />}>
                        <ResponsiveContainer>
                            <BarChart data={bookingData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem' }} />
                                <Bar dataKey="predicted_bookings" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
                
                {/* Churn Risk */}
                <div className="xl:col-span-1">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 h-full">
                        <div className="flex items-center space-x-3 mb-4">
                             <Users className="w-6 h-6 text-red-500" />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Customers at Risk of Churn</h3>
                        </div>
                        <ul className="space-y-4">
                            {predictions.churn_risk.high_risk_customers.slice(0, 5).map(customer => (
                                <li key={customer.customer_id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{customer.customer_name}</p>
                                        <span className="text-sm font-bold text-red-500">{(customer.risk_score * 100).toFixed(0)}% risk</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Last visit: {customer.last_visit}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Service Trends */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TrendCard title="Top Growing Services" data={predictions.service_trends.growing} icon={<TrendingUp className="w-6 h-6 text-green-500" />} isUp={true}/>
                    <TrendCard title="Top Declining Services" data={predictions.service_trends.declining} icon={<TrendingDown className="w-6 h-6 text-red-500" />} isUp={false}/>
                </div>

            </div>
        </div>
    );
};
