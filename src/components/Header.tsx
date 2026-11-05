import React from 'react';
import { Sun, Moon, Plus } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenNewCustomer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, onOpenNewCustomer }) => {
  const { theme, toggleTheme } = useCrm();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#181a1e]/90 backdrop-blur-md border-b border-white/10 transition-colors text-white">
      {/* Zone 1: Single text element wordmark */}
      <div 
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
          Öz
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Güntek OzCRM
        </span>
      </div>

      {/* Zone 2: 4-5 concise single-line text links with subtle hover underlines */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-200">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            currentTab === 'dashboard'
              ? 'text-white font-bold underline underline-offset-8 decoration-blue-400 decoration-2'
              : 'text-slate-200 hover:text-white'
          }`}
        >
          Genel Bakış
        </button>
        <button
          onClick={() => onNavigate('customers')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            currentTab === 'customers'
              ? 'text-white font-bold underline underline-offset-8 decoration-blue-400 decoration-2'
              : 'text-slate-200 hover:text-white'
          }`}
        >
          Müşteriler
        </button>
        <button
          onClick={() => onNavigate('deals')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            currentTab === 'deals'
              ? 'text-white font-bold underline underline-offset-8 decoration-blue-400 decoration-2'
              : 'text-slate-200 hover:text-white'
          }`}
        >
          Satış Fırsatları
        </button>
        <button
          onClick={() => onNavigate('quotes')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            currentTab === 'quotes'
              ? 'text-white font-bold underline underline-offset-8 decoration-blue-400 decoration-2'
              : 'text-slate-200 hover:text-white'
          }`}
        >
          Teklifler
        </button>
        <button
          onClick={() => onNavigate('tickets')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            currentTab === 'tickets'
              ? 'text-white font-bold underline underline-offset-8 decoration-blue-400 decoration-2'
              : 'text-slate-200 hover:text-white'
          }`}
        >
          Destek Talepleri
        </button>
        <button
          onClick={() => onNavigate('csharp-api')}
          className={`whitespace-nowrap shrink-0 transition-colors ${
            currentTab === 'csharp-api'
              ? 'text-white font-bold underline underline-offset-8 decoration-blue-400 decoration-2'
              : 'text-slate-200 hover:text-white'
          }`}
        >
          C# Web API
        </button>
      </nav>

      {/* Zone 3: 1 primary action + theme toggle */}
      <div className="flex items-center gap-3 shrink-0">
        {/* MSSQL & Cloud Status Pill */}
        <div 
          onClick={() => onNavigate('csharp-api')}
          title="Microsoft SQL Server (T-SQL) & Firestore Bulut Senkronizasyonu Aktif"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#131518] border border-white/10 hover:border-emerald-500/50 cursor-pointer transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-mono text-[11px]">MSSQL & Bulut Aktif</span>
        </div>

        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Açık Temaya Geç' : 'Karanlık Temaya Geç'}
          className="p-2 text-slate-300 hover:text-white rounded-md hover:bg-white/10 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          onClick={onOpenNewCustomer}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Müşteri</span>
        </button>
      </div>
    </header>
  );
};
