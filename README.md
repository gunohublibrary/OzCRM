# GÜNTEK BİLİŞİM - OzCRM Kurumsal Müşteri Yönetim Portalı

Bu proje **Güntek Bilişim** için geliştirilmiş, kurumsal müşteri portföyü, satış fırsatları (pipeline), fiyat teklifleri, SLA destek masası biletleri ve C# / Microsoft SQL Server entegrasyonu sunan web tabanlı bir CRM uygulamasıdır.

---

## 🚀 Hızlı Başlangıç & Yerel Kurulum (Localhost)

Projeyi kendi bilgisayarınızda veya sunucunuzda çalıştırmak için:

### 1. Gereksinimler
- **Node.js** (v18 veya üzeri önerilir)
- **npm**, **yarn** veya **pnpm**
- (Opsiyonel) **Microsoft SQL Server 2019/2022** veya **Azure SQL Database**
- (Opsiyonel) **.NET 8.0 SDK** (C# Web API için)

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Uygulama varsayılan olarak `http://localhost:3000` adresinde açılacaktır.

### 4. Canlı Üretim Derlemesi (Production Build)
```bash
npm run build
```
Oluşturulan `dist/` klasörünü herhangi bir web sunucusuna (IIS, Nginx, Apache, Cloudflare Pages, Vercel) dağıtabilirsiniz.

---

## 🗄️ Microsoft SQL Server (MSSQL) Veritabanı Kurulumu

1. OzCRM web uygulamasını açın.
2. Üst menüden **C# Web API** veya sağ üstteki **Ayarlar & Yedekleme** sayfasına gidin.
3. **`MSSQL (.sql) Scripti İndir`** butonuna tıklayın.
4. İndirilen `OzCRM_MSSQL_Database_Setup.sql` dosyasını **SQL Server Management Studio (SSMS)** veya **Azure Data Studio** ile açın.
5. **Execute (F5)** tuşuna basarak çalıştırın:
   - `OzCrmDb` veritabanı otomatik oluşturulur.
   - `Customers`, `Deals`, `Quotes`, `QuoteItems`, `SupportTickets` ve `Activities` tabloları ve indeksleri kurulur.
   - Tüm müşteri ve teklif verileri anında tablolarınıza yüklenir.

### C# Entity Framework Core Bağlantısı (`appsettings.json`):
```json
{
  "ConnectionStrings": {
    "OzCrmMssqlConnection": "Server=localhost,1433;Database=OzCrmDb;User Id=sa;Password=Guntek_OzCrm_Secret_2026!;TrustServerCertificate=True;MultipleActiveResultSets=true;"
  }
}
```

---

## 🌐 Canlı Web Bağlantısı (Bulut Erişimi)

Uygulamanız şu anda bulutta barındırılmaktadır. Doğrudan tarayıcınızdan veya cep telefonunuzdan kullanabilirsiniz:
- **Canlı Önizleme Adresi**: [https://ais-pre-tm66tmwtbfo4ijaakjeipr-988458157176.europe-west2.run.app](https://ais-pre-tm66tmwtbfo4ijaakjeipr-988458157176.europe-west2.run.app)
- **Geliştirme Adresi**: [https://ais-dev-tm66tmwtbfo4ijaakjeipr-988458157176.europe-west2.run.app](https://ais-dev-tm66tmwtbfo4ijaakjeipr-988458157176.europe-west2.run.app)

---

## 📁 Proje Dizin Yapısı

- `src/`
  - `components/` -> React arayüz bileşenleri (Müşteriler, Fırsatlar, Teklifler, Destek Masası, C# Web API, Ayarlar)
  - `context/` -> `CrmContext.tsx` (Canlı durum yönetimi, CRUD işlemleri ve veri tabanı dışa aktarımı)
  - `data/` -> `seedData.ts` (Güntek Bilişim başlangıç verileri) & `mssqlSchema.ts` (T-SQL script oluşturucu)
  - `lib/` -> `firebase.ts` (Bulut Firestore yapılandırması)
  - `types/` -> `crm.ts` (TypeScript veri modelleri ve DTO'lar)
- `index.html` -> Giriş HTML dosyası
- `package.json` -> Bağımlılıklar ve derleme betikleri
- `firestore.rules` -> Bulut güvenlik kuralları
