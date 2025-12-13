import React from 'react';

interface DateSelectionProps {
  onSelectDate: (date: string) => void;
}

export const DateSelection: React.FC<DateSelectionProps> = ({ onSelectDate }) => {
  const getNextDays = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {getNextDays().map((date) => {
        const dateStr = date.toISOString().split('T')[0];
        return (
          <button
            key={dateStr}
            onClick={() => onSelectDate(dateStr)}
            className="relative p-5 rounded-2xl border transition-all duration-200 group bg-white border-gray-100 hover:border-brand-300 hover:shadow-md text-gray-600"
          >
            <span className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-400">
              {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
            </span>
            <span className="block text-3xl font-bold tracking-tight mb-1">{date.getDate()}</span>
            <span className="text-sm text-gray-400">
              {date.toLocaleDateString('pt-BR', { month: 'long' })}
            </span>
          </button>
        );
      })}
    </div>
  );
};