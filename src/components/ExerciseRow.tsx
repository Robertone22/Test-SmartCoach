import { Exercise, MuscleGroup } from '../types';
import { PREDEFINED_EXERCISES } from '../data/exercises';

interface ExerciseRowProps {
  exercise: Exercise;
  onChange: (e: Exercise) => void;
  onRemove: () => void;
}

export function ExerciseRow({ exercise, onChange, onRemove }: ExerciseRowProps) {
  
  // Group exercises by muscle group
  const groupedExercises = PREDEFINED_EXERCISES.reduce((acc, ex) => {
    if (!acc[ex.muscleGroup]) {
      acc[ex.muscleGroup] = [];
    }
    acc[ex.muscleGroup].push(ex);
    return acc;
  }, {} as Record<string, typeof PREDEFINED_EXERCISES>);

  const muscleGroupLabels: Record<MuscleGroup, string> = {
    chest: 'Piept',
    back: 'Spate',
    legs: 'Picioare',
    shoulders: 'Umeri',
    arms: 'Brațe',
    core: 'Core',
    cardio: 'Cardio'
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const predefined = PREDEFINED_EXERCISES.find(ex => ex.name === selectedName);
    
    onChange({
      ...exercise,
      name: selectedName,
      muscleGroup: predefined ? predefined.muscleGroup : exercise.muscleGroup
    });
  };

  const isCardio = exercise.muscleGroup === 'cardio';

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a] relative group">
      
      <button 
        type="button"
        onClick={onRemove}
        className="absolute -left-2 -top-2 bg-[#ef4444] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
        title="Șterge exercițiu"
      >
        ✕
      </button>

      <div className="flex-1 w-full">
        <label className="text-[#9ca3af] text-xs font-medium mb-1 block">Exercițiu</label>
        <select 
          value={exercise.name}
          onChange={handleNameChange}
          className="bg-[#111111] border border-[#2a2a2a] text-[#f0f0f0] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#22c55e] w-full text-sm"
        >
          <option value="" disabled>Selectează...</option>
          {Object.entries(groupedExercises).map(([group, exercises]) => (
            <optgroup key={group} label={muscleGroupLabels[group as MuscleGroup] || group}>
              {exercises.map(ex => (
                <option key={ex.name} value={ex.name}>{ex.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {isCardio ? (
        <>
          <div className="w-full sm:w-24">
            <label className="text-[#9ca3af] text-xs font-medium mb-1 block">Durată (min)</label>
            <input 
              type="number" 
              min="1" max="300"
              value={exercise.duration ?? ''}
              onChange={e => onChange({ ...exercise, duration: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="bg-[#111111] border border-[#2a2a2a] text-[#f0f0f0] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#22c55e] w-full text-sm"
            />
          </div>

          <div className="w-full sm:w-24">
            <label className="text-[#9ca3af] text-xs font-medium mb-1 block">Dist (km)</label>
            <input 
              type="number" 
              step="0.1" min="0" max="100"
              value={exercise.distance ?? ''}
              onChange={e => onChange({ ...exercise, distance: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="bg-[#111111] border border-[#2a2a2a] text-[#f0f0f0] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#22c55e] w-full text-sm"
            />
          </div>
        </>
      ) : (
        <>
          <div className="w-full sm:w-20">
            <label className="text-[#9ca3af] text-xs font-medium mb-1 block">Seturi</label>
            <input 
              type="number" 
              min="1" max="20"
              value={exercise.sets ?? ''}
              onChange={e => onChange({ ...exercise, sets: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="bg-[#111111] border border-[#2a2a2a] text-[#f0f0f0] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#22c55e] w-full text-sm"
            />
          </div>

          <div className="w-full sm:w-20">
            <label className="text-[#9ca3af] text-xs font-medium mb-1 block">Reps</label>
            <input 
              type="number" 
              min="1" max="100"
              value={exercise.reps ?? ''}
              onChange={e => onChange({ ...exercise, reps: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="bg-[#111111] border border-[#2a2a2a] text-[#f0f0f0] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#22c55e] w-full text-sm"
            />
          </div>

          <div className="w-full sm:w-24">
            <label className="text-[#9ca3af] text-xs font-medium mb-1 block">Kg</label>
            <input 
              type="number" 
              step="0.5" min="0" max="500"
              value={exercise.weightKg ?? ''}
              onChange={e => onChange({ ...exercise, weightKg: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="bg-[#111111] border border-[#2a2a2a] text-[#f0f0f0] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#22c55e] w-full text-sm"
            />
          </div>
        </>
      )}

    </div>
  );
}
