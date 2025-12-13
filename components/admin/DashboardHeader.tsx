import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onRefresh }) => {
  const getPublicUrl = () => {
    try {
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        const base = pathname === '/' ? origin : `${origin}${pathname}`;
        return `${base.replace(/\/$/, '')}/#/`;
    } catch (e) {
        return '/#/';
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-slate-700 pb-6">
      <div>
         <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Visão Geral</h2>
         <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Acompanhe o desempenho do seu negócio hoje.</p>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={getPublicUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2 text-sm font-medium"
        >
          <ExternalLink size={16} /> Ver Agenda Pública
        </a>
        <button
          onClick={onRefresh}
          className="bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2 text-sm font-medium"
        >
          <RefreshCw size={16} /> Atualizar
        </button>
      </div>
    </div>
  );
};