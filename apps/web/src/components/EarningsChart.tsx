'use client';

import { Card } from './ui/card';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface EarningsChartProps {
  data: { date: string; earnings: number }[];
  type?: 'line' | 'area';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    return (
      <div className="bg-gray-900 border border-amber-500/50 rounded-lg p-3 shadow-lg">
        <p className="text-gray-400 text-xs mb-1">{formattedDate}</p>
        <p className="text-amber-400 font-bold text-sm">
          {payload[0].value?.toFixed(4)} SUI
        </p>
      </div>
    );
  }
  return null;
};

export default function EarningsChart({ data, type = 'area' }: EarningsChartProps) {
  const totalEarnings = data.reduce((sum, item) => sum + item.earnings, 0);
  const maxEarning = Math.max(...data.map(item => item.earnings));
  const avgEarning = totalEarnings / data.length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="bg-gray-900/50 p-6 border border-gray-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" /> Earnings Trend (30 Days)
          </h2>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total: </span>
              <span className="text-green-400 font-bold">{totalEarnings.toFixed(4)} SUI</span>
            </div>
            <div>
              <span className="text-gray-500">Avg/Day: </span>
              <span className="text-cyan-400 font-bold">{avgEarning.toFixed(4)} SUI</span>
            </div>
            <div>
              <span className="text-gray-500">Peak: </span>
              <span className="text-amber-400 font-bold">{maxEarning.toFixed(4)} SUI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickLine={{ stroke: '#374151' }}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="earnings" 
                stroke="#fbbf24" 
                strokeWidth={2}
                fill="url(#colorEarnings)"
                animationDuration={1000}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickLine={{ stroke: '#374151' }}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="#fbbf24" 
                strokeWidth={3}
                dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#fbbf24' }}
                animationDuration={1000}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
          <p className="text-gray-500">No earnings data available yet</p>
        </div>
      )}
    </Card>
  );
}
