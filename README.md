# n8n-nodes-risveglia

[![npm version](https://img.shields.io/npm/v/@ivanlaomarketing/n8n-nodes-risveglia?color=25D366&label=npm)](https://www.npmjs.com/package/@ivanlaomarketing/n8n-nodes-risveglia)
[![n8n compatible](https://img.shields.io/badge/n8n-compatible-FF6347)](https://n8n.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built by Ivan Lao](https://img.shields.io/badge/Built%20by-Ivan%20Lao-FF6B35)](https://laoivan.com)

Nodi n8n per [RisveglIA](https://risveglia.it), l'archivio e l'assistente delle chat WhatsApp della tua attività.

> **English.** n8n community node for RisveglIA (WhatsApp archive and assistant for businesses): send WhatsApp messages, manage contacts, deals, labels, reminders, groups and channels, AI agent and media, read the chat archive, and start workflows on RisveglIA events. The node UI is in Italian.

## Cosa contiene

- **RisveglIA**: invia messaggi WhatsApp, gestisce contatti e trattative, gruppi e canali, agente AI e media, e legge l'archivio delle chat. Si può usare anche come strumento di un AI Agent.
- **RisveglIA Trigger**: avvia il workflow quando succede qualcosa in RisveglIA, per esempio un messaggio ricevuto o inviato. L'iscrizione si crea e si cancella da sola quando attivi o spegni il workflow, e ogni evento arriva firmato.

Guida completa: [risveglia.it/integrazioni/n8n](https://risveglia.it/integrazioni/n8n).

## Installazione

In n8n apri **Settings > Community nodes > Install** e scrivi:

```
@ivanlaomarketing/n8n-nodes-risveglia
```

Il trigger ha bisogno che n8n sia raggiungibile da internet con un indirizzo https.

## Credenziale

1. In RisveglIA apri **Impostazioni, Integrazioni** e crea un **token personale**. Scegli i permessi che servono al workflow: per esempio, per inviare messaggi serve il permesso di invio.
2. In n8n crea una credenziale **RisveglIA API** e incolla il token. L'indirizzo resta quello predefinito, `https://app.risveglia.it/api`.

Il token dà accesso ai tuoi dati: tienilo riservato e, se non ti serve più, revocalo da Impostazioni, Integrazioni. Il token lavora con l'accesso di chi l'ha creato: se quella persona perde un permesso, lo perde anche il token.

## Note

- **Chiave di idempotenza.** «Invia un messaggio» e «Crea promemoria» accettano una chiave di idempotenza. Se il workflow ripete la stessa chiamata con la stessa chiave, il messaggio parte una volta sola.
- **Elenchi.** Le risposte che contengono un elenco arrivano come un solo elemento. Per lavorare un elemento alla volta usa **Split Out**.
- **Allegati e vocali.** «Allegati» elenca immagini, vocali, video e documenti di un messaggio o di una chat; «Scarica il file di un allegato» li passa ai nodi successivi come dato binario; «Trascrivi un vocale» usa la chiave AI salvata nell'account. «Testo leggibile di un allegato» restituisce come testo PDF, Word, Excel, PowerPoint, TXT, MD e CSV, oltre ai vocali già trascritti. Gli id si possono incollare anche nella forma `media:<id>`.
- **Limiti.** Valgono le stesse regole e gli stessi limiti di invio del portale RisveglIA.

## Sviluppo

```bash
npm install
npm run build
npm run lint
```

Il codice dei nodi nasce dal catalogo delle operazioni di RisveglIA e viene aggiornato da lì: non modificare a mano `nodes/RisveglIa/catalogo.ts`.

La pubblicazione su npm parte da GitHub Actions quando si crea un tag `vX.Y.Z` uguale alla versione in `package.json`, con provenance.

## Autore

**Ivan Lao**, consulente di Marketing Automation e AI dal 2015, Make Certified Partner e Meta Tech Provider WhatsApp Business Platform.

- Sito: [laoivan.com](https://laoivan.com)
- LinkedIn: [ivanlaomarketing](https://www.linkedin.com/in/ivanlaomarketing/)
- YouTube: [@IvanLaoMarketing](https://www.youtube.com/@IvanLaoMarketing)

## Licenza

[MIT](LICENSE)
