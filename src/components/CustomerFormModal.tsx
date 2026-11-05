import React, { useState, useEffect } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { Customer, CustomerCategory, CustomerStatus, IndustryType } from '../types/crm';
import { useCrm } from '../context/CrmContext';

interface CustomerFormModalProps {
  customerToEdit?: Customer | null;
  onClose: () => void;
  onSuccess: (savedCustomer: Customer) => void;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  customerToEdit,
  onClose,
  onSuccess,
}) => {
  const { addCustomer, updateCustomer } = useCrm();

  const [companyName, setCompanyName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactTitle, setContactTitle] = useState('Bilgi İşlem Müdürü');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [website, setWebsite] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('Bilişim & Yazılım');
  const [status, setStatus] = useState<CustomerStatus>('Aktif');
  const [category, setCategory] = useState<CustomerCategory>('KOBİ');
  const [accountManager, setAccountManager] = useState('Emre Güneş (Güntek Bilişim)');
  const [creditLimit, setCreditLimit] = useState(500000);
  const [balance, setBalance] = useState(0);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customerToEdit) {
      setCompanyName(customerToEdit.companyName);
      setTradeName(customerToEdit.tradeName || '');
      setContactPerson(customerToEdit.contactPerson);
      setContactTitle(customerToEdit.contactTitle);
      setEmail(customerToEdit.email);
      setPhone(customerToEdit.phone);
      setMobile(customerToEdit.mobile || '');
      setWebsite(customerToEdit.website || '');
      setTaxNumber(customerToEdit.taxNumber);
      setTaxOffice(customerToEdit.taxOffice);
      setCity(customerToEdit.city);
      setDistrict(customerToEdit.district);
      setAddress(customerToEdit.address);
      setIndustry(customerToEdit.industry);
      setStatus(customerToEdit.status);
      setCategory(customerToEdit.category);
      setAccountManager(customerToEdit.accountManager);
      setCreditLimit(customerToEdit.creditLimit);
      setBalance(customerToEdit.balance);
      setNotes(customerToEdit.notes || '');
    }
  }, [customerToEdit]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!companyName.trim()) errs.companyName = 'Firma tam ünvanı zorunludur.';
    if (!contactPerson.trim()) errs.contactPerson = 'Yetkili kişi adı zorunludur.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Geçerli bir e-posta adresi giriniz.';
    if (!phone.trim()) errs.phone = 'Telefon numarası zorunludur.';
    if (!taxNumber.trim() || taxNumber.length < 10) errs.taxNumber = 'Geçerli 10 haneli VKN / Vergi No giriniz.';
    if (!taxOffice.trim()) errs.taxOffice = 'Vergi dairesi zorunludur.';
    if (!city.trim()) errs.city = 'Şehir zorunludur.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (customerToEdit) {
      updateCustomer(customerToEdit.id, {
        companyName: companyName.trim(),
        tradeName: tradeName.trim() || undefined,
        contactPerson: contactPerson.trim(),
        contactTitle: contactTitle.trim(),
        email: email.trim(),
        phone: phone.trim(),
        mobile: mobile.trim() || undefined,
        website: website.trim() || undefined,
        taxNumber: taxNumber.trim(),
        taxOffice: taxOffice.trim(),
        city: city.trim(),
        district: district.trim(),
        address: address.trim(),
        industry,
        status,
        category,
        accountManager,
        creditLimit: Number(creditLimit),
        balance: Number(balance),
        notes: notes.trim(),
      });
      onSuccess({
        ...customerToEdit,
        companyName,
        contactPerson,
        contactTitle,
        email,
        phone,
        taxNumber,
        taxOffice,
        city,
        district,
        address,
        industry,
        status,
        category,
        accountManager,
        creditLimit: Number(creditLimit),
        balance: Number(balance),
        notes,
      });
    } else {
      const created = addCustomer({
        companyName: companyName.trim(),
        tradeName: tradeName.trim() || undefined,
        contactPerson: contactPerson.trim(),
        contactTitle: contactTitle.trim(),
        email: email.trim(),
        phone: phone.trim(),
        mobile: mobile.trim() || undefined,
        website: website.trim() || undefined,
        taxNumber: taxNumber.trim(),
        taxOffice: taxOffice.trim(),
        city: city.trim(),
        district: district.trim(),
        address: address.trim(),
        industry,
        status,
        category,
        accountManager,
        creditLimit: Number(creditLimit),
        balance: Number(balance),
        notes: notes.trim(),
      });
      onSuccess(created);
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto text-white">
      <div className="relative w-full max-w-3xl bg-[#1c1f24] border border-white/15 rounded-lg shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#131518]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {customerToEdit ? 'Müşteri Bilgilerini Düzenle' : 'Yeni Müşteri Kaydı (Güntek OzCRM)'}
              </h2>
              <p className="text-[11px] text-slate-300">
                Veritabanına kaydedilecek kurumsal firma, vergi ve temsilci detayları
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-white">
          {/* Section 1: Company Profile */}
          <div className="space-y-3">
            <h3 className="font-bold text-white border-b border-white/10 pb-1">
              1. Firma & Ticari Tanımlar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Firma Tam Resmi Ünvanı *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Örn: Anadolu Bilişim Teknolojileri A.Ş."
                  className={`w-full px-3 py-1.5 bg-[#131518] border rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.companyName ? 'border-rose-500' : 'border-white/15'
                  }`}
                />
                {errors.companyName && <p className="text-[10px] text-rose-400 mt-0.5">{errors.companyName}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Kısa Ticari Ad / Marka
                </label>
                <input
                  type="text"
                  value={tradeName}
                  onChange={e => setTradeName(e.target.value)}
                  placeholder="Örn: Anadolu Tech"
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Faaliyet Sektörü
                </label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value as IndustryType)}
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Müşteri Statüsü
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as CustomerStatus)}
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Aktif">Aktif Müşteri</option>
                  <option value="Potansiyel">Potansiyel / Aday</option>
                  <option value="Pasif">Pasif</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Segment / Kategori
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as CustomerCategory)}
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="VIP Kurumsal">VIP Kurumsal</option>
                  <option value="KOBİ">KOBİ</option>
                  <option value="Kamu / Kurum">Kamu / Kurum</option>
                  <option value="Girişim">Girişim</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Person */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
              2. Yetkili Kişi & İletişim Kanalları
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Yetkili Adı Soyadı *
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  placeholder="Örn: Murat Kara"
                  className={`w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.contactPerson ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.contactPerson && <p className="text-[10px] text-rose-500 mt-0.5">{errors.contactPerson}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Görevi / Ünvanı
                </label>
                <input
                  type="text"
                  value={contactTitle}
                  onChange={e => setContactTitle(e.target.value)}
                  placeholder="Örn: Bilgi İşlem Müdürü / CIO"
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Kurumsal E-posta *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Örn: m.kara@anadolutech.com.tr"
                  className={`w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.email && <p className="text-[10px] text-rose-500 mt-0.5">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Sabit Telefon *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Örn: +90 216 450 12 30"
                  className={`w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.phone ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Cep Telefonu
                </label>
                <input
                  type="text"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="Örn: +90 532 110 45 67"
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Web Sitesi
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://www.anadolutech.com.tr"
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Tax and Address */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
              3. Vergi & Fatura Adresi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Vergi Dairesi *
                </label>
                <input
                  type="text"
                  value={taxOffice}
                  onChange={e => setTaxOffice(e.target.value)}
                  placeholder="Örn: Kozyatağı V.D."
                  className={`w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.taxOffice ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.taxOffice && <p className="text-[10px] text-rose-500 mt-0.5">{errors.taxOffice}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Vergi No (VKN / TC No) *
                </label>
                <input
                  type="text"
                  value={taxNumber}
                  maxLength={11}
                  onChange={e => setTaxNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 Haneli VKN"
                  className={`w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-md font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.taxNumber ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.taxNumber && <p className="text-[10px] text-rose-500 mt-0.5">{errors.taxNumber}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  İl (Şehir) *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="İstanbul"
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  İlçe
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="Ataşehir"
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Açık Fatura & Sevk Adresi
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Mahalle, cadde, sokak, bina no, kat/daire bilgileri..."
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Account & Management */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
              4. Müşteri Temsilcisi & Finansal Tanımlar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Atanan Temsilci (Güntek Bilişim)
                </label>
                <select
                  value={accountManager}
                  onChange={e => setAccountManager(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Emre Güneş (Güntek Bilişim)">Emre Güneş (Kıdemli Satış)</option>
                  <option value="Zeynep Aksoy (Güntek Bilişim)">Zeynep Aksoy (Kurumsal Hesap Yöneticisi)</option>
                  <option value="Hakan Şahin (Güntek Bilişim)">Hakan Şahin (Çözüm Mimarı)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Kredi Limiti (TL)
                </label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={e => setCreditLimit(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Mevcut Cari Bakiye (TL)
                </label>
                <input
                  type="number"
                  value={balance}
                  onChange={e => setBalance(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Müşteri Notları & IT Altyapı Özeti
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Mevcut sunucu/ağ yapısı, SLA sözleşme detayları, IT tercihleri..."
                  className="w-full px-3 py-1.5 bg-[#131518] border border-white/15 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#22252a] border border-white/10 hover:bg-[#2c3038] rounded-md transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{customerToEdit ? 'Değişiklikleri Kaydet' : 'Müşteriyi Sisteme Ekle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
