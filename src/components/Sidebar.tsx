import React from 'react';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
  Headphones,
  Code2,
  Settings,
  Building2,
  PhoneCall
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate }) => {
  const { customers, deals, quotes, tickets } = useCrm();

  const openTicketsCount = tickets.filter(t => t.status === 'Açık' || t.status === 'İşlemde').length;
  const activeCustomersCount = customers.filter(c => c.status === 'Aktif').length;
  const openDealsCount = deals.filter(d => d.stage !== 'Kazanıldı' && d.stage !== 'Kaybedildi').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Gösterge Paneli',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'customers',
      label: 'Müşteri Yönetimi',
      icon: Users,
      badge: `${activeCustomersCount}`,
    },
    {
      id: 'deals',
      label: 'Satış Fırsatları (Pipeline)',
      icon: TrendingUp,
      badge: `${openDealsCount}`,
    },
    {
      id: 'quotes',
      label: 'Teklifler & Sözleşmeler',
      icon: FileText,
      badge: `${quotes.length}`,
    },
    {
      id: 'tickets',
      label: 'Destek Masası (SLA)',
      icon: Headphones,
      badge: openTicketsCount > 0 ? `${openTicketsCount}` : null,
      highlightBadge: openTicketsCount > 0,
    },
    {
      id: 'activities',
      label: 'Görüşme & Etkinlikler',
      icon: PhoneCall,
      badge: null,
    },
    {
      id: 'csharp-api',
      label: 'C# Web API & Geliştirici',
      icon: Code2,
      badge: '.NET 8',
    },
    {
      id: 'settings',
      label: 'Yedekleme & Sistem',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#16181c]/90 backdrop-blur-md border-r border-white/10 flex flex-col justify-between hidden lg:flex select-none text-white">
      <div className="p-4 space-y-6">
        {/* Workspace Card */}
        <div className="p-3 bg-[#22252a]/80 rounded-lg border border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                GÜNTEK BİLİŞİM
              </p>
              <p className="text-[11px] text-slate-300 truncate">
                OzCRM Portalı · Ümraniye
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="space-y-1">
          <p className="px-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Yönetim Menüsü
          </p>
          <div className="pt-1 space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600/30 text-white font-bold border border-blue-500/40 shadow-xs'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded font-mono ${
                        item.highlightBadge
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                          : isActive
                          ? 'bg-blue-500/30 text-white font-semibold'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="text-[11px] text-slate-300">
          <div className="flex items-center justify-between">
            <span>Sürüm</span>
            <span className="font-mono text-white font-medium">v4.2 (C# Web)</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Bağlantı</span>
            <span className="text-emerald-400 font-medium">Yerel Aktif</span>
          </div>
        </div>
        <div className="pt-2 text-[10px] text-slate-400 text-center">
          © {new Date().getFullYear()} Güntek Bilişim Ltd. Şti.
        </div>
      </div>
    </aside>
  );
};
