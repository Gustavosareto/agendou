import React, { useEffect, useState } from 'react';
import { availabilityApi, businessApi } from '../../services/api';
import { Availability, BusinessConfig } from '../../types';
import { Save, Phone, Store, AlertCircle, Clock, Check } from 'lucide-react';
import { formatPhoneInput, normalizeForWhatsApp, isValidPhone } from '../../utils/phone';

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const SettingsPage: React.FC = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [availData, busData] = await Promise.all([
        availabilityApi.get(),
        businessApi.get()
      ]);

      const fullWeek = Array.from({ length: 7 }).map((_, i) => {
        const existing = availData.find(d => d.dayOfWeek === i);
        return existing || { dayOfWeek: i, startTime: '09:00', endTime: '18:00', isActive: i > 0 && i < 6 };
      });

      setAvailability(fullWeek);
      setBusinessConfig({
        ...busData,
        phone: formatPhoneInput(busData.phone)
      });
      setLoading(false);
    };
    load();
  }, []);

  const handleAvailabilityChange = (index: number, field: keyof Availability, value: any) => {
    const newAvail = [...availability];
    newAvail[index] = { ...newAvail[index], [field]: value };
    setAvailability(newAvail);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessConfig({
      ...businessConfig,
      phone: formatPhoneInput(e.target.value)
    });
  };

  const handleSave = async () => {
    if (businessConfig.phone && !isValidPhone(businessConfig.phone)) {
      alert('Número de WhatsApp inválido. Verifique o DDD.');
      return;
    }

    setSaving(true);
    setSuccess(false);
    
    const cleanConfig = {
      ...businessConfig,
      phone: normalizeForWhatsApp(businessConfig.phone)
    };

    try {
      await Promise.all([
        availabilityApi.update(availability),
        businessApi.update(cleanConfig)
      ]);
      
      setBusinessConfig({
        ...cleanConfig,
        phone: formatPhoneInput(cleanConfig.phone)
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Carregando configurações...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10 animate-fade-in">
      
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configurações</h2>
           <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Defina os detalhes da sua loja e horários.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold shadow-sm disabled:opacity-70 ${
            success 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-slate-900 dark:bg-brand-600 text-white hover:bg-slate-800 dark:hover:bg-brand-700'
          }`}
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : success ? (
            <Check size={18} />
          ) : (
            <Save size={18} />
          )} 
          
          {saving ? 'Salvando...' : success ? 'Salvo com Sucesso!' : 'Salvar Alterações'}
        </button>
      </div>

      {/* Section 1: Business Info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
            <Store className="text-brand-600 dark:text-brand-400" size={20}/>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Identidade da Loja</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Nome Comercial</label>
            <input 
              type="text" 
              value={businessConfig.name}
              onChange={(e) => setBusinessConfig({...businessConfig, name: e.target.value})}
              className="w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder:text-gray-400"
              placeholder="Ex: Barbearia do Silva"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">WhatsApp para Notificações</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input 
                type="text" 
                value={businessConfig.phone}
                onChange={handlePhoneChange}
                className="w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder:text-gray-400"
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>
            <div className="mt-2 flex items-start gap-2 text-xs text-gray-500 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-blue-800">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0"/>
              <p>Este número receberá os alertas de novos agendamentos via API.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Availability */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
           <Clock className="text-brand-600 dark:text-brand-400" size={20}/>
           <h3 className="font-bold text-slate-800 dark:text-slate-100">Horários de Funcionamento</h3>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {availability.map((day, idx) => (
            <div key={day.dayOfWeek} className={`p-4 flex flex-col sm:flex-row items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50 ${!day.isActive && 'bg-gray-50/50 dark:bg-slate-900/30'}`}>
              
              <div className="flex items-center gap-4 w-full sm:w-1/3 mb-2 sm:mb-0">
                <div className="relative flex items-center">
                    <input 
                        type="checkbox" 
                        id={`day-${idx}`}
                        checked={day.isActive}
                        onChange={(e) => handleAvailabilityChange(idx, 'isActive', e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-slate-600 transition-all checked:border-brand-600 checked:bg-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
                    />
                     <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                </div>
                <label htmlFor={`day-${idx}`} className={`font-medium cursor-pointer select-none ${day.isActive ? 'text-slate-700 dark:text-slate-200' : 'text-gray-400 dark:text-slate-500'}`}>
                    {DAYS[day.dayOfWeek]}
                </label>
              </div>

              <div className={`flex items-center gap-3 transition-opacity duration-200 ${!day.isActive ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                <div className="relative">
                    <input 
                        type="time" 
                        value={day.startTime}
                        onChange={(e) => handleAvailabilityChange(idx, 'startTime', e.target.value)}
                        className="border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-900 dark:text-white focus:border-brand-500 outline-none font-mono text-gray-700"
                    />
                </div>
                <span className="text-gray-400 text-sm font-medium">até</span>
                <div className="relative">
                    <input 
                        type="time" 
                        value={day.endTime}
                        onChange={(e) => handleAvailabilityChange(idx, 'endTime', e.target.value)}
                        className="border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-900 dark:text-white focus:border-brand-500 outline-none font-mono text-gray-700"
                    />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};