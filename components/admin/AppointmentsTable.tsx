import React from 'react';
import { Appointment, AppointmentStatus } from '../../types';
import { MessageCircle, Check, X, Filter } from 'lucide-react';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onWhatsApp: (apt: Appointment) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onStatusChange,
  onWhatsApp
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
    <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/30">
      <h3 className="font-bold text-slate-800 dark:text-white">Últimos Agendamentos</h3>
      <button className="text-gray-400 hover:text-brand-600"><Filter size={18} /></button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
            <th className="px-6 py-4">Data/Hora</th>
            <th className="px-6 py-4">Cliente</th>
            <th className="px-6 py-4">Serviço</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
          {appointments.slice(0, 10).map((apt) => (
            <tr key={apt.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-700/30 transition-colors group">
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-800 dark:text-white text-sm">{apt.startTime}</div>
                <div className="text-xs text-gray-400 dark:text-slate-500">{new Date(apt.date + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-700 dark:text-slate-200 text-sm">{apt.clientName}</div>
                <div className="text-xs text-gray-400 dark:text-slate-500 font-mono mt-0.5">{apt.clientPhone}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{apt.serviceName}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    apt.status === 'CONFIRMED' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800' :
                    apt.status === 'CANCELLED' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800' :
                    'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800'
                  }`}>
                    {apt.status === 'CONFIRMED' ? 'Confirmado' : apt.status === 'CANCELLED' ? 'Cancelado' : 'Pendente'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                 <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onWhatsApp(apt)}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition"
                      title="WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </button>
                    {apt.status === AppointmentStatus.PENDING && (
                       <button
                        onClick={() => onStatusChange(apt.id, AppointmentStatus.CONFIRMED)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition"
                        title="Confirmar"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    {apt.status !== AppointmentStatus.CANCELLED && (
                      <button
                        onClick={() => { if(window.confirm('Tem certeza que deseja cancelar este agendamento?')) onStatusChange(apt.id, AppointmentStatus.CANCELLED) }}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition"
                        title="Cancelar Agendamento"
                      >
                        <X size={18} />
                      </button>
                    )}
                 </div>
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td colSpan={5} className="p-12 text-center text-gray-400">
                Nenhum agendamento encontrado no sistema.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);