import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WeightChart } from '../components/WeightChart';
import { StreakBadge } from '../components/StreakBadge';
import { EditWeightModal } from '../components/EditWeightModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { WeightEntry } from '../types';
import { todayStr, formatDate } from '../utils/dateUtils';

export function WeightPage() {
  const { profile, weightEntries, addWeightEntry, editWeightEntry, removeWeightEntry } = useApp();

  const [date, setDate] = useState(todayStr());
  const [weight, setWeight] = useState<number | ''>(profile?.weight || 70);
  const [error, setError] = useState('');

  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!profile) return null;

  const handleAdd = () => {
    setError('');

    if (typeof weight !== 'number' || weight < 20 || weight > 500) {
      setError('Greutatea trebuie să fie între 20 și 500 kg.');
      return;
    }

    if (weightEntries.some(e => e.date === date)) {
      setError('Există deja o înregistrare pentru această dată. Editează înregistrarea existentă.');
      return;
    }

    addWeightEntry({
      id: crypto.randomUUID(),
      date,
      weight: Number(weight)
    });

    // Reset date to today after success
    setDate(todayStr());
  };

  const sortedEntries = [...weightEntries].sort((a, b) => b.date.localeCompare(a.date));

  const entryToDelete = weightEntries.find(e => e.id === deletingId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Jurnal Greutate</h1>
        <StreakBadge />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Chart */}
        <div className="lg:col-span-2">
          <WeightChart
            entries={weightEntries}
            targetWeight={profile.targetWeight}
            goal={profile.goal}
          />
        </div>

        {/* Right Column: Add Form & Table */}
        <div className="flex flex-col gap-8">

          {/* Add Form */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 fade-in">
            <h2 className="text-xl font-bold mb-4">Adaugă Înregistrare</h2>

            {error && (
              <div className="bg-[#ef4444] bg-opacity-10 border border-[#ef4444] text-[#ef4444] p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
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
                <label className="text-[#9ca3af] text-sm font-medium mb-1 block">Greutate (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#f0f0f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#22c55e] w-full"
                />
              </div>
              <button
                onClick={handleAdd}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-4 py-2 rounded-lg transition-colors w-full mt-2"
              >
                Înregistrează
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden fade-in flex-1">
            <div className="p-4 border-b border-[#2a2a2a] bg-[#1a1a1a]">
              <h3 className="font-semibold">Istoric</h3>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {sortedEntries.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="text-[#9ca3af] sticky top-0 bg-[#111111] z-10">
                    <tr>
                      <th className="px-4 py-3 font-medium border-b border-[#2a2a2a]">Data</th>
                      <th className="px-4 py-3 font-medium border-b border-[#2a2a2a]">Kg</th>
                      <th className="px-4 py-3 font-medium border-b border-[#2a2a2a] text-right">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEntries.map(entry => (
                      <tr key={entry.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors group">
                        <td className="px-4 py-3 font-mono">{formatDate(entry.date)}</td>
                        <td className="px-4 py-3 font-mono font-bold">{entry.weight.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingEntry(entry)}
                              className="text-[#9ca3af] hover:text-[#22c55e] transition-colors p-1"
                              title="Editează"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => setDeletingId(entry.id)}
                              className="text-[#9ca3af] hover:text-[#ef4444] transition-colors p-1"
                              title="Șterge"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-[#9ca3af]">
                  Nicio înregistrare încă.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <EditWeightModal
        entry={editingEntry}
        onSave={(id, newWeight) => editWeightEntry(id, newWeight)}
        onClose={() => setEditingEntry(null)}
      />

      <ConfirmModal
        isOpen={deletingId !== null}
        message={`Ești sigur că vrei să ștergi înregistrarea din ${entryToDelete ? formatDate(entryToDelete.date) : ''}?`}
        onConfirm={() => {
          if (deletingId) removeWeightEntry(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />

    </div>
  );
}
