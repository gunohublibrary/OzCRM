import React, { useState, useMemo } from 'react';
import {
  Code2,
  Copy,
  Check,
  Play,
  Terminal,
  Globe,
  Database,
  Layers,
  FileCode2,
  Server,
  Download,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { GUNTEK_COMPANY_INFO } from '../data/seedData';
import { generateMssqlScript } from '../data/mssqlSchema';

export const CSharpIntegrationView: React.FC = () => {
  const { customers, deals, quotes, tickets, activities, downloadMssqlScript } = useCrm();

  const [activeTab, setActiveTab] = useState<'mssql' | 'endpoints' | 'controller' | 'dto' | 'client'>('mssql');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live test runner state
  const [selectedEndpoint, setSelectedEndpoint] = useState<'get-customers' | 'get-customer-detail' | 'get-deals' | 'get-tickets'>('get-customers');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<number | null>(null);
  const [testTime, setTestTime] = useState<number | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runApiTest = () => {
    const startTime = performance.now();
    let data: any = null;
    let status = 200;

    if (selectedEndpoint === 'get-customers') {
      data = {
        success: true,
        total: customers.length,
        version: '8.0.4-csharp-web-core',
        timestamp: new Date().toISOString(),
        data: customers,
      };
    } else if (selectedEndpoint === 'get-customer-detail') {
      data = {
        success: true,
        version: '8.0.4-csharp-web-core',
        timestamp: new Date().toISOString(),
        data: customers[0] || null,
      };
    } else if (selectedEndpoint === 'get-deals') {
      data = {
        success: true,
        total: deals.length,
        totalPipelineValue: deals.reduce((acc, d) => acc + d.value, 0),
        data: deals,
      };
    } else if (selectedEndpoint === 'get-tickets') {
      data = {
        success: true,
        total: tickets.length,
        data: tickets,
      };
    }

    const elapsed = Math.round(performance.now() - startTime + 14); // simulated fast execution
    setTestResponse(JSON.stringify(data, null, 2));
    setTestStatus(status);
    setTestTime(elapsed);
  };

  // C# Code Snippets
  const csharpControllerCode = `// ============================================================================
// Güntek Bilişim OzCRM - ASP.NET Core Web API Controller
// File: Controllers/CustomersController.cs
// Framework: .NET 8 / C# 12
// ============================================================================

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Guntek.OzCrm.Models;
using Guntek.OzCrm.Services;

namespace Guntek.OzCrm.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(ICustomerService customerService, ILogger<CustomersController> logger)
        {
            _customerService = customerService;
            _logger = logger;
        }

        /// <summary>
        /// Güntek Bilişim kayıtlı kurumsal müşteri listesini filtreli olarak döner.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CustomerDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers(
            [FromQuery] string? status = null,
            [FromQuery] string? industry = null,
            [FromQuery] string? search = null)
        {
            var result = await _customerService.GetCustomersAsync(status, industry, search);
            return Ok(result);
        }

        /// <summary>
        /// Belirtilen ID'ye sahip müşterinin 360 derece kartını döner.
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CustomerDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CustomerDetailDto>> GetById(string id)
        {
            var customer = await _customerService.GetByIdAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = $"Müşteri bulunamadı: {id}" });
            }
            return Ok(customer);
        }

        /// <summary>
        /// OzCRM veritabanına yeni bir müşteri ve cari kart ekler.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CustomerDto>> Create([FromBody] CreateCustomerDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _customerService.CreateCustomerAsync(dto);
            _logger.LogInformation("Yeni müşteri eklendi: {Code} - {Company}", created.Code, created.CompanyName);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        /// <summary>
        /// Müşteri bilgilerini ve cari limitini günceller.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateCustomerDto dto)
        {
            var success = await _customerService.UpdateCustomerAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

        /// <summary>
        /// Müşteri kaydını arşivler veya siler.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _customerService.DeleteCustomerAsync(id);
            return NoContent();
        }
    }
}`;

  const csharpDtoCode = `// ============================================================================
// Güntek Bilişim OzCRM - C# Data Transfer Objects (DTOs)
// File: Dtos/CustomerDtos.cs
// ============================================================================

using System.ComponentModel.DataAnnotations;

namespace Guntek.OzCrm.Models
{
    public record CustomerDto(
        string Id,
        string Code,
        string CompanyName,
        string? TradeName,
        string ContactPerson,
        string ContactTitle,
        string Email,
        string Phone,
        string TaxNumber,
        string TaxOffice,
        string City,
        string District,
        string Industry,
        string Status,
        string Category,
        string AccountManager,
        decimal CreditLimit,
        decimal Balance,
        DateTime CreatedAt
    );

    public class CreateCustomerDto
    {
        [Required(ErrorMessage = "Firma tam ünvanı zorunludur.")]
        [StringLength(200, MinimumLength = 3)]
        public string CompanyName { get; set; } = string.Empty;

        public string? TradeName { get; set; }

        [Required(ErrorMessage = "Yetkili kişi adı zorunludur.")]
        public string ContactPerson { get; set; } = string.Empty;

        public string ContactTitle { get; set; } = "Bilgi İşlem Müdürü";

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, Phone]
        public string Phone { get; set; } = string.Empty;

        [Required, RegularExpression(@"^[0-9]{10,11}$", ErrorMessage = "10 veya 11 haneli geçerli VKN giriniz.")]
        public string TaxNumber { get; set; } = string.Empty;

        [Required]
        public string TaxOffice { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = "İstanbul";

        public string District { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Industry { get; set; } = "Bilişim & Yazılım";
        public string Status { get; set; } = "Aktif";
        public string Category { get; set; } = "KOBİ";
        public string AccountManager { get; set; } = "Emre Güneş (Güntek Bilişim)";
        public decimal CreditLimit { get; set; } = 500000m;
        public decimal Balance { get; set; } = 0m;
        public string? Notes { get; set; }
    }
}`;

  const csharpClientCode = `// ============================================================================
// Güntek Bilişim OzCRM - C# HttpClient Client SDK
// File: Clients/OzCrmApiClient.cs
// Kullanım: Harici bir C# uygulaması veya mikroservisten OzCRM'e bağlanmak için
// ============================================================================

using System.Net.Http.Json;
using Guntek.OzCrm.Models;

namespace Guntek.OzCrm.Client
{
    public class OzCrmApiClient
    {
        private readonly HttpClient _httpClient;

        public OzCrmApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://ozcrm.guntekbilisim.com.tr/api/v1/");
            _httpClient.DefaultRequestHeaders.Add("X-OzCrm-ApiKey", "GUNTEK_SECURE_TOKEN_2026");
        }

        // 1. Tüm müşterileri getir
        public async Task<List<CustomerDto>?> GetCustomersAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<CustomerDto>>("customers");
        }

        // 2. ID ile tek müşteri getir
        public async Task<CustomerDto?> GetCustomerByIdAsync(string id)
        {
            return await _httpClient.GetFromJsonAsync<CustomerDto>($"customers/{id}");
        }

        // 3. Yeni müşteri ekle
        public async Task<CustomerDto?> CreateCustomerAsync(CreateCustomerDto newCustomer)
        {
            var response = await _httpClient.PostAsJsonAsync("customers", newCustomer);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<CustomerDto>();
        }

        // 4. Satış fırsatlarını listele
        public async Task<List<DealDto>?> GetDealsAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<DealDto>>("deals");
        }
    }
}`;

  const mssqlConnectionString = `Server=localhost,1433;Database=OzCrmDb;User Id=sa;Password=Guntek_OzCrm_Secret_2026!;TrustServerCertificate=True;MultipleActiveResultSets=true;`;

  const csharpDbContextCode = `// ============================================================================
// Güntek Bilişim OzCRM - Microsoft SQL Server Entity Framework Core DbContext
// File: Data/OzCrmDbContext.cs
// Paket: Microsoft.EntityFrameworkCore.SqlServer (v8.0+)
// ============================================================================

using Microsoft.EntityFrameworkCore;
using Guntek.OzCrm.Models;

namespace Guntek.OzCrm.Data
{
    public class OzCrmDbContext : DbContext
    {
        public OzCrmDbContext(DbContextOptions<OzCrmDbContext> options) : base(options) { }

        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Deal> Deals => Set<Deal>();
        public DbSet<Quote> Quotes => Set<Quote>();
        public DbSet<QuoteItem> QuoteItems => Set<QuoteItem>();
        public DbSet<SupportTicket> SupportTickets => Set<SupportTicket>();
        public DbSet<CustomerActivity> Activities => Set<CustomerActivity>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Customers Tablosu (MSSQL)
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable("Customers", "dbo");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Code).IsUnique();
                entity.HasIndex(e => e.TaxNumber);
                entity.Property(e => e.CreditLimit).HasPrecision(18, 2);
                entity.Property(e => e.Balance).HasPrecision(18, 2);
            });

            // Deals (Satış Fırsatları)
            modelBuilder.Entity<Deal>(entity =>
            {
                entity.ToTable("Deals", "dbo");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Value).HasPrecision(18, 2);
                entity.HasOne<Customer>()
                      .WithMany()
                      .HasForeignKey(e => e.CustomerId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Quotes (Fiyat Teklifleri & Kalemler)
            modelBuilder.Entity<Quote>(entity =>
            {
                entity.ToTable("Quotes", "dbo");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.QuoteNumber).IsUnique();
                entity.Property(e => e.GrandTotal).HasPrecision(18, 2);
                entity.HasMany(e => e.Items)
                      .WithOne()
                      .HasForeignKey(e => e.QuoteId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}

// ============================================================================
// Program.cs - MSSQL Bağlantı Kaydı (Dependency Injection)
// ============================================================================
// var connectionString = builder.Configuration.GetConnectionString("OzCrmMssqlConnection");
// builder.Services.AddDbContext<OzCrmDbContext>(options =>
//     options.UseSqlServer(connectionString, sqlOptions =>
//     {
//         sqlOptions.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(30), errorNumbersToAdd: null);
//         sqlOptions.MigrationsAssembly("Guntek.OzCrm");
//     }));`;

  const mssqlSqlScript = useMemo(() => {
    return generateMssqlScript(customers, deals, quotes, tickets, activities);
  }, [customers, deals, quotes, tickets, activities]);

  return (
    <div className="space-y-6 text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              C# Web Tabanlı Mimari & MSSQL Server Merkezi
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-950 border border-blue-800/60 text-blue-300 font-bold">
              ASP.NET Core 8.0 & MSSQL 2022
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Güntek Bilişim OzCRM Microsoft SQL Server (T-SQL) veritabanı, EF Core ve ASP.NET Core Web API altyapısı
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadMssqlScript}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>MSSQL (.sql) Scripti İndir</span>
          </button>
        </div>
      </div>

      {/* Tech Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              Microsoft SQL Server (MSSQL)
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              T-SQL şeması, Foreign Key kısıtlamaları, NONCLUSTERED Index'ler ve saklı yordamlar (Stored Procedures) ile kurumsal RDBMS.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-blue-950/80 border border-blue-800/60 text-blue-300 flex items-center justify-center shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              ASP.NET Core & EF Core
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              Microsoft.EntityFrameworkCore.SqlServer entegrasyonu, UseSqlServer() havuzu, Dependency Injection ve asenkron CRUD.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-lg flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              Bulut Firestore & Canlı Senkron
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              Web arayüzü Google Cloud Firestore üzerinden anlık senkronize çalışır; veriler dilediğiniz an tek tıkla MSSQL Server'a aktarılır.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border border-white/10 border-b-0 flex items-center gap-6 text-xs font-medium bg-[#1c1f24]/90 backdrop-blur-md px-4 rounded-t-lg overflow-x-auto">
        <button
          onClick={() => setActiveTab('mssql')}
          className={`py-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'mssql'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>MSSQL Server & T-SQL</span>
        </button>
        <button
          onClick={() => setActiveTab('endpoints')}
          className={`py-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'endpoints'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Canlı API Test Konsolu</span>
        </button>
        <button
          onClick={() => setActiveTab('controller')}
          className={`py-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'controller'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>CustomersController.cs</span>
        </button>
        <button
          onClick={() => setActiveTab('dto')}
          className={`py-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'dto'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>CustomerDtos.cs</span>
        </button>
        <button
          onClick={() => setActiveTab('client')}
          className={`py-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'client'
              ? 'border-blue-500 text-blue-400 font-bold'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>OzCrmApiClient.cs</span>
        </button>
      </div>

      {/* Tab: MSSQL Server & T-SQL */}
      {activeTab === 'mssql' && (
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-b-lg p-5 space-y-6 text-white">
          {/* Header & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#15171a] border border-white/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">
                  Microsoft SQL Server (OzCrmDb) Veritabanı Mimarisi
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                SQL Server Management Studio (SSMS), Azure Data Studio veya C# Entity Framework Core ile hemen kullanıma hazır eksiksiz T-SQL scripti.
              </p>
            </div>
            <button
              onClick={downloadMssqlScript}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>OzCRM_MSSQL_Database_Setup.sql İndir</span>
            </button>
          </div>

          {/* Connection String Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>appsettings.json Connection String (MSSQL)</span>
              </h3>
              <button
                onClick={() => copyToClipboard(mssqlConnectionString, 'conn')}
                className="flex items-center gap-1 text-xs text-blue-400 hover:underline cursor-pointer"
              >
                {copiedKey === 'conn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Kopyala</span>
              </button>
            </div>
            <pre className="p-3 bg-[#0e1013] text-emerald-300 rounded-md text-xs font-mono overflow-x-auto border border-white/10">
              {`"ConnectionStrings": {\n  "OzCrmMssqlConnection": "${mssqlConnectionString}"\n}`}
            </pre>
          </div>

          {/* C# Entity Framework Core DbContext Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">
                C# Entity Framework Core (OzCrmDbContext.cs & UseSqlServer)
              </h3>
              <button
                onClick={() => copyToClipboard(csharpDbContextCode, 'dbcontext')}
                className="flex items-center gap-1 text-xs text-blue-400 hover:underline cursor-pointer"
              >
                {copiedKey === 'dbcontext' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Kopyala</span>
              </button>
            </div>
            <pre className="p-4 bg-[#0e1013] text-slate-100 rounded-lg text-xs font-mono overflow-x-auto max-h-72 border border-white/10 leading-relaxed">
              {csharpDbContextCode}
            </pre>
          </div>

          {/* Live Generated T-SQL Script Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">
                  Üretilen Canlı T-SQL Scripti (Tüm Tablolar, İndeksler & Mevcut Veriler)
                </h3>
                <p className="text-[11px] text-slate-300">
                  {customers.length} müşteri, {deals.length} satış fırsatı, {quotes.length} teklif ve {tickets.length} destek bileti içerir.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(mssqlSqlScript, 'tsql')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/15 rounded-md transition-colors cursor-pointer"
              >
                {copiedKey === 'tsql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>T-SQL Scriptini Kopyala</span>
              </button>
            </div>
            <pre className="p-4 bg-[#0e1013] text-emerald-300/90 rounded-lg text-xs font-mono overflow-x-auto max-h-80 border border-white/10 leading-relaxed">
              {mssqlSqlScript}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 1: Live Interactive API Tester */}
      {activeTab === 'endpoints' && (
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-b-lg p-5 space-y-4 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">
                Web API Uç Noktası Seçimi & Simülasyonu
              </h2>
              <p className="text-xs text-slate-300">
                Gerçek veriler üzerinde C# ASP.NET Core API çağrısını tetikleyin ve JSON yanıtını inceleyin.
              </p>
            </div>

            <button
              onClick={runApiTest}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>İsteği Gönder (Execute)</span>
            </button>
          </div>

          {/* Endpoints Selector Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedEndpoint('get-customers')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedEndpoint === 'get-customers'
                  ? 'border-blue-500 bg-blue-950/50 ring-1 ring-blue-500 text-white'
                  : 'border-white/10 bg-[#15171a] hover:bg-white/5 text-slate-300'
              }`}
            >
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                GET
              </span>
              <p className="font-mono text-xs font-bold text-white mt-1.5 truncate">
                /api/v1/customers
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Tüm müşteri listesi</p>
            </button>

            <button
              onClick={() => setSelectedEndpoint('get-customer-detail')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedEndpoint === 'get-customer-detail'
                  ? 'border-blue-500 bg-blue-950/50 ring-1 ring-blue-500 text-white'
                  : 'border-white/10 bg-[#15171a] hover:bg-white/5 text-slate-300'
              }`}
            >
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                GET
              </span>
              <p className="font-mono text-xs font-bold text-white mt-1.5 truncate">
                /api/v1/customers/{`{id}`}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Müşteri detay & bakiye</p>
            </button>

            <button
              onClick={() => setSelectedEndpoint('get-deals')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedEndpoint === 'get-deals'
                  ? 'border-blue-500 bg-blue-950/50 ring-1 ring-blue-500 text-white'
                  : 'border-white/10 bg-[#15171a] hover:bg-white/5 text-slate-300'
              }`}
            >
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                GET
              </span>
              <p className="font-mono text-xs font-bold text-white mt-1.5 truncate">
                /api/v1/deals
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Satış fırsatları pipeline</p>
            </button>

            <button
              onClick={() => setSelectedEndpoint('get-tickets')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedEndpoint === 'get-tickets'
                  ? 'border-blue-500 bg-blue-950/50 ring-1 ring-blue-500 text-white'
                  : 'border-white/10 bg-[#15171a] hover:bg-white/5 text-slate-300'
              }`}
            >
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                GET
              </span>
              <p className="font-mono text-xs font-bold text-white mt-1.5 truncate">
                /api/v1/tickets
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Destek biletleri SLA</p>
            </button>
          </div>

          {/* Request Info Bar */}
          <div className="p-3 bg-[#131518] rounded-md border border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Request:</span>
              <span className="text-emerald-400 font-bold">GET</span>
              <span className="text-slate-200">
                https://ozcrm.guntekbilisim.com.tr/api/v1/
                {selectedEndpoint === 'get-customers'
                  ? 'customers'
                  : selectedEndpoint === 'get-customer-detail'
                  ? `customers/${customers[0]?.id || 'cust-1'}`
                  : selectedEndpoint === 'get-deals'
                  ? 'deals'
                  : 'tickets'}
              </span>
            </div>

            {testStatus && (
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
                  Status: {testStatus} OK
                </span>
                <span className="text-slate-300">Time: {testTime} ms</span>
              </div>
            )}
          </div>

          {/* Response Console */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-white">JSON Yanıt Gövdesi (Response Body):</span>
              {testResponse && (
                <button
                  onClick={() => copyToClipboard(testResponse, 'test-res')}
                  className="flex items-center gap-1 text-blue-400 hover:underline cursor-pointer"
                >
                  {copiedKey === 'test-res' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Kopyala</span>
                </button>
              )}
            </div>

            <pre className="p-4 bg-[#0e1013] text-emerald-300 rounded-lg text-xs font-mono overflow-x-auto max-h-80 border border-white/10">
              {testResponse || `// 'İsteği Gönder (Execute)' butonuna tıklayarak C# ASP.NET Core Web API yanıtını test edebilirsiniz.\n// Güntek Bilişim OzCRM canlı verisi dönecektir.`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Controller Code */}
      {activeTab === 'controller' && (
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-b-lg p-5 space-y-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">
                ASP.NET Core C# Controller Kodu
              </h2>
              <p className="text-xs text-slate-300">
                Guntek.OzCrm.Controllers.CustomersController sınıfı
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(csharpControllerCode, 'ctrl')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/15 rounded-md transition-colors cursor-pointer"
            >
              {copiedKey === 'ctrl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Kodu Kopyala</span>
            </button>
          </div>

          <pre className="p-4 bg-[#0e1013] text-slate-100 rounded-lg text-xs font-mono overflow-x-auto max-h-[500px] border border-white/10 leading-relaxed">
            {csharpControllerCode}
          </pre>
        </div>
      )}

      {/* Tab 3: DTO Code */}
      {activeTab === 'dto' && (
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-b-lg p-5 space-y-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">
                C# DTO (Data Transfer Object) & Validasyon Modelleri
              </h2>
              <p className="text-xs text-slate-300">
                Guntek.OzCrm.Models.CustomerDtos sınıfı
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(csharpDtoCode, 'dto')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/15 rounded-md transition-colors cursor-pointer"
            >
              {copiedKey === 'dto' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Kodu Kopyala</span>
            </button>
          </div>

          <pre className="p-4 bg-[#0e1013] text-slate-100 rounded-lg text-xs font-mono overflow-x-auto max-h-[500px] border border-white/10 leading-relaxed">
            {csharpDtoCode}
          </pre>
        </div>
      )}

      {/* Tab 4: Client SDK */}
      {activeTab === 'client' && (
        <div className="bg-[#1c1f24]/90 backdrop-blur-md border border-white/10 rounded-b-lg p-5 space-y-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">
                C# HttpClient SDK Entegrasyon Kütüphanesi
              </h2>
              <p className="text-xs text-slate-300">
                Harici C# sistemlerinizden (ERP, E-Fatura, Depo El Terminali) OzCRM API'sine doğrudan bağlanın.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(csharpClientCode, 'client')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/15 rounded-md transition-colors cursor-pointer"
            >
              {copiedKey === 'client' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Kodu Kopyala</span>
            </button>
          </div>

          <pre className="p-4 bg-[#0e1013] text-slate-100 rounded-lg text-xs font-mono overflow-x-auto max-h-[500px] border border-white/10 leading-relaxed">
            {csharpClientCode}
          </pre>
        </div>
      )}
    </div>
  );
};
