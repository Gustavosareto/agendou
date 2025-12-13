import { Appointment } from '../types';

// Helper seguro para acessar variáveis de ambiente em diferentes ambientes (Vite, CRA, etc)
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}
  
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env[key];
    }
  } catch (e) {}
  
  return '';
};

// Configurações
const META_API_URL = 'https://graph.facebook.com/v19.0';
const PHONE_NUMBER_ID = getEnv('VITE_META_PHONE_ID'); 
const ACCESS_TOKEN = getEnv('VITE_META_TOKEN');
const STORE_PHONE_NUMBER = getEnv('VITE_STORE_PHONE');

interface TemplateParameter {
  type: 'text';
  text: string;
}

interface TemplateComponent {
  type: 'body';
  parameters: TemplateParameter[];
}

interface WhatsAppPayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: { code: string };
    components: TemplateComponent[];
  };
}

/**
 * Envia notificação automática para o WhatsApp da loja via Meta Cloud API.
 * Não bloqueia o fluxo em caso de erro (Fire-and-forget).
 */
export const sendBookingNotification = async (appointment: Appointment): Promise<void> => {
  // Verificação básica de configuração
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN || !STORE_PHONE_NUMBER) {
    // Silently ignore if not configured to avoid console noise in demo
    return;
  }

  // Prevenir envio se os placeholders ainda estiverem no .env
  if (PHONE_NUMBER_ID.includes('YOUR_') || ACCESS_TOKEN.includes('YOUR_')) {
    return;
  }

  try {
    const payload: WhatsAppPayload = {
      messaging_product: 'whatsapp',
      to: STORE_PHONE_NUMBER,
      type: 'template',
      template: {
        name: 'novo_agendamento',
        language: { code: 'pt_BR' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: appointment.clientName },
              { type: 'text', text: appointment.serviceName },
              { type: 'text', text: formatDateBr(appointment.date) },
              { type: 'text', text: appointment.startTime }
            ]
          }
        ]
      }
    };

    const response = await fetch(`${META_API_URL}/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.warn('[WhatsApp] API Error:', errorData);
    }
  } catch (error) {
    console.error('[WhatsApp] Falha ao enviar notificação:', error);
  }
};

const formatDateBr = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};