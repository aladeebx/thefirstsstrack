# 🚀 TrakoShip Deployment Guide - Render

دليل شامل لنشر مشروع TrakoShip على Render.

## المتطلبات الأساسية

- حساب على [Render](https://render.com)
- GitHub repository للمشروع
- معرفة أساسية بـ Git

---

## الخطوة 1: إنشاء PostgreSQL Database

### 1.1 إنشاء Database

1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. اضغط على **"New +"** في أعلى الصفحة
3. اختر **"PostgreSQL"**
4. املأ البيانات التالية:
   - **Name**: `trakoship-db` (أو أي اسم تفضله)
   - **Database**: `trakoship`
   - **User**: `trakoship_user` (أو أي اسم)
   - **Region**: اختر الأقرب لموقعك (مثلاً: `Frankfurt`, `Oregon`)
   - **PostgreSQL Version**: `14` أو أحدث
   - **Plan**: 
     - **Free**: للاختبار والتطوير (512 MB RAM, 1 GB Storage)
     - **Starter**: للإنتاج ($7/شهر)
5. اضغط **"Create Database"**
6. انتظر حتى يكتمل الإنشاء (2-3 دقائق)

### 1.2 الحصول على Connection String

1. بعد إنشاء Database، افتحه من Dashboard
2. في قسم **"Connections"** ستجد:
   - **Internal Database URL**: للاستخدام من داخل Render (أسرع وأكثر أماناً)
   - **External Database URL**: للاستخدام من خارج Render
3. انسخ **External Database URL** (يبدو كالتالي):
   ```
   postgresql://user:password@hostname:5432/database_name?sslmode=require
   ```
4. احفظ هذا الرابط - ستحتاجه في الخطوة التالية

---

## الخطوة 2: إنشاء Web Service

### 2.1 ربط GitHub Repository

1. في Render Dashboard، اضغط **"New +"** → **"Web Service"**
2. اختر **"Build and deploy from a Git repository"**
3. إذا لم تكن متصلاً بـ GitHub:
   - اضغط **"Connect account"**
   - سجّل الدخول إلى GitHub
   - امنح Render صلاحيات الوصول
4. اختر Repository الخاص بك (`thefirstsstrack`)

### 2.2 إعدادات Web Service

املأ البيانات التالية:

- **Name**: `trakoship` (أو أي اسم)
- **Region**: نفس Region الخاص بـ Database (موصى به)
- **Branch**: `main` (أو `master`)
- **Root Directory**: اتركه فارغاً (أو `trraddk-main` إذا كان المشروع في مجلد فرعي)
- **Runtime**: `Node`
- **Build Command**: 
   ```bash
   npm install && npx prisma generate && npm run build
   ```
- **Start Command**: 
   ```bash
   npx prisma db push && npm start
   ```
- **Plan**: 
   - **Free**: للاختبار (512 MB RAM)
   - **Starter**: للإنتاج ($7/شهر)

### 2.3 إضافة Environment Variables

**مهم جداً**: قبل الضغط على "Create Web Service"، أضف Environment Variables:

1. في قسم **"Environment Variables"**، اضغط **"Add Environment Variable"**
2. أضف المتغيرات التالية:

#### DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: الصق External Database URL من الخطوة 1.2
- مثال:
  ```
  postgresql://trakoship_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com/trakoship?sslmode=require
  ```

#### JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: أي نص عشوائي قوي (على الأقل 32 حرف)
- مثال:
  ```
  trakoship-super-secret-jwt-key-2024-production-change-this
  ```
- **مهم**: استخدم مولد عشوائي قوي للإنتاج

#### NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`

### 2.4 إنشاء Web Service

1. بعد إضافة جميع Environment Variables
2. اضغط **"Create Web Service"**
3. Render سيبدأ عملية Build تلقائياً

---

## الخطوة 3: مراقبة النشر

### 3.1 Build Process

1. اذهب إلى Web Service الخاص بك
2. اضغط على تبويب **"Logs"**
3. راقب عملية Build:
   - ✅ `npm install` - تثبيت المكتبات
   - ✅ `prisma generate` - توليد Prisma Client
   - ✅ `next build` - بناء المشروع
   - ✅ `prisma db push` - رفع Schema إلى Database
   - ✅ `npm start` - بدء التطبيق

### 3.2 التحقق من الأخطاء

إذا ظهرت أخطاء:

#### خطأ: "Environment variable not found: DATABASE_URL"
- **الحل**: تأكد من إضافة `DATABASE_URL` في Environment Variables

#### خطأ: "Dynamic server usage"
- **الحل**: تم إصلاحه بإضافة `export const dynamic = 'force-dynamic'` في API routes

#### خطأ: "Database connection failed"
- **الحل**: 
  - تحقق من صحة `DATABASE_URL`
  - تأكد من أن Database يعمل (Status: Available)
  - تحقق من وجود `?sslmode=require` في نهاية URL

---

## الخطوة 4: التحقق من النشر الناجح

### 4.1 التحقق من Logs

في Logs يجب أن ترى:
```
✓ Prisma schema loaded
✓ Database connection successful
✓ Next.js server started
✓ Listening on port 10000
```

### 4.2 اختبار التطبيق

1. اذهب إلى Web Service
2. انسخ **URL** (مثلاً: `https://trakoship.onrender.com`)
3. افتح الرابط في المتصفح
4. يجب أن ترى الصفحة الرئيسية

### 4.3 اختبار Database

1. اذهب إلى Database Dashboard
2. اضغط **"Connect"** → **"psql"**
3. أو استخدم Prisma Studio:
   ```bash
   npx prisma studio
   ```

---

## الخطوة 5: إعدادات إضافية (اختياري)

### 5.1 استخدام Internal Database URL

للأداء الأفضل والأمان:
1. في Web Service → Environment Variables
2. استبدل `DATABASE_URL` بـ **Internal Database URL** من Database Dashboard
3. Internal URL أسرع ولا يحتسب ضمن Network Transfer

### 5.2 تفعيل Auto-Deploy

1. في Web Service → Settings
2. تأكد من تفعيل **"Auto-Deploy"**
3. سيتم إعادة النشر تلقائياً عند Push جديد

### 5.3 إعداد Custom Domain

1. في Web Service → Settings → Custom Domains
2. أضف Domain الخاص بك
3. اتبع التعليمات لإعداد DNS

### 5.4 تفعيل Database Backups

1. في Database Dashboard → Settings
2. فعّل **"Backups"**
3. اختر تردد Backup (يومي/أسبوعي)

---

## Environment Variables المطلوبة

| Variable | الوصف | مثال |
|----------|-------|------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `JWT_SECRET` | Secret key لـ JWT tokens | `your-super-secret-key-here` |
| `NODE_ENV` | بيئة التشغيل | `production` |

---

## استكشاف الأخطاء

### المشكلة: Build فشل

**الحلول**:
1. تحقق من Logs للخطأ المحدد
2. تأكد من صحة Build Command
3. تحقق من أن جميع المكتبات مثبتة

### المشكلة: Database connection failed

**الحلول**:
1. تحقق من `DATABASE_URL` في Environment Variables
2. تأكد من أن Database Status: Available
3. تحقق من وجود `?sslmode=require` في URL
4. جرب استخدام Internal URL بدلاً من External

### المشكلة: Application crashes

**الحلول**:
1. تحقق من Logs للأخطاء
2. تأكد من وجود جميع Environment Variables
3. تحقق من أن Database schema تم رفعه (`prisma db push`)

### المشكلة: Port already in use

**الحل**: Render يدير Ports تلقائياً - لا حاجة لإعداد

---

## نصائح للإنتاج

1. **استخدم Paid Plan**: Free plan ينام بعد 15 دقيقة من عدم الاستخدام
2. **استخدم Internal Database URL**: أسرع وأكثر أماناً
3. **فعّل Backups**: مهم للبيانات المهمة
4. **راقب Logs**: للكشف عن المشاكل مبكراً
5. **استخدم Environment Variables**: لا تضع secrets في الكود

---

## روابط مفيدة

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Render Status](https://status.render.com)

---

## الدعم

إذا واجهت مشاكل:
1. تحقق من Logs في Render Dashboard
2. راجع هذا الدليل
3. تحقق من [Render Community](https://community.render.com)

---

**آخر تحديث**: 2024

