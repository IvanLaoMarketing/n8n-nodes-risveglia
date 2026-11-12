# Changelog

## 0.3.0 - 2026-11-12

- Nuova operazione «Testo leggibile di un allegato»: restituisce come testo il contenuto di PDF, Word, Excel, PowerPoint, TXT, MD e CSV, e la trascrizione dei vocali già trascritti. Serve un token con l'ambito Fonti.

## 0.2.0 - 2026-11-12

- Allegati: elenco degli allegati di un messaggio o di una chat, dati di un allegato e download del file (immagini, vocali, video, documenti) come dato binario.
- Trascrizione di un vocale con la chiave AI salvata nell'account (se è già trascritto restituisce il testo senza altra spesa).
- Gli id degli allegati si possono incollare anche nella forma `media:<id>`.
- Il token lavora con l'accesso di chi l'ha creato: se la persona perde un permesso, il collegamento lo perde con lei.
- Testi aggiornati: il token si crea in Impostazioni, Integrazioni. Pagina del nodo: https://risveglia.it/integrazioni/n8n

## 0.1.2 - 2026-11-09

- Pubblicazione tramite Trusted Publishing npm (OIDC), senza token. Codice invariato.

## 0.1.1 - 2026-11-09

- Prima pubblicazione su npm.
- URL del repository corretto per la provenance.

## 0.1.0 - 2026-11-09

Prima versione pubblica.

- Nodo **RisveglIA**: 51 operazioni (messaggi WhatsApp, contatti e trattative, etichette, promemoria, gruppi e canali, agente AI, media, webhook) e letture dall'archivio, utilizzabile anche come strumento di un AI Agent.
- Nodo **RisveglIA Trigger**: iscrizione automatica agli eventi di RisveglIA con verifica della firma.
- Credenziale **RisveglIA API** con token personale `rsv_pat_`.
- Chiave di idempotenza su invio messaggi e promemoria.
