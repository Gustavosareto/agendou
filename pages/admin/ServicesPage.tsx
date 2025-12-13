import React, { useEffect, useState } from 'react';
import { serviceApi } from '../../services/api';
import { Service } from '../../types';
import { Trash2, Plus, DollarSign, Clock, X } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState(0);
  const [newDuration, setNewDuration] = useState(30);

  const loadServices = async () => {
    setLoading(true);
    const data = await serviceApi.list();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este serviço?')) {
      await serviceApi.delete(id);
      loadServices();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await serviceApi.create({
      name: newName,
      description: newDesc,
      price: Number(newPrice),
      durationMinutes: Number(newDuration)
    });
    setIsFormOpen(false);
    // Reset
    setNewName(''); setNewDesc(''); setNewPrice(0); setNewDuration(30);
    loadServices();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Catálogo de Serviços</h2>
           <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Gerencie os preços e durações oferecidos.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-brand-600 text-white px-5 py-2.5 rounded-xl hover:bg-brand-700 transition flex items-center gap-2 shadow-sm font-medium hover:shadow-md"
        >
          <Plus size={18} /> Novo Serviço
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-brand-100 dark:border-slate-700 animate-slide-up relative">
          <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
             <X size={20}/>
          </button>
          <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-white">Adicionar Serviço</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Nome do Serviço</label>
              <input 
                required 
                type="text" 
                className="w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none placeholder-gray-400" 
                placeholder="Ex: Corte Moderno" 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Descrição Curta</label>
              <input 
                type="text" 
                className="w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none placeholder-gray-400" 
                placeholder="Detalhes opcionais..." 
                value={newDesc} 
                onChange={e => setNewDesc(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Preço (R$)</label>
              <input 
                required 
                type="number" 
                className="w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none placeholder-gray-400" 
                value={newPrice} 
                onChange={e => setNewPrice(Number(e.target.value))} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Duração</label>
              <select 
                className="w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-gray-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer" 
                value={newDuration} 
                onChange={e => setNewDuration(Number(e.target.value))}
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hora</option>
                <option value={90}>1h 30min</option>
                <option value={120}>2 horas</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-slate-700">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white font-medium">Cancelar</button>
              <button type="submit" className="px-6 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-bold shadow-sm">Salvar Serviço</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Carregando serviços...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map(service => (
            <div key={service.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between items-start group hover:border-brand-200 dark:hover:border-brand-900 hover:shadow-md transition-all">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">{service.name}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-4 leading-snug">{service.description || 'Sem descrição'}</p>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-800"><DollarSign size={14} /> R$ {service.price}</span>
                  <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600"><Clock size={14} /> {service.durationMinutes} min</span>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(service.id)} 
                className="text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {services.length === 0 && (
             <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 text-gray-400">
                Nenhum serviço cadastrado ainda.
             </div>
          )}
        </div>
      )}
    </div>
  );
};