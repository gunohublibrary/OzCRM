import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Eye,
  Trash2,
  Printer,
  CheckCircle2,
  Search,
  Building2
} from 'lucide-react';
import { Quote, QuoteStatus } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface QuotesViewProps {
  onOpenNewQuote: () => void;
  onViewQuote: (quote: Quote) => void;
  onSelectCustomer: (customerId: string) => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  onOpenNewQuote,
  onViewQuote,
  onSelectCustomer,
}) => {
  const { quotes, updateQuoteStatus, deleteQuote } = useCrm();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'All'>('All');

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (val: number, cur: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Teklifler & Kurumsal Sözleşmeler
            </h1>
            <span className="font-mono text-xs tabular-nums px-2 py-0.5 rounded bg-white/10 text-slate-200 font-medium">
              {filteredQuotes.length} Teklif
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Güntek Bilişim IT donanım, lisans ve SLA bakım tekliflerinin takibi ve PDF yazdırılması
          </p>
        </div>

        <button
          onClick={onOpenNewQuote}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Teklif Hazırla</span>
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
            placeholder="Teklif no, müşteri adı veya proje konusu ara..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-[#131518] border border-white/10 rounded-md text-xs font-medium">
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
            onClick={() => setStatusFilter('Gönderildi')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              statusFilter === 'Gönderildi'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Gönderildi
          </button>
          <button
            onClick={() => setStatusFilter('Onaylandı')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              statusFilter === 'Onaylandı'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Onaylandı
          </button>
          <button
            onClick={() => setStatusFilter('Taslak')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              statusFilter === 'Taslak'
                ? 'bg-slate-700 text-white shadow-xs font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Taslak
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredQuotes.length === 0 ? (
        <div className="p-10 text-center bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg text-white">
          <FileText className="w-8 h-8 mx-auto text-slate-500 mb-2" />
          <p className="text-xs text-slate-300">Kriterlere uygun teklif bulunamadı.</p>
        </div>
      ) : (
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg overflow-x-auto text-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#16181c] border-b border-white/10 text-slate-200 font-semibold">
                <th className="py-2.5 px-4 whitespace-nowrap">Teklif No</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Müşteri & Muhatap</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Konu & Açıklama</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">KDV Dahil Toplam</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Geçerlilik</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Durum</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredQuotes.map(quote => (
                <tr
                  key={quote.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                    <button
                      onClick={() => onViewQuote(quote)}
                      className="hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{quote.quoteNumber}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onSelectCustomer(quote.customerId)}
                      className="font-semibold text-white hover:text-blue-400 hover:underline block truncate max-w-xs cursor-pointer text-left"
                    >
                      {quote.customerName}
                    </button>
                    <span className="text-[11px] text-slate-300">{quote.contactPerson}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-100">
                    <div>{quote.title}</div>
                    <span className="text-[11px] text-slate-300 font-normal">
                      Kalem: {quote.items.length} adet · Hazırlayan: {quote.preparedBy.split(' ')[0]}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-white whitespace-nowrap">
                    {formatCurrency(quote.grandTotal, quote.currency)}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-300 whitespace-nowrap">
                    {quote.validUntil}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <select
                      value={quote.status}
                      onChange={e => updateQuoteStatus(quote.id, e.target.value as QuoteStatus)}
                      className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer border-0 ${
                        quote.status === 'Onaylandı'
                          ? 'bg-emerald-950 text-emerald-300'
                          : quote.status === 'Gönderildi'
                          ? 'bg-blue-950 text-blue-300'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      <option value="Taslak">Taslak</option>
                      <option value="Gönderildi">Gönderildi</option>
                      <option value="Onaylandı">Onaylandı</option>
                      <option value="Revizyon">Revizyon</option>
                      <option value="İptal">İptal</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewQuote(quote)}
                        title="Teklifi Görüntüle / Yazdır"
                        className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteQuote(quote.id)}
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
