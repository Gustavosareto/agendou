import React, { useState, useEffect } from 'react';
import { serviceApi, appointmentApi } from '../../services/api';
import { Service, TimeSlot, BusinessConfig } from '../../types';
import { Loader2 } from 'lucide-react';
import { formatPhoneInput, normalizeForWhatsApp, isValidPhone } from '../../utils/phone';
import { ProgressHeader } from '../../components/booking/ProgressHeader';
import { ServiceSelection } from '../../components/booking/ServiceSelection';
import { DateSelection } from '../../components/booking/DateSelection';
import { TimeSelection } from '../../components/booking/TimeSelection';
import { BookingForm } from '../../components/booking/BookingForm';

const STEPS = ['Serviço', 'Data', 'Horário', 'Confirmação'];

export const BookingWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig | null>(null);
  
  // Selection State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [autoNotify, setAutoNotify] = useState(true);

  // Confirmation State
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [servicesData, businessData] = await Promise.all([
          serviceApi.list(),
          businessApi.get()
        ]);
        setServices(servicesData);
        setBusinessConfig(businessData);
      } catch (err) {
        setError('Erro ao carregar dados do sistema.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      const loadSlots = async () => {
        setLoading(true);
        setSlots([]); // clear prev
        try {
          const data = await appointmentApi.getAvailableSlots(selectedDate, selectedService.id);
          setSlots(data);
        } catch (err) {
          setError('Erro ao buscar horários.');
        } finally {
          setLoading(false);
        }
      };
      loadSlots();
    }
  }, [selectedDate, selectedService]);

  // Helpers
  const getNextDays = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', weekday: 'long' }).format(d);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setClientPhone(formatted);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    if (!isValidPhone(clientPhone)) {
      setError('Por favor, insira um número de celular válido com DDD.');
      return;
    }
    
    setLoading(true);
    setError(null);
    const finalPhone = normalizeForWhatsApp(clientPhone);

    try {
      await appointmentApi.create({
        serviceId: selectedService!.id,
        clientName,
        clientPhone: finalPhone,
        date: selectedDate,
        startTime: selectedTime
      });
      const latestConfig = await businessApi.get();
      setBusinessConfig(latestConfig);
      setTimeout(() => { setSuccess(true); }, 600);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar agendamento.');
      setLoading(false);
    }
  };

  const getMessageDetails = () => {
    if (!selectedService) return '';
    const dateFormatted = new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR');
    return `*Serviço:* ${selectedService.name}\n*Data:* ${dateFormatted}\n*Horário:* ${selectedTime}\n*Cliente:* ${clientName}`;
  };

  const handleSendToClientSelf = async () => {
    const freshConfig = await businessApi.get();
    const msg = `✅ *Confirmação de Agendamento* - ${freshConfig?.name || 'Agendou'} ✅\n\n${getMessageDetails()}\n\n_Guarde esta mensagem como comprovante._`;
    const cleanPhone = normalizeForWhatsApp(clientPhone);
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSendToBusiness = async () => {
    const freshConfig = await businessApi.get();
    if (!freshConfig?.phone) {
      alert("Número do estabelecimento não configurado.");
      return;
    }
    const msg = `🔔 *Nova Reserva!* \n\n${getMessageDetails()}\n\n_Aguardando confirmação!_`;
    const cleanBusinessPhone = normalizeForWhatsApp(freshConfig.phone);
    window.open(`https://wa.me/${cleanBusinessPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 text-center max-w-md mx-auto mt-10 animate-fade-in">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
          <CheckCircle2 className="w-12 h-12 text-green-600 animate-slide-up" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Agendado!</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Seu horário para <strong className="text-gray-800">{selectedService?.name}</strong> foi reservado com sucesso.
        </p>
        
        <div className="space-y-3">
           <button 
            onClick={handleSendToBusiness}
            className="w-full bg-green-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-700 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg shadow-green-200"
          >
            <MessageCircle size={22} />
            Confirmar no WhatsApp da Loja
          </button>

          <button 
            onClick={handleSendToClientSelf}
            className="w-full bg-white text-gray-700 border border-gray-200 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
            <Phone size={20} className="text-gray-400"/>
            Salvar Comprovante (Meu Whats)
          </button>
          
          <div className="pt-6">
             <button 
              onClick={() => window.location.reload()}
              className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
            >
              Fazer novo agendamento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden min-h-[600px] flex flex-col animate-slide-up">
      <ProgressHeader step={step} businessConfig={businessConfig} onBack={() => setStep(step - 1)} />

      <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-gray-50/50">
        {loading && step !== 3 && (
          <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-brand-600" size={40} /></div>
        )}

        {/* Step 1: Services */}
        {step === 1 && !loading && (
          <ServiceSelection services={services} onSelectService={(service) => { setSelectedService(service); setStep(2); }} />
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <DateSelection onSelectDate={(date) => { setSelectedDate(date); setStep(3); }} />
        )}

        {/* Step 3: Time */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto">
            <TimeSelection
              slots={slots}
              loading={loading}
              onSelectTime={(time) => { setSelectedTime(time); setStep(4); }}
              onBackToDate={() => setStep(2)}
            />
          </div>
        )}

        {/* Step 4: Form */}
        {step === 4 && (
          <BookingForm
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            clientName={clientName}
            clientPhone={clientPhone}
            autoNotify={autoNotify}
            error={error}
            loading={loading}
            onClientNameChange={setClientName}
            onClientPhoneChange={(phone) => setClientPhone(formatPhoneInput(phone))}
            onAutoNotifyChange={setAutoNotify}
            onSubmit={handleBooking}
          />
        )}
      </div>
    </div>
  );
};