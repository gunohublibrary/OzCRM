import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building2,
  FilePlus,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Customer, CustomerStatus, IndustryType } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface CustomersViewProps {
  onSelectCustomer: (customerId: string) => void;
  onOpenNewCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onCreateDealForCustomer: (customer: Customer) => void;
  onCreateQuoteForCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  onSelectCustomer,
  onOpenNewCustomer,
  onEditCustomer,
  onCreateDealForCustomer,
  onCreateQuoteForCustomer,
}) => {
  const { customers, deleteCustomer, exportCustomersCsv } = useCrm();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus | 'All'>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'code' | 'balance' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered and sorted customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter(customer => {
        const matchesSearch =
          customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.taxNumber.includes(searchTerm) ||
          customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm) ||
          customer.code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'All' || customer.status === selectedStatus;
        const matchesIndustry = selectedIndustry === 'All' || customer.industry === selectedIndustry;

        return matchesSearch && matchesStatus && matchesIndustry;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'name') {
          comparison = a.companyName.localeCompare(b.companyName, 'tr');
        } else if (sortBy === 'code') {
          comparison = a.code.localeCompare(b.code);
        } else if (sortBy === 'balance') {
          comparison = a.balance - b.balance;
        } else if (sortBy === 'createdAt') {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [customers, searchTerm, selectedStatus, selectedIndustry, sortBy, sortOrder]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const industries: IndustryType[] = [
    'Bilişim & Yazılım',
    'Telekomünikasyon',
    'Finans & Bankacılık',
    'Sağlık & İlaç',
    'Üretim & Sanayi',
    'Lojistik & Taşımacılık',
    'Perakende & E-Ticaret',
    'Enerji & Altyapı',
    'Eğitim',
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1
              className="text-xl font-bold tracking-tight text-[#a2b7ea]"
              style={{ color: '#a2b7ea' }}
            >
              Müşteri Veritabanı & Yönetimi
            </h1>
            <span className="font-mono text-xs tabular-nums px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {filteredCustomers.length} Kayıt
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Güntek Bilişim kurumsal firma portföyü, yetkili bilgileri, vergi dairesi ve finansal durum takibi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCustomersCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Tüm müşterileri CSV formatında indir"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel / CSV</span>
          </button>
          <button
            onClick={onOpenNewCustomer}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Müşteri Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-white">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Firma adı, yetkili, vergi no, şehir veya müşteri kodu ile ara..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#131518] border border-white/15 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center p-0.5 bg-[#131518] border border-white/10 rounded-md text-xs font-medium">
            <button
              onClick={() => setSelectedStatus('All')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedStatus === 'All'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedStatus('Aktif')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedStatus === 'Aktif'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Aktif
            </button>
            <button
              onClick={() => setSelectedStatus('Potansiyel')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedStatus === 'Potansiyel'
                  ? 'bg-blue-500 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Potansiyel
            </button>
            <button
              onClick={() => setSelectedStatus('Pasif')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedStatus === 'Pasif'
                  ? 'bg-slate-700 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Pasif
            </button>
          </div>

          {/* Industry Dropdown */}
          <select
            value={selectedIndustry}
            onChange={e => setSelectedIndustry(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="All">Tüm Sektörler</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={e => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb as any);
              setSortOrder(so as any);
            }}
            className="px-2.5 py-1.5 text-xs bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="name-asc">Firma Adı (A-Z)</option>
            <option value="name-desc">Firma Adı (Z-A)</option>
            <option value="code-asc">Müşteri Kodu (0-9)</option>
            <option value="balance-desc">Bakiye (Yüksekten Düşüğe)</option>
            <option value="createdAt-desc">En Yeni Eklenenler</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 text-center bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg text-white">
          <Building2 className="w-10 h-10 mx-auto text-slate-500 mb-3" />
          <h3 className="text-sm font-bold text-white">
            Arama Kriterine Uygun Müşteri Bulunamadı
          </h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1 mb-4">
            Arama terimini değiştirebilir, filtreleri temizleyebilir veya yeni bir müşteri kaydı oluşturabilirsiniz.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('All');
                setSelectedIndustry('All');
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-md"
            >
              Filtreleri Temizle
            </button>
            <button
              onClick={onOpenNewCustomer}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500"
            >
              Yeni Müşteri Ekle
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg overflow-x-auto text-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#131518]/90 border-b border-white/10 text-white font-bold select-none">
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-500 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap text-white font-bold">Kod</th>
                <th className="py-2.5 px-4 whitespace-nowrap text-white font-bold">Firma & Yetkili</th>
                <th className="py-2.5 px-4 whitespace-nowrap text-white font-bold">İletişim</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-white font-bold">Şehir / Sektör</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-white font-bold">Durum</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-white font-bold">Temsilci</th>
                <th className="py-2.5 px-4 text-right whitespace-nowrap text-white font-bold">Bakiye</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap text-white font-bold">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.map(customer => {
                const isSelected = selectedIds.includes(customer.id);
                return (
                  <tr
                    key={customer.id}
                    className={`hover:bg-white/5 transition-colors ${
                      isSelected ? 'bg-blue-600/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(customer.id)}
                        className="rounded border-slate-500 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                      {customer.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectCustomer(customer.id)}
                          className="hover:text-blue-400 hover:underline text-left"
                        >
                          {customer.companyName}
                        </button>
                        {customer.category === 'VIP Kurumsal' && (
                          <span className="text-[10px] font-mono px-1 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-bold">
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {customer.contactPerson} · <span className="text-slate-400">{customer.contactTitle}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-white font-mono text-[11px] font-medium">
                        {customer.phone}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {customer.email}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-white font-medium">
                        {customer.city}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {customer.industry}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded ${
                          customer.status === 'Aktif'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : customer.status === 'Potansiyel'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-200">
                      {customer.accountManager.split(' ')[0]} {customer.accountManager.split(' ')[1]}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums font-bold text-white">
                      {formatCurrency(customer.balance)}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectCustomer(customer.id)}
                          title="Detay Kartı"
                          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onCreateDealForCustomer(customer)}
                          title="Fırsat Ekle"
                          className="p-1.5 text-slate-300 hover:text-emerald-400 hover:bg-white/10 rounded transition-colors"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onCreateQuoteForCustomer(customer)}
                          title="Teklif Hazırla"
                          className="p-1.5 text-slate-300 hover:text-indigo-400 hover:bg-white/10 rounded transition-colors"
                        >
                          <FilePlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditCustomer(customer)}
                          title="Düzenle"
                          className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-white/10 rounded transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(customer.id)}
                          title="Sil"
                          className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-white/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table Footer with Summary Stats */}
          <div className="p-3 bg-[#131518]/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
            <div>
              Toplam <span className="font-bold text-white">{filteredCustomers.length}</span> firma gösteriliyor (Toplam sistemde {customers.length} kayıtlı)
            </div>
            <div className="font-mono tabular-nums">
              Toplam Portföy Bakiyesi:{' '}
              <span className="font-bold text-white">
                {formatCurrency(filteredCustomers.reduce((acc, c) => acc + c.balance, 0))}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Müşteri Kaydını Silmek İstiyor musunuz?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Bu müşteriyi sildiğinizde, firmaya ait iletişim ve cari bilgileri kaldırılacaktır. Bu işlem geri alınamaz.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  deleteCustomer(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
