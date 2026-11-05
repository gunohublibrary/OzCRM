import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Customer, Deal, Quote, SupportTicket, CustomerActivity, DealStage, QuoteStatus, TicketStatus } from '../types/crm';
import { INITIAL_CUSTOMERS, INITIAL_DEALS, INITIAL_QUOTES, INITIAL_TICKETS, INITIAL_ACTIVITIES } from '../data/seedData';
import { generateMssqlScript } from '../data/mssqlSchema';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';

interface CrmContextType {
  customers: Customer[];
  deals: Deal[];
  quotes: Quote[];
  tickets: SupportTicket[];
  activities: CustomerActivity[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  syncStatus: 'connected' | 'syncing' | 'offline';
  // Customer CRUD
  addCustomer: (data: Omit<Customer, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  // Deal CRUD
  addDeal: (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Deal;
  updateDeal: (id: string, data: Partial<Deal>) => void;
  updateDealStage: (id: string, stage: DealStage) => void;
  deleteDeal: (id: string) => void;
  // Quote CRUD
  addQuote: (data: Omit<Quote, 'id' | 'quoteNumber'>) => Quote;
  updateQuoteStatus: (id: string, status: QuoteStatus) => void;
  deleteQuote: (id: string) => void;
  // Ticket CRUD
  addTicket: (data: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>) => SupportTicket;
  updateTicketStatus: (id: string, status: TicketStatus, notes?: string) => void;
  deleteTicket: (id: string) => void;
  // Activity
  addActivity: (data: Omit<CustomerActivity, 'id'>) => void;
  // Backup & Import
  resetToDefaults: () => void;
  exportAllData: () => string;
  importAllData: (jsonStr: string) => boolean;
  exportCustomersCsv: () => void;
  downloadMssqlScript: () => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CUSTOMERS: 'ozcrm_customers_v1',
  DEALS: 'ozcrm_deals_v1',
  QUOTES: 'ozcrm_quotes_v1',
  TICKETS: 'ozcrm_tickets_v1',
  ACTIVITIES: 'ozcrm_activities_v1',
  THEME: 'ozcrm_theme_v1',
};

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEALS);
      return saved ? JSON.parse(saved) : INITIAL_DEALS;
    } catch {
      return INITIAL_DEALS;
    }
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUOTES);
      return saved ? JSON.parse(saved) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [activities, setActivities] = useState<CustomerActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // Theme synchronization
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // LocalStorage persistence for quick offline caching
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [customers, deals, quotes, tickets, activities]);

  // Firestore Real-time synchronization
  useEffect(() => {
    let unsubCustomers: (() => void) | undefined;
    let unsubDeals: (() => void) | undefined;
    let unsubQuotes: (() => void) | undefined;
    let unsubTickets: (() => void) | undefined;
    let unsubActivities: (() => void) | undefined;

    const initFirestoreSync = async () => {
      try {
        setSyncStatus('syncing');

        // Check if customers collection is empty and seed if necessary
        const customersCol = collection(db, 'customers');
        const custSnap = await getDocs(customersCol);
        if (custSnap.empty) {
          const batch = writeBatch(db);
          for (const c of INITIAL_CUSTOMERS) {
            batch.set(doc(db, 'customers', c.id), c);
          }
          for (const d of INITIAL_DEALS) {
            batch.set(doc(db, 'deals', d.id), d);
          }
          for (const q of INITIAL_QUOTES) {
            batch.set(doc(db, 'quotes', q.id), q);
          }
          for (const t of INITIAL_TICKETS) {
            batch.set(doc(db, 'tickets', t.id), t);
          }
          for (const a of INITIAL_ACTIVITIES) {
            batch.set(doc(db, 'activities', a.id), a);
          }
          await batch.commit();
        }

        // Setup real-time listeners
        unsubCustomers = onSnapshot(collection(db, 'customers'), snapshot => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(d => d.data() as Customer);
            setCustomers(list);
          }
          setSyncStatus('connected');
        }, err => {
          console.warn('Firestore customers listener note:', err);
          setSyncStatus('connected');
        });

        unsubDeals = onSnapshot(collection(db, 'deals'), snapshot => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(d => d.data() as Deal);
            setDeals(list);
          }
        }, () => {});

        unsubQuotes = onSnapshot(collection(db, 'quotes'), snapshot => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(d => d.data() as Quote);
            setQuotes(list);
          }
        }, () => {});

        unsubTickets = onSnapshot(collection(db, 'tickets'), snapshot => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(d => d.data() as SupportTicket);
            setTickets(list);
          }
        }, () => {});

        unsubActivities = onSnapshot(collection(db, 'activities'), snapshot => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(d => d.data() as CustomerActivity);
            setActivities(list);
          }
        }, () => {});

        setSyncStatus('connected');
      } catch (err) {
        console.warn('Firestore initial sync note:', err);
        setSyncStatus('connected');
      }
    };

    initFirestoreSync();

    return () => {
      unsubCustomers?.();
      unsubDeals?.();
      unsubQuotes?.();
      unsubTickets?.();
      unsubActivities?.();
    };
  }, []);

  // Customer Operations
  const addCustomer = (data: Omit<Customer, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Customer => {
    const id = `cust-${Date.now()}`;
    const nextNum = customers.length + 1;
    const code = `GNT-M${String(nextNum).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      ...data,
      id,
      code,
      createdAt: now,
      updatedAt: now,
    };
    setCustomers(prev => [newCustomer, ...prev]);

    // Save to Firestore
    try {
      setDoc(doc(db, 'customers', id), newCustomer).catch(() => {});
    } catch {
      // ignore
    }

    // Automatically record an activity
    const newActivity: CustomerActivity = {
      id: `act-${Date.now()}`,
      customerId: id,
      customerName: newCustomer.companyName,
      type: 'Not',
      title: 'Müşteri Kaydı Oluşturuldu',
      description: `${newCustomer.companyName} sisteme eklendi. Yetkili: ${newCustomer.contactPerson}`,
      date: now,
      performedBy: 'Sistem Yöneticisi',
    };
    setActivities(prev => [newActivity, ...prev]);

    try {
      setDoc(doc(db, 'activities', newActivity.id), newActivity).catch(() => {});
    } catch {
      // ignore
    }

    return newCustomer;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    const now = new Date().toISOString();
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, ...data, updatedAt: now };
          try {
            setDoc(doc(db, 'customers', id), updated).catch(() => {});
          } catch {
            // ignore
          }
          return updated;
        }
        return c;
      })
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    try {
      deleteDoc(doc(db, 'customers', id)).catch(() => {});
    } catch {
      // ignore
    }
  };

  // Deal Operations
  const addDeal = (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Deal => {
    const id = `deal-${Date.now()}`;
    const now = new Date().toISOString();
    const newDeal: Deal = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setDeals(prev => [newDeal, ...prev]);

    try {
      setDoc(doc(db, 'deals', id), newDeal).catch(() => {});
    } catch {
      // ignore
    }

    // Record activity
    const newActivity: CustomerActivity = {
      id: `act-${Date.now()}`,
      customerId: data.customerId,
      customerName: data.customerName,
      type: 'Not',
      title: 'Yeni Satış Fırsatı Oluşturuldu',
      description: `Fırsat: ${data.title} (${data.value.toLocaleString('tr-TR')} ${data.currency})`,
      date: now,
      performedBy: data.assignedTo || 'Satış Ekibi',
    };
    setActivities(prev => [newActivity, ...prev]);

    try {
      setDoc(doc(db, 'activities', newActivity.id), newActivity).catch(() => {});
    } catch {
      // ignore
    }

    return newDeal;
  };

  const updateDeal = (id: string, data: Partial<Deal>) => {
    const now = new Date().toISOString();
    setDeals(prev =>
      prev.map(d => {
        if (d.id === id) {
          const updated = { ...d, ...data, updatedAt: now };
          try {
            setDoc(doc(db, 'deals', id), updated).catch(() => {});
          } catch {
            // ignore
          }
          return updated;
        }
        return d;
      })
    );
  };

  const updateDealStage = (id: string, stage: DealStage) => {
    const now = new Date().toISOString();
    let probability = 50;
    if (stage === 'İlk Temas') probability = 20;
    if (stage === 'İhtiyaç Analizi') probability = 40;
    if (stage === 'Teklif Sunuldu') probability = 60;
    if (stage === 'Müzakere') probability = 80;
    if (stage === 'Kazanıldı') probability = 100;
    if (stage === 'Kaybedildi') probability = 0;

    setDeals(prev => {
      const deal = prev.find(d => d.id === id);
      if (deal) {
        const act: CustomerActivity = {
          id: `act-${Date.now()}`,
          customerId: deal.customerId,
          customerName: deal.customerName,
          type: 'Not',
          title: `Fırsat Aşaması Güncellendi: ${stage}`,
          description: `"${deal.title}" fırsatının yeni aşaması: ${stage} (%${probability} başarı olasılığı)`,
          date: now,
          performedBy: deal.assignedTo,
        };
        setActivities(a => [act, ...a]);
        try {
          setDoc(doc(db, 'activities', act.id), act).catch(() => {});
        } catch {
          // ignore
        }
      }
      return prev.map(d => {
        if (d.id === id) {
          const updated = { ...d, stage, probability, updatedAt: now };
          try {
            setDoc(doc(db, 'deals', id), updated).catch(() => {});
          } catch {
            // ignore
          }
          return updated;
        }
        return d;
      });
    });
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
    try {
      deleteDoc(doc(db, 'deals', id)).catch(() => {});
    } catch {
      // ignore
    }
  };

  // Quote Operations
  const addQuote = (data: Omit<Quote, 'id' | 'quoteNumber'>): Quote => {
    const id = `quote-${Date.now()}`;
    const nextNum = quotes.length + 90;
    const quoteNumber = `GNT-TEK-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`;
    const newQuote: Quote = {
      ...data,
      id,
      quoteNumber,
    };
    setQuotes(prev => [newQuote, ...prev]);

    try {
      setDoc(doc(db, 'quotes', id), newQuote).catch(() => {});
    } catch {
      // ignore
    }

    const now = new Date().toISOString();
    const act: CustomerActivity = {
      id: `act-${Date.now()}`,
      customerId: data.customerId,
      customerName: data.customerName,
      type: 'Teknik Keşif',
      title: `Teklif Hazırlandı: ${quoteNumber}`,
      description: `"${data.title}" için ${data.grandTotal.toLocaleString('tr-TR')} ${data.currency} tutarında teklif oluşturuldu.`,
      date: now,
      performedBy: data.preparedBy,
    };
    setActivities(a => [act, ...a]);

    try {
      setDoc(doc(db, 'activities', act.id), act).catch(() => {});
    } catch {
      // ignore
    }

    return newQuote;
  };

  const updateQuoteStatus = (id: string, status: QuoteStatus) => {
    setQuotes(prev =>
      prev.map(q => {
        if (q.id === id) {
          const updated = { ...q, status };
          try {
            setDoc(doc(db, 'quotes', id), updated).catch(() => {});
          } catch {
            // ignore
          }
          return updated;
        }
        return q;
      })
    );
  };

  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    try {
      deleteDoc(doc(db, 'quotes', id)).catch(() => {});
    } catch {
      // ignore
    }
  };

  // Ticket Operations
  const addTicket = (data: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt'>): SupportTicket => {
    const id = `tkt-${Date.now()}`;
    const nextNum = tickets.length + 105;
    const ticketNumber = `TKT-${new Date().getFullYear()}-${String(nextNum).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      ...data,
      id,
      ticketNumber,
      createdAt: now,
    };
    setTickets(prev => [newTicket, ...prev]);

    try {
      setDoc(doc(db, 'tickets', id), newTicket).catch(() => {});
    } catch {
      // ignore
    }

    const act: CustomerActivity = {
      id: `act-${Date.now()}`,
      customerId: data.customerId,
      customerName: data.customerName,
      type: 'Not',
      title: `Destek Talebi Açıldı: ${ticketNumber}`,
      description: `${data.subject} (${data.category} - ${data.priority} Öncelik)`,
      date: now,
      performedBy: data.assignedEngineer,
    };
    setActivities(a => [act, ...a]);

    try {
      setDoc(doc(db, 'activities', act.id), act).catch(() => {});
    } catch {
      // ignore
    }

    return newTicket;
  };

  const updateTicketStatus = (id: string, status: TicketStatus, notes?: string) => {
    const now = new Date().toISOString();
    setTickets(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated = {
            ...t,
            status,
            resolutionNotes: notes !== undefined ? notes : t.resolutionNotes,
            resolvedAt: status === 'Çözüldü' || status === 'Kapatıldı' ? (t.resolvedAt || now) : undefined,
          };
          try {
            setDoc(doc(db, 'tickets', id), updated).catch(() => {});
          } catch {
            // ignore
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    try {
      deleteDoc(doc(db, 'tickets', id)).catch(() => {});
    } catch {
      // ignore
    }
  };

  // Activity Operations
  const addActivity = (data: Omit<CustomerActivity, 'id'>) => {
    const newAct: CustomerActivity = {
      ...data,
      id: `act-${Date.now()}`,
    };
    setActivities(prev => [newAct, ...prev]);
    try {
      setDoc(doc(db, 'activities', newAct.id), newAct).catch(() => {});
    } catch {
      // ignore
    }
  };

  // Reset to Defaults
  const resetToDefaults = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setDeals(INITIAL_DEALS);
    setQuotes(INITIAL_QUOTES);
    setTickets(INITIAL_TICKETS);
    setActivities(INITIAL_ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.DEALS);
    localStorage.removeItem(STORAGE_KEYS.QUOTES);
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);

    // Overwrite in Firestore
    try {
      const batch = writeBatch(db);
      for (const c of INITIAL_CUSTOMERS) batch.set(doc(db, 'customers', c.id), c);
      for (const d of INITIAL_DEALS) batch.set(doc(db, 'deals', d.id), d);
      for (const q of INITIAL_QUOTES) batch.set(doc(db, 'quotes', q.id), q);
      for (const t of INITIAL_TICKETS) batch.set(doc(db, 'tickets', t.id), t);
      for (const a of INITIAL_ACTIVITIES) batch.set(doc(db, 'activities', a.id), a);
      batch.commit().catch(() => {});
    } catch {
      // ignore
    }
  };

  // Backup & Restore
  const exportAllData = (): string => {
    const backupObj = {
      exportedAt: new Date().toISOString(),
      company: 'Güntek Bilişim',
      system: 'OzCRM',
      version: 'v4.2.0-mssql-ready',
      databaseEngine: 'Microsoft SQL Server / Cloud Firestore Synced',
      data: {
        customers,
        deals,
        quotes,
        tickets,
        activities,
      },
    };
    return JSON.stringify(backupObj, null, 2);
  };

  const importAllData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.data && Array.isArray(parsed.data.customers)) {
        setCustomers(parsed.data.customers);
        if (Array.isArray(parsed.data.deals)) setDeals(parsed.data.deals);
        if (Array.isArray(parsed.data.quotes)) setQuotes(parsed.data.quotes);
        if (Array.isArray(parsed.data.tickets)) setTickets(parsed.data.tickets);
        if (Array.isArray(parsed.data.activities)) setActivities(parsed.data.activities);

        // Upload imported data to Firestore in background
        try {
          const batch = writeBatch(db);
          for (const c of parsed.data.customers) batch.set(doc(db, 'customers', c.id), c);
          if (Array.isArray(parsed.data.deals)) {
            for (const d of parsed.data.deals) batch.set(doc(db, 'deals', d.id), d);
          }
          if (Array.isArray(parsed.data.quotes)) {
            for (const q of parsed.data.quotes) batch.set(doc(db, 'quotes', q.id), q);
          }
          if (Array.isArray(parsed.data.tickets)) {
            for (const t of parsed.data.tickets) batch.set(doc(db, 'tickets', t.id), t);
          }
          if (Array.isArray(parsed.data.activities)) {
            for (const a of parsed.data.activities) batch.set(doc(db, 'activities', a.id), a);
          }
          batch.commit().catch(() => {});
        } catch {
          // ignore
        }

        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const exportCustomersCsv = () => {
    const headers = [
      'Müşteri Kodu',
      'Firma Adı',
      'Yetkili Kişi',
      'Unvan',
      'Telefon',
      'E-posta',
      'Şehir',
      'İlçe',
      'Sektör',
      'Durum',
      'Kategori',
      'Temsilci',
      'Vergi No',
      'Vergi Dairesi',
      'Bakiye (TL)',
    ];

    const rows = customers.map(c => [
      `"${c.code}"`,
      `"${c.companyName.replace(/"/g, '""')}"`,
      `"${c.contactPerson.replace(/"/g, '""')}"`,
      `"${c.contactTitle.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.city}"`,
      `"${c.district}"`,
      `"${c.industry}"`,
      `"${c.status}"`,
      `"${c.category}"`,
      `"${c.accountManager}"`,
      `"${c.taxNumber}"`,
      `"${c.taxOffice}"`,
      `"${c.balance}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Guntek_OzCRM_Musteriler_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate and download executable Microsoft SQL Server (MSSQL / T-SQL) Script
  const downloadMssqlScript = () => {
    const sqlContent = generateMssqlScript(customers, deals, quotes, tickets, activities);
    const blob = new Blob([sqlContent], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `OzCRM_MSSQL_Database_Setup_${new Date().toISOString().slice(0, 10)}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const value = useMemo(
    () => ({
      customers,
      deals,
      quotes,
      tickets,
      activities,
      theme,
      toggleTheme,
      syncStatus,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addDeal,
      updateDeal,
      updateDealStage,
      deleteDeal,
      addQuote,
      updateQuoteStatus,
      deleteQuote,
      addTicket,
      updateTicketStatus,
      deleteTicket,
      addActivity,
      resetToDefaults,
      exportAllData,
      importAllData,
      exportCustomersCsv,
      downloadMssqlScript,
    }),
    [customers, deals, quotes, tickets, activities, theme, syncStatus]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
