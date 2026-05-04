# EnvatoDesk 🚀

**Validate Envato purchase codes, track sales & monitor your ThemeForest portfolio — all in one dashboard.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/envato-desk&env=ENVATO_TOKEN&envDescription=Your%20Envato%20Personal%20Token&envLink=https://build.envato.com/create-token/)

![EnvatoDesk Dashboard](https://via.placeholder.com/1200x630/00b779/ffffff?text=EnvatoDesk)

---

## ✨ Features

- **Purchase Code Validator** — paste any UUID and get buyer name, email, item, price, license type, and support status in real time
- **Sales Dashboard** — full transaction history with search, filter, sort, and pagination
- **Top 10 Items** — ranked list of your best-selling ThemeForest products with sales bars and ratings
- **Analytics** — monthly revenue/sales area charts, category donut chart, support status breakdown
- **Demo Mode** — works out of the box with realistic demo data (no token needed)
- **Dark Mode** — full dark/light theme toggle
- **Responsive** — works on mobile, tablet and desktop

---

## 🚀 Deploy to Vercel in 3 steps

### Step 1 — Push to GitHub

```bash
# Create a new repo on github.com, then:
git init
git add .
git commit -m "Initial commit: EnvatoDesk"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/envato-desk.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your `envato-desk` repo
3. Leave all settings as default — Vercel auto-detects Next.js
4. Click **Deploy** 🎉

### Step 3 — Add your Envato Token (optional)

Either add it in the app's **Settings** tab (stored in your browser), or set it as an environment variable in Vercel for server-side use:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add `ENVATO_TOKEN` = your personal token
3. Click **Save** and **Redeploy**

---

## 🔑 Getting your Envato Token

1. Log in to your Envato account
2. Visit [build.envato.com/create-token/](https://build.envato.com/create-token/)
3. Enable these scopes:
   - ✅ View and search Envato sites
   - ✅ View your sales
   - ✅ Verify purchases you've made
4. Click **Create Token** and copy it

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Create your env file
cp .env.example .env.local
# Add your ENVATO_TOKEN to .env.local

# Run dev server
npm run dev
# Open http://localhost:3000
```

---

## 🏗 Tech Stack

| Tool | Purpose |
|------|---------|
| [Next.js 14](https://nextjs.org) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Recharts](https://recharts.org) | Revenue & analytics charts |
| [Lucide React](https://lucide.dev) | Icon set |
| [Envato API](https://build.envato.com) | Real sales & purchase data |
| [Vercel](https://vercel.com) | Hosting & deployment |

---

## 📁 Project Structure

```
envato-desk/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main dashboard (all tabs)
│   │   ├── layout.tsx        # Root layout & metadata
│   │   └── api/
│   │       ├── validate/     # POST /api/validate — check purchase code
│   │       ├── sales/        # GET  /api/sales    — fetch sales list
│   │       ├── top-items/    # GET  /api/top-items — top 10 items
│   │       └── author/       # GET  /api/author   — author account info
│   ├── lib/
│   │   ├── envato.ts         # Envato API client
│   │   └── demo.ts           # Demo data generators & utilities
│   └── styles/
│       └── globals.css       # Tailwind base + custom utilities
├── .env.example              # Environment variable template
├── vercel.json               # Vercel deployment config
└── README.md
```

---

## 🔒 Security Notes

- Your Envato token is **never sent to any third party** — it goes directly to `api.envato.com`
- When stored in the browser (Settings tab), it stays in `localStorage` on your device only
- For team use, set `ENVATO_TOKEN` as a Vercel environment variable instead

---

## 📄 License

MIT — free to use, modify and deploy.
# envato-desk
