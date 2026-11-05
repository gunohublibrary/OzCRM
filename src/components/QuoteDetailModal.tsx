import React from 'react';
import { X, Printer, CheckCircle2, Building2, Send, Download } from 'lucide-react';
import { Quote } from '../types/crm';
import { GUNTEK_COMPANY_INFO } from '../data/seedData';
import { useCrm } from '../context/CrmContext';

interface QuoteDetailModalProps {
  quote: Quote;
  onClose: () => void;
}

export const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({ quote, onClose }) => {
  const { updateQuoteStatus } = useCrm();

  const formatCurrency = (val: number, cur: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1c1f24] border border-white/15 rounded-lg shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-white">
        {/* Modal Top Actions */}
        <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between bg-[#16181c] print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white">
              {quote.quoteNumber}
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                quote.status === 'Onaylandı'
                  ? 'bg-emerald-950 text-emerald-300'
                  : quote.status === 'Gönderildi'
                  ? 'bg-blue-950 text-blue-300'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              {quote.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuoteStatus(quote.id, 'Onaylandı')}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded-md cursor-pointer transition-colors"
            >
              Onaylandı Olarak İşaretle
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 border border-white/15 hover:bg-slate-700 rounded-md cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="p-8 overflow-y-auto flex-1 bg-[#141619] text-white print:bg-white print:text-slate-900 print:p-0 print:m-0 space-y-6">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  Öz
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-white print:text-slate-900">
                    {GUNTEK_COMPANY_INFO.companyName}
                  </h1>
                  <p className="text-xs text-blue-400 font-medium print:text-blue-600">
                    Kurumsal IT, Ağ Güvenliği & Yazılım Çözümleri
                  </p>
                </div>
              </div>
              <div className="text-[11px] text-slate-300 print:text-slate-600 mt-2 space-y-0.5">
                <p>{GUNTEK_COMPANY_INFO.address}</p>
                <p>Tel: {GUNTEK_COMPANY_INFO.phone} · E-posta: {GUNTEK_COMPANY_INFO.salesEmail}</p>
                <p>Vergi: {GUNTEK_COMPANY_INFO.taxOffice} - VKN: {GUNTEK_COMPANY_INFO.taxNumber}</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-blue-950 text-blue-300 print:bg-blue-50 print:text-blue-700 text-xs font-bold rounded">
                KURUMSAL FİYAT TEKLİFİ
              </span>
              <div className="font-mono text-sm font-bold pt-1 text-white print:text-slate-900">{quote.quoteNumber}</div>
              <div className="text-xs text-slate-300 print:text-slate-600">
                Tarih: <span className="font-mono text-white print:text-slate-900">{quote.issueDate}</span>
              </div>
              <div className="text-xs text-slate-300 print:text-slate-600">
                Geçerlilik: <span className="font-mono text-white print:text-slate-900">{quote.validUntil}</span>
              </div>
            </div>
          </div>

          {/* Client Info & Project Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-[#1b1e23] print:bg-slate-50 rounded-lg border border-white/10 print:border-slate-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Müşteri / Kurum Bilgisi
              </span>
              <h3 className="text-sm font-bold text-white print:text-slate-900 mt-1">
                {quote.customerName}
              </h3>
              <p className="text-xs text-slate-300 print:text-slate-600 mt-0.5">
                Sayın: {quote.contactPerson}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Teklif / Proje Başlığı
              </span>
              <h3 className="text-sm font-semibold text-white print:text-slate-900 mt-1">
                {quote.title}
              </h3>
              <p className="text-xs text-slate-300 print:text-slate-600 mt-0.5">
                Hazırlayan: {quote.preparedBy}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-white/10 print:border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#1e2228] print:bg-slate-100 border-b border-white/10 print:border-slate-200 font-semibold text-slate-200 print:text-slate-700">
                  <th className="py-2.5 px-3 w-8 text-center">#</th>
                  <th className="py-2.5 px-4">Hizmet / Donanım / Lisans Açıklaması</th>
                  <th className="py-2.5 px-3 text-center">Birim</th>
                  <th className="py-2.5 px-3 text-right">Miktar</th>
                  <th className="py-2.5 px-4 text-right">Birim Fiyat</th>
                  <th className="py-2.5 px-4 text-right">KDV</th>
                  <th className="py-2.5 px-4 text-right">Toplam Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 print:divide-slate-200">
                {quote.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-white/5 print:hover:bg-slate-50">
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-white print:text-slate-900">
                      {item.description}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300 print:text-slate-500">{item.unit}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-white print:text-slate-900">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-white print:text-slate-900">
                      {formatCurrency(item.unitPrice, quote.currency)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300 print:text-slate-500">
                      %{item.vatRate}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-white print:text-slate-900">
                      {formatCurrency(item.total, quote.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300 print:text-slate-600">
                <span>Ara Toplam:</span>
                <span className="font-mono tabular-nums font-medium text-white print:text-slate-900">
                  {formatCurrency(quote.subtotal, quote.currency)}
                </span>
              </div>
              {quote.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-400 print:text-emerald-600 font-medium">
                  <span>Özel Güntek İskontosu:</span>
                  <span className="font-mono tabular-nums">
                    -{formatCurrency(quote.discountTotal, quote.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-300 print:text-slate-600">
                <span>Hesaplanan KDV (%20):</span>
                <span className="font-mono tabular-nums font-medium text-white print:text-slate-900">
                  {formatCurrency(quote.vatTotal, quote.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10 print:border-slate-200 text-white print:text-slate-900">
                <span>Genel Toplam (KDV Dahil):</span>
                <span className="font-mono tabular-nums text-blue-400 print:text-blue-600">
                  {formatCurrency(quote.grandTotal, quote.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Notes */}
          <div className="pt-4 border-t border-white/10 print:border-slate-200 space-y-2 text-xs">
            <h4 className="font-semibold text-white print:text-slate-900">
              Şartlar, Koşullar ve Ödeme Esasları
            </h4>
            <p className="text-slate-300 print:text-slate-600 leading-relaxed">
              {quote.terms || 'Teklifimiz düzenlenme tarihinden itibaren 30 takvim günü geçerlidir.'}
            </p>
            {quote.notes && (
              <p className="text-slate-400 print:text-slate-500 italic">
                Not: {quote.notes}
              </p>
            )}
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="border-t border-white/10 print:border-slate-200 pt-3">
              <p className="font-bold text-white print:text-slate-900">GÜNTEK BİLİŞİM LTD. ŞTİ.</p>
              <p className="text-slate-300 print:text-slate-500 mt-1">{quote.preparedBy}</p>
              <p className="text-slate-400 text-[10px] mt-6">(Yetkili İmza & Kaşe)</p>
            </div>
            <div className="border-t border-white/10 print:border-slate-200 pt-3">
              <p className="font-bold text-white print:text-slate-900">{quote.customerName}</p>
              <p className="text-slate-300 print:text-slate-500 mt-1">{quote.contactPerson}</p>
              <p className="text-slate-400 text-[10px] mt-6">(Teklif Onay & Kaşe)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
