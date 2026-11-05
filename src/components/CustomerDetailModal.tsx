import React, { useState } from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Plus,
  FileText,
  TrendingUp,
  Headphones,
  Edit2,
  Clock,
  Send,
  ExternalLink
} from 'lucide-react';
import { Customer, Deal, Quote, SupportTicket, CustomerActivity, ActivityType } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onCreateDeal: (customer: Customer) => void;
  onCreateQuote: (customer: Customer) => void;
  onCreateTicket: (customer: Customer) => void;
  onViewQuote: (quote: Quote) => void;
  onViewTicket: (ticket: SupportTicket) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
  onEdit,
  onCreateDeal,
  onCreateQuote,
  onCreateTicket,
  onViewQuote,
  onViewTicket,
}) => {
  const { deals, quotes, tickets, activities, addActivity } = useCrm();

  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'quotes' | 'tickets' | 'activities'>('overview');

  // New activity form state
  const [newActivityType, setNewActivityType] = useState<ActivityType>('Toplantı');
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [performedBy, setPerformedBy] = useState('Emre Güneş');
  const [showActivityForm, setShowActivityForm] = useState(false);

  // Customer specific data
  const customerDeals = deals.filter(d => d.customerId === customer.id);
  const customerQuotes = quotes.filter(q => q.customerId === customer.id);
  const customerTickets = tickets.filter(t => t.customerId === customer.id);
  const customerActivities = activities.filter(a => a.customerId === customer.id);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    addActivity({
      customerId: customer.id,
      customerName: customer.companyName,
      type: newActivityType,
      title: newActivityTitle.trim(),
      description: newActivityDesc.trim(),
      date: new Date().toISOString(),
      performedBy,
    });

    setNewActivityTitle('');
    setNewActivityDesc('');
    setShowActivityForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto text-white">
      <div className="relative w-full max-w-4xl bg-[#1c1f24] border border-white/15 rounded-lg shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#131518]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                  {customer.code}
                </span>
                <h2 className="text-base font-bold text-white">
                  {customer.companyName}
                </h2>
                <span
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                    customer.status === 'Aktif'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : customer.status === 'Potansiyel'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {customer.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {customer.industry} · {customer.city} / {customer.district} · Temsilci: {customer.accountManager}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(customer)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#22252b] border border-white/15 rounded-md hover:bg-[#2b2f38] transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Düzenle</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-white/10 flex items-center gap-6 text-xs font-medium bg-[#16181c] overflow-x-auto text-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            Genel & İletişim Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`py-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'deals'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <span>Satış Fırsatları</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-white/10 rounded font-bold text-white">
              {customerDeals.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'quotes'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <span>Teklifler & Sözleşmeler</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-white/10 rounded font-bold text-white">
              {customerQuotes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'tickets'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <span>Destek Biletleri</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-white/10 rounded font-bold text-white">
              {customerTickets.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`py-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'activities'
                ? 'border-blue-500 text-white font-bold'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <span>Görüşme & Zaman Çizelgesi</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-white/10 rounded font-bold text-white">
              {customerActivities.length}
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial & Account Summary Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#131518] border border-white/10 text-white">
                <div>
                  <span className="text-xs text-slate-300">Güncel Cari Bakiye</span>
                  <div className="text-lg font-bold font-mono tabular-nums text-white">
                    {formatCurrency(customer.balance)}
                  </div>
                  <span className="text-[11px] text-slate-400">Ödenmesi beklenen fatura tutarı</span>
                </div>
                <div>
                  <span className="text-xs text-slate-300">Tanımlı Kredi Limiti</span>
                  <div className="text-lg font-bold font-mono tabular-nums text-blue-400">
                    {formatCurrency(customer.creditLimit)}
                  </div>
                  <span className="text-[11px] text-slate-400">Onaylı risk sınırı</span>
                </div>
                <div>
                  <span className="text-xs text-slate-300">Müşteri Segmenti</span>
                  <div className="text-lg font-bold text-white">
                    {customer.category}
                  </div>
                  <span className="text-[11px] text-slate-400">Sözleşme tipi: Standart Kurumsal</span>
                </div>
              </div>

              {/* Contact and Legal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                {/* Contact Card */}
                <div className="p-4 rounded-lg bg-[#131518] border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Yetkili İletişim Bilgileri
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-200">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-bold text-white">
                        {customer.contactPerson}
                      </span>
                      <span className="text-slate-400">({customer.contactTitle})</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-mono text-white font-medium">{customer.phone}</span>
                      {customer.mobile && (
                        <span className="font-mono text-slate-400">/ Cep: {customer.mobile}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <a href={`mailto:${customer.email}`} className="text-blue-400 hover:underline font-medium">
                        {customer.email}
                      </a>
                    </div>
                    {customer.website && (
                      <div className="flex items-center gap-2 text-slate-200">
                        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                        <a
                          href={customer.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline font-medium"
                        >
                          {customer.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tax and Address Card */}
                <div className="p-4 rounded-lg bg-[#131518] border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Vergi & Fatura Bilgileri
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Vergi Dairesi:</span>
                      <span className="font-bold text-white">{customer.taxOffice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Vergi Kimlik No (VKN):</span>
                      <span className="font-mono font-bold text-white">{customer.taxNumber}</span>
                    </div>
                    <div className="flex items-start gap-2 pt-1 border-t border-white/10">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-white">
                          {customer.address}
                        </div>
                        <div className="text-slate-300">
                          {customer.district} / {customer.city}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Box */}
              {customer.notes && (
                <div className="p-4 rounded-lg bg-[#131518] border border-blue-500/30">
                  <h4 className="text-xs font-bold text-blue-400 mb-1">
                    Güntek Bilişim Müşteri & Altyapı Notları
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {customer.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DEALS */}
          {activeTab === 'deals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Satış Fırsatları & Çözüm Projeleri
                </h3>
                <button
                  onClick={() => onCreateDeal(customer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Fırsat Ekle</span>
                </button>
              </div>

              {customerDeals.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs text-slate-500">Bu müşteriye ait kayıtlı satış fırsatı bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerDeals.map(deal => (
                    <div
                      key={deal.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {deal.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {deal.description}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span>Tahmini Kapanış: {deal.expectedCloseDate}</span>
                          <span aria-hidden="true">·</span>
                          <span>Temsilci: {deal.assignedTo}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                            {formatCurrency(deal.value)}
                          </div>
                          <span className="text-[11px] text-slate-400">%{deal.probability} Olasılık</span>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {deal.stage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QUOTES */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Resmi Teklifler & Sözleşmeler
                </h3>
                <button
                  onClick={() => onCreateQuote(customer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Teklif Hazırla</span>
                </button>
              </div>

              {customerQuotes.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  <FileText className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs text-slate-500">Bu müşteriye ait kayıtlı teklif bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerQuotes.map(quote => (
                    <div
                      key={quote.id}
                      onClick={() => onViewQuote(quote)}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                            {quote.quoteNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {quote.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span>Düzenlenme: {quote.issueDate}</span>
                          <span aria-hidden="true">·</span>
                          <span>Geçerlilik: {quote.validUntil}</span>
                          <span aria-hidden="true">·</span>
                          <span>Kalem: {quote.items.length} adet</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                            {formatCurrency(quote.grandTotal)}
                          </div>
                          <span className="text-[10px] text-slate-400">KDV Dahil Toplam</span>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                            quote.status === 'Onaylandı'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : quote.status === 'Gönderildi'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {quote.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TICKETS */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Teknik Destek & SLA Biletleri
                </h3>
                <button
                  onClick={() => onCreateTicket(customer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Destek Bileti Aç</span>
                </button>
              </div>

              {customerTickets.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  <Headphones className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs text-slate-500">Bu müşteriye ait aktif veya geçmiş destek bileti bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerTickets.map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => onViewTicket(ticket)}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {ticket.ticketNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {ticket.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span>Kategori: {ticket.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>Mühendis: {ticket.assignedEngineer}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${
                            ticket.priority === 'Kritik'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : ticket.priority === 'Yüksek'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                        <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACTIVITIES */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Görüşme ve Temas Kayıtları
                </h3>
                <button
                  onClick={() => setShowActivityForm(!showActivityForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showActivityForm ? 'Formu Kapat' : 'Görüşme / Not Ekle'}</span>
                </button>
              </div>

              {/* Add Activity Form */}
              {showActivityForm && (
                <form
                  onSubmit={handleSaveActivity}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Etkinlik Türü
                      </label>
                      <select
                        value={newActivityType}
                        onChange={e => setNewActivityType(e.target.value as ActivityType)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md"
                      >
                        <option value="Toplantı">Toplantı (Yüz yüze / Online)</option>
                        <option value="Telefon">Telefon Görüşmesi</option>
                        <option value="E-posta">E-posta Yazışması</option>
                        <option value="Saha Ziyareti">Saha / Tesis Ziyareti</option>
                        <option value="Teknik Keşif">Teknik Keşif / Demo</option>
                        <option value="Not">Dahili Not</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Görüşmeyi Yapan
                      </label>
                      <input
                        type="text"
                        value={performedBy}
                        onChange={e => setPerformedBy(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md"
                        placeholder="Örn: Emre Güneş"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Başlık / Konu
                    </label>
                    <input
                      type="text"
                      value={newActivityTitle}
                      onChange={e => setNewActivityTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md"
                      placeholder="Örn: Firewall teklif revizyonu hakkında telekonferans"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Açıklama & Görüşme Özeti
                    </label>
                    <textarea
                      rows={2}
                      value={newActivityDesc}
                      onChange={e => setNewActivityDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md"
                      placeholder="Görüşmede konuşulan maddeler, müşteri talepleri, bir sonraki adım..."
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowActivityForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              )}

              {/* Timeline */}
              {customerActivities.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs text-slate-500">Henüz kaydedilmiş görüşme veya etkinlik yok.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerActivities.map(act => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            [{act.type}]
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {act.title}
                          </span>
                        </div>
                        <span className="font-mono tabular-nums text-slate-400 text-[11px]">
                          {new Date(act.date).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {act.description}
                      </p>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                        İşlemi Kaydeden: {act.performedBy}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
