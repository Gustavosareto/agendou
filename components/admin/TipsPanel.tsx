import React from 'react';
import { Clock } from 'lucide-react';

export const TipsPanel: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-8 flex flex-col justify-between">
     <div>
        <h4 className="font-bold text-slate-800 dark:text-white mb-2">Dica de Gestão</h4>
        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
          Confirme os agendamentos pelo WhatsApp um dia antes. Isso reduz faltas em até 30%.
        </p>
     </div>
     <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Taxa de Conversão</span>
          <span className="font-bold text-green-600 dark:text-green-400">Alta</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full mt-2">
          <div className="bg-green-500 h-2 rounded-full w-[85%]"></div>
        </div>
     </div>
  </div>
);