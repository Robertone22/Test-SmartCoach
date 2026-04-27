export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'weight_loss' | 'weight_gain' | 'maintenance';
export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';

export interface UserProfile {
  name: string;
  gender: Gender;
  weight: number;        // kg, greutatea inițială
  height: number;        // cm
  age: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  targetWeight: number;  // kg
  createdAt: string;     // ISO string
}

export interface WeightEntry {
  id: string;
  date: string;          // format "YYYY-MM-DD" (doar data, fără oră)
  weight: number;        // kg, cu maxim 1 zecimală
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets?: number;
  reps?: number;
  weightKg?: number;      // 0 pentru exerciții cu greutatea corpului
  duration?: number;      // minute (pentru cardio)
  distance?: number;      // km (pentru cardio)
}

export interface WorkoutSession {
  id: string;
  date: string;          // format "YYYY-MM-DD"
  exercises: Exercise[];
  notes: string;         // string gol dacă nu există note, NU undefined
}

export interface AgentAnalysis {
  avgWeightLast7: number;
  avgWeightPrev7: number;
  currentKcal: number;
  suggestedKcal: number;
  adjustment: number;
  aiMessage: string;
  generatedAt: string;   // ISO string
}
