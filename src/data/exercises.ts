import { MuscleGroup } from '../types';

export interface PredefinedExercise {
  name: string;
  muscleGroup: MuscleGroup;
}

export const PREDEFINED_EXERCISES: PredefinedExercise[] = [
  // Chest
  { name: 'Împins la bancă cu bara', muscleGroup: 'chest' },
  { name: 'Împins cu ganterele înclinat', muscleGroup: 'chest' },
  { name: 'Fluturări cu gantere', muscleGroup: 'chest' },
  { name: 'Flotări', muscleGroup: 'chest' },
  // Back
  { name: 'Tracțiuni la bara fixă', muscleGroup: 'back' },
  { name: 'Ramat cu bara', muscleGroup: 'back' },
  { name: 'Ramat cu gantera', muscleGroup: 'back' },
  { name: 'Lat pulldown', muscleGroup: 'back' },
  // Legs
  { name: 'Genuflexiuni cu bara', muscleGroup: 'legs' },
  { name: 'Leg press', muscleGroup: 'legs' },
  { name: 'Fandări cu gantere', muscleGroup: 'legs' },
  { name: 'Romanian deadlift', muscleGroup: 'legs' },
  { name: 'Leg curl', muscleGroup: 'legs' },
  // Shoulders
  { name: 'Împins militar cu bara', muscleGroup: 'shoulders' },
  { name: 'Ridicări laterale cu gantere', muscleGroup: 'shoulders' },
  { name: 'Față anterioară cu gantera', muscleGroup: 'shoulders' },
  // Arms
  { name: 'Bicep curl cu bara', muscleGroup: 'arms' },
  { name: 'Tricep pushdown la cablu', muscleGroup: 'arms' },
  { name: 'Hammer curl', muscleGroup: 'arms' },
  { name: 'Skull crushers', muscleGroup: 'arms' },
  // Core
  { name: 'Planșă', muscleGroup: 'core' },
  { name: 'Crunch abdominal', muscleGroup: 'core' },
  { name: 'Ridicări de picioare', muscleGroup: 'core' },
  // Cardio
  { name: 'Alergare pe bandă', muscleGroup: 'cardio' },
  { name: 'Bicicletă staționară', muscleGroup: 'cardio' },
  { name: 'Rowing machine', muscleGroup: 'cardio' },
];
