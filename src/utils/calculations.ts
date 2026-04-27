import { UserProfile, ActivityLevel } from '../types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Formula Mifflin-St Jeor
export function calculateBMR(profile: UserProfile): number {
  const base = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
  return profile.gender === 'male' ? base + 5 : base - 161;
}

export function calculateTDEE(profile: UserProfile): number {
  return Math.round(calculateBMR(profile) * ACTIVITY_MULTIPLIERS[profile.activityLevel]);
}

export function calculateRecommendedKcal(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  if (profile.goal === 'weight_loss') return tdee - 500;
  if (profile.goal === 'weight_gain') return tdee + 300;
  return tdee;
}

// Calculează BMI
export function calculateBMI(weight: number, heightCm: number): number {
  const h = heightCm / 100;
  return Math.round((weight / (h * h)) * 10) / 10;
}

// Calculează streak-ul de zile consecutive
// Regula: o zi contează dacă există CEL PUȚIN O înregistrare de greutate SAU un antrenament în acea zi
// Dacă există mai multe înregistrări în aceeași zi, contează ca 1 singură zi
export function calculateStreak(weightDates: string[], workoutDates: string[]): number {
  const allDates = new Set([...weightDates, ...workoutDates]);
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    if (allDates.has(dateStr)) {
      streak++;
    } else {
      // Dacă e azi și nu există înregistrare, streak-ul nu se rupe încă
      // Dar dacă e ieri sau mai devreme și lipsește, streak-ul se oprește
      if (i > 0) break;
    }
  }
  
  return streak;
}
