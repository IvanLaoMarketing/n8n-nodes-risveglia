# Changelog

## 0.6.0 - 2026-11-20

- «Crea invio» e «Invia a un numero» accettano il campo «Contenuto (JSON)»: foto, video, documenti e vocali dalla libreria media, sondaggi, posizione e scheda contatto con il collegamento QR; pulsanti, lista, link, posizione, contatto e file con WhatsApp Business API entro 24 ore dall'ultimo messaggio del contatto.
- Nuova operazione «Importa un file da link»: carica nella libreria media un file da un indirizzo web e ne restituisce l'id da usare negli invii.
- Valgono gli stessi tetti, fasce orarie e permessi del portale. Per aggiornare: Impostazioni › Nodi della community › «Aggiorna», poi ricarica l'editor. I flussi già salvati continuano a funzionare.

## 0.5.0 - 2026-11-17

- Il nodo manda a ogni chiamata la sua versione (intestazione `X-Risveglia-Client: n8n/0.5.0`): RisveglIA riconosce la versione in uso e ti avvisa nel portale e per email quando ne esce una nuova, con cosa cambia e cosa fare.
- Per aggiornare: in n8n apri Impostazioni › Nodi della community, premi «Aggiorna» accanto a @ivanlaomarketing/n8n-nodes-risveglia e ricarica l'editor. I flussi già salvati continuano a funzionare.

## 0.4.0 - 2026-11-15

- Nuova operazione «Invia a un numero», anche a un numero mai scritto prima: testo (con allegato) via QR oppure template approvato con variabili via API, canale Automatico, QR o API senza ripieghi silenziosi, template alternativo fuori dalle 24 ore, chiave di idempotenza.
- Primo messaggio a un contatto nuovo: serve un token con il permesso «Primo messaggio a contatti nuovi» e la fonte e la data del consenso. Valgono la fascia 8-21 e i tetti giornalieri dell'account.
- Nuove letture: numeri mittenti con i canali collegati e i template approvati, stato di un invio a un numero.

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
