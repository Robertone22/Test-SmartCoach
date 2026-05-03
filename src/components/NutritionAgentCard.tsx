import { useState } from 'react';
import { AgentAnalysis } from '../types';

interface NutritionAgentCardProps {
  analysis: AgentAnalysis;
}

export function NutritionAgentCard({ analysis }: NutritionAgentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.aiMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(analysis.generatedAt).toLocaleString('ro-RO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden fade-in shadow-[0_0_20px_rgba(34,197,94,0.05)]">
      
      {/* Header */}
      <div className="bg-[#1a1a1a] p-4 border-b border-[#2a2a2a] flex items-center gap-3">
        <div className="text-3xl">🤖</div>
        <h2 className="text-xl font-bold text-[#f0f0f0]">Analiză Nutriție AI</h2>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
            <div className="text-[#9ca3af] text-sm font-medium mb-1">Medie Săptămâna Trecută</div>
            <div className="text-2xl font-mono text-[#f0f0f0]">{analysis.avgWeightPrev7} kg</div>
          </div>
          
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
            <div className="text-[#9ca3af] text-sm font-medium mb-1">Medie Această Săptămână</div>
            <div className="text-2xl font-mono text-[#f0f0f0]">{analysis.avgWeightLast7} kg</div>
          </div>
          
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
            <div className="text-[#9ca3af] text-sm font-medium mb-1">Calorii Curente</div>
            <div className="text-2xl font-mono text-[#f0f0f0]">{analysis.currentKcal} kcal</div>
          </div>
          
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a] relative overflow-hidden">
            <div className="text-[#9ca3af] text-sm font-medium mb-1 relative z-10">Recomandare Nouă</div>
            <div className="flex items-end gap-2 relative z-10">
              <span className="text-2xl font-mono text-[#22c55e] font-bold">{analysis.suggestedKcal} kcal</span>
              {analysis.adjustment !== 0 && (
                <span className={`text-sm font-bold mb-1 ${analysis.adjustment > 0 ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
                  {analysis.adjustment > 0 ? '+' : ''}{analysis.adjustment}
                </span>
              )}
            </div>
            {/* Background glow indicating change */}
            {analysis.adjustment !== 0 && (
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 ${analysis.adjustment > 0 ? 'bg-[#ef4444]' : 'bg-[#22c55e]'}`}></div>
            )}
          </div>
        </div>

        {/* AI Message */}
        <div className="bg-[#1a1a1a] border border-[#22c55e] border-opacity-30 rounded-lg p-5 relative mb-2">
          <div className="absolute -top-3 -left-3 bg-[#111111] p-1 rounded-full border border-[#2a2a2a]">
            💬
          </div>
          <p className="text-[#d1d5db] leading-relaxed whitespace-pre-wrap">
            {analysis.aiMessage}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a1a1a] border-t border-[#2a2a2a] px-6 py-3 flex justify-between items-center">
        <span className="text-xs text-[#6b7280]">Generat: {formattedDate}</span>
        
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
            copied ? 'text-[#22c55e] bg-[#22c55e] bg-opacity-10' : 'text-[#9ca3af] hover:text-[#f0f0f0] hover:bg-[#2a2a2a]'
          }`}
        >
          {copied ? '✅ Copiat!' : '📋 Copiază recomandarea'}
        </button>
      </div>

    </div>
  );
}
