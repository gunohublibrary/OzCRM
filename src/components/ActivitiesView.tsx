import React, { useState } from 'react';
import {
  PhoneCall,
  Calendar,
  Plus,
  Clock,
  Filter,
  Search,
  CheckCircle2,
  Building2,
  X
} from 'lucide-react';
import { ActivityType } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface ActivitiesViewProps {
  onSelectCustomer: (customerId: string) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({ onSelectCustomer }) => {
  const { activities, customers, addActivity } = useCrm();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New form fields
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '');
  const [type, setType] = useState<ActivityType>('Toplantı');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [performedBy, setPerformedBy] = useState('Emre Güneş');

  const filteredActivities = activities.filter(act => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'All' || act.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    addActivity({
      customerId,
      customerName: customer.companyName,
      type,
      title: title.trim(),
      description: description.trim(),
      date: new Date().toISOString(),
      performedBy,
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Görüşme & Etkinlik Kayıtları
            </h1>
            <span className="font-mono text-xs tabular-nums px-2 py-0.5 rounded bg-white/10 text-slate-200 font-medium">
              {filteredActivities.length} Kayıt
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Müşterilerle yapılan telefon aramaları, yerinde teknik keşifler, sözleşme toplantıları
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Temas / Görüşme Ekle</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-3 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Başlık, firma adı veya açıklama ara..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All" className="bg-[#181a1e] text-white">Tüm Etkinlik Türleri</option>
            <option value="Toplantı" className="bg-[#181a1e] text-white">Toplantı</option>
            <option value="Telefon" className="bg-[#181a1e] text-white">Telefon Görüşmesi</option>
            <option value="Teknik Keşif" className="bg-[#181a1e] text-white">Teknik Keşif</option>
            <option value="Saha Ziyareti" className="bg-[#181a1e] text-white">Saha Ziyareti</option>
            <option value="E-posta" className="bg-[#181a1e] text-white">E-posta</option>
            <option value="Not" className="bg-[#181a1e] text-white">Dahili Not</option>
          </select>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="p-10 text-center bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg text-white">
            <Clock className="w-8 h-8 mx-auto text-slate-500 mb-2" />
            <p className="text-xs text-slate-300">Kayıtlı etkinlik bulunamadı.</p>
          </div>
        ) : (
          filteredActivities.map(act => (
            <div
              key={act.id}
              className="p-4 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-white"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  {act.type === 'Toplantı'
                    ? 'T'
                    : act.type === 'Telefon'
                    ? 'A'
                    : act.type === 'Teknik Keşif'
                    ? 'K'
                    : act.type === 'Saha Ziyareti'
                    ? 'S'
                    : 'N'}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-blue-400">
                      [{act.type}]
                    </span>
                    <h3 className="text-xs font-bold text-white truncate">
                      {act.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <button
                      onClick={() => onSelectCustomer(act.customerId)}
                      className="hover:text-blue-400 hover:underline font-medium text-slate-200 cursor-pointer"
                    >
                      {act.customerName}
                    </button>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-300">Yetkili: {act.performedBy}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-xs tabular-nums text-slate-300 whitespace-nowrap">
                  {new Date(act.date).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#1c1f24] border border-white/15 rounded-lg p-6 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">
                Yeni Görüşme / Etkinlik Kaydı
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs text-white">
              <div>
                <label className="block text-[11px] font-medium text-slate-200 mb-1">
                  Müşteri Firma *
                </label>
                <select
                  value={customerId}
                  onChange={e => setCustomerId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md font-medium text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#181a1e] text-white">
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-200 mb-1">
                    Etkinlik Türü
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as ActivityType)}
                    className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Toplantı" className="bg-[#181a1e] text-white">Toplantı</option>
                    <option value="Telefon" className="bg-[#181a1e] text-white">Telefon Görüşmesi</option>
                    <option value="Teknik Keşif" className="bg-[#181a1e] text-white">Teknik Keşif</option>
                    <option value="Saha Ziyareti" className="bg-[#181a1e] text-white">Saha Ziyareti</option>
                    <option value="E-posta" className="bg-[#181a1e] text-white">E-posta</option>
                    <option value="Not" className="bg-[#181a1e] text-white">Dahili Not</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-200 mb-1">
                    Görüşmeyi Yapan
                  </label>
                  <input
                    type="text"
                    value={performedBy}
                    onChange={e => setPerformedBy(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-200 mb-1">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Örn: 2027 Bakım Sözleşmesi Ön Değerlendirme"
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-200 mb-1">
                  Görüşme Notları & Detay
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Konuşulan maddeler, müşteri geri bildirimi..."
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md cursor-pointer transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs cursor-pointer transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
