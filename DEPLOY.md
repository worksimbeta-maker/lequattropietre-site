# Deploy su Vercel — Guida operativa

## Opzione A · Deploy via Vercel CLI (più veloce, 5 minuti)

### 1. Installa Vercel CLI

In PowerShell:
```powershell
npm install -g vercel
```

### 2. Vai nella cartella del progetto

```powershell
cd C:\Users\gianl\Desktop\Chatbot\lequattropietre-site
```

### 3. Lancia deploy

```powershell
vercel
```

Al primo lancio Vercel ti chiede:
- **Set up and deploy?** → `Y`
- **Which scope?** → seleziona il tuo account
- **Link to existing project?** → `N` (è la prima volta)
- **What's your project's name?** → `lequattropietre`
- **In which directory is your code located?** → `./` (invio)
- **Want to modify these settings?** → `N`

In ~30 secondi il sito è online su un URL `https://lequattropietre-xxx.vercel.app`.

### 4. Promuovi a produzione

```powershell
vercel --prod
```

Otterrai l'URL **definitivo** (es. `https://lequattropietre.vercel.app`) — questo è quello da mostrare al cliente.

---

## Opzione B · Deploy via GitHub (consigliata a regime)

### 1. Crea repo GitHub

In PowerShell, dentro la cartella del progetto:
```powershell
git init
git add .
git commit -m "Le Quattro Pietre — sito v3 premium"
gh repo create lequattropietre-site --public --source=. --push
```

Se non hai `gh` (GitHub CLI), installalo con `winget install --id GitHub.cli` e poi `gh auth login`.

### 2. Collega Vercel a GitHub

1. Vai su https://vercel.com/new
2. Login (anche con GitHub stesso, è gratis)
3. **Import Git Repository** → seleziona `lequattropietre-site`
4. **Framework Preset** → "Other" (è HTML statico, niente build)
5. **Build Command** → lascia vuoto
6. **Output Directory** → lascia vuoto (o metti `.`)
7. Clicca **Deploy**

In ~40 secondi il sito è online. **Da quel momento ogni `git push` aggiorna automaticamente il sito in produzione.**

### 3. Workflow quotidiano post-deploy

```powershell
# Quando modifichi qualcosa:
cd C:\Users\gianl\Desktop\Chatbot\lequattropietre-site
git add .
git commit -m "modifica testi hero"
git push
```

Vercel ricostruisce e pubblica automaticamente in ~30 secondi.

---

## Configurare il dominio `lequattropietre.it`

### Step 1 · In Vercel
1. Settings del progetto → **Domains**
2. Aggiungi `lequattropietre.it` e `www.lequattropietre.it`
3. Vercel ti mostra i record DNS da impostare (A + CNAME)

### Step 2 · Dal registrar attuale
Vai dal provider DNS attuale (Italiaonline / Aruba / OVH / GoDaddy ecc.) e modifica:

**Per `lequattropietre.it` (record A):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Per `www.lequattropietre.it` (record CNAME):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

> ⚠️ Modifica i DNS solo dopo aver salvato i record vecchi (per fallback). Il cambio si propaga in 1-24 ore.

### Step 3 · HTTPS automatico
Vercel emette il certificato SSL Let's Encrypt **automaticamente**. Quando i DNS sono propagati, il sito è disponibile in HTTPS senza configurazioni aggiuntive.

---

## Aggiungere il file `vercel.json` (consigliato)

Crea un file `vercel.json` nella root del progetto per:
- Forzare HTTPS
- Aggiungere security headers
- Custom 404
- Cache aggressive sugli asset statici

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/(.*\\.(jpg|jpeg|png|webp|svg|woff2|css|js))",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

(Ho già preparato questo file per te nella cartella del progetto.)

---

## Variabili d'ambiente (per quando colleghi n8n/Dify)

Quando passerai alle integrazioni, su Vercel → Project Settings → Environment Variables aggiungi:

```
N8N_WEBHOOK_URL=https://n8n.tuo-dominio.com/webhook/lequattropietre
DIFY_API_KEY=app-XXXXXXXX
DIFY_API_URL=https://api.dify.ai/v1/chat-messages
```

E spostando il fetch del form in una **Vercel Serverless Function** (`api/prenota.js`) puoi tenere le chiavi server-side, senza esporle nel frontend.

Esempio `api/prenota.js`:
```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const body = req.body;

  const r = await fetch(process.env.N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) return res.status(502).json({ error: 'upstream' });
  return res.status(200).json({ ok: true });
}
```

Poi nel `script.js` chiami `/api/prenota` invece dell'URL n8n diretto.

---

## Checklist pre-deploy

- [ ] Tutte le foto reali in `assets/photos/` (oppure fallback Unsplash attivi)
- [ ] `vercel.json` presente
- [ ] Test su localhost: `python -m http.server 8000` e verifica navigazione
- [ ] Test responsive su Chrome DevTools (375px, 768px, 1280px, 1920px)
- [ ] Form invia console.log (test)
- [ ] Link interni funzionano (privacy, cookie, termini, menu, 404)
- [ ] WhatsApp link apre WhatsApp web
- [ ] Lighthouse score >85 su tutti gli indicatori

---

## Comandi PowerShell utili (cheatsheet)

```powershell
# Setup ambiente
cd C:\Users\gianl\Desktop\Chatbot\lequattropietre-site

# Test locale (Python)
python -m http.server 8000
# poi → http://localhost:8000

# Test locale (Node)
npx serve -l 8000

# Deploy preview Vercel
vercel

# Deploy produzione Vercel
vercel --prod

# Aggiornamento via Git
git add . ; git commit -m "messaggio" ; git push

# Vedi log produzione Vercel
vercel logs --follow

# Apri il progetto su vercel.com
vercel open
```

---

Buon deploy.
