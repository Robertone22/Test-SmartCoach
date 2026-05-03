import { useState, useEffect } from 'react';
import { WorkoutSession, Exercise } from '../types';
import { formatDate } from '../utils/dateUtils';
import { ExerciseRow } from './ExerciseRow';

interface EditWorkoutModalProps {
  session: WorkoutSession | null;
  onSave: (session: WorkoutSession) => void;
  onClose: () => void;
}

export function EditWorkoutModal({ session, onSave, onClose }: EditWorkoutModalProps) {
  const [editedSession, setEditedSession] = useState<WorkoutSession | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      // Deep clone to avoid mutating state directly
      setEditedSession(JSON.parse(JSON.stringify(session)));
    } else {
      setEditedSession(null);
    }
  }, [session]);

  if (!session || !editedSession) return null;

  const handleAddExercise = () => {
    setEditedSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: [
          ...prev.exercises,
          {
            id: crypto.randomUUID(),
            name: '',
            muscleGroup: 'chest',
            sets: 3,
            reps: 10,
            weightKg: 0
          }
        ]
      };
    });
  };

  const handleUpdateExercise = (id: string, updated: Exercise) => {
    setEditedSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => ex.id === id ? updated : ex)
      };
    });
  };

  const handleRemoveExercise = (id: string) => {
    setEditedSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.filter(ex => ex.id !== id)
      };
    });
  };

  const handleSave = () => {
    setError('');

    if (editedSession.exercises.length === 0) {
      setError('Adaugă cel puțin un exercițiu.');
      return;
    }

    for (const ex of editedSession.exercises) {
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

    onSave(editedSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#111111] border border-[#2a2a2a] p-6 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b border-[#2a2a2a] pb-4">
          <h3 className="text-xl font-bold">Editează Antrenamentul</h3>
          <button type="button" onClick={onClose} className="text-[#9ca3af] hover:text-[#f0f0f0] text-2xl p-2 -mr-2 leading-none" title="Închide">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar pr-2 mb-6">
          <p className="text-[#9ca3af] mb-4">Data: <span className="font-mono text-[#f0f0f0]">{formatDate(editedSession.date)}</span></p>
          
          {error && (
            <div className="bg-[#ef4444] bg-opacity-10 border border-[#ef4444] text-[#ef4444] p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Note</label>
            <textarea 
              value={editedSession.notes}
              onChange={e => setEditedSession({...editedSession, notes: e.target.value})}
              className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full min-h-[80px]"
              placeholder="Note despre sesiune..."
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <label className="text-[#9ca3af] text-sm font-medium block">Exerciții</label>
            <button 
              onClick={handleAddExercise}
              className="text-[#22c55e] hover:text-[#16a34a] text-sm font-medium flex items-center gap-1"
            >
              + Adaugă
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {editedSession.exercises.map(ex => (
              <ExerciseRow 
                key={ex.id}
                exercise={ex}
                onChange={(updated) => handleUpdateExercise(ex.id, updated)}
                onRemove={() => handleRemoveExercise(ex.id)}
              />
            ))}
            {editedSession.exercises.length === 0 && (
              <div className="text-center p-4 border border-dashed border-[#2a2a2a] rounded-lg text-[#9ca3af]">
                Niciun exercițiu. Apasă pe "+ Adaugă" pentru a începe.
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-[#2a2a2a]">
          <button 
            onClick={onClose}
            className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f0f0f0] border border-[#2a2a2a] px-4 py-2 rounded-lg transition-colors"
          >
            Anulează
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Salvează modificările
          </button>
        </div>
      </div>
    </div>
  );
}
