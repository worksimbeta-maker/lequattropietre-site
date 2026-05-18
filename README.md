# Le Quattro Pietre — Sito Web v3 (Premium Edition)

Sito demo ready-to-show per **Le Quattro Pietre** — ristorante, agriturismo (7 camere), location matrimoni · Castiglion Fibocchi (AR), dal 1995.

Stack motion: **GSAP + ScrollTrigger + Lenis** via CDN, zero build step.
Copy strategico: framework **Boosted** (USP + Big Idea + Meccanismo Unico + BAB).
SEO-ready + responsive + accessibilità + 4 pagine legali + 404 brandizzata.

---

## ⚡ Avvio in 30 secondi

```powershell
cd C:\Users\gianl\Desktop\Chatbot\lequattropietre-site
python -m http.server 8000
```
→ http://localhost:8000

Stop: **Ctrl+C**. Alternative: `npx serve -l 8000`.

---

## 📁 Struttura

```
lequattropietre-site/
├── index.html                ← home one-page
├── style.css                 ← design system + animazioni
├── script.js                 ← motion, validazione, chatbot, lightbox
├── 404.html                  ← errore brandizzato
├── vercel.json               ← config deploy
├── assets/
│   ├── logo-quadrato.svg
│   └── photos/               ← LE TUE 5 FOTO QUI (vedi sezione 4)
├── pages/
│   ├── menu.html             ← menu ristorante (già esistente)
│   ├── privacy.html          ← GDPR
│   ├── cookie.html           ← cookie policy
│   └── termini.html          ← T&C
├── README.md
├── STRATEGIA-MARKETING.md    ← piano funnel completo
└── DEPLOY.md                 ← guida Vercel passo-passo
```

---

## 🎯 1. Cosa è stato fatto (v3)

### Copy persuasivo applicato dai manuali Boosted
- **Big Idea**: *"Quattro pietre. Una Toscana."*
- **Headline hero (5 mattoncini)**: promessa + pain implicito + curiosità + prova + obiezione demolita
- **Framework BAB** sull'intro (Before/After/Bridge)
- **Framework PAS** sui matrimoni ("un solo matrimonio per weekend")
- **Meccanismo Unico** esplicito: "pasta tirata a mano dalle 6", "brace di quercia", "cantina di famiglia"
- **Offerta Irresistibile** strutturata per ciascun servizio (vedi STRATEGIA-MARKETING.md §3)
- **Trust line** in hero: "4,8/5 su 127 recensioni · Risposta in 24h"
- **Promesse esplicite** nel form: cancellazione gratuita, no acconto, conferma in giornata

### Effetti motion premium
- Preloader cinematic con 4 pietre che si compongono + counter %
- Hero slideshow 3 immagini Ken Burns + indicatore "01/03"
- **Split-text lettera-per-lettera** GSAP su tutte le headline
- **Horizontal pinned scroll** per "Le 4 Pietre" (desktop)
- **Image reveal con clip-path mask** (drappo terra che si ritira)
- **Counter animati** sui numeri (30+, 200+, 7, 0km)
- **Magnetic buttons** che inseguono il mouse
- **Custom cursor** difference-blend
- **Grain noise overlay** vintage
- **Floating olive leaves** (foglie d'ulivo che cadono in background)
- **Gradient mesh** dorato che segue il mouse (desktop)
- **Marquee doppio** in direzioni opposte
- **Lenis smooth scroll** cinematografico
- **Nav active link** tracking automatico
- **Footer giant text** responsive

### Sezioni complete
1. Hero cinematic
2. Marquee identitari doppio strato
3. Intro Big Idea + counter strip (4 numeri)
4. **Le 4 Pietre** (horizontal scroll desktop / stack mobile)
5. Ristorante (split image + meccanismo unico + orari)
6. Camere (gallery masonry + lightbox)
7. Eventi/Matrimoni (parallax + inclusi + urgency)
8. Storia (narrative + badge "30 anni")
9. Testimonianze (3 card con stelle)
10. Prenota (form + 3 contatti diretti)
11. Contatti (mappa Google + scheda)
12. Footer giant + 4 colonne

### Tecnico
- HTML semantico + Schema.org Restaurant con `aggregateRating`
- SEO: meta description, OG tags, canonical
- Validazione form realtime + lato submit (nome, email, tel, ospiti, data)
- Anti double-submit + feedback "Invio in corso..."
- Lightbox keyboard-friendly (Esc + frecce)
- Chatbot "Pietra" con 13 risposte intelligenti + integrazione Dify pronta
- Responsive: 4 breakpoint testati (375, 768, 1024, 1440)
- Accessibilità: skip link, aria labels, focus-visible, prefers-reduced-motion
- Performance: lazy loading, preconnect fonts, defer script

---

## 📸 2. Le tue 5 foto reali — come integrarle

Ho lasciato pronti i 5 path nel codice HTML, con fallback Unsplash automatico se mancano. Per attivare le foto vere:

1. Apri la cartella `C:\Users\gianl\Desktop\Chatbot\lequattropietre-site\assets\photos\`
2. Salva le tue 5 foto con questi **nomi esatti**:

| Nome file | Foto da usare |
|---|---|
| `villa-facciata.jpg` | Facciata della villa con prato verde (la 1°) |
| `villa-retro.jpg` | Retro della villa con vasi terracotta (la 2°) |
| `salone-eventi.jpg` | Salone interno con palloncini bianchi/celesti (la 3°) |
| `piscina-notte.jpg` | Piscina sotto gazebo notturna (la 4°) |
| `matrimonio-tavolo-sposi.jpg` | Tavolo sposi con vetrata fiorita (la 5°) |

Appena salvate, ricarica il sito → vedrai le tue foto reali in tutte le sezioni (hero slideshow, le 4 esperienze, ristorante, camere, eventi, storia).

> **Per ottenere foto ad alta risoluzione**: chiedi al cliente di mandarti gli originali, oppure ingrandisci i thumbnail Instagram con tool come `instaloader` (`pip install instaloader && instaloader --no-videos --highlights --stories le4pietre`).

---

## 🔌 3. Collegare il form a n8n / Make.com

Nello `script.js`, riga ~360, c'è un blocco commentato `WEBHOOK ENDPOINT`. Decommentalo e metti l'URL del tuo webhook:

```js
const endpoint = 'https://n8n.tuo-dominio.com/webhook/lequattropietre';
// ... resto già pronto
```

Lo schema del payload che arriva al webhook:
```json
{
  "tipo": "ristorante|camere|evento|info",
  "nome": "Mario Rossi",
  "email": "mario@email.it",
  "tel": "+39 333 1234567",
  "ospiti": "4",
  "data": "2026-06-15",
  "ora": "20:00",
  "note": "Anniversario, tavolo all'esterno",
  "ts": "2026-05-18T14:32:11.000Z",
  "source": "lequattropietre.it",
  "userAgent": "..."
}
```

In n8n concatena: **Webhook POST** → **Send Email** (Gmail/SMTP) → **Google Sheets** → **HTTP Request** (WhatsApp notify titolare).

---

## 🤖 4. Collegare Dify al chatbot "Pietra"

Due modalità (dettaglio nel codice commentato di `script.js`):

**A) Embed widget Dify** (più semplice): incolla lo snippet `<script>` di Dify prima di `</body>` in `index.html`. Rimuovi il chatbot custom.

**B) UI custom + API**: sostituisci la funzione `botRespond` con chiamata a `https://api.dify.ai/v1/chat-messages` (o meglio, tramite proxy Vercel Serverless per non esporre la API key — vedi `DEPLOY.md` §"Variabili d'ambiente").

Configurazione lato Dify:
- App tipo **Chatbot**
- KB: carica `pages/menu.html` + `Quattro Pietre BIO e TAG.pdf` + un FAQ con orari/contatti/info camere/info matrimoni
- System prompt: *"Sei Pietra, assistente Le Quattro Pietre, ristorante e agriturismo dal 1995 a Castiglion Fibocchi (AR). Tono cordiale, toscano garbato. Italiano. Per prenotazioni invita al modulo del sito o WhatsApp 333 8144853. Non inventare prezzi o disponibilità."*

---

## 🚀 5. Deploy

Guida completa in [DEPLOY.md](DEPLOY.md).

In sintesi:
```powershell
npm install -g vercel
cd C:\Users\gianl\Desktop\Chatbot\lequattropietre-site
vercel --prod
```

Configurazione dominio + SSL automatico documentati in DEPLOY.md.

---

## 📈 6. Strategia marketing

Piano completo in [STRATEGIA-MARKETING.md](STRATEGIA-MARKETING.md):
- Posizionamento brand
- 3 avatar cliente (ristorante / camere / eventi)
- Offerta Irresistibile per ogni servizio (con value stacking)
- Funnel 4 fasi (Meta Ads → sito → lead → conferma)
- Strategia social Instagram/Facebook
- Pricing strategy
- Roadmap 90 giorni
- KPI da monitorare

---

## ✅ 7. Checklist pre-lancio

### 🔴 Bloccanti
- [ ] Salvare le 5 foto reali in `assets/photos/` (vedi §2)
- [ ] Webhook n8n configurato e collegato (§3)
- [ ] Chatbot Dify configurato e collegato (§4)
- [ ] Verifica con cliente: numeri telefono, indirizzo, P.IVA
- [ ] Deploy Vercel + dominio (§5)

### 🟠 Importanti
- [ ] Banner cookie (Iubenda free tier o Cookiebot)
- [ ] Favicon dalle 4 pietre (file `favicon.ico` in root)
- [ ] OG image 1200x630 della villa (file `og.jpg` in root)
- [ ] Google My Business: foto, post settimanali
- [ ] Sitemap.xml + Google Search Console
- [ ] Pixel Meta Ads installato (per re-targeting futuro)

### 🟡 Migliorie nice-to-have
- [ ] Multi-lingua IT/EN (i 4 mercati esteri principali per la Toscana)
- [ ] Booking engine reale: SimpleBooking per camere, TheFork per ristorante
- [ ] Pagina blog (post stagionali: vendemmia, raccolta olive, menu di stagione)
- [ ] Galleria gallery dedicata con filtri (ristorante / camere / eventi)
- [ ] Sezione "Esperienze sul territorio" (degustazioni vino, corsi cucina)
- [ ] Video hero al posto dello slideshow (production: 1 giornata di shooting)
- [ ] Recensioni Google embedded (widget reale)
- [ ] Newsletter subscribe (Brevo/Mailchimp)

---

## 🎨 8. Effetti wow extra (se vuoi spingere oltre)

Idee che si possono aggiungere in 1-2 ore ciascuna:
- **Audio toggle** in nav: musica di sottofondo (acustica toscana, sussurrata, opt-in)
- **Modalità giorno/notte** automatica (alle 19:00 il sito si fa più scuro)
- **WebGL background** in hero (acqua della piscina che si muove sottilmente)
- **Cursor magnetico potenziato** con scia animata (tipo Aceternity/Eldora UI)
- **Section transition con SVG curve** (passaggio terra→panna a forma organica)
- **Drag horizontal gallery** sulle camere (touch mobile + mouse desktop)
- **Text scramble** sull'hero al primo caricamento (effetto cinematic)
- **Loader assets pre-caching** con preloader prolungato

---

## 🔧 9. Tech notes

- **GSAP 3.12.5** + ScrollTrigger via CDN jsdelivr
- **Lenis 1.1.13** smooth scroll
- **Font**: Google Fonts (Italiana display + Cormorant Garamond serif + Jost sans)
- **No build step**: HTML + CSS + JS vanilla → 0 dipendenze npm
- **Lighthouse atteso**: Performance >90, Accessibility >95, Best Practices 100, SEO 100

---

## 💡 10. Roadmap operativa prossimi 30 giorni

| Giorno | Task | Owner | Esito |
|---|---|---|---|
| 1 | Foto reali in `assets/photos/` | Tu + cliente | foto integrate |
| 2 | Deploy preview Vercel + dominio temporaneo | Tu | URL demo da mostrare |
| 3 | Sopralluogo cliente: dimostrazione live del sito demo | Tu + cliente | feedback raccolto |
| 4-5 | n8n workflow + email + WhatsApp notify | Tu | form funzionante end-to-end |
| 6-7 | Dify chatbot configurato sulla KB | Tu | Pietra risponde davvero |
| 8 | Iubenda cookie banner + sitemap + Google Search Console | Tu | sito compliance ready |
| 9 | Deploy produzione + dominio reale | Tu | sito live su lequattropietre.it |
| 10 | Setup Meta Business Manager + Pixel + prima campagna test (50€) | Tu | dati iniziali |
| 11-15 | Calendar contenuti Instagram (12 post + 8 reel programmati) | Tu | community starter |
| 16-20 | Onboarding cliente: come usare WhatsApp Business, come rispondere ai lead | Tu + cliente | autonomia operativa |
| 21-30 | Ottimizzazione campagne, A/B test headline, analisi prime conversioni | Tu | iterazione su dati reali |

---

## 🆘 Attivare Claude Code in PowerShell

```powershell
npm install -g @anthropic-ai/claude-code
cd C:\Users\gianl\Desktop\Chatbot\lequattropietre-site
claude
```

Login al primo avvio (browser si apre da solo).

---

Buon lavoro 🌿

— Strategia, design e copy applicati con metodo. Sito ready-to-show al cliente.
