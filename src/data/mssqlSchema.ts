import { Customer, Deal, Quote, SupportTicket, CustomerActivity } from '../types/crm';

/**
 * Güntek Bilişim OzCRM - Microsoft SQL Server (MSSQL / T-SQL) Schema & Seed Generator
 * SQL Server 2019 / 2022 / Azure SQL Database uyumlu eksiksiz T-SQL scripti
 */
export const generateMssqlScript = (
  customers: Customer[],
  deals: Deal[],
  quotes: Quote[],
  tickets: SupportTicket[],
  activities: CustomerActivity[]
): string => {
  const timestamp = new Date().toISOString();

  let sql = `-- ============================================================================
-- GÜNTEK BİLİŞİM - OzCRM KURUMSAL MÜŞTERİ YÖNETİMİ VERİTABANI
-- Hedef RDBMS: Microsoft SQL Server (MSSQL 2019 / 2022 / Azure SQL)
-- Oluşturulma Tarihi: ${timestamp}
-- Karakter Kümesi: Turkish_CI_AS (Türkçe duyarlı)
-- ============================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'OzCrmDb')
BEGIN
    CREATE DATABASE [OzCrmDb] COLLATE Turkish_CI_AS;
END
GO

USE [OzCrmDb];
GO

-- 1. TABLO: Customers (Kurumsal Müşteriler & Cari Kartlar)
IF OBJECT_ID(N'dbo.Customers', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Customers (
        Id NVARCHAR(64) NOT NULL PRIMARY KEY,
        Code NVARCHAR(32) NOT NULL UNIQUE,
        CompanyName NVARCHAR(200) NOT NULL,
        TradeName NVARCHAR(200) NULL,
        ContactPerson NVARCHAR(100) NOT NULL,
        ContactTitle NVARCHAR(100) NULL,
        Email NVARCHAR(128) NOT NULL,
        Phone NVARCHAR(32) NOT NULL,
        TaxNumber NVARCHAR(20) NOT NULL,
        TaxOffice NVARCHAR(100) NOT NULL,
        City NVARCHAR(64) NOT NULL,
        District NVARCHAR(64) NULL,
        Address NVARCHAR(500) NULL,
        Industry NVARCHAR(64) NOT NULL,
        Status NVARCHAR(32) NOT NULL DEFAULT 'Aktif',
        Category NVARCHAR(32) NOT NULL DEFAULT 'KOBİ',
        AccountManager NVARCHAR(100) NOT NULL,
        CreditLimit DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        Balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        Notes NVARCHAR(MAX) NULL
    );

    CREATE NONCLUSTERED INDEX IX_Customers_TaxNumber ON dbo.Customers(TaxNumber);
    CREATE NONCLUSTERED INDEX IX_Customers_CompanyName ON dbo.Customers(CompanyName);
    CREATE NONCLUSTERED INDEX IX_Customers_City ON dbo.Customers(City);
END
GO

-- 2. TABLO: Deals (Satış Fırsatları & Pipeline)
IF OBJECT_ID(N'dbo.Deals', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Deals (
        Id NVARCHAR(64) NOT NULL PRIMARY KEY,
        CustomerId NVARCHAR(64) NOT NULL,
        CustomerName NVARCHAR(200) NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Value DECIMAL(18, 2) NOT NULL,
        Currency NVARCHAR(10) NOT NULL DEFAULT 'TRY',
        Stage NVARCHAR(32) NOT NULL,
        Probability INT NOT NULL DEFAULT 50,
        ExpectedCloseDate DATE NOT NULL,
        AssignedTo NVARCHAR(100) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        Description NVARCHAR(MAX) NULL,
        CONSTRAINT FK_Deals_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(Id) ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX IX_Deals_Stage ON dbo.Deals(Stage);
    CREATE NONCLUSTERED INDEX IX_Deals_CustomerId ON dbo.Deals(CustomerId);
END
GO

-- 3. TABLO: Quotes (Kurumsal Fiyat Teklifleri)
IF OBJECT_ID(N'dbo.Quotes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Quotes (
        Id NVARCHAR(64) NOT NULL PRIMARY KEY,
        QuoteNumber NVARCHAR(64) NOT NULL UNIQUE,
        CustomerId NVARCHAR(64) NOT NULL,
        CustomerName NVARCHAR(200) NOT NULL,
        ContactPerson NVARCHAR(100) NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Currency NVARCHAR(10) NOT NULL DEFAULT 'TRY',
        Subtotal DECIMAL(18, 2) NOT NULL,
        VatTotal DECIMAL(18, 2) NOT NULL,
        DiscountTotal DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
        GrandTotal DECIMAL(18, 2) NOT NULL,
        IssueDate DATE NOT NULL,
        ValidUntil DATE NOT NULL,
        Status NVARCHAR(32) NOT NULL DEFAULT 'Gönderildi',
        PreparedBy NVARCHAR(100) NOT NULL,
        Notes NVARCHAR(MAX) NULL,
        Terms NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Quotes_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(Id) ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX IX_Quotes_CustomerId ON dbo.Quotes(CustomerId);
    CREATE NONCLUSTERED INDEX IX_Quotes_Status ON dbo.Quotes(Status);
END
GO

-- 4. TABLO: QuoteItems (Teklif Kalemleri)
IF OBJECT_ID(N'dbo.QuoteItems', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.QuoteItems (
        Id NVARCHAR(64) NOT NULL PRIMARY KEY,
        QuoteId NVARCHAR(64) NOT NULL,
        Description NVARCHAR(300) NOT NULL,
        Unit NVARCHAR(32) NOT NULL DEFAULT 'Adet',
        Quantity INT NOT NULL DEFAULT 1,
        UnitPrice DECIMAL(18, 2) NOT NULL,
        VatRate INT NOT NULL DEFAULT 20,
        Total DECIMAL(18, 2) NOT NULL,
        CONSTRAINT FK_QuoteItems_Quotes FOREIGN KEY (QuoteId) REFERENCES dbo.Quotes(Id) ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX IX_QuoteItems_QuoteId ON dbo.QuoteItems(QuoteId);
END
GO

-- 5. TABLO: SupportTickets (SLA Destek Masası Biletleri)
IF OBJECT_ID(N'dbo.SupportTickets', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.SupportTickets (
        Id NVARCHAR(64) NOT NULL PRIMARY KEY,
        TicketNumber NVARCHAR(64) NOT NULL UNIQUE,
        CustomerId NVARCHAR(64) NOT NULL,
        CustomerName NVARCHAR(200) NOT NULL,
        ContactPerson NVARCHAR(100) NOT NULL,
        Subject NVARCHAR(200) NOT NULL,
        Category NVARCHAR(64) NOT NULL,
        Priority NVARCHAR(32) NOT NULL DEFAULT 'Orta',
        Status NVARCHAR(32) NOT NULL DEFAULT 'Açık',
        AssignedEngineer NVARCHAR(100) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        DueDate DATETIME2 NOT NULL,
        ResolvedAt DATETIME2 NULL,
        Description NVARCHAR(MAX) NOT NULL,
        ResolutionNotes NVARCHAR(MAX) NULL,
        CONSTRAINT FK_Tickets_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(Id) ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX IX_Tickets_CustomerId ON dbo.SupportTickets(CustomerId);
    CREATE NONCLUSTERED INDEX IX_Tickets_Status ON dbo.SupportTickets(Status);
    CREATE NONCLUSTERED INDEX IX_Tickets_Priority ON dbo.SupportTickets(Priority);
END
GO

-- 6. TABLO: Activities (Müşteri Temas ve Görüşme Logları)
IF OBJECT_ID(N'dbo.Activities', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Activities (
        Id NVARCHAR(64) NOT NULL PRIMARY KEY,
        CustomerId NVARCHAR(64) NOT NULL,
        CustomerName NVARCHAR(200) NOT NULL,
        Type NVARCHAR(32) NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        Date DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        PerformedBy NVARCHAR(100) NOT NULL,
        CONSTRAINT FK_Activities_Customers FOREIGN KEY (CustomerId) REFERENCES dbo.Customers(Id) ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX IX_Activities_CustomerId ON dbo.Activities(CustomerId);
END
GO

-- ============================================================================
-- SAKLI YORDAMLAR (STORED PROCEDURES)
-- ============================================================================
IF OBJECT_ID(N'dbo.sp_GetCustomer360Summary', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetCustomer360Summary;
GO

CREATE PROCEDURE dbo.sp_GetCustomer360Summary
    @CustomerId NVARCHAR(64)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Müşteri bilgisi
    SELECT * FROM dbo.Customers WHERE Id = @CustomerId;
    
    -- Aktif fırsatlar toplamı
    SELECT 
        COUNT(Id) AS ActiveDealCount,
        ISNULL(SUM(Value), 0) AS TotalPipelineValue
    FROM dbo.Deals 
    WHERE CustomerId = @CustomerId AND Stage NOT IN ('Kazanıldı', 'Kaybedildi');
    
    -- Bekleyen destek talepleri
    SELECT 
        COUNT(Id) AS OpenTicketCount
    FROM dbo.SupportTickets 
    WHERE CustomerId = @CustomerId AND Status IN ('Açık', 'İşlemde', 'Beklemede');
END;
GO

-- ============================================================================
-- VERİ EKLEME (INSERT DATA)
-- ============================================================================
PRINT 'OzCRM Güncel Verileri MSSQL Tablolarına Aktarılıyor...';
`;

  // Customers
  if (customers.length > 0) {
    sql += `\n-- Müşteriler (${customers.length} kayıt)\n`;
    for (const c of customers) {
      const escape = (str?: string) => (str ? str.replace(/'/g, "''") : '');
      sql += `IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE Id = '${c.id}')\n`;
      sql += `INSERT INTO dbo.Customers (Id, Code, CompanyName, TradeName, ContactPerson, ContactTitle, Email, Phone, TaxNumber, TaxOffice, City, District, Address, Industry, Status, Category, AccountManager, CreditLimit, Balance, Notes)\n`;
      sql += `VALUES ('${c.id}', '${c.code}', N'${escape(c.companyName)}', N'${escape(c.tradeName)}', N'${escape(c.contactPerson)}', N'${escape(c.contactTitle)}', '${escape(c.email)}', '${escape(c.phone)}', '${escape(c.taxNumber)}', N'${escape(c.taxOffice)}', N'${escape(c.city)}', N'${escape(c.district)}', N'${escape(c.address)}', N'${escape(c.industry)}', N'${c.status}', N'${c.category}', N'${escape(c.accountManager)}', ${c.creditLimit || 0}, ${c.balance || 0}, N'${escape(c.notes)}');\n`;
    }
  }

  // Deals
  if (deals.length > 0) {
    sql += `\n-- Satış Fırsatları (${deals.length} kayıt)\n`;
    for (const d of deals) {
      const escape = (str?: string) => (str ? str.replace(/'/g, "''") : '');
      sql += `IF NOT EXISTS (SELECT 1 FROM dbo.Deals WHERE Id = '${d.id}')\n`;
      sql += `INSERT INTO dbo.Deals (Id, CustomerId, CustomerName, Title, Value, Currency, Stage, Probability, ExpectedCloseDate, AssignedTo, Description)\n`;
      sql += `VALUES ('${d.id}', '${d.customerId}', N'${escape(d.customerName)}', N'${escape(d.title)}', ${d.value}, '${d.currency}', N'${d.stage}', ${d.probability}, '${d.expectedCloseDate}', N'${escape(d.assignedTo)}', N'${escape(d.description)}');\n`;
    }
  }

  // Quotes
  if (quotes.length > 0) {
    sql += `\n-- Teklifler (${quotes.length} kayıt)\n`;
    for (const q of quotes) {
      const escape = (str?: string) => (str ? str.replace(/'/g, "''") : '');
      sql += `IF NOT EXISTS (SELECT 1 FROM dbo.Quotes WHERE Id = '${q.id}')\n`;
      sql += `INSERT INTO dbo.Quotes (Id, QuoteNumber, CustomerId, CustomerName, ContactPerson, Title, Currency, Subtotal, VatTotal, DiscountTotal, GrandTotal, IssueDate, ValidUntil, Status, PreparedBy, Notes, Terms)\n`;
      sql += `VALUES ('${q.id}', '${q.quoteNumber}', '${q.customerId}', N'${escape(q.customerName)}', N'${escape(q.contactPerson)}', N'${escape(q.title)}', '${q.currency}', ${q.subtotal}, ${q.vatTotal}, ${q.discountTotal}, ${q.grandTotal}, '${q.issueDate}', '${q.validUntil}', N'${q.status}', N'${escape(q.preparedBy)}', N'${escape(q.notes)}', N'${escape(q.terms)}');\n`;

      if (q.items && q.items.length > 0) {
        for (const itm of q.items) {
          sql += `IF NOT EXISTS (SELECT 1 FROM dbo.QuoteItems WHERE Id = '${itm.id}')\n`;
          sql += `INSERT INTO dbo.QuoteItems (Id, QuoteId, Description, Unit, Quantity, UnitPrice, VatRate, Total)\n`;
          sql += `VALUES ('${itm.id}', '${q.id}', N'${escape(itm.description)}', N'${escape(itm.unit)}', ${itm.quantity}, ${itm.unitPrice}, ${itm.vatRate}, ${itm.total});\n`;
        }
      }
    }
  }

  // Support Tickets
  if (tickets.length > 0) {
    sql += `\n-- SLA Destek Biletleri (${tickets.length} kayıt)\n`;
    for (const t of tickets) {
      const escape = (str?: string) => (str ? str.replace(/'/g, "''") : '');
      sql += `IF NOT EXISTS (SELECT 1 FROM dbo.SupportTickets WHERE Id = '${t.id}')\n`;
      sql += `INSERT INTO dbo.SupportTickets (Id, TicketNumber, CustomerId, CustomerName, ContactPerson, Subject, Category, Priority, Status, AssignedEngineer, DueDate, Description, ResolutionNotes)\n`;
      sql += `VALUES ('${t.id}', '${t.ticketNumber}', '${t.customerId}', N'${escape(t.customerName)}', N'${escape(t.contactPerson)}', N'${escape(t.subject)}', N'${escape(t.category)}', N'${t.priority}', N'${t.status}', N'${escape(t.assignedEngineer)}', '${t.dueDate}', N'${escape(t.description)}', N'${escape(t.resolutionNotes)}');\n`;
    }
  }

  sql += `\nPRINT 'T-SQL Kurulumu ve Veri Yüklemesi Başarıyla Tamamlandı.';\nGO\n`;

  return sql;
};
