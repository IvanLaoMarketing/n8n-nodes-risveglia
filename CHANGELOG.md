# Changelog

## 0.9.0 - 2026-11-23

- Nuova opzione «Scritto Da Una Persona» in «Invia a un numero»: se il testo l'ha scritto a mano un operatore, per esempio da un CRM, l'agente AI va in pausa in quella chat come quando scrivi dal portale.
- Per aggiornare: Impostazioni › Nodi della community › «Aggiorna», poi ricarica l'editor. I flussi già salvati continuano a funzionare.

## 0.8.0 - 2026-11-21

- Nuova operazione «Il numero è su WhatsApp?»: prima di scrivere a un contatto nuovo sai se il numero usa WhatsApp.
- Nuova operazione «Segna una chat come letta»: un flusso segna come letti i messaggi di una chat che ha già gestito. Se il collegamento con il QR code è fermo, aspetta che torni.
- Invii con canale Automatico in una chat già aperta: se il QR è fermo il messaggio parte dall'API ufficiale, solo nelle 24 ore dall'ultimo messaggio del contatto, e torna al QR quando è di nuovo stabile. Fuori dalle 24 ore l'invio si rifiuta con un errore chiaro.
- Per aggiornare: Impostazioni › Nodi della community › «Aggiorna», poi ricarica l'editor. I flussi già salvati continuano a funzionare.

## 0.7.0 - 2026-11-20

- Eventi WhatsApp: «Invia in una chat» con kind evento manda un evento (nome, giorno, ora, luogo, descrizione) in una chat o in un gruppo dei numeri collegati con il QR code. Chi lo riceve risponde «Ci sarò», «Non ci sarò» o «Forse».
- Nuova lettura «Eventi mandati in una chat con le risposte»: quante risposte per ogni scelta, chi ha risposto e quanti ospiti porta.
- Nuova operazione «Carica o sostituisci un file nelle fonti»: carica un testo, un PDF o un Word nei File e documenti che l'agente AI consulta. Con lo stesso nome sostituisce il file precedente appena il nuovo è pronto; se il contenuto non è cambiato non carica nulla. Serve il permesso «File e documenti» sul token.
- Per aggiornare: Impostazioni › Nodi della community › «Aggiorna», poi ricarica l'editor. I flussi già salvati continuano a funzionare.

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
