import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Calendar,
  Building2,
  Trash2,
  Edit2,
  LayoutGrid,
  List
} from 'lucide-react';
import { Deal, DealStage } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface DealsPipelineViewProps {
  onOpenNewDeal: () => void;
  onEditDeal: (deal: Deal) => void;
  onSelectCustomer: (customerId: string) => void;
}

export const DealsPipelineView: React.FC<DealsPipelineViewProps> = ({
  onOpenNewDeal,
  onEditDeal,
  onSelectCustomer,
}) => {
  const { deals, updateDealStage, deleteDeal } = useCrm();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [stageFilter, setStageFilter] = useState<string>('All');

  const STAGES: DealStage[] = [
    'İlk Temas',
    'İhtiyaç Analizi',
    'Teklif Sunuldu',
    'Müzakere',
    'Kazanıldı',
    'Kaybedildi',
  ];

  const formatCurrency = (val: number, cur: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalPipeline = useMemo(() => {
    return deals
      .filter(d => d.stage !== 'Kazanıldı' && d.stage !== 'Kaybedildi')
      .reduce((acc, d) => acc + d.value, 0);
  }, [deals]);

  const totalWon = useMemo(() => {
    return deals
      .filter(d => d.stage === 'Kazanıldı')
      .reduce((acc, d) => acc + d.value, 0);
  }, [deals]);

  const handleNextStage = (deal: Deal) => {
    const currentIndex = STAGES.indexOf(deal.stage);
    if (currentIndex < STAGES.length - 2) {
      // Don't auto advance into Kaybedildi
      updateDealStage(deal.id, STAGES[currentIndex + 1]);
    }
  };

  const handlePrevStage = (deal: Deal) => {
    const currentIndex = STAGES.indexOf(deal.stage);
    if (currentIndex > 0) {
      updateDealStage(deal.id, STAGES[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Satış Fırsatları & Pipeline (Satış Hunisi)
            </h1>
            <span className="font-mono text-xs tabular-nums px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {deals.length} Fırsat
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Güntek Bilişim IT altyapı, yazılım ve donanım projelerinin aşama ve gelir tahminleri
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Kanban Panosu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tablo Listesi"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenNewDeal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Fırsat Ekle</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg text-white">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-slate-300 font-medium">
            Aktif Açık Pipeline Değeri:
          </span>
          <span className="font-mono text-base font-bold tabular-nums text-white">
            {formatCurrency(totalPipeline)}
          </span>
        </div>
        <div className="flex items-center justify-between px-2 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0">
          <span className="text-xs text-slate-300 font-medium">
            Kazanılan Toplam Proje Hacmi:
          </span>
          <span className="font-mono text-base font-bold tabular-nums text-emerald-400">
            {formatCurrency(totalWon)}
          </span>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-4 text-white">
          {STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={stage}
                className="bg-[#14161a]/90 backdrop-blur-md border border-white/10 rounded-lg flex flex-col min-w-[220px]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-white/10 bg-[#1b1e24] rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">
                      {stage}
                    </span>
                    <span className="text-[11px] font-mono px-1.5 py-0.2 bg-white/10 rounded font-bold text-white">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-slate-300 mt-1">
                    {formatCurrency(stageTotal)}
                  </div>
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[600px]">
                  {stageDeals.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400 font-medium">
                      Fırsat yok
                    </div>
                  ) : (
                    stageDeals.map(deal => (
                      <div
                        key={deal.id}
                        className="p-3 bg-[#1e2127] border border-white/10 rounded-md shadow-xs hover:border-white/25 transition-all space-y-2 text-white"
                      >
                        <div>
                          <button
                            onClick={() => onSelectCustomer(deal.customerId)}
                            className="text-[11px] font-bold text-blue-400 hover:underline text-left block truncate w-full"
                          >
                            {deal.customerName}
                          </button>
                          <h4 className="text-xs font-semibold text-white line-clamp-2 mt-0.5">
                            {deal.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                          <span className="font-mono font-bold text-white tabular-nums">
                            {formatCurrency(deal.value, deal.currency)}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-slate-300">
                            %{deal.probability}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-mono">{deal.expectedCloseDate}</span>
                          <span className="truncate max-w-[80px] font-medium text-slate-300">
                            {deal.assignedTo.split(' ')[0]}
                          </span>
                        </div>

                        {/* Stage Mover Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/10">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handlePrevStage(deal)}
                              disabled={stage === 'İlk Temas'}
                              title="Önceki Aşamaya Taşı"
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleNextStage(deal)}
                              disabled={stage === 'Kazanıldı' || stage === 'Kaybedildi'}
                              title="Sonraki Aşamaya Taşı"
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateDealStage(deal.id, 'Kazanıldı')}
                              title="Kazanıldı Olarak İşaretle"
                              className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => updateDealStage(deal.id, 'Kaybedildi')}
                              title="Kaybedildi Olarak İşaretle"
                              className="p-1 text-rose-400 hover:bg-rose-500/20 rounded"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditDeal(deal)}
                              title="Düzenle"
                              className="p-1 text-slate-400 hover:text-white rounded"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteDeal(deal.id)}
                              title="Sil"
                              className="p-1 text-slate-400 hover:text-rose-400 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg overflow-x-auto text-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#131518]/90 border-b border-white/10 text-white font-bold select-none">
                <th className="py-2.5 px-4 whitespace-nowrap text-white">Fırsat Başlığı</th>
                <th className="py-2.5 px-4 whitespace-nowrap text-white">Müşteri</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap text-white">Değer</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-white">Aşama</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap text-white">Olasılık</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-white">Kapanış Tarihi</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-white">Temsilci</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap text-white">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {deals.map(deal => (
                <tr key={deal.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    {deal.title}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onSelectCustomer(deal.customerId)}
                      className="text-blue-400 hover:underline font-bold"
                    >
                      {deal.customerName}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-white">
                    {formatCurrency(deal.value, deal.currency)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <select
                      value={deal.stage}
                      onChange={e => updateDealStage(deal.id, e.target.value as DealStage)}
                      className="px-2 py-1 text-xs bg-[#131518] border border-white/15 rounded font-medium text-white"
                    >
                      {STAGES.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-200">
                    %{deal.probability}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-300 whitespace-nowrap">
                    {deal.expectedCloseDate}
                  </td>
                  <td className="py-3 px-3 text-slate-200 whitespace-nowrap">
                    {deal.assignedTo.split(' ')[0]}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEditDeal(deal)}
                      className="p-1 text-slate-400 hover:text-white mr-1"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteDeal(deal.id)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
