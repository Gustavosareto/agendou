import React from 'react';
import { Service } from '../../types';
import { Clock, ArrowRight } from 'lucide-react';

interface ServiceSelectionProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ services, onSelectService }) => (
  <div className="grid gap-4 sm:grid-cols-1 max-w-2xl mx-auto">
    {services.map(service => (
      <div
        key={service.id}
        role="button"
        tabIndex={0}
        onClick={() => onSelectService(service)}
        onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') onSelectService(service); }}
        className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:border-brand-300 hover:shadow-md transition-all text-left flex items-center justify-between cursor-pointer"
      >
        <div>
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-brand-700 transition-colors">{service.name}</h3>
          <p className="text-gray-500 text-sm mt-1">{service.description || "Sem descrição"}</p>
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded">
              <Clock size={12} /> {service.durationMinutes} min
          </span>
        </div>
        <div className="text-right pl-4">
          <span className="block text-xl font-bold text-brand-600">R$ {service.price}</span>
          <div className="mt-2 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all ml-auto">
              <ArrowRight size={16} />
          </div>
        </div>
      </div>
    ))}
  </div>
);