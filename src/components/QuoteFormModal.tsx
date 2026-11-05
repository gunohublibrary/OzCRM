import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, Save } from 'lucide-react';
import { Quote, QuoteItem, QuoteStatus, Customer } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface QuoteFormModalProps {
  initialCustomer?: Customer | null;
  onClose: () => void;
  onSuccess: (savedQuote: Quote) => void;
}

export const QuoteFormModal: React.FC<QuoteFormModalProps> = ({
  initialCustomer,
  onClose,
  onSuccess,
}) => {
  const { customers, addQuote } = useCrm();

  const [customerId, setCustomerId] = useState(
    initialCustomer?.id || (customers[0]?.id ?? '')
  );
  const [title, setTitle] = useState('');
  const [currency, setCurrency] = useState<'TRY' | 'USD' | 'EUR'>('TRY');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<QuoteStatus>('Gönderildi');
  const [preparedBy, setPreparedBy] = useState('Emre Güneş - Kıdemli Satış Mühendisi');
  const [discountTotal, setDiscountTotal] = useState(0);
  const [notes, setNotes] = useState('Kurulum ve devreye alma işlemleri Güntek Bilişim sertifikalı uzmanlarınca yapılacaktır.');
  const [terms, setTerms] = useState('Ödeme koşulu: %50 siparişte, %50 teslimat ve kabul tutanağını müteakip.');

  // Dynamic line items
  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: `item-${Date.now()}-1`,
      description: 'Kurumsal Ağ Güvenlik Cihazı & 1 Yıllık UTM Lisansı',
      unit: 'Adet',
      quantity: 1,
      unitPrice: 180000,
      vatRate: 20,
      total: 180000,
    },
    {
      id: `item-${Date.now()}-2`,
      description: 'Mühendislik, Konfigürasyon ve Kesintisiz Geçiş Hizmeti',
      unit: 'Hizmet',
      quantity: 1,
      unitPrice: 35000,
      vatRate: 20,
      total: 35000,
    },
  ]);

  const [error, setError] = useState('');

  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${items.length + 1}`,
      description: '',
      unit: 'Adet',
      quantity: 1,
      unitPrice: 10000,
      vatRate: 20,
      total: 10000,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, val: any) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const vatTotal = taxableAmount * 0.2; // 20% VAT standard
  const grandTotal = taxableAmount + vatTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Lütfen bir teklif başlığı giriniz.');
      return;
    }
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
      setError('Lütfen müşteri seçiniz.');
      return;
    }

    const created = addQuote({
      customerId,
      customerName: customer.companyName,
      contactPerson: customer.contactPerson,
      title: title.trim(),
      currency,
      items,
      subtotal,
      vatTotal,
      discountTotal,
      grandTotal,
      issueDate,
      validUntil,
      status,
      preparedBy,
      notes: notes.trim(),
      terms: terms.trim(),
    });

    onSuccess(created);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1c1f24] border border-white/15 rounded-lg shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#16181c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Yeni Kurumsal Teklif Hazırla
              </h2>
              <p className="text-[11px] text-slate-300">
                Güntek Bilişim fiyat teklifi ve sözleşme taslağı
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-white">
          {error && (
            <div className="p-2.5 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-md">
              {error}
            </div>
          )}

          {/* Customer & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Teklif Verilecek Müşteri *
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
                Teklif / Proje Başlığı *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Örn: VMware Sanallaştırma & Dell EMC Storage Altyapısı"
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Para Birimi
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md font-medium text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="TRY" className="bg-[#181a1e] text-white">₺ - Türk Lirası (TRY)</option>
                <option value="USD" className="bg-[#181a1e] text-white">$ - Amerikan Doları (USD)</option>
                <option value="EUR" className="bg-[#181a1e] text-white">€ - Euro (EUR)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Teklif Durumu
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as QuoteStatus)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md font-medium text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Taslak" className="bg-[#181a1e] text-white">Taslak</option>
                <option value="Gönderildi" className="bg-[#181a1e] text-white">Gönderildi (Bekliyor)</option>
                <option value="Onaylandı" className="bg-[#181a1e] text-white">Onaylandı (Sözleşme)</option>
                <option value="Revizyon" className="bg-[#181a1e] text-white">Revizyon İstendi</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Düzenlenme Tarihi
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Geçerlilik Tarihi
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={e => setValidUntil(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-1">
              <h3 className="font-semibold text-white">
                Hizmet & Ürün Kalemleri
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Kalem Ekle</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#181a1e] border border-white/10 rounded-md flex flex-col sm:flex-row sm:items-center gap-2"
                >
                  <span className="font-mono text-slate-400 w-4">{idx + 1}</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="Hizmet veya ürün açıklaması..."
                      className="w-full px-2.5 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={e => handleItemChange(item.id, 'unit', e.target.value)}
                      placeholder="Birim"
                      className="w-16 px-2 py-1.5 bg-[#131518] border border-white/15 rounded-md text-center text-white focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                      placeholder="Adet"
                      className="w-16 px-2 py-1.5 bg-[#131518] border border-white/15 rounded-md text-right font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={e => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                      placeholder="Birim Fiyat"
                      className="w-28 px-2 py-1.5 bg-[#131518] border border-white/15 rounded-md text-right font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="w-24 text-right font-mono font-semibold tabular-nums text-white">
                      {item.total.toLocaleString('tr-TR')} {currency}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={items.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-rose-400 disabled:opacity-20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="p-4 bg-[#181a1e] border border-white/10 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-[11px] font-medium text-slate-200">
                Uygulanacak İskonto (TL):
              </label>
              <input
                type="number"
                value={discountTotal}
                onChange={e => setDiscountTotal(Number(e.target.value))}
                className="w-28 px-2 py-1 bg-[#131518] border border-white/15 rounded-md text-right font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="text-right space-y-0.5">
              <div className="text-xs text-slate-300">
                Ara Toplam: <span className="font-mono text-white">{subtotal.toLocaleString('tr-TR')} {currency}</span>
              </div>
              <div className="text-xs text-slate-300">
                KDV (%20): <span className="font-mono text-white">{vatTotal.toLocaleString('tr-TR')} {currency}</span>
              </div>
              <div className="text-sm font-bold text-blue-400">
                Genel Toplam: <span className="font-mono">{grandTotal.toLocaleString('tr-TR')} {currency}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Ödeme Koşulları & Sözleşme Şartları
              </label>
              <textarea
                rows={2}
                value={terms}
                onChange={e => setTerms(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-200 mb-1">
                Mühendislik Notları & Dipnotlar
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
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
              <span>Teklifi Kaydet & Yayınla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
