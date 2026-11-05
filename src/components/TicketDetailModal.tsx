import React, { useState } from 'react';
import { X, Headphones, Clock, CheckCircle2, User, Save } from 'lucide-react';
import { SupportTicket, TicketStatus } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface TicketDetailModalProps {
  ticket: SupportTicket;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose }) => {
  const { updateTicketStatus } = useCrm();

  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [resolutionNotes, setResolutionNotes] = useState(ticket.resolutionNotes || '');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTicketStatus(ticket.id, status, resolutionNotes);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1c1f24] border border-white/15 rounded-lg shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#16181c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white">
                  {ticket.ticketNumber}
                </span>
                <span
                  className={`px-2 py-0.2 text-[10px] font-semibold rounded ${
                    ticket.priority === 'Kritik'
                      ? 'bg-rose-950 text-rose-300'
                      : ticket.priority === 'Yüksek'
                      ? 'bg-amber-950 text-amber-300'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {ticket.priority} Öncelik
                </span>
              </div>
              <h2 className="text-sm font-bold text-white mt-0.5">
                {ticket.subject}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-white">
          {savedMessage && (
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Bilet durumu ve çözüm notları başarıyla güncellendi.</span>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#181a1e] rounded-lg border border-white/10 text-white">
            <div>
              <span className="text-slate-400 block text-[10px]">Müşteri</span>
              <span className="font-semibold text-white truncate block">
                {ticket.customerName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Kategori</span>
              <span className="font-medium text-slate-200 truncate block">
                {ticket.category}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Atanan Mühendis</span>
              <span className="font-medium text-slate-200 truncate block">
                {ticket.assignedEngineer}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Oluşturulma</span>
              <span className="font-mono tabular-nums text-slate-300 block">
                {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-white">
              Sorun & Arıza Bildirimi:
            </label>
            <div className="p-3 bg-[#141619] border border-white/15 rounded-md text-slate-200 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {/* Status and SLA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Bilet Durumu
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TicketStatus)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md font-medium text-white cursor-pointer focus:outline-none focus:border-blue-500"
              >
                <option value="Açık" className="bg-[#181a1e] text-white">Açık (İnceleniyor)</option>
                <option value="İşlemde" className="bg-[#181a1e] text-white">İşlemde (Mühendis Çalışıyor)</option>
                <option value="Beklemede" className="bg-[#181a1e] text-white">Beklemede (Müşteriden Bilgi Bekleniyor)</option>
                <option value="Çözüldü" className="bg-[#181a1e] text-white">Çözüldü (Test Edildi)</option>
                <option value="Kapatıldı" className="bg-[#181a1e] text-white">Kapatıldı</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                SLA Hedef Bitiş
              </label>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-slate-200 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{new Date(ticket.dueDate).toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>

          {/* Resolution Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-white">
              Teknik Çözüm & Mühendis Notları
            </label>
            <textarea
              rows={4}
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              placeholder="Uygulanan teknik düzeltmeler, sunucu logları, firewall kural değişiklikleri veya müşteri geri bildirimi..."
              className="w-full px-3 py-2 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md cursor-pointer transition-colors"
            >
              Kapat
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Durumu Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
