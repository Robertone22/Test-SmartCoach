
import { useApp } from '../context/AppContext';
import { calculateStreak } from '../utils/calculations';

export function StreakBadge() {
  const { weightEntries, workoutSessions } = useApp();
  
  const weightDates = weightEntries.map(e => e.date);
  const workoutDates = workoutSessions.map(s => s.date);
  
  const streak = calculateStreak(weightDates, workoutDates);

  if (streak === 0) {
    return (
      <div className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#9ca3af] px-3 py-1.5 rounded-full border border-[#2a2a2a] text-sm font-medium">
        Începe azi! 💪
      </div>
    );
  }

  let bgColor = 'bg-[#1a1a1a] border-[#2a2a2a] text-[#f0f0f0]';
  if (streak >= 7) {
    bgColor = 'bg-[#22c55e] bg-opacity-20 border-[#22c55e] text-[#22c55e]';
  } else if (streak >= 3) {
    bgColor = 'bg-[#f97316] bg-opacity-20 border-[#f97316] text-[#f97316]';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${bgColor}`}>
      🔥 {streak} zile consecutive
    </div>
  );
}
