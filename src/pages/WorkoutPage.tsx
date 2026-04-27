import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExerciseRow } from '../components/ExerciseRow';
import { EditWorkoutModal } from '../components/EditWorkoutModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Exercise, WorkoutSession, MuscleGroup } from '../types';
import { todayStr, formatDate } from '../utils/dateUtils';

const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  chest: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  back: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  legs: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  shoulders: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  arms: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  core: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  cardio: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Piept',
  back: 'Spate',
  legs: 'Picioare',
  shoulders: 'Umeri',
  arms: 'Brațe',
  core: 'Core',
  cardio: 'Cardio'
};

export function WorkoutPage() {
  const { workoutSessions, addWorkoutSession, editWorkoutSession, removeWorkoutSession } = useApp();
  
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [date, setDate] = useState(todayStr());
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState('');

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<WorkoutSession | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddExercise = () => {
    setExercises(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        muscleGroup: 'chest',
        sets: 3,
        reps: 10,
        weightKg: 0
      }
    ]);
  };

  const handleSaveNewSession = () => {
    setError('');
    
    if (exercises.length === 0) {
      setError('Adaugă cel puțin un exercițiu.');
      return;
    }

    for (const ex of exercises) {
      if (!ex.name) {
        setError('Toate exercițiile trebuie să aibă un nume selectat.');
        return;
      }
      if (ex.muscleGroup === 'cardio') {
        if (!ex.duration || ex.duration < 1) {
          setError('Durata cardio trebuie să fie cel puțin 1 minut.');
          return;
        }
      } else {
        if (!ex.sets || ex.sets < 1) {
          setError('Seturile trebuie să fie cel puțin 1.');
          return;
        }
        if (!ex.reps || ex.reps < 1) {
          setError('Repetările trebuie să fie cel puțin 1.');
          return;
        }
        if (ex.weightKg && ex.weightKg < 0) {
          setError('Greutatea nu poate fi negativă.');
          return;
        }
      }
    }

    const hasDuplicateDate = workoutSessions.some(s => s.date === date);
    if (hasDuplicateDate && !window.confirm('Există deja un antrenament înregistrat pentru această dată. Vrei să continui și să-l adaugi?')) {
      return;
    }

    const newSession: WorkoutSession = {
      id: crypto.randomUUID(),
      date,
      notes,
      exercises
    };

    addWorkoutSession(newSession);
    
    // Reset form
    setIsAddingMode(false);
    setDate(todayStr());
    setNotes('');
    setExercises([]);
  };

  const sortedSessions = [...workoutSessions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Antrenamente</h1>
        {!isAddingMode && (
          <button 
            onClick={() => {
              setIsAddingMode(true);
              if (exercises.length === 0) handleAddExercise();
            }}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="text-xl leading-none">+</span> Sesiune Nouă
          </button>
        )}
      </div>

      {isAddingMode && (
        <div className="bg-[#111111] border border-[#22c55e] border-opacity-50 rounded-xl p-6 fade-in shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#22c55e]">Înregistrare Antrenament Nou</h2>
            <button 
              onClick={() => setIsAddingMode(false)}
              className="text-[#9ca3af] hover:text-[#f0f0f0]"
            >
              Anulează
            </button>
          </div>

          {error && (
            <div className="bg-[#ef4444] bg-opacity-10 border border-[#ef4444] text-[#ef4444] p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Data</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                max={todayStr()}
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Note (Opțional)</label>
              <input 
                type="text" 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ex: M-am simțit obosit / Nou record la piept..."
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Exerciții</h3>
              <button 
                onClick={handleAddExercise}
                className="text-[#22c55e] hover:text-[#16a34a] font-medium flex items-center gap-1"
              >
                + Adaugă Exercițiu
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {exercises.map(ex => (
                <ExerciseRow 
                  key={ex.id}
                  exercise={ex}
                  onChange={(updated) => setExercises(prev => prev.map(e => e.id === ex.id ? updated : e))}
                  onRemove={() => setExercises(prev => prev.filter(e => e.id !== ex.id))}
                />
              ))}
              {exercises.length === 0 && (
                <div className="text-center p-8 border border-dashed border-[#2a2a2a] rounded-lg text-[#9ca3af]">
                  Apasă pe butonul de mai sus pentru a adăuga primul exercițiu.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#2a2a2a]">
            <button 
              onClick={handleSaveNewSession}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
            >
              Salvează Sesiunea
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {sortedSessions.map(session => {
          const isExpanded = expandedId === session.id;
          const muscleGroups = Array.from(new Set(session.exercises.map(e => e.muscleGroup)));
          
          return (
            <div key={session.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden transition-all duration-300 fade-in">
              {/* Header (Always visible) */}
              <div 
                className="p-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                onClick={() => setExpandedId(isExpanded ? null : session.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a] text-center min-w-[80px]">
                    <div className="text-sm font-medium text-[#f0f0f0]">{formatDate(session.date).split(' ')[0]}</div>
                    <div className="text-xs text-[#9ca3af] uppercase">{formatDate(session.date).split(' ')[1]}</div>
                  </div>
                  <div>
                    <div className="font-semibold">{session.exercises.length} Exerciții</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {muscleGroups.map(mg => (
                        <span key={mg} className={`text-xs px-2 py-0.5 rounded border ${MUSCLE_GROUP_COLORS[mg]}`}>
                          {MUSCLE_GROUP_LABELS[mg]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  {session.notes && <span className="text-[#9ca3af] text-sm hidden md:inline-block">📝 Vezi note</span>}
                  <button className="text-[#9ca3af] w-8 h-8 flex items-center justify-center bg-[#1a1a1a] rounded-full">
                    <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body (Expanded) */}
              {isExpanded && (
                <div className="p-4 border-t border-[#2a2a2a] bg-[#0a0a0a]">
                  {session.notes && (
                    <div className="mb-4 p-3 bg-[#111111] border border-[#2a2a2a] rounded-lg text-sm text-[#d1d5db]">
                      <span className="font-semibold text-[#9ca3af] mr-2">Note:</span>
                      {session.notes}
                    </div>
                  )}
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="text-[#9ca3af] border-b border-[#2a2a2a]">
                        <tr>
                          <th className="px-2 py-2 font-medium">Exercițiu</th>
                          <th className="px-2 py-2 font-medium">Detalii</th>
                        </tr>
                      </thead>
                      <tbody>
                        {session.exercises.map(ex => (
                          <tr key={ex.id} className="border-b border-[#2a2a2a] border-opacity-50">
                            <td className="px-2 py-3 font-medium text-[#f0f0f0]">{ex.name}</td>
                            <td className="px-2 py-3 font-mono text-[#9ca3af]">
                              {ex.muscleGroup === 'cardio' 
                                ? <span className="text-[#f0f0f0]">{ex.duration} min {ex.distance ? `/ ${ex.distance} km` : ''}</span>
                                : <span className="text-[#f0f0f0]">{ex.sets} seturi × {ex.reps} reps <span className="text-[#9ca3af] ml-1">@ {ex.weightKg ? `${ex.weightKg} kg` : 'Corp'}</span></span>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#2a2a2a]">
                    <button 
                      onClick={() => setEditingSession(session)}
                      className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f0f0f0] border border-[#2a2a2a] px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                      ✏️ Editează
                    </button>
                    <button 
                      onClick={() => setDeletingId(session.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                      🗑️ Șterge
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {sortedSessions.length === 0 && !isAddingMode && (
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-12 text-center fade-in">
            <div className="text-4xl mb-4">🏋️</div>
            <h3 className="text-xl font-bold mb-2">Niciun antrenament înregistrat</h3>
            <p className="text-[#9ca3af] mb-6">Începe să îți urmărești progresul adăugând prima ta sesiune de antrenament.</p>
            <button 
              onClick={() => {
                setIsAddingMode(true);
                handleAddExercise();
              }}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Adaugă Antrenament
            </button>
          </div>
        )}
      </div>

      <EditWorkoutModal 
        session={editingSession}
        onSave={(updated) => editWorkoutSession(updated)}
        onClose={() => setEditingSession(null)}
      />

      <ConfirmModal 
        isOpen={deletingId !== null}
        message="Ești sigur că vrei să ștergi acest antrenament? Acțiunea este ireversibilă."
        onConfirm={() => {
          if (deletingId) removeWorkoutSession(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />

    </div>
  );
}
