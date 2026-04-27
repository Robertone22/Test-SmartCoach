
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StreakBadge } from '../components/StreakBadge';
import { calculateBMR, calculateTDEE, calculateRecommendedKcal, calculateBMI } from '../utils/calculations';
import { formatDate } from '../utils/dateUtils';

export function DashboardPage() {
  const { profile, weightEntries, workoutSessions, lastAnalysis } = useApp();

  if (!profile) return null;

  const latestWeight = weightEntries.length > 0 
    ? [...weightEntries].sort((a, b) => b.date.localeCompare(a.date))[0] 
    : null;

  const latestWorkout = workoutSessions.length > 0
    ? [...workoutSessions].sort((a, b) => b.date.localeCompare(a.date))[0]
    : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bună ziua, {profile.name}! 👋</h1>
          <p className="text-[#9ca3af] mt-1">Iată rezumatul progresului tău.</p>
        </div>
        <StreakBadge />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Profile Stats */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 fade-in shadow-[0_0_15px_rgba(34,197,94,0.05)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👤</span>
            <h2 className="text-lg font-bold">Date Profil</h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
              <span className="text-[#9ca3af]">BMR:</span>
              <span className="font-mono">{calculateBMR(profile)} kcal</span>
            </div>
            <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
              <span className="text-[#9ca3af]">TDEE:</span>
              <span className="font-mono">{calculateTDEE(profile)} kcal</span>
            </div>
            <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
              <span className="text-[#9ca3af]">Țintă Zilnică:</span>
              <span className="font-mono text-[#22c55e] font-bold">{calculateRecommendedKcal(profile)} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9ca3af]">BMI Curent:</span>
              <span className="font-mono">{calculateBMI(latestWeight?.weight || profile.weight, profile.height)}</span>
            </div>
          </div>
        </div>

        {/* Latest Weight */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 flex flex-col justify-between fade-in">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚖️</span>
                <h2 className="text-lg font-bold">Ultima Greutate</h2>
              </div>
              {latestWeight && (
                <span className="text-xs text-[#9ca3af] bg-[#1a1a1a] px-2 py-1 rounded">
                  {formatDate(latestWeight.date)}
                </span>
              )}
            </div>
            
            {latestWeight ? (
              <div className="mb-4">
                <div className="text-4xl font-mono font-bold text-[#f0f0f0] mb-1">
                  {latestWeight.weight} <span className="text-xl text-[#9ca3af]">kg</span>
                </div>
                <div className="text-sm text-[#9ca3af]">
                  Țintă: {profile.targetWeight} kg
                </div>
              </div>
            ) : (
              <div className="text-[#9ca3af] mb-4">Nicio înregistrare încă.</div>
            )}
          </div>
          
          <Link 
            to="/weight"
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f0f0f0] border border-[#2a2a2a] px-4 py-2 rounded-lg transition-colors text-center font-medium block w-full"
          >
            Înregistrează Greutatea Azi
          </Link>
        </div>

        {/* Latest Workout */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 flex flex-col justify-between fade-in">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏋️</span>
                <h2 className="text-lg font-bold">Ultimul Antrenament</h2>
              </div>
              {latestWorkout && (
                <span className="text-xs text-[#9ca3af] bg-[#1a1a1a] px-2 py-1 rounded">
                  {formatDate(latestWorkout.date).split(' ').slice(0,2).join(' ')}
                </span>
              )}
            </div>
            
            {latestWorkout ? (
              <div className="mb-4">
                <div className="text-2xl font-bold mb-1">
                  {latestWorkout.exercises.length} <span className="text-lg text-[#9ca3af] font-normal">Exerciții</span>
                </div>
                <div className="text-sm text-[#9ca3af] truncate">
                  Grupe: {Array.from(new Set(latestWorkout.exercises.map(e => e.muscleGroup))).join(', ')}
                </div>
              </div>
            ) : (
              <div className="text-[#9ca3af] mb-4">Niciun antrenament înregistrat.</div>
            )}
          </div>
          
          <Link 
            to="/workouts"
            className="bg-[#22c55e] hover:bg-[#16a34a] text-black px-4 py-2 rounded-lg transition-colors text-center font-medium block w-full"
          >
            Nou Antrenament
          </Link>
        </div>

        {/* Latest AI Analysis */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 md:col-span-2 lg:col-span-3 fade-in relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#22c55e] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <h2 className="text-lg font-bold">Analiză Nutriție AI</h2>
            </div>
            {lastAnalysis && (
              <span className="text-xs text-[#9ca3af]">
                {new Date(lastAnalysis.generatedAt).toLocaleDateString('ro-RO')}
              </span>
            )}
          </div>

          <div className="relative z-10">
            {lastAnalysis ? (
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex-1">
                  <p className="text-[#d1d5db] line-clamp-2 leading-relaxed mb-4">
                    {lastAnalysis.aiMessage}
                  </p>
                  <div className="flex gap-4">
                    <div className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#2a2a2a]">
                      <span className="text-xs text-[#9ca3af] block mb-0.5">Calorii Recomandate</span>
                      <span className="font-mono text-[#22c55e] font-bold">{lastAnalysis.suggestedKcal} kcal</span>
                    </div>
                  </div>
                </div>
                <Link 
                  to="/agent"
                  className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f0f0f0] border border-[#2a2a2a] px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Vezi Detalii Analiză
                </Link>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <p className="text-[#9ca3af]">
                  Agentul AI este pregătit să îți analizeze progresul săptămânal și să ofere ajustări calorice.
                </p>
                <Link 
                  to="/agent"
                  className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f0f0f0] border border-[#2a2a2a] px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Deschide Agentul AI
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
