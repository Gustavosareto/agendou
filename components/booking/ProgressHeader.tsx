import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { BusinessConfig } from '../../types';

interface ProgressHeaderProps {
  step: number;
  businessConfig: BusinessConfig | null;
  onBack: () => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({ step, businessConfig, onBack }) => (
  <div className="bg-white border-b border-gray-100 p-6 sticky top-0 z-10">
    <div className="flex items-center justify-between mb-6">
      {step > 1 ? (
        <button onClick={onBack} className="group text-gray-400 hover:text-brand-600 flex items-center gap-1 text-sm font-medium transition-colors">
          <div className="p-1 rounded-full group-hover:bg-brand-50"><ChevronLeft size={18} /></div> Voltar
        </button>
      ) : <div className="w-20"></div>}

      <div className="flex gap-2">
         {[1,2,3,4].map(s => (
            <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${s <= step ? 'bg-brand-600' : 'bg-gray-100'}`} />
         ))}
      </div>

      <span className="text-sm font-medium text-gray-400 w-20 text-right">Passo {step}/4</span>
    </div>

    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
      {step === 1 && (businessConfig?.name || "Escolha o Serviço")}
      {step === 2 && "Escolha a Data"}
      {step === 3 && "Escolha o Horário"}
      {step === 4 && "Seus Dados"}
    </h1>
    <p className="text-gray-400 mt-1">
      {step === 1 && "Selecione o procedimento que deseja realizar"}
      {step === 2 && "Para qual dia seria o agendamento?"}
      {step === 3 && "Selecione um horário disponível"}
      {step === 4 && "Preencha para receber a confirmação"}
    </p>
  </div>
);