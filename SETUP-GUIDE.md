# 🚀 Quick Setup Guide for TrakoShip

Follow these steps to get TrakoShip running on your local machine in under 10 minutes!

## Step 1: Install Prerequisites ✅

Make sure you have:
- ✅ Node.js (v18+) - Download from https://nodejs.org/
- ✅ PostgreSQL (v14+) - Download from https://www.postgresql.org/download/

## Step 2: Install Dependencies 📦

```bash
npm install
```

⏱️ This will take 2-3 minutes.

## Step 3: Setup Database 🗄️

### Create Database

```bash
# Open PostgreSQL (Windows)
# Press Windows key, search for "psql" or "SQL Shell"

# Or use command line
psql -U postgres

# In PostgreSQL shell, run:
CREATE DATABASE trakoship;

# Exit
\q
```

### Update .env File

A `.env` file is already created. Update the database credentials if needed:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/trakoship?schema=public"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

## Step 4: Setup Database Tables 🏗️

```bash
npm run db:generate
npm run db:push
```

## Step 5: Add Sample Data (Optional) 🌱

```bash
npm run db:seed
```

This creates test accounts and sample shipments!

## Step 6: Start the App 🎉

```bash
npm run dev
```

## Step 7: Open in Browser 🌐

Visit: **http://localhost:3000/en/**

## Step 8: Login 🔐

Use the test account created by the seed script:

- **Email**: demo@trakoship.com
- **Password**: password123

## ✨ You're Done!

Now you can:
1. **Dashboard**: View statistics and recent shipments
2. **Add Customers**: Create customer profiles
3. **Create Shipments**: Generate tracking numbers automatically
4. **Track Publicly**: Visit http://localhost:3000/en/track/TKS-ABC12345
5. **Switch Languages**: Toggle between English and Arabic

## 📝 Sample Tracking Numbers

Test the tracking feature with these:
- `TKS-ABC12345` - Delivered
- `TKS-XYZ67890` - In Transit
- `TKS-DEF54321` - Pending
- `TKS-GHI98765` - Out for Delivery

## 🎯 Key URLs

| Page | URL |
|------|-----|
| Home (English) | http://localhost:3000/en/ |
| Home (Arabic) | http://localhost:3000/ar/ |
| Login | http://localhost:3000/en/login |
| Dashboard | http://localhost:3000/en/dashboard |
| Track Shipment | http://localhost:3000/en/track/TKS-ABC12345 |

## ⚠️ Troubleshooting

### Can't connect to database?
- Make sure PostgreSQL is running
- Check your password in `.env`
- Verify database exists: `psql -U postgres -l`

### Port 3000 already in use?
```bash
PORT=3001 npm run dev
```

### Prisma errors?
```bash
npm run db:generate
```

## 🎊 Next Steps

1. Explore all features in the dashboard
2. Create your own customers and shipments
3. Test the embeddable widget (see Settings page)
4. Try the Arabic interface at `/ar/`

---

**Need help?** Check the main README.md for detailed documentation.

