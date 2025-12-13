import React from 'react';
import { TimeSlot } from '../../types';
import { Calendar } from 'lucide-react';

interface TimeSelectionProps {
  slots: TimeSlot[];
  loading: boolean;
  onSelectTime: (time: string) => void;
  onBackToDate: () => void;
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({
  slots,
  loading,
  onSelectTime,
  onBackToDate
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mb-3"></div>
        <p className="font-medium">Verificando disponibilidade...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-gray-400" size={24} />
        </div>
        <h3 className="text-gray-900 font-bold mb-1">Sem horários livres</h3>
        <p className="text-gray-500 mb-4">Não encontramos vagas para esta data.</p>
        <button onClick={onBackToDate} className="text-brand-600 font-semibold hover:underline">Escolher outra data</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 animate-fade-in">
      {slots.map((slot) => (
        <button
          key={slot.time}
          onClick={() => onSelectTime(slot.time)}
          className="py-3 px-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
};