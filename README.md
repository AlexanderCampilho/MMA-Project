# Cage Clash

A fantasy MMA picks PWA backed by Supabase. Testers pick winners on the live
card; you (the admin) enter fighters and results; everyone shares one real
leaderboard.

No build step — plain HTML/JS, React/Babel/Supabase loaded from CDN. That
means deploying is just "push these files somewhere static."

## Deploy to GitHub Pages (2 minutes)

1. Create a **new, empty** repo on GitHub (no README/gitignore/license —
   this folder already has its own git history). Note the URL it gives you,
   e.g. `https://github.com/<you>/cage-clash.git`.

2. From this `app/` folder, run:

   ```bash
   git remote add origin https://github.com/<you>/cage-clash.git
   git branch -M main
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Source: Deploy from a branch → Branch:
   `main` / folder: `/ (root)` → Save.**

4. Wait ~1 minute, then your app is live at:
   `https://<you>.github.io/cage-clash/`

That's the link to share with testers. The admin page is the same URL plus
`/admin.html` — don't share that one.

## Admin

- URL: `<your-pages-url>/admin.html`
- Passphrase: `cage2026` (set in `src/admin-data.js`... actually in
  `admin.html` — search for `ADMIN_PIN` to change it before sharing anything
  publicly)
- From there: edit fighter names/divisions/order for the live card, enter
  results as fights happen (winner / method / round / bonus), then **Lock
  picks** before first bell and **Settle card** once you've entered every
  result. Settling awards a collectible pack to everyone and finalizes the
  leaderboard for that card.
- "Start a new event" replaces the live card for a future event.

## What's real vs. local, tonight

- **Real, shared via Supabase:** the fight card (bouts/results you enter),
  every tester's picks, and the leaderboard.
- **Local per device:** fighter-card packs/collection, language, timezone
  display. Not shared across testers' devices — a deliberate scope cut to
  ship tonight; ask if you want these synced too.

## Known trade-offs (by design, for a small trusted test group — not a public launch)

- **Open writes.** Row Level Security on every table currently allows
  anyone with the app's (public, expected-to-be-public) Supabase key to
  read *and write* every row — there's no per-tester auth yet, just a
  device-local random ID. Fine for a few trusted friends tonight; before a
  wider release, swap in real Supabase Auth (anonymous sign-in is the
  easiest fit) and tighten the RLS policies to check `auth.uid()`.
- **Admin gate is a shared passphrase**, not real auth — good enough to
  keep casual testers out of `/admin.html`, not a real security boundary.
- **Countdown/timezone math** approximates prelims/main-card start times as
  fixed offsets from the picks-lock time you set, rather than three
  separately-entered times.

## Local dev

No build step, no npm install. Serve the folder any way you like, e.g.:

```bash
ruby -run -e httpd . -p 4173
# or: python3 -m http.server 4173
```

Then open `http://localhost:4173`.
