import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, CartesianGrid } from 'recharts';
import { WeightEntry, Goal } from '../types';
import { formatDate } from '../utils/dateUtils';

interface WeightChartProps {
  entries: WeightEntry[];
  targetWeight: number;
  goal: Goal;
}

type Period = '7' | '30' | 'all';

export function WeightChart({ entries, targetWeight, goal }: WeightChartProps) {
  const [period, setPeriod] = useState<Period>('30');

  const filteredEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date)); // cronologic
    if (period === 'all') return sorted;
    
    const days = period === '7' ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return sorted.filter(e => new Date(e.date) >= cutoff);
  }, [entries, period]);

  const stats = useMemo(() => {
    if (filteredEntries.length === 0) return null;
    
    const weights = filteredEntries.map(e => e.weight);
    const current = weights[weights.length - 1];
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
    
    let isFavorable = false;
    if (filteredEntries.length > 1) {
      const mid = Math.floor(filteredEntries.length / 2);
      const firstHalf = weights.slice(0, mid);
      const secondHalf = weights.slice(mid);
      
      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (goal === 'weight_loss' && avgSecond < avgFirst) isFavorable = true;
      if (goal === 'weight_gain' && avgSecond > avgFirst) isFavorable = true;
      if (goal === 'maintenance' && Math.abs(avgSecond - avgFirst) <= 0.5) isFavorable = true;
    } else {
      isFavorable = true; // Not enough data to say it's bad
    }

    return {
      current,
      min,
      max,
      avg: Math.round(avg * 10) / 10,
      isFavorable
    };
  }, [filteredEntries, goal]);

  if (entries.length === 0) {
    return (
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-8 text-center text-[#9ca3af]">
        Adaugă înregistrări de greutate pentru a vedea graficul.
      </div>
    );
  }

  const yMin = stats ? Math.floor(stats.min - 2) : 0;
  const yMax = stats ? Math.ceil(stats.max + 2) : 100;

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Evoluție Greutate</h2>
        <div className="flex gap-2 bg-[#1a1a1a] p-1 rounded-lg border border-[#2a2a2a]">
          {(['7', '30', 'all'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                period === p ? 'bg-[#2a2a2a] text-[#f0f0f0]' : 'text-[#9ca3af] hover:text-[#f0f0f0]'
              }`}
            >
              {p === 'all' ? 'Tot' : `${p} zile`}
            </button>
          ))}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]">
            <div className="text-[#9ca3af] text-xs uppercase font-medium mb-1">Curentă</div>
            <div className="text-xl font-mono font-bold">{stats.current} kg</div>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]">
            <div className="text-[#9ca3af] text-xs uppercase font-medium mb-1">Minimă</div>
            <div className="text-xl font-mono text-[#22c55e]">{stats.min} kg</div>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]">
            <div className="text-[#9ca3af] text-xs uppercase font-medium mb-1">Maximă</div>
            <div className="text-xl font-mono text-[#ef4444]">{stats.max} kg</div>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]">
            <div className="text-[#9ca3af] text-xs uppercase font-medium mb-1">Medie</div>
            <div className="text-xl font-mono">{stats.avg} kg</div>
          </div>
        </div>
      )}

      {filteredEntries.length > 0 ? (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredEntries} margin={{ top: 5, right: 5, bottom: 25, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getDate()}/${d.getMonth()+1}`;
                }}
                stroke="#6b7280"
                fontSize={12}
                dy={10}
              />
              <YAxis 
                domain={[yMin, yMax]} 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={val => `${val}kg`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111111', borderColor: '#2a2a2a', borderRadius: '8px' }}
                itemStyle={{ color: '#f0f0f0' }}
                labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                labelFormatter={(val) => formatDate(val as string)}
                formatter={(value: any) => [`${value} kg`, 'Greutate']}
              />
              <ReferenceLine y={targetWeight} stroke="#9ca3af" strokeDasharray="3 3" label={{ position: 'top', value: 'Țintă', fill: '#9ca3af', fontSize: 12 }} />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke={stats?.isFavorable ? '#22c55e' : '#ef4444'} 
                strokeWidth={3}
                dot={{ r: 4, fill: '#111111', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: stats?.isFavorable ? '#22c55e' : '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-[#9ca3af]">
          Nu există date în această perioadă.
        </div>
      )}
    </div>
  );
}
