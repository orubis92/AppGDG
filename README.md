# GdG CSAIN — Giudice di Gara 3D (PWA)

App per il Giudice di Gara CSAIN di tiro con l'arco 3D: checklist ufficiale, tabella logistica
con verifica distanze, controllo piazzole e arcieri, controllo velocità compound, registro di gara,
regolamenti, strumenti e relazione finale. Funziona **offline**, tutti i dati restano sul dispositivo.

**App online:** `https://<tuo-utente>.github.io/AppGDG/`

## File

- `index.html` — tutta l'app (singolo file)
- `manifest.json` — dati di installazione PWA
- `sw.js` — service worker (offline e aggiornamenti)
- `icon-192.png` · `icon-512.png` · `icon-maskable-512.png` — icone

## Installazione sul telefono

Apri l'indirizzo dell'app nel browser → menu → **"Aggiungi a schermata Home"** (Android/Chrome
propone "Installa app"). Da quel momento si apre a schermo intero e funziona anche senza rete.
Le librerie per l'import PDF/xlsx si scaricano al primo utilizzo e poi restano in cache.

## Pubblicare un aggiornamento

1. Modifica `index.html` (versione `APP_VER` inclusa).
2. In `sw.js` aggiorna la riga `const CACHE = 'gdg-csain-vX.Y';` alla stessa versione.
3. Commit e push su GitHub: dopo circa un minuto l'app online è aggiornata.
4. Sul telefono basta riaprire l'app con connessione: la nuova versione arriva da sola.

## Export XML e punto di scambio

Da **Referto → Relazione → Esporta XML** l'intera gara esce come file XML strutturato
(dati gara, checklist, tabella logistica con anomalie, controlli arcieri per piazzola,
velocità compound, sanzioni, briefing, diario e testo della relazione), leggibile da
qualsiasi altra applicazione.

Da **Referto → Punto di scambio** puoi impostare un indirizzo HTTP a cui inviare l'XML
con un tasto: l'app fa una `POST` (Content-Type `text/plain`, corpo = XML, nome file nel
parametro `?nome=`). Funziona con qualsiasi endpoint; per salvare direttamente su Google
Drive usa lo script pronto in **`punto-scambio-drive.gs`** (istruzioni nel file stesso).

## Dati

Nessun server: gare, foto e archivio vivono solo nel browser del dispositivo
(localStorage + IndexedDB). Il passaggio dati tra dispositivi si fa da
**Referto → Archivio → Esporta/Importa JSON**.
