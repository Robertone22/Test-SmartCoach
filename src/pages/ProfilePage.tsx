import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserProfile, Gender, Goal, ActivityLevel } from '../types';
import { calculateBMR, calculateTDEE, calculateRecommendedKcal, calculateBMI } from '../utils/calculations';

const ACTIVITY_DESC = {
  sedentary: 'Sedentar — Birou, fără sport',
  light: 'Ușor activ — Sport 1-3 zile/săptămână',
  moderate: 'Moderat activ — Sport 3-5 zile/săptămână',
  active: 'Activ — Sport 6-7 zile/săptămână',
  very_active: 'Foarte activ — Antrenamente de 2x/zi sau muncă fizică',
};

const GOAL_DESC = {
  weight_loss: 'Scădere în greutate',
  maintenance: 'Mentenanță',
  weight_gain: 'Creștere în greutate',
};

export function ProfilePage() {
  const { profile, setProfile } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    gender: 'male',
    age: 25,
    height: 175,
    weight: 70,
    targetWeight: 65,
    goal: 'weight_loss',
    activityLevel: 'light',
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setIsEditing(true);
      setStep(1); // Meniu editare single-page
    }
  }, [profile]);

  const validate = () => {
    setError('');
    if (step === 1 || isEditing) {
      if (!formData.name || formData.name.length < 2) return 'Numele trebuie să aibă minim 2 caractere.';
      if (!formData.age || formData.age < 10 || formData.age > 100) return 'Vârsta trebuie să fie între 10 și 100 ani.';
      if (!formData.height || formData.height < 100 || formData.height > 250) return 'Înălțimea trebuie să fie între 100 și 250 cm.';
    }
    if (step === 2 || isEditing) {
      if (!formData.weight || formData.weight < 30 || formData.weight > 300) return 'Greutatea trebuie să fie între 30 și 300 kg.';
      if (!formData.targetWeight || formData.targetWeight < 30 || formData.targetWeight > 300) return 'Greutatea țintă trebuie să fie între 30 și 300 kg.';
      
      if (formData.goal === 'weight_loss' && formData.targetWeight >= formData.weight) {
        return 'Greutatea țintă trebuie să fie mai mică decât greutatea actuală pentru scădere în greutate.';
      }
      if (formData.goal === 'weight_gain' && formData.targetWeight <= formData.weight) {
        return 'Greutatea țintă trebuie să fie mai mare decât greutatea actuală pentru creștere în greutate.';
      }
    }
    return '';
  };

  const handleNext = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleSave = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    const newProfile: UserProfile = {
      ...(formData as UserProfile),
      createdAt: profile?.createdAt || new Date().toISOString(),
    };
    
    setProfile(newProfile);
    
    if (!isEditing) {
      setShowSummary(true);
    } else {
      navigate('/dashboard');
    }
  };

  if (showSummary && formData) {
    const p = formData as UserProfile;
    return (
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Profil creat cu succes! 🎉</h2>
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 flex flex-col gap-4">
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#9ca3af]">BMR:</span>
            <span className="font-mono">{calculateBMR(p)} kcal/zi</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#9ca3af]">TDEE:</span>
            <span className="font-mono">{calculateTDEE(p)} kcal/zi</span>
          </div>
          <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
            <span className="text-[#9ca3af]">Calorii Recomandate:</span>
            <span className="font-mono text-[#22c55e] font-bold">{calculateRecommendedKcal(p)} kcal/zi</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-[#9ca3af]">BMI Curent:</span>
            <span className="font-mono">{calculateBMI(p.weight, p.height)}</span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-6 w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-4 py-3 rounded-lg transition-colors"
        >
          Mergi la Dashboard
        </button>
      </div>
    );
  }

  const renderStep1 = () => (
    <div className="flex flex-col gap-4 fade-in">
      <div>
        <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Nume</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full"
        />
      </div>
      <div>
        <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Gen</label>
        <select 
          value={formData.gender}
          onChange={e => setFormData({...formData, gender: e.target.value as Gender})}
          className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full"
        >
          <option value="male">Masculin</option>
          <option value="female">Feminin</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Vârstă</label>
          <input 
            type="number" 
            value={formData.age ?? ''} 
            onChange={e => setFormData({...formData, age: e.target.value === '' ? undefined : Number(e.target.value)})}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full"
          />
        </div>
        <div>
          <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Înălțime (cm)</label>
          <input 
            type="number" 
            value={formData.height ?? ''} 
            onChange={e => setFormData({...formData, height: e.target.value === '' ? undefined : Number(e.target.value)})}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col gap-4 fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Greutate actuală (kg)</label>
          <input 
            type="number" 
            step="0.1"
            value={formData.weight ?? ''} 
            onChange={e => setFormData({...formData, weight: e.target.value === '' ? undefined : Number(e.target.value)})}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full"
          />
        </div>
        <div>
          <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Greutate țintă (kg)</label>
          <input 
            type="number" 
            step="0.1"
            value={formData.targetWeight ?? ''} 
            onChange={e => setFormData({...formData, targetWeight: e.target.value === '' ? undefined : Number(e.target.value)})}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full"
          />
        </div>
      </div>
      <div>
        <label className="text-[#9ca3af] text-sm font-medium mb-2 block">Obiectiv</label>
        <div className="flex flex-col gap-2">
          {(Object.entries(GOAL_DESC) as [Goal, string][]).map(([val, label]) => (
            <label key={val} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.goal === val ? 'border-[#22c55e] bg-[#1a1a1a]' : 'border-[#2a2a2a] hover:bg-[#1a1a1a]'}`}>
              <input 
                type="radio" 
                name="goal" 
                value={val} 
                checked={formData.goal === val}
                onChange={() => setFormData({...formData, goal: val})}
                className="accent-[#22c55e]"
              />
              <span className="text-[#f0f0f0]">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col gap-4 fade-in">
      <div>
        <label className="text-[#9ca3af] text-sm font-medium mb-2 block">Nivel de activitate</label>
        <div className="flex flex-col gap-2">
          {(Object.entries(ACTIVITY_DESC) as [ActivityLevel, string][]).map(([val, label]) => (
            <label key={val} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.activityLevel === val ? 'border-[#22c55e] bg-[#1a1a1a]' : 'border-[#2a2a2a] hover:bg-[#1a1a1a]'}`}>
              <input 
                type="radio" 
                name="activityLevel" 
                value={val} 
                checked={formData.activityLevel === val}
                onChange={() => setFormData({...formData, activityLevel: val})}
                className="accent-[#22c55e]"
              />
              <span className="text-[#f0f0f0]">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Editare Profil' : 'Creare Profil'}</h1>
      
      {!isEditing && (
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-[#22c55e]' : 'bg-[#2a2a2a]'}`} />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-[#ef4444] bg-opacity-10 border border-[#ef4444] text-[#ef4444] p-3 rounded-lg mb-6 fade-in">
          {error}
        </div>
      )}

      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
        {isEditing ? (
          <div className="flex flex-col gap-6">
            {renderStep1()}
            <hr className="border-[#2a2a2a]" />
            {renderStep2()}
            <hr className="border-[#2a2a2a]" />
            {renderStep3()}
          </div>
        ) : (
          <>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </>
        )}

        <div className="mt-8 flex gap-3">
          {!isEditing && step > 1 && (
            <button 
              onClick={handlePrev}
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#f0f0f0] border border-[#2a2a2a] px-4 py-2 rounded-lg transition-colors flex-1"
            >
              Înapoi
            </button>
          )}
          
          {(!isEditing && step < 3) ? (
            <button 
              onClick={handleNext}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-4 py-2 rounded-lg transition-colors flex-1"
            >
              Următorul
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-4 py-2 rounded-lg transition-colors flex-1"
            >
              Salvează
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
