export type CustomerStatus = 'Aktif' | 'Potansiyel' | 'Pasif';
export type CustomerCategory = 'VIP Kurumsal' | 'KOBİ' | 'Kamu / Kurum' | 'Girişim';
export type IndustryType =
  | 'Bilişim & Yazılım'
  | 'Telekomünikasyon'
  | 'Finans & Bankacılık'
  | 'Sağlık & İlaç'
  | 'Üretim & Sanayi'
  | 'Lojistik & Taşımacılık'
  | 'Perakende & E-Ticaret'
  | 'Enerji & Altyapı'
  | 'Eğitim';

export interface Customer {
  id: string;
  code: string; // e.g., GNT-M001
  companyName: string;
  tradeName?: string;
  contactPerson: string;
  contactTitle: string;
  email: string;
  phone: string;
  mobile?: string;
  website?: string;
  taxNumber: string;
  taxOffice: string;
  city: string;
  district: string;
  address: string;
  industry: IndustryType;
  status: CustomerStatus;
  category: CustomerCategory;
  accountManager: string; // Atanan Müşteri Temsilcisi
  creditLimit: number; // ₺ Kredi Limiti
  balance: number; // ₺ Güncel Bakiye
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type DealStage =
  | 'İlk Temas'
  | 'İhtiyaç Analizi'
  | 'Teklif Sunuldu'
  | 'Müzakere'
  | 'Kazanıldı'
  | 'Kaybedildi';

export interface Deal {
  id: string;
  customerId: string;
  customerName: string;
  title: string; // e.g. "Veri Merkezi Sanallaştırma & Dell PowerEdge Sunucu Çözümü"
  value: number; // Tutar
  currency: 'TRY' | 'USD' | 'EUR';
  stage: DealStage;
  probability: number; // 0 - 100
  expectedCloseDate: string;
  assignedTo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  unit: string; // Adet, Ay, Yıl, Adam/Gün
  quantity: number;
  unitPrice: number;
  vatRate: number; // %20
  total: number;
}

export type QuoteStatus = 'Taslak' | 'Gönderildi' | 'Onaylandı' | 'Revizyon' | 'İptal';

export interface Quote {
  id: string;
  quoteNumber: string; // e.g., GNT-TEK-2026-042
  customerId: string;
  customerName: string;
  contactPerson: string;
  title: string;
  currency: 'TRY' | 'USD' | 'EUR';
  items: QuoteItem[];
  subtotal: number;
  vatTotal: number;
  discountTotal: number;
  grandTotal: number;
  issueDate: string;
  validUntil: string;
  status: QuoteStatus;
  preparedBy: string;
  notes: string;
  terms: string;
}

export type TicketPriority = 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
export type TicketStatus = 'Açık' | 'İşlemde' | 'Beklemede' | 'Çözüldü' | 'Kapatıldı';
export type TicketCategory =
  | 'Sunucu & Altyapı'
  | 'Ağ Güvenliği & Firewall'
  | 'Yazılım & ERP Entegrasyonu'
  | 'Bulut & Sanallaştırma'
  | 'Yedekleme & Felaket Kurtarma'
  | 'Kullanıcı Destek & Lisans';

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g., TKT-8901
  customerId: string;
  customerName: string;
  contactPerson: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedEngineer: string;
  createdAt: string;
  dueDate: string;
  resolvedAt?: string;
  description: string;
  resolutionNotes?: string;
}

export type ActivityType = 'Toplantı' | 'Telefon' | 'E-posta' | 'Saha Ziyareti' | 'Teknik Keşif' | 'Not';

export interface CustomerActivity {
  id: string;
  customerId: string;
  customerName: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  performedBy: string;
}
