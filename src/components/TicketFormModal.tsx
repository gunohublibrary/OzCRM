import React, { useState } from 'react';
import { X, Headphones, Save } from 'lucide-react';
import { SupportTicket, TicketCategory, TicketPriority, Customer } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface TicketFormModalProps {
  initialCustomer?: Customer | null;
  onClose: () => void;
  onSuccess: (savedTicket: SupportTicket) => void;
}

export const TicketFormModal: React.FC<TicketFormModalProps> = ({
  initialCustomer,
  onClose,
  onSuccess,
}) => {
  const { customers, addTicket } = useCrm();

  const [customerId, setCustomerId] = useState(
    initialCustomer?.id || (customers[0]?.id ?? '')
  );
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Ağ Güvenliği & Firewall');
  const [priority, setPriority] = useState<TicketPriority>('Orta');
  const [assignedEngineer, setAssignedEngineer] = useState('Serkan Yavuz (Kıdemli Ağ Mühendisi)');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 24 * 3600000).toISOString().slice(0, 16)
  );
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Lütfen bilet konusunu giriniz.');
      return;
    }
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
      setError('Lütfen geçerli bir müşteri seçiniz.');
      return;
    }

    const created = addTicket({
      customerId,
      customerName: customer.companyName,
      contactPerson: customer.contactPerson,
      subject: subject.trim(),
      category,
      priority,
      status: 'Açık',
      assignedEngineer,
      dueDate,
      description: description.trim(),
    });

    onSuccess(created);
  };

  const categories: TicketCategory[] = [
    'Sunucu & Altyapı',
    'Ağ Güvenliği & Firewall',
    'Yazılım & ERP Entegrasyonu',
    'Bulut & Sanallaştırma',
    'Yedekleme & Felaket Kurtarma',
    'Kullanıcı Destek & Lisans',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#1c1f24] border border-white/15 rounded-lg shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#16181c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Yeni Teknik Destek Talebi Aç
              </h2>
              <p className="text-[11px] text-slate-300">
                Güntek Bilişim SLA yardım masası kaydı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-white">
          {error && (
            <div className="p-2.5 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-200 mb-1">
              İlgili Müşteri Firma *
            </label>
            <select
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md font-medium text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id} className="bg-[#181a1e] text-white">
                  {c.companyName} ({c.contactPerson})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-200 mb-1">
              Sorun / Arıza Konusu *
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Örn: FortiGate VPN tüneli kopma sorunu"
              className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TicketCategory)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-[#181a1e] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Öncelik Derecesi
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Düşük" className="bg-[#181a1e] text-white">Düşük</option>
                <option value="Orta" className="bg-[#181a1e] text-white">Orta</option>
                <option value="Yüksek" className="bg-[#181a1e] text-white">Yüksek</option>
                <option value="Kritik" className="bg-[#181a1e] text-white">Kritik (Acil Kesinti)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Atanan Sistem / Ağ Mühendisi
              </label>
              <select
                value={assignedEngineer}
                onChange={e => setAssignedEngineer(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Serkan Yavuz (Kıdemli Ağ Mühendisi)" className="bg-[#181a1e] text-white">Serkan Yavuz (Kıdemli Ağ Mühendisi)</option>
                <option value="Ali Kurt (Sistem & Veritabanı Yöneticisi)" className="bg-[#181a1e] text-white">Ali Kurt (Sistem & Veritabanı Yöneticisi)</option>
                <option value="Bora Deniz (Yazılım Geliştirici)" className="bg-[#181a1e] text-white">Bora Deniz (Yazılım & C# .NET Geliştirici)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-200 mb-1">
              Sorun Detayı & Alınan Hata Mesajı
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Müşterinin yaşadığı problem, log çıktıları, etkilenen kullanıcı sayısı..."
              className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md cursor-pointer transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Bileti Oluştur & SLA Başlat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
