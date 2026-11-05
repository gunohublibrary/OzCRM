import React from 'react';
import {
  Users,
  TrendingUp,
  FileCheck,
  Headphones,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  AlertCircle
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenNewCustomer: () => void;
  onSelectCustomer: (customerId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewCustomer,
  onSelectCustomer,
}) => {
  const { customers, deals, quotes, tickets, activities } = useCrm();

  // Metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Aktif').length;
  const potentialCustomers = customers.filter(c => c.status === 'Potansiyel').length;

  const openDeals = deals.filter(d => d.stage !== 'Kazanıldı' && d.stage !== 'Kaybedildi');
  const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);

  const wonDeals = deals.filter(d => d.stage === 'Kazanıldı');
  const totalWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  const pendingTickets = tickets.filter(t => t.status === 'Açık' || t.status === 'İşlemde');
  const criticalTickets = tickets.filter(t => t.priority === 'Kritik' && t.status !== 'Çözüldü' && t.status !== 'Kapatıldı');

  // Industry Distribution
  const industryCounts = customers.reduce((acc, c) => {
    acc[c.industry] = (acc[c.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedIndustries = Object.entries(industryCounts).sort((a, b) => b[1] - a[1]);

  // Format currency
  const formatTRY = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10 text-white">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Yönetim Gösterge Paneli
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Güntek Bilişim kurumsal müşteri portföyü, satış pipeline'ı ve SLA destek metrikleri
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('csharp-api')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#24272e] border border-white/15 hover:bg-[#2e333b] rounded-md transition-colors whitespace-nowrap"
          >
            C# API Entegrasyon
          </button>
          <button
            onClick={onOpenNewCustomer}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Müşteri Ekle</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg text-white">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-xs font-semibold">Toplam Müşteri</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {totalCustomers}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
            <span className="font-medium text-white">{activeCustomers} Aktif</span>
            <span aria-hidden="true">·</span>
            <span>{potentialCustomers} Potansiyel Aday</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg text-white">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-xs font-semibold">Açık Satış Pipeline'ı</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {formatTRY(pipelineValue)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
            <span className="font-medium text-white">{openDeals.length} aktif fırsat</span>
            <span aria-hidden="true">·</span>
            <span>Müzakere sürecinde</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg text-white">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-xs font-semibold">Kazanılan Satışlar</span>
            <FileCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {formatTRY(totalWonValue)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
            <span className="font-medium text-white">{wonDeals.length} başarılı proje</span>
            <span aria-hidden="true">·</span>
            <span>%100 kapanış oranı</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg text-white">
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-xs font-semibold">Açık Destek Biletleri</span>
            <Headphones className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {pendingTickets.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            {criticalTickets.length > 0 ? (
              <span className="text-rose-400 font-semibold">
                {criticalTickets.length} kritik öncelikli bilet
              </span>
            ) : (
              <span className="text-slate-300">Tüm SLA'lar kontrol altında</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Hot Deals + Critical Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
        {/* Hot Deals (2 cols) */}
        <div className="lg:col-span-2 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">
                Aktif Satış Fırsatları & Teklif Aşamaları
              </h2>
            </div>
            <button
              onClick={() => onNavigate('deals')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-0.5"
            >
              <span>Tümünü Gör ({deals.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {deals.slice(0, 4).map(deal => (
              <div
                key={deal.id}
                className="p-4 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white truncate">
                      {deal.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <button
                      onClick={() => onSelectCustomer(deal.customerId)}
                      className="hover:text-blue-400 hover:underline truncate font-medium text-white"
                    >
                      {deal.customerName}
                    </button>
                    <span aria-hidden="true">·</span>
                    <span>Temsilci: {deal.assignedTo.split(' ')[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums text-slate-400">Kapanış: {deal.expectedCloseDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono tabular-nums text-white">
                      {formatTRY(deal.value)}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Başarı: %{deal.probability}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
                      deal.stage === 'Kazanıldı'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : deal.stage === 'Müzakere'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : deal.stage === 'Teklif Sunuldu'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {deal.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority SLA & Support Box (1 col) */}
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between text-white">
          <div>
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">
                  Teknik Destek Masası
                </h2>
              </div>
              <button
                onClick={() => onNavigate('tickets')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-0.5"
              >
                <span>Tümü ({tickets.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {tickets.slice(0, 3).map(ticket => (
                <div
                  key={ticket.id}
                  className="p-3 rounded-md bg-[#131518] border border-white/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-white">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        ticket.priority === 'Kritik'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : ticket.priority === 'Yüksek'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {ticket.priority} Öncelik
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white line-clamp-1">
                    {ticket.subject}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                    <span className="truncate max-w-[150px]">{ticket.customerName}</span>
                    <span className="font-semibold text-white">{ticket.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#131518]/90 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-300">Güntek SLA Taahhüdü:</span>
            <span className="font-bold text-emerald-400">4 Saat Müdahale Garantisi</span>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Industry Distribution & Recent Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
        {/* Industry Portfolio (1 col) */}
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">
              Sektörel Dağılım
            </h2>
            <Building className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {sortedIndustries.map(([industry, count]) => {
              const percentage = Math.round((count / totalCustomers) * 100);
              return (
                <div key={industry} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{industry}</span>
                    <span className="font-mono tabular-nums text-white font-bold">
                      {count} firma (%{percentage})
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#131518] rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities Timeline (2 cols) */}
        <div className="lg:col-span-2 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">
              Son Müşteri Temasları & İşlemler
            </h2>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {activities.slice(0, 4).map(act => (
              <div
                key={act.id}
                className="flex items-start gap-3 pb-3 border-b border-white/10 last:border-0 last:pb-0"
              >
                <div className="w-7 h-7 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {act.type === 'Toplantı' ? 'T' : act.type === 'Telefon' ? 'A' : act.type === 'Teknik Keşif' ? 'K' : 'N'}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white truncate">
                      {act.title}
                    </p>
                    <span className="text-[11px] font-mono tabular-nums text-slate-300 whitespace-nowrap">
                      {new Date(act.date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {act.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <button
                      onClick={() => onSelectCustomer(act.customerId)}
                      className="hover:text-blue-400 hover:underline font-semibold text-white"
                    >
                      {act.customerName}
                    </button>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-300">İşlemi Yapan: {act.performedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
