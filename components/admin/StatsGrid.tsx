import React from 'react';
import { DollarSign, Users, Calendar, ShoppingBag } from 'lucide-react';
import { StatCard } from './StatCard';

interface StatsGridProps {
  stats: {
    totalRevenue: number;
    totalAppointments: number;
    uniqueClients: number;
    activeServices: number;
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      title="Faturamento Total"
      value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`}
      icon={<DollarSign size={20} className="text-green-600 dark:text-green-400"/>}
      colorClass="bg-green-50 dark:bg-green-900"
    />
    <StatCard
      title="Clientes"
      value={stats.uniqueClients.toString()}
      icon={<Users size={20} className="text-blue-600 dark:text-blue-400"/>}
      colorClass="bg-blue-50 dark:bg-blue-900"
    />
    <StatCard
      title="Agendamentos"
      value={stats.totalAppointments.toString()}
      icon={<Calendar size={20} className="text-indigo-600 dark:text-indigo-400"/>}
      colorClass="bg-indigo-50 dark:bg-indigo-900"
    />
    <StatCard
      title="Serviços Ativos"
      value={stats.activeServices.toString()}
      icon={<ShoppingBag size={20} className="text-orange-600 dark:text-orange-400"/>}
      colorClass="bg-orange-50 dark:bg-orange-900"
    />
  </div>
);