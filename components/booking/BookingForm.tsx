import React from 'react';
import { Service } from '../../types';
import { AlertCircle } from 'lucide-react';

interface BookingFormProps {
  selectedService: Service | null;
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientPhone: string;
  autoNotify: boolean;
  error: string | null;
  loading: boolean;
  onClientNameChange: (name: string) => void;
  onClientPhoneChange: (phone: string) => void;
  onAutoNotifyChange: (notify: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedService,
  selectedDate,
  selectedTime,
  clientName,
  clientPhone,
  autoNotify,
  error,
  loading,
  onClientNameChange,
  onClientPhoneChange,
  onAutoNotifyChange,
  onSubmit
}) => {
  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', weekday: 'long' }).format(d);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
       {/* Summary Card */}
       <div className="w-full md:w-1/3 order-2 md:order-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">Resumo</h3>
              <div className="space-y-4">
                  <div>
                      <span className="block text-2xl font-bold text-brand-600">{selectedTime}</span>
                      <span className="text-gray-900 font-medium capitalize">{selectedDate && formatDateDisplay(selectedDate)}</span>
                  </div>
                  <div className="h-px bg-gray-100"></div>
                  <div>
                      <span className="block text-sm text-gray-500">Serviço</span>
                      <span className="font-semibold text-gray-800">{selectedService?.name}</span>
                  </div>
                  <div>
                       <span className="block text-sm text-gray-500">Valor</span>
                       <span className="font-semibold text-gray-800">R$ {selectedService?.price}</span>
                  </div>
              </div>
          </div>
       </div>

       {/* Form */}
       <form onSubmit={onSubmit} className="w-full md:w-2/3 order-1 md:order-2 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Seu Nome</label>
            <input
              required
              type="text"
              className="w-full border-gray-200 bg-white rounded-xl shadow-sm focus:border-brand-500 focus:ring-brand-500 p-4 border transition-all outline-none"
              placeholder="Ex: João Silva"
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Celular / WhatsApp</label>
            <input
              required
              type="tel"
              className="w-full border-gray-200 bg-white rounded-xl shadow-sm focus:border-brand-500 focus:ring-brand-500 p-4 border transition-all outline-none"
              placeholder="(11) 99999-9999"
              value={clientPhone}
              onChange={(e) => onClientPhoneChange(e.target.value)}
              maxLength={15}
            />
          </div>

          <div className="flex items-start gap-3 p-4 bg-brand-50 rounded-xl border border-brand-100">
            <input
              id="notify"
              type="checkbox"
              checked={autoNotify}
              onChange={(e) => onAutoNotifyChange(e.target.checked)}
              className="mt-1 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="notify" className="text-sm text-gray-700 cursor-pointer">
              Quero receber o comprovante de agendamento imediatamente após a confirmação.
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-100">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? 'Processando...' : 'Confirmar Agendamento'}
          </button>
       </form>
    </div>
  );
};