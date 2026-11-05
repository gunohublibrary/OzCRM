import React, { useState, useRef } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Building2,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { GUNTEK_COMPANY_INFO } from '../data/seedData';

export const SettingsBackupView: React.FC = () => {
  const {
    customers,
    deals,
    quotes,
    tickets,
    activities,
    exportAllData,
    importAllData,
    resetToDefaults,
    exportCustomersCsv,
    downloadMssqlScript,
  } = useCrm();

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Guntek_OzCRM_Yedek_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showNotice('success', 'OzCRM tam veritabanı yedeği JSON formatında başarıyla indirildi.');
  };

  const handleDownloadMssql = () => {
    downloadMssqlScript();
    showNotice('success', 'Microsoft SQL Server (T-SQL) veritabanı kurulum scripti başarıyla indirildi.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      const success = importAllData(content);
      if (success) {
        showNotice('success', 'Yedek dosyası başarıyla yüklendi ve veriler güncellendi.');
      } else {
        showNotice('error', 'Geçersiz yedek dosyası formatı. Lütfen OzCRM uyumlu bir JSON dosyası seçin.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
    showNotice('success', 'OzCRM varsayılan Güntek Bilişim demo verilerine sıfırlandı.');
  };

  return (
    <div className="space-y-6 max-w-4xl text-white">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Sistem Ayarları & Veri Yedekleme
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Güntek Bilişim firma profili, CRM veritabanı yedeği ve Excel/CSV dışa aktarım araçları
        </p>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-md text-xs flex items-center gap-2 border ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-200 border-emerald-800'
              : 'bg-rose-950/80 text-rose-200 border-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Company Info Box */}
      <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg p-5 space-y-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {GUNTEK_COMPANY_INFO.companyName}
            </h2>
            <p className="text-xs text-blue-400 font-medium">
              OzCRM Kurumsal Müşteri Yönetim Portalı
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-white/10">
          <div>
            <span className="text-slate-400 block text-[10px]">Genel Merkez Adresi</span>
            <span className="font-medium text-white">
              {GUNTEK_COMPANY_INFO.address}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">İletişim & Santral</span>
            <span className="font-mono text-white">
              {GUNTEK_COMPANY_INFO.phone} · {GUNTEK_COMPANY_INFO.salesEmail}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Vergi Dairesi & Sicil</span>
            <span className="font-mono text-white">
              {GUNTEK_COMPANY_INFO.taxOffice} - VKN: {GUNTEK_COMPANY_INFO.taxNumber}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Teknoloji Altyapısı</span>
            <span className="font-mono text-white">
              {GUNTEK_COMPANY_INFO.techStack}
            </span>
          </div>
        </div>
      </div>

      {/* Data Backup & Export Section */}
      <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg p-5 space-y-4 text-white">
        <div>
          <h2 className="text-sm font-bold text-white">
            Veri Yönetimi & Dışa/İçe Aktarım
          </h2>
          <p className="text-xs text-slate-300">
            Tüm müşteri portföyünü, satış fırsatlarını ve destek kayıtlarını bilgisayarınıza yedekleyin veya geri yükleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Download MSSQL Script */}
          <div className="p-4 rounded-lg bg-[#15171a] border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-transparent space-y-2 text-white">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">
              MSSQL Server (T-SQL) Scripti
            </h3>
            <p className="text-[11px] text-slate-300">
              MSSQL 2019/2022 / Azure SQL uyumlu DDL tablolar, indexler, SP'ler ve canlı veri insertleri.
            </p>
            <button
              onClick={handleDownloadMssql}
              className="w-full mt-2 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer"
            >
              T-SQL (.sql) İndir
            </button>
          </div>

          {/* Download JSON */}
          <div className="p-4 rounded-lg bg-[#15171a] border border-white/10 space-y-2 text-white">
            <Download className="w-5 h-5 text-blue-400" />
            <h3 className="text-xs font-bold text-white">
              JSON Veritabanı Yedeği
            </h3>
            <p className="text-[11px] text-slate-300">
              Müşteriler, teklifler, biletler ve tüm geçmişi tek bir JSON dosyasında depolar.
            </p>
            <button
              onClick={handleDownloadBackup}
              className="w-full mt-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors cursor-pointer"
            >
              JSON İndir
            </button>
          </div>

          {/* Export CSV */}
          <div className="p-4 rounded-lg bg-[#15171a] border border-white/10 space-y-2 text-white">
            <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            <h3 className="text-xs font-bold text-white">
              Excel / CSV Müşteri Listesi
            </h3>
            <p className="text-[11px] text-slate-300">
              Tüm kurumsal müşterileri Excel ve muhasebe yazılımları ile tam uyumlu CSV olarak aktarır.
            </p>
            <button
              onClick={exportCustomersCsv}
              className="w-full mt-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/15 rounded-md transition-colors cursor-pointer"
            >
              CSV İndir
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-lg bg-[#15171a] border border-white/10 space-y-2 text-white">
            <Upload className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-bold text-white">
              Yedekten Geri Yükle
            </h3>
            <p className="text-[11px] text-slate-300">
              Daha önce aldığınız bir OzCRM JSON yedeğini seçerek verileri geri yükler.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/15 rounded-md transition-colors cursor-pointer"
            >
              Dosya Seç & Yükle
            </button>
          </div>
        </div>
      </div>

      {/* Database Diagnostic Stats */}
      <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg p-5 space-y-4 text-white">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-white">
            Yerel Bellek & Kayıt İstatistikleri
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-[#15171a] border border-white/10 rounded-md">
            <span className="text-slate-400 block text-[10px]">Müşteri</span>
            <span className="font-mono text-base font-bold text-white">{customers.length}</span>
          </div>
          <div className="p-3 bg-[#15171a] border border-white/10 rounded-md">
            <span className="text-slate-400 block text-[10px]">Satış Fırsatı</span>
            <span className="font-mono text-base font-bold text-white">{deals.length}</span>
          </div>
          <div className="p-3 bg-[#15171a] border border-white/10 rounded-md">
            <span className="text-slate-400 block text-[10px]">Teklif</span>
            <span className="font-mono text-base font-bold text-white">{quotes.length}</span>
          </div>
          <div className="p-3 bg-[#15171a] border border-white/10 rounded-md">
            <span className="text-slate-400 block text-[10px]">Destek Bileti</span>
            <span className="font-mono text-base font-bold text-white">{tickets.length}</span>
          </div>
          <div className="p-3 bg-[#15171a] border border-white/10 rounded-md">
            <span className="text-slate-400 block text-[10px]">Etkinlik</span>
            <span className="font-mono text-base font-bold text-white">{activities.length}</span>
          </div>
        </div>

        {/* Reset button */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-300">
            Örnek verileri sıfırlayarak Güntek Bilişim başlangıç durumuna dönün:
          </span>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/80 hover:bg-rose-900 rounded-md border border-rose-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılan Verilere Dön</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1c1f24] border border-white/15 rounded-lg p-5 shadow-lg space-y-4 text-white">
            <h3 className="text-sm font-bold text-white">
              Tüm Verileri Sıfırlamak İstiyor musunuz?
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Bu işlem mevcut tarayıcı belleğindeki müşteri, teklif ve bilet değişikliklerinizi silecek ve Güntek Bilişim orijinal demo verilerini yükleyecektir.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md cursor-pointer transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md cursor-pointer transition-colors"
              >
                Evet, Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
