# 🚀 XCHANGESHIPPMENT — DEPLOYMENT GUIDE
## From your computer to live on xchangeshippment.org in ~20 minutes

---

## WHAT YOU NEED (all free)
- [ ] GitHub account → github.com
- [ ] Supabase account → supabase.com  
- [ ] Netlify account → netlify.com (already have this)
- [ ] GitHub Desktop app → desktop.github.com (easiest way — no terminal needed)

---

## STEP 1 — INSTALL GITHUB DESKTOP
1. Go to https://desktop.github.com
2. Download for Windows
3. Install it (click through the prompts)
4. Sign in with your GitHub account (or create one at github.com)

---

## STEP 2 — CREATE A SUPABASE DATABASE
1. Go to https://supabase.com → Sign in (or create free account)
2. Click **"New Project"**
3. Name it: `xchangeshippment`
4. Set a strong database password (SAVE THIS — you'll need it!)
5. Choose region: **Europe West** (closest to Nigeria)
6. Click **Create New Project** and wait ~2 minutes

7. Once ready, go to **Settings → Database**
8. Copy the **Connection String (URI)** — it looks like:
   `postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres`
   
9. Also go to **Settings → Database → Connection Pooling**
10. Copy the pooler URL — it looks like:
    `postgresql://postgres.xxx:[password]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`

---

## STEP 3 — SET UP YOUR ENV FILE
1. In the project folder, find the file called `.env.example`
2. Make a COPY of it and rename the copy to `.env`
3. Fill in the values:

```
DATABASE_URL="[paste your pooler URL here — port 6543]"
DIRECT_URL="[paste your direct URL here — port 5432]"
NEXTAUTH_URL="https://xchangeshippment.org"
NEXTAUTH_SECRET="[generate one at: https://generate-secret.vercel.app/32]"
```

⚠️ IMPORTANT: The .env file must NEVER be uploaded to GitHub. It's already in .gitignore — do not remove it.

---

## STEP 4 — RUN DATABASE MIGRATIONS
You need Node.js installed. If you don't have it:
1. Go to https://nodejs.org → Download the LTS version → Install

Then open the project folder in terminal/command prompt:
```
npm install
npx prisma migrate deploy
npm run db:seed
```

This creates all database tables and adds demo accounts.

---

## STEP 5 — PUSH TO GITHUB
1. Open **GitHub Desktop**
2. Click **File → Add Local Repository**
3. Browse to your project folder (xship-next)
4. Click **"create a repository"** if prompted
5. Name it: `xchangeshippment`
6. Click **Create Repository**
7. Click **"Publish repository"**
   - Uncheck "Keep this code private" if you want it public
   - Click **Publish**

Your code is now on GitHub! ✅

---

## STEP 6 — CONNECT NETLIFY TO GITHUB

1. Go to https://app.netlify.com
2. Click **"Add new site" → "Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub
5. Find and select your **xchangeshippment** repository
6. Build settings (should auto-detect, but verify):
   - **Build command:** `npm install && npx prisma generate && npm run build`
   - **Publish directory:** `.next`
7. Click **"Add environment variables"** and add:
   - `DATABASE_URL` = [your pooler URL]
   - `DIRECT_URL` = [your direct URL]
   - `NEXTAUTH_URL` = `https://xchangeshippment.org`
   - `NEXTAUTH_SECRET` = [your generated secret]
8. Click **"Deploy site"**

Wait 3-5 minutes for the first build to complete.

---

## STEP 7 — CONNECT YOUR DOMAIN

1. In Netlify, go to **Site configuration → Domain management**
2. Click **"Add a domain"**
3. Enter: `xchangeshippment.org`
4. Follow the instructions to update your domain's DNS settings

---

## STEP 8 — AFTER FIRST SUCCESSFUL DEPLOY

Run the seed command to add demo accounts to your live database:
```
DATABASE_URL="[your direct URL]" npx prisma db seed
```

Or run it from the Netlify functions dashboard.

---

## DEMO ACCOUNTS (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Super Admin | brightolisaeneh@gmail.com | Admin@2024! |
| Customer | demo@xchangeshippment.com | Demo@2024! |

---

## FUTURE DEPLOYS (automatic!)
After this setup, every time you:
1. Make changes to any file
2. Open GitHub Desktop
3. Write a commit message and click **Commit**
4. Click **Push origin**

→ Netlify will automatically detect the change and redeploy in ~3 minutes.

---

## TROUBLESHOOTING

**Build fails with TypeScript error:**
- Check the Netlify deploy log for the exact error
- Send me a screenshot and I'll fix it immediately

**"Database connection failed":**
- Make sure DATABASE_URL is set correctly in Netlify environment variables
- Make sure you used the pooler URL (port 6543), not the direct URL

**"Page not found" after deploy:**
- Go to Netlify → Plugins → Install @netlify/plugin-nextjs if not already installed

**Need to change admin password:**
- Log in at brightolisaeneh@gmail.com / Admin@2024!
- Contact support or update directly in Supabase → Table Editor → users

---

## SUPPORT
Email: brightolisaeneh@gmail.com
Phone: 09058326972
