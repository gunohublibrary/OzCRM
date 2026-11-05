import React, { useState } from 'react';
import {
  Headphones,
  Plus,
  Eye,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { SupportTicket, TicketPriority, TicketStatus } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface TicketsViewProps {
  onOpenNewTicket: () => void;
  onViewTicket: (ticket: SupportTicket) => void;
  onSelectCustomer: (customerId: string) => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  onOpenNewTicket,
  onViewTicket,
  onSelectCustomer,
}) => {
  const { tickets, updateTicketStatus, deleteTicket } = useCrm();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'All'>('All');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Teknik Destek Masası & SLA Biletleri
            </h1>
            <span className="font-mono text-xs tabular-nums px-2 py-0.5 rounded bg-white/10 text-slate-200 font-medium">
              {filteredTickets.length} Talep
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Güntek Bilişim 7/24 IT altyapı, ağ güvenliği, sunucu ve yazılım SLA destek kayıtları
          </p>
        </div>

        <button
          onClick={onOpenNewTicket}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Destek Bileti Aç</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-3 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-white">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Bilet no, firma adı veya arıza konusu ile ara..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center p-0.5 bg-[#131518] border border-white/10 rounded-md text-xs font-medium">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                statusFilter === 'All'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('Açık')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                statusFilter === 'Açık'
                  ? 'bg-rose-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Açık
            </button>
            <button
              onClick={() => setStatusFilter('İşlemde')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                statusFilter === 'İşlemde'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              İşlemde
            </button>
            <button
              onClick={() => setStatusFilter('Çözüldü')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                statusFilter === 'Çözüldü'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Çözüldü
            </button>
          </div>

          {/* Priority dropdown */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-[#131518] border border-white/15 rounded-md text-white cursor-pointer focus:outline-none focus:border-blue-500"
          >
            <option value="All" className="bg-[#181a1e] text-white">Tüm Öncelikler</option>
            <option value="Kritik" className="bg-[#181a1e] text-white">Kritik</option>
            <option value="Yüksek" className="bg-[#181a1e] text-white">Yüksek</option>
            <option value="Orta" className="bg-[#181a1e] text-white">Orta</option>
            <option value="Düşük" className="bg-[#181a1e] text-white">Düşük</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredTickets.length === 0 ? (
        <div className="p-10 text-center bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg text-white">
          <Headphones className="w-8 h-8 mx-auto text-slate-500 mb-2" />
          <p className="text-xs text-slate-300">Kriterlere uygun teknik destek bileti bulunamadı.</p>
        </div>
      ) : (
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg overflow-x-auto text-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#16181c] border-b border-white/10 text-slate-200 font-semibold">
                <th className="py-2.5 px-4 whitespace-nowrap">Bilet No</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Müşteri Firma</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Konu / Arıza Tanımı</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Kategori</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Öncelik</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Atanan Mühendis</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Durum</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredTickets.map(ticket => (
                <tr
                  key={ticket.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                    <button
                      onClick={() => onViewTicket(ticket)}
                      className="hover:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <Headphones className="w-3.5 h-3.5 text-blue-400" />
                      <span>{ticket.ticketNumber}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onSelectCustomer(ticket.customerId)}
                      className="font-semibold text-white hover:text-blue-400 hover:underline block truncate max-w-xs cursor-pointer text-left"
                    >
                      {ticket.customerName}
                    </button>
                    <span className="text-[11px] text-slate-300">{ticket.contactPerson}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-100">
                    <div className="line-clamp-1">{ticket.subject}</div>
                    <span className="text-[11px] text-slate-300 line-clamp-1 font-normal">
                      {ticket.description}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-200">
                    {ticket.category}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                        ticket.priority === 'Kritik'
                          ? 'bg-rose-950 text-rose-300'
                          : ticket.priority === 'Yüksek'
                          ? 'bg-amber-950 text-amber-300'
                          : ticket.priority === 'Orta'
                          ? 'bg-blue-950 text-blue-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-200">
                    {ticket.assignedEngineer.split(' ')[0]} {ticket.assignedEngineer.split(' ')[1]}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <select
                      value={ticket.status}
                      onChange={e => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                      className={`px-2 py-0.5 rounded text-xs font-semibold border-0 cursor-pointer ${
                        ticket.status === 'Çözüldü' || ticket.status === 'Kapatıldı'
                          ? 'bg-emerald-950 text-emerald-300'
                          : ticket.status === 'İşlemde'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      <option value="Açık">Açık</option>
                      <option value="İşlemde">İşlemde</option>
                      <option value="Beklemede">Beklemede</option>
                      <option value="Çözüldü">Çözüldü</option>
                      <option value="Kapatıldı">Kapatıldı</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewTicket(ticket)}
                        title="İncele & Çözüm Ekle"
                        className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTicket(ticket.id)}
                        title="Sil"
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-950/40 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
