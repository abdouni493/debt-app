# GestDette — Gestion des dettes & clients

A debt / seller management web app (FR + AR / RTL) for shops that sell on credit.
Static front-end (vanilla JS) backed by **Supabase** (Auth + Postgres). No build step.

## Features
- Login only (accounts live in Supabase Auth). There is **no sign-up in the app** —
  create the admin user from the Supabase dashboard (**Authentication → Users →
  Add user**).
- **Offline demo account** (no server needed) to explore the UI.
- Dashboard (total clients / debts / payments / outstanding).
- Clients: create with products (name, description, price) + initial deposit,
  automatic remaining calculation, search by name or phone, cards, details,
  edit, delete (confirmed), payments with full timestamped history.
- Reports over a date range.
- Settings (profile + credentials).
- Currency: **DZD**.

## 1. Set up Supabase (once)
1. Open your project → **SQL Editor** → paste all of [`supabase.sql`](./supabase.sql) → **Run**.
2. **Authentication → Users → Add user** → create the admin account (e-mail +
   password, “Auto Confirm User” checked). The app has no sign-up screen.
3. The connection keys are already filled in [`config.js`](./config.js)
   (URL + public anon key — safe to expose; Row Level Security protects data).

## 2. Run locally
Any static server works, e.g.:
```bash
python -m http.server 5177
# then open http://localhost:5177
```
Or just open `index.html` in a browser (demo mode works; live Supabase needs http(s)).

## 3. Deploy to Vercel
This is a pure static site — no framework, no build command.

**Option A — Dashboard**
1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. Vercel → **Add New → Project** → import the repo.
3. Framework preset: **Other**. Build command: *(empty)*. Output dir: `./`.
4. **Deploy.**

**Option B — CLI**
```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

`vercel.json` is already included (clean URLs + sensible headers).

> After deploying, add your Vercel domain to Supabase → **Authentication → URL
> Configuration → Site URL / Redirect URLs** if you later enable e-mail flows.

## Files
| File | Purpose |
|------|---------|
| `index.html` | App shell + script tags |
| `styles.css` | Design system, gradients, animations, responsive |
| `app.js` | SPA logic, i18n (FR/AR), Supabase + demo backends |
| `config.js` | Supabase URL + anon key + currency |
| `supabase.sql` | Full DB schema, RLS, triggers, RPCs |
| `vercel.json` | Static hosting config |
