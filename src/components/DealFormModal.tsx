import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Save } from 'lucide-react';
import { Deal, DealStage, Customer } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface DealFormModalProps {
  dealToEdit?: Deal | null;
  initialCustomer?: Customer | null;
  onClose: () => void;
  onSuccess: (savedDeal: Deal) => void;
}

export const DealFormModal: React.FC<DealFormModalProps> = ({
  dealToEdit,
  initialCustomer,
  onClose,
  onSuccess,
}) => {
  const { customers, addDeal, updateDeal } = useCrm();

  const [customerId, setCustomerId] = useState(
    dealToEdit?.customerId || initialCustomer?.id || (customers[0]?.id ?? '')
  );
  const [title, setTitle] = useState(dealToEdit?.title || '');
  const [value, setValue] = useState(dealToEdit?.value || 250000);
  const [currency, setCurrency] = useState<'TRY' | 'USD' | 'EUR'>(dealToEdit?.currency || 'TRY');
  const [stage, setStage] = useState<DealStage>(dealToEdit?.stage || 'İlk Temas');
  const [probability, setProbability] = useState(dealToEdit?.probability || 30);
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    dealToEdit?.expectedCloseDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [assignedTo, setAssignedTo] = useState(
    dealToEdit?.assignedTo || 'Emre Güneş (Güntek Bilişim)'
  );
  const [description, setDescription] = useState(dealToEdit?.description || '');

  const [error, setError] = useState('');

  // Update probability based on stage automatically if user hasn't set custom
  const handleStageChange = (newStage: DealStage) => {
    setStage(newStage);
    if (newStage === 'İlk Temas') setProbability(20);
    else if (newStage === 'İhtiyaç Analizi') setProbability(40);
    else if (newStage === 'Teklif Sunuldu') setProbability(60);
    else if (newStage === 'Müzakere') setProbability(80);
    else if (newStage === 'Kazanıldı') setProbability(100);
    else if (newStage === 'Kaybedildi') setProbability(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Lütfen bir fırsat başlığı giriniz.');
      return;
    }
    const targetCustomer = customers.find(c => c.id === customerId);
    if (!targetCustomer) {
      setError('Lütfen geçerli bir müşteri seçiniz.');
      return;
    }

    if (dealToEdit) {
      updateDeal(dealToEdit.id, {
        customerId,
        customerName: targetCustomer.companyName,
        title: title.trim(),
        value: Number(value),
        currency,
        stage,
        probability: Number(probability),
        expectedCloseDate,
        assignedTo,
        description: description.trim(),
      });
      onSuccess({
        ...dealToEdit,
        customerId,
        customerName: targetCustomer.companyName,
        title,
        value: Number(value),
        currency,
        stage,
        probability: Number(probability),
        expectedCloseDate,
        assignedTo,
        description,
      });
    } else {
      const created = addDeal({
        customerId,
        customerName: targetCustomer.companyName,
        title: title.trim(),
        value: Number(value),
        currency,
        stage,
        probability: Number(probability),
        expectedCloseDate,
        assignedTo,
        description: description.trim(),
      });
      onSuccess(created);
    }
  };

  const stages: DealStage[] = [
    'İlk Temas',
    'İhtiyaç Analizi',
    'Teklif Sunuldu',
    'Müzakere',
    'Kazanıldı',
    'Kaybedildi',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#1c1f24] border border-white/15 rounded-lg shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#16181c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {dealToEdit ? 'Satış Fırsatını Düzenle' : 'Yeni Satış Fırsatı Oluştur'}
              </h2>
              <p className="text-[11px] text-slate-300">
                Güntek Bilişim IT projesi & pipeline kaydı
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
            <div className="p-2.5 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-md text-xs">
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
              className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id} className="bg-[#181a1e] text-white">
                  {c.code} - {c.companyName} ({c.contactPerson})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-200 mb-1">
              Fırsat / Proje Başlığı *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Örn: Fortinet FG-200F Firewall Kümesi & SD-WAN Yenilemesi"
              className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Fırsat Tutarı
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={value}
                  onChange={e => setValue(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md font-mono text-white focus:outline-none focus:border-blue-500"
                />
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-[#131518] border border-white/15 rounded-md font-medium text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="TRY" className="bg-[#181a1e] text-white">₺ (TRY)</option>
                  <option value="USD" className="bg-[#181a1e] text-white">$ (USD)</option>
                  <option value="EUR" className="bg-[#181a1e] text-white">€ (EUR)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Satış Aşaması (Pipeline Stage)
              </label>
              <select
                value={stage}
                onChange={e => handleStageChange(e.target.value as DealStage)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {stages.map(stg => (
                  <option key={stg} value={stg} className="bg-[#181a1e] text-white">
                    {stg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Başarı Olasılığı (%) : %{probability}
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={probability}
                onChange={e => setProbability(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Tahmini Kapanış Tarihi
              </label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={e => setExpectedCloseDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Sorumlu Satış Mühendisi / Temsilci
              </label>
              <select
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Emre Güneş (Güntek Bilişim)" className="bg-[#181a1e] text-white">Emre Güneş (Kıdemli Satış Mühendisi)</option>
                <option value="Zeynep Aksoy (Güntek Bilişim)" className="bg-[#181a1e] text-white">Zeynep Aksoy (Kurumsal Hesap Yöneticisi)</option>
                <option value="Hakan Şahin (Güntek Bilişim)" className="bg-[#181a1e] text-white">Hakan Şahin (Çözüm Mimarı)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-200 mb-1">
              Fırsat Açıklaması & Kapsam
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Donanım modelleri, yazılım lisans sayısı, bakım gereksinimleri..."
              className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
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
              <span>{dealToEdit ? 'Fırsatı Güncelle' : 'Fırsatı Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
