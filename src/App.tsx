/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import { CustomerFormModal } from './components/CustomerFormModal';
import { DealsPipelineView } from './components/DealsPipelineView';
import { DealFormModal } from './components/DealFormModal';
import { QuotesView } from './components/QuotesView';
import { QuoteDetailModal } from './components/QuoteDetailModal';
import { QuoteFormModal } from './components/QuoteFormModal';
import { TicketsView } from './components/TicketsView';
import { TicketDetailModal } from './components/TicketDetailModal';
import { TicketFormModal } from './components/TicketFormModal';
import { ActivitiesView } from './components/ActivitiesView';
import { CSharpIntegrationView } from './components/CSharpIntegrationView';
import { SettingsBackupView } from './components/SettingsBackupView';
import { Customer, Deal, Quote, SupportTicket } from './types/crm';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
  Headphones,
  Code2
} from 'lucide-react';

function CrmAppContent() {
  const { customers } = useCrm();

  const [currentTab, setCurrentTab] = useState<string>('customers');

  // Modals state
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<Customer | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);

  // Deal modals
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const [dealInitialCustomer, setDealInitialCustomer] = useState<Customer | null>(null);
  const [isDealFormOpen, setIsDealFormOpen] = useState(false);

  // Quote modals
  const [selectedQuoteForDetail, setSelectedQuoteForDetail] = useState<Quote | null>(null);
  const [quoteInitialCustomer, setQuoteInitialCustomer] = useState<Customer | null>(null);
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  // Ticket modals
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<SupportTicket | null>(null);
  const [ticketInitialCustomer, setTicketInitialCustomer] = useState<Customer | null>(null);
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);

  // Helpers to select customer by id
  const handleSelectCustomerById = (id: string) => {
    const found = customers.find(c => c.id === id);
    if (found) {
      setSelectedCustomerForDetail(found);
    }
  };

  const handleOpenNewCustomer = () => {
    setCustomerToEdit(null);
    setIsCustomerFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsCustomerFormOpen(true);
  };

  const handleCreateDealForCustomer = (customer: Customer) => {
    setDealToEdit(null);
    setDealInitialCustomer(customer);
    setIsDealFormOpen(true);
  };

  const handleCreateQuoteForCustomer = (customer: Customer) => {
    setQuoteInitialCustomer(customer);
    setIsQuoteFormOpen(true);
  };

  const handleCreateTicketForCustomer = (customer: Customer) => {
    setTicketInitialCustomer(customer);
    setIsTicketFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col font-sans transition-colors">
      {/* Top Bar adheres to strict contract */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenNewCustomer={handleOpenNewCustomer}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar currentTab={currentTab} onNavigate={setCurrentTab} />

        {/* Central Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentTab}
              onOpenNewCustomer={handleOpenNewCustomer}
              onSelectCustomer={handleSelectCustomerById}
            />
          )}

          {currentTab === 'customers' && (
            <CustomersView
              onSelectCustomer={handleSelectCustomerById}
              onOpenNewCustomer={handleOpenNewCustomer}
              onEditCustomer={handleEditCustomer}
              onCreateDealForCustomer={handleCreateDealForCustomer}
              onCreateQuoteForCustomer={handleCreateQuoteForCustomer}
            />
          )}

          {currentTab === 'deals' && (
            <DealsPipelineView
              onOpenNewDeal={() => {
                setDealToEdit(null);
                setDealInitialCustomer(null);
                setIsDealFormOpen(true);
              }}
              onEditDeal={deal => {
                setDealToEdit(deal);
                setIsDealFormOpen(true);
              }}
              onSelectCustomer={handleSelectCustomerById}
            />
          )}

          {currentTab === 'quotes' && (
            <QuotesView
              onOpenNewQuote={() => {
                setQuoteInitialCustomer(null);
                setIsQuoteFormOpen(true);
              }}
              onViewQuote={quote => setSelectedQuoteForDetail(quote)}
              onSelectCustomer={handleSelectCustomerById}
            />
          )}

          {currentTab === 'tickets' && (
            <TicketsView
              onOpenNewTicket={() => {
                setTicketInitialCustomer(null);
                setIsTicketFormOpen(true);
              }}
              onViewTicket={ticket => setSelectedTicketForDetail(ticket)}
              onSelectCustomer={handleSelectCustomerById}
            />
          )}

          {currentTab === 'activities' && (
            <ActivitiesView onSelectCustomer={handleSelectCustomerById} />
          )}

          {currentTab === 'csharp-api' && <CSharpIntegrationView />}

          {currentTab === 'settings' && <SettingsBackupView />}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <nav className="lg:hidden sticky bottom-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around p-2 text-[10px]">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1 ${
            currentTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Panel</span>
        </button>
        <button
          onClick={() => setCurrentTab('customers')}
          className={`flex flex-col items-center gap-1 p-1 ${
            currentTab === 'customers' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Müşteriler</span>
        </button>
        <button
          onClick={() => setCurrentTab('deals')}
          className={`flex flex-col items-center gap-1 p-1 ${
            currentTab === 'deals' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Fırsatlar</span>
        </button>
        <button
          onClick={() => setCurrentTab('quotes')}
          className={`flex flex-col items-center gap-1 p-1 ${
            currentTab === 'quotes' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Teklifler</span>
        </button>
        <button
          onClick={() => setCurrentTab('tickets')}
          className={`flex flex-col items-center gap-1 p-1 ${
            currentTab === 'tickets' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Destek</span>
        </button>
        <button
          onClick={() => setCurrentTab('csharp-api')}
          className={`flex flex-col items-center gap-1 p-1 ${
            currentTab === 'csharp-api' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>C# API</span>
        </button>
      </nav>

      {/* Global Modals */}
      {selectedCustomerForDetail && (
        <CustomerDetailModal
          customer={selectedCustomerForDetail}
          onClose={() => setSelectedCustomerForDetail(null)}
          onEdit={c => {
            setSelectedCustomerForDetail(null);
            handleEditCustomer(c);
          }}
          onCreateDeal={c => {
            setSelectedCustomerForDetail(null);
            handleCreateDealForCustomer(c);
          }}
          onCreateQuote={c => {
            setSelectedCustomerForDetail(null);
            handleCreateQuoteForCustomer(c);
          }}
          onCreateTicket={c => {
            setSelectedCustomerForDetail(null);
            handleCreateTicketForCustomer(c);
          }}
          onViewQuote={q => setSelectedQuoteForDetail(q)}
          onViewTicket={t => setSelectedTicketForDetail(t)}
        />
      )}

      {isCustomerFormOpen && (
        <CustomerFormModal
          customerToEdit={customerToEdit}
          onClose={() => setIsCustomerFormOpen(false)}
          onSuccess={saved => {
            setIsCustomerFormOpen(false);
            setSelectedCustomerForDetail(saved);
          }}
        />
      )}

      {isDealFormOpen && (
        <DealFormModal
          dealToEdit={dealToEdit}
          initialCustomer={dealInitialCustomer}
          onClose={() => setIsDealFormOpen(false)}
          onSuccess={() => setIsDealFormOpen(false)}
        />
      )}

      {selectedQuoteForDetail && (
        <QuoteDetailModal
          quote={selectedQuoteForDetail}
          onClose={() => setSelectedQuoteForDetail(null)}
        />
      )}

      {isQuoteFormOpen && (
        <QuoteFormModal
          initialCustomer={quoteInitialCustomer}
          onClose={() => setIsQuoteFormOpen(false)}
          onSuccess={saved => {
            setIsQuoteFormOpen(false);
            setSelectedQuoteForDetail(saved);
          }}
        />
      )}

      {selectedTicketForDetail && (
        <TicketDetailModal
          ticket={selectedTicketForDetail}
          onClose={() => setSelectedTicketForDetail(null)}
        />
      )}

      {isTicketFormOpen && (
        <TicketFormModal
          initialCustomer={ticketInitialCustomer}
          onClose={() => setIsTicketFormOpen(false)}
          onSuccess={saved => {
            setIsTicketFormOpen(false);
            setSelectedTicketForDetail(saved);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CrmProvider>
      <CrmAppContent />
    </CrmProvider>
  );
}
