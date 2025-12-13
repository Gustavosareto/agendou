import React, { useEffect, useState } from 'react';
import { appointmentApi, serviceApi } from '../../services/api';
import { Appointment, AppointmentStatus, Service } from '../../types';
import { Clock } from 'lucide-react';
import { DashboardHeader } from '../../components/admin/DashboardHeader';
import { StatsGrid } from '../../components/admin/StatsGrid';
import { SimpleBarChart } from '../../components/admin/SimpleBarChart';
import { TipsPanel } from '../../components/admin/TipsPanel';
import { AppointmentsTable } from '../../components/admin/AppointmentsTable';
import { normalizeForWhatsApp } from '../../utils/phone';

export const AdminDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalAppointments: 0,
    uniqueClients: 0,
    activeServices: 0,
    weeklyData: [0, 0, 0, 0, 0, 0, 0]
  });

  const loadData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [aptData, srvData] = await Promise.all([
        appointmentApi.list(),
        serviceApi.list()
      ]);

      aptData.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`).getTime();
        const dateB = new Date(`${b.date}T${b.startTime}`).getTime();
        return dateB - dateA;
      });

      setAppointments(aptData);
      setServices(srvData);
      calculateStats(aptData, srvData);
    } catch (e) {
      console.error(e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const calculateStats = (apts: Appointment[], srvs: Service[]) => {
    let revenue = 0;
    const clientSet = new Set();
    const weekCounts = [0, 0, 0, 0, 0, 0, 0];

    apts.forEach(apt => {
      if (apt.status === AppointmentStatus.CONFIRMED) {
        const srv = srvs.find(s => s.id === apt.serviceId);
        if (srv) revenue += srv.price;
      }
      clientSet.add(apt.clientPhone);
      const dayIndex = new Date(apt.date + 'T00:00:00').getDay();
      if (!isNaN(dayIndex)) {
        weekCounts[dayIndex]++;
      }
    });

    setStats({
      totalRevenue: revenue,
      totalAppointments: apts.length,
      uniqueClients: clientSet.size,
      activeServices: srvs.length,
      weeklyData: weekCounts
    });
  };

  useEffect(() => {
    loadData(true);
    const intervalId = setInterval(() => loadData(false), 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    await appointmentApi.updateStatus(id, status);
    loadData(false);
  };

  const handleWhatsApp = (apt: Appointment) => {
    const phone = normalizeForWhatsApp(apt.clientPhone);
    const date = new Date(apt.date + 'T00:00:00').toLocaleDateString('pt-BR');
    let message = `Olá ${apt.clientName}, sobre seu agendamento em ${date}.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-brand-600 font-medium animate-pulse">Carregando painel...</div>;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <DashboardHeader onRefresh={() => loadData(true)} />

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Fluxo Semanal</h3>
             <Clock size={18} className="text-gray-400" />
          </div>
          <SimpleBarChart data={stats.weeklyData} />
        </div>

        <TipsPanel />
      </div>

      <AppointmentsTable
        appointments={appointments}
        onStatusChange={handleStatusChange}
        onWhatsApp={handleWhatsApp}
      />
    </div>
  );
};