import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, WeightEntry, AgentAnalysis } from '../types';
import { calculateRecommendedKcal } from '../utils/calculations';
import { NutritionAgentCard } from '../components/NutritionAgentCard';

function computeNutritionAnalysis(
  profile: UserProfile,
  weightEntries: WeightEntry[]
): { avgLast7: number; avgPrev7: number; adjustment: number; newKcal: number } {
  const sorted = [...weightEntries].sort((a, b) => b.date.localeCompare(a.date));

  const today = new Date();

  const last7 = sorted.filter(e => {
    const diff = (today.getTime() - new Date(e.date).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  const prev7 = sorted.filter(e => {
    const diff = (today.getTime() - new Date(e.date).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 7 && diff <= 14;
  });

  const avgLast7 = last7.length > 0
    ? last7.reduce((s, e) => s + e.weight, 0) / last7.length
    : profile.weight;

  const avgPrev7 = prev7.length > 0
    ? prev7.reduce((s, e) => s + e.weight, 0) / prev7.length
    : profile.weight;

  const currentKcal = calculateRecommendedKcal(profile);
  let adjustment = 0;

  const weeklyChange = avgLast7 - avgPrev7;

  if (profile.goal === 'weight_loss') {
    if (weeklyChange > -0.3) adjustment = -150;
  } else if (profile.goal === 'weight_gain') {
    if (weeklyChange < 0.2) adjustment = +150;
  } else {
    if (Math.abs(weeklyChange) > 0.5) {
      adjustment = weeklyChange > 0 ? -100 : +100;
    }
  }

  return {
    avgLast7: Math.round(avgLast7 * 10) / 10,
    avgPrev7: Math.round(avgPrev7 * 10) / 10,
    adjustment,
    newKcal: currentKcal + adjustment,
  };
}

async function callNutritionAgent(
  profile: UserProfile,
  avgLast7: number,
  avgPrev7: number,
  currentKcal: number,
  newKcal: number,
  adjustment: number
): Promise<string> {
  const goalLabel = {
    weight_loss: 'scădere în greutate',
    weight_gain: 'creștere în greutate',
    maintenance: 'mentenanță',
  }[profile.goal];

  const weeklyChange = avgLast7 - avgPrev7;
  const changeStr = weeklyChange >= 0
    ? `+${weeklyChange.toFixed(1)} kg`
    : `${weeklyChange.toFixed(1)} kg`;

  const prompt = `Ești un antrenor de nutriție profesionist. Răspunde DOAR în limba română.

Date utilizator:
- Nume: ${profile.name}
- Obiectiv: ${goalLabel}
- Greutate medie săptămâna trecută (zilele 8-14): ${avgPrev7} kg
- Greutate medie săptămâna aceasta (ultimele 7 zile): ${avgLast7} kg
- Schimbare săptămânală: ${changeStr}
- Greutate țintă: ${profile.targetWeight} kg
- Calorii recomandate până acum: ${currentKcal} kcal/zi
- Calorii recomandate noi: ${newKcal} kcal/zi (ajustare: ${adjustment > 0 ? '+' : ''}${adjustment} kcal)

Scrie un paragraf de 8-12 propoziții care:
1. Comentează progresul din această săptămână față de săptămâna trecută
2. Explică DE CE se ajustează caloriile (sau DE CE NU se ajustează dacă adjustment = 0)
3. Oferă UN sfat practic concret pentru săptămâna viitoare
4. Ofera si un meal plan pentru ziua de astazi incepand cu ora la care user-ul a postat prima data greutatea din acea zi
Tonul să fie cald, motivant și specific. Nu folosi bullet points. Scrie ca un antrenor care vorbește direct cu clientul.`;

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error("Cheia API Groq nu este configurată corect în fișierul .env");
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Eroare la apelul API Groq.');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export function AgentPage() {
  const { profile, weightEntries, lastAnalysis, setLastAnalysis } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!profile) return null;

  const hasEnoughData = weightEntries.length >= 3;

  const handleRunAnalysis = async () => {
    if (!hasEnoughData) return;

    setIsLoading(true);
    setError(null);

    try {
      const stats = computeNutritionAnalysis(profile, weightEntries);

      const aiMessage = await callNutritionAgent(
        profile,
        stats.avgLast7,
        stats.avgPrev7,
        calculateRecommendedKcal(profile),
        stats.newKcal,
        stats.adjustment
      );

      const newAnalysis: AgentAnalysis = {
        avgWeightLast7: stats.avgLast7,
        avgWeightPrev7: stats.avgPrev7,
        currentKcal: calculateRecommendedKcal(profile),
        suggestedKcal: stats.newKcal,
        adjustment: stats.adjustment,
        aiMessage,
        generatedAt: new Date().toISOString()
      };

      setLastAnalysis(newAnalysis);

    } catch (err: any) {
      setError(err.message || 'A apărut o eroare necunoscută.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-4xl">🤖</span> Agent Nutriție AI
          </h1>
          <p className="text-[#9ca3af] mt-2">Primește recomandări săptămânale personalizate bazate pe progresul tău.</p>
        </div>
      </div>

      {!hasEnoughData ? (
        <div className="bg-[#f97316] bg-opacity-10 border border-[#f97316] text-[#f97316] p-6 rounded-xl fade-in flex items-start gap-4">
          <div className="text-2xl mt-1">⚠️</div>
          <div>
            <h3 className="font-bold text-lg mb-1">Date insuficiente</h3>
            <p className="text-[#f97316] opacity-90">
              Adaugă cel puțin 3 înregistrări de greutate pentru a putea rula analiza AI. Momentan ai {weightEntries.length} înregistrări.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">

          {error && (
            <div className="bg-[#ef4444] bg-opacity-10 border border-[#ef4444] text-[#ef4444] p-6 rounded-xl fade-in flex items-start gap-4">
              <div className="text-2xl mt-1">❌</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Eroare</h3>
                <p className="text-[#ef4444] opacity-90 mb-3">{error}</p>
                <button
                  onClick={handleRunAnalysis}
                  className="bg-[#ef4444] bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Încearcă din nou
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="bg-[#111111] border border-[#2a2a2a] p-12 rounded-xl flex flex-col items-center justify-center fade-in">
              <div className="w-12 h-12 border-4 border-[#2a2a2a] border-t-[#22c55e] rounded-full animate-spin mb-6"></div>
              <p className="text-lg text-[#f0f0f0] font-medium">Agentul AI analizează progresul tău...</p>
              <p className="text-[#9ca3af] text-sm mt-2">Această operațiune poate dura câteva secunde.</p>
            </div>
          )}

          {!isLoading && lastAnalysis && !error && (
            <NutritionAgentCard analysis={lastAnalysis} />
          )}

          {!isLoading && !error && (
            <button
              onClick={handleRunAnalysis}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-6 py-4 rounded-xl transition-colors text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] w-full sm:w-auto self-center"
            >
              🪄 Rulează Analiza Săptămânală
            </button>
          )}

        </div>
      )}

    </div>
  );
}
