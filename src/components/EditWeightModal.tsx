import { useState, useEffect } from 'react';
import { WeightEntry } from '../types';
import { formatDate } from '../utils/dateUtils';

interface EditWeightModalProps {
  entry: WeightEntry | null;
  onSave: (id: string, weight: number) => void;
  onClose: () => void;
}

export function EditWeightModal({ entry, onSave, onClose }: EditWeightModalProps) {
  const [weight, setWeight] = useState<number | ''>('');

  useEffect(() => {
    if (entry) {
      setWeight(entry.weight);
    }
  }, [entry]);

  if (!entry) return null;

  const handleSave = () => {
    if (typeof weight === 'number' && weight >= 20 && weight <= 500) {
      onSave(entry.id, weight);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#111111] border border-[#2a2a2a] p-6 rounded-xl max-w-sm w-full fade-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4">Editează Greutatea</h3>
        <p className="text-[#9ca3af] mb-4">Data: <span className="font-mono text-[#f0f0f0]">{formatDate(entry.date)}</span></p>
        
        <div className="mb-6">
          <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Greutate (kg)</label>
          <input 
            type="number" 
            step="0.1"
            value={weight}
            onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full"
          />
        </div>

        <div className="flex gap-4">
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
            Salvează
          </button>
        </div>
      </div>
    </div>
  );
}
