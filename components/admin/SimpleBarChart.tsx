import React from 'react';

interface SimpleBarChartProps {
  data: number[];
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
  const safeData = data.map(d => isNaN(d) ? 0 : d);
  const max = Math.max(...safeData, 1);
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  return (
    <div className="flex items-end justify-between h-48 gap-3 pt-6">
      {safeData.map((val, idx) => (
        <div key={idx} className="flex flex-col items-center gap-3 flex-1 group cursor-default">
          <div className="relative w-full flex justify-center h-full items-end bg-gray-50 dark:bg-slate-700/30 rounded-t-lg overflow-hidden">
             <div
              style={{ height: `${(val / max) * 100}%` }}
              className="w-full max-w-[40px] bg-brand-500 opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-t-md relative"
             >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold">
                    {val}
                </div>
             </div>
          </div>
          <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">{days[idx]}</span>
        </div>
      ))}
    </div>
  );
};