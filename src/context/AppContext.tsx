import { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, WeightEntry, WorkoutSession, AgentAnalysis } from '../types';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface AppContextType {
  profile: UserProfile | null;
  weightEntries: WeightEntry[];
  workoutSessions: WorkoutSession[];
  lastAnalysis: AgentAnalysis | null;
  isLoading: boolean;
  
  setProfile: (p: UserProfile) => Promise<void>;
  addWeightEntry: (entry: WeightEntry) => Promise<void>;
  editWeightEntry: (id: string, weight: number) => Promise<void>;
  removeWeightEntry: (id: string) => Promise<void>;
  addWorkoutSession: (session: WorkoutSession) => Promise<void>;
  editWorkoutSession: (session: WorkoutSession) => Promise<void>;
  removeWorkoutSession: (id: string) => Promise<void>;
  setLastAnalysis: (a: AgentAnalysis) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoadingAuth } = useAuth();
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [lastAnalysis, setLastAnalysisState] = useState<AgentAnalysis | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function loadData(uid: string) {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userDocRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.profile) setProfileState(data.profile);
          if (data.lastAnalysis) setLastAnalysisState(data.lastAnalysis);
        }

        const weightsSnap = await getDocs(collection(db, `users/${uid}/weightEntries`));
        const weights = weightsSnap.docs.map(d => d.data() as WeightEntry);
        setWeightEntries(weights);

        const workoutsSnap = await getDocs(collection(db, `users/${uid}/workoutSessions`));
        const workouts = workoutsSnap.docs.map(d => d.data() as WorkoutSession);
        setWorkoutSessions(workouts);
        
      } catch (err) {
        console.error("Error loading data from Firebase:", err);
      } finally {
        setIsLoadingData(false);
      }
    }
    
    if (isLoadingAuth) return;

    if (!user) {
      // Clear data if logged out
      setProfileState(null);
      setWeightEntries([]);
      setWorkoutSessions([]);
      setLastAnalysisState(null);
      setIsLoadingData(false);
      return;
    }

    if (import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      setIsLoadingData(true);
      loadData(user.uid);
    } else {
      setIsLoadingData(false);
      console.warn("Firebase credentials missing, app will not save data.");
    }
  }, [user, isLoadingAuth]);

  const setProfile = async (p: UserProfile) => {
    if (!user) return;
    setProfileState(p);
    await setDoc(doc(db, 'users', user.uid), { profile: p }, { merge: true });
  };

  const addWeightEntry = async (entry: WeightEntry) => {
    if (!user) return;
    setWeightEntries(prev => [...prev, entry]);
    await setDoc(doc(db, `users/${user.uid}/weightEntries`, entry.id), entry);
  };

  const editWeightEntry = async (id: string, weight: number) => {
    if (!user) return;
    setWeightEntries(prev => prev.map(e => e.id === id ? { ...e, weight } : e));
    await updateDoc(doc(db, `users/${user.uid}/weightEntries`, id), { weight });
  };

  const removeWeightEntry = async (id: string) => {
    if (!user) return;
    setWeightEntries(prev => prev.filter(e => e.id !== id));
    await deleteDoc(doc(db, `users/${user.uid}/weightEntries`, id));
  };

  const addWorkoutSession = async (session: WorkoutSession) => {
    if (!user) return;
    setWorkoutSessions(prev => [...prev, session]);
    await setDoc(doc(db, `users/${user.uid}/workoutSessions`, session.id), session);
  };

  const editWorkoutSession = async (session: WorkoutSession) => {
    if (!user) return;
    setWorkoutSessions(prev => prev.map(s => s.id === session.id ? session : s));
    await setDoc(doc(db, `users/${user.uid}/workoutSessions`, session.id), session);
  };

  const removeWorkoutSession = async (id: string) => {
    if (!user) return;
    setWorkoutSessions(prev => prev.filter(s => s.id !== id));
    await deleteDoc(doc(db, `users/${user.uid}/workoutSessions`, id));
  };

  const setLastAnalysis = async (a: AgentAnalysis) => {
    if (!user) return;
    setLastAnalysisState(a);
    await setDoc(doc(db, 'users', user.uid), { lastAnalysis: a }, { merge: true });
  };

  const isLoading = isLoadingAuth || isLoadingData;

  if (isLoading && user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2a2a2a] border-t-[#22c55e] rounded-full animate-spin"></div>
          <p className="text-[#9ca3af]">Se încarcă datele tale...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        profile,
        weightEntries,
        workoutSessions,
        lastAnalysis,
        isLoading,
        setProfile,
        addWeightEntry,
        editWeightEntry,
        removeWeightEntry,
        addWorkoutSession,
        editWorkoutSession,
        removeWorkoutSession,
        setLastAnalysis,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
