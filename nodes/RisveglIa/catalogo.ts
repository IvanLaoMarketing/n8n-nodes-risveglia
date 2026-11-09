// File generato da scripts/genera-catalogo.ts (pnpm --filter @ivanlaomarketing/n8n-nodes-risveglia genera): non modificarlo a mano.

export const gruppi = ["Messaggi","Contatti e trattative","Gruppi e canali","Agente AI","Media","Campagne e automazioni","Attivatori","Account"] as const;

export const operazioni = [
  {
    "id": "numeri.elenca",
    "method": "GET",
    "path": "/v2/numeri",
    "scope": "sources:read",
    "group": "Account",
    "title": "Numeri collegati e stato del collegamento",
    "idempotent": false
  },
  {
    "id": "invii.crea",
    "method": "POST",
    "path": "/v2/invii",
    "scope": "messages:send",
    "group": "Messaggi",
    "title": "Invia una risposta, una reazione, una modifica o un'eliminazione",
    "idempotent": true
  },
  {
    "id": "invii.elenca",
    "method": "GET",
    "path": "/v2/invii",
    "scope": "messages:send",
    "group": "Messaggi",
    "title": "Invii recenti di una chat e il loro stato",
    "idempotent": false
  },
  {
    "id": "invii.annulla",
    "method": "POST",
    "path": "/v2/invii/{id}/annulla",
    "scope": "messages:send",
    "group": "Messaggi",
    "title": "Annulla un invio ancora in attesa",
    "idempotent": false
  },
  {
    "id": "invii.impostazioni",
    "method": "GET",
    "path": "/v2/invii/impostazioni",
    "scope": "messages:send",
    "group": "Messaggi",
    "title": "Tetti e fasce orarie degli invii",
    "idempotent": false
  },
  {
    "id": "etichette.elenca",
    "method": "GET",
    "path": "/v2/etichette",
    "scope": "contacts:read",
    "group": "Contatti e trattative",
    "title": "Elenca le etichette",
    "idempotent": false
  },
  {
    "id": "etichette.crea",
    "method": "POST",
    "path": "/v2/etichette",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Crea un'etichetta",
    "idempotent": false
  },
  {
    "id": "chat.etichette",
    "method": "PUT",
    "path": "/v2/chats/{id}/etichette",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Imposta le etichette di una chat",
    "idempotent": false
  },
  {
    "id": "promemoria.crea",
    "method": "POST",
    "path": "/v2/reminders",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Crea un promemoria",
    "idempotent": true
  },
  {
    "id": "promemoria.aggiorna",
    "method": "PATCH",
    "path": "/v2/reminders/{id}",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Aggiorna o chiude un promemoria",
    "idempotent": false
  },
  {
    "id": "promemoria.elimina",
    "method": "DELETE",
    "path": "/v2/reminders/{id}",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Elimina un promemoria",
    "idempotent": false
  },
  {
    "id": "trattative.board",
    "method": "GET",
    "path": "/v2/trattative",
    "scope": "opportunities:read",
    "group": "Contatti e trattative",
    "title": "Pipeline, fasi e card delle trattative",
    "idempotent": false
  },
  {
    "id": "trattative.card.crea",
    "method": "POST",
    "path": "/v2/trattative/card",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Mette una chat in una pipeline",
    "idempotent": false
  },
  {
    "id": "trattative.card.sposta",
    "method": "PATCH",
    "path": "/v2/trattative/card/{id}",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Sposta o aggiorna una card",
    "idempotent": false
  },
  {
    "id": "trattative.card.elimina",
    "method": "DELETE",
    "path": "/v2/trattative/card/{id}",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Toglie una card dalla pipeline",
    "idempotent": false
  },
  {
    "id": "consensi.registra",
    "method": "POST",
    "path": "/v2/consensi",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Registra un consenso o una disiscrizione",
    "idempotent": false
  },
  {
    "id": "esclusioni.elenca",
    "method": "GET",
    "path": "/v2/esclusioni",
    "scope": "contacts:read",
    "group": "Contatti e trattative",
    "title": "Elenca i numeri esclusi dalle automazioni",
    "idempotent": false
  },
  {
    "id": "esclusioni.crea",
    "method": "POST",
    "path": "/v2/esclusioni",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Esclude un numero dalle automazioni",
    "idempotent": false
  },
  {
    "id": "esclusioni.elimina",
    "method": "DELETE",
    "path": "/v2/esclusioni/{id}",
    "scope": "crm:write",
    "group": "Contatti e trattative",
    "title": "Toglie un'esclusione",
    "idempotent": false
  },
  {
    "id": "spazi.elenca",
    "method": "GET",
    "path": "/v2/spazi",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Elenca gruppi, community e canali",
    "idempotent": false
  },
  {
    "id": "spazi.dettaglio",
    "method": "GET",
    "path": "/v2/spazi/{id}",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Dettaglio di un gruppo o canale",
    "idempotent": false
  },
  {
    "id": "spazi.gruppo.crea",
    "method": "POST",
    "path": "/v2/spazi/gruppi",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Crea un gruppo",
    "idempotent": false
  },
  {
    "id": "spazi.canale.crea",
    "method": "POST",
    "path": "/v2/spazi/canali",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Crea un canale",
    "idempotent": false
  },
  {
    "id": "spazi.azione",
    "method": "POST",
    "path": "/v2/spazi/{id}/azioni",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Impostazioni, amministratori, rimozioni, richieste e link di invito",
    "idempotent": false
  },
  {
    "id": "spazi.invitabili",
    "method": "GET",
    "path": "/v2/spazi/{id}/contatti",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Contatti invitabili in un gruppo",
    "idempotent": false
  },
  {
    "id": "spazi.inviti.crea",
    "method": "POST",
    "path": "/v2/spazi/{id}/inviti",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Mette in coda gli inviti, con i tetti giornalieri",
    "idempotent": false
  },
  {
    "id": "spazi.inviti.elenca",
    "method": "GET",
    "path": "/v2/spazi/inviti",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Code degli inviti",
    "idempotent": false
  },
  {
    "id": "spazi.inviti.dettaglio",
    "method": "GET",
    "path": "/v2/spazi/inviti/{id}",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Stato di una coda degli inviti",
    "idempotent": false
  },
  {
    "id": "spazi.inviti.azione",
    "method": "POST",
    "path": "/v2/spazi/inviti/{id}/{azione}",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Mette in pausa, riprende o annulla una coda degli inviti",
    "idempotent": false
  },
  {
    "id": "pubblicazioni.elenca",
    "method": "GET",
    "path": "/v2/pubblicazioni",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Elenca le pubblicazioni",
    "idempotent": false
  },
  {
    "id": "pubblicazioni.destinazioni",
    "method": "GET",
    "path": "/v2/pubblicazioni/destinazioni",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Gruppi, canali e stato dove si può pubblicare",
    "idempotent": false
  },
  {
    "id": "pubblicazioni.crea",
    "method": "POST",
    "path": "/v2/pubblicazioni",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Crea una pubblicazione in gruppi, canali o stato",
    "idempotent": false
  },
  {
    "id": "pubblicazioni.dettaglio",
    "method": "GET",
    "path": "/v2/pubblicazioni/{id}",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Dettaglio di una pubblicazione",
    "idempotent": false
  },
  {
    "id": "pubblicazioni.azione",
    "method": "POST",
    "path": "/v2/pubblicazioni/{id}/{azione}",
    "scope": "groups:write",
    "group": "Gruppi e canali",
    "title": "Programma, mette in pausa o annulla una pubblicazione",
    "idempotent": false
  },
  {
    "id": "agente.stato",
    "method": "GET",
    "path": "/v2/agente",
    "scope": "agent:write",
    "group": "Agente AI",
    "title": "Impostazioni dell'agente e chat in pausa",
    "idempotent": false
  },
  {
    "id": "agente.riprendi",
    "method": "POST",
    "path": "/v2/agente/pause/{id}/riprendi",
    "scope": "agent:write",
    "group": "Agente AI",
    "title": "Fa riprendere l'agente in una chat in pausa",
    "idempotent": false
  },
  {
    "id": "media.elenca",
    "method": "GET",
    "path": "/v2/media",
    "scope": "media:write",
    "group": "Media",
    "title": "Elenca la libreria media",
    "idempotent": false
  },
  {
    "id": "media.dettaglio",
    "method": "GET",
    "path": "/v2/media/{id}",
    "scope": "media:write",
    "group": "Media",
    "title": "Dettaglio e stato di una generazione",
    "idempotent": false
  },
  {
    "id": "media.file",
    "method": "GET",
    "path": "/v2/media/{id}/file",
    "scope": "media:write",
    "group": "Media",
    "title": "Scarica il file di un media",
    "idempotent": false
  },
  {
    "id": "media.fal",
    "method": "GET",
    "path": "/v2/media/fal",
    "scope": "media:write",
    "group": "Media",
    "title": "Stato della chiave fal.ai e budget",
    "idempotent": false
  },
  {
    "id": "media.stima",
    "method": "POST",
    "path": "/v2/media/fal/stima",
    "scope": "media:write",
    "group": "Media",
    "title": "Stima il costo di una generazione",
    "idempotent": false
  },
  {
    "id": "media.genera",
    "method": "POST",
    "path": "/v2/media/genera",
    "scope": "media:write",
    "group": "Media",
    "title": "Genera un'immagine o un video con fal.ai",
    "idempotent": false
  },
  {
    "id": "template.elenca",
    "method": "GET",
    "path": "/v2/waba/template",
    "scope": "campaigns:write",
    "group": "Campagne e automazioni",
    "title": "Elenca i modelli di messaggio approvati",
    "idempotent": false
  },
  {
    "id": "liste.elenca",
    "method": "GET",
    "path": "/v2/liste",
    "scope": "campaigns:write",
    "group": "Campagne e automazioni",
    "title": "Elenca le liste dei destinatari",
    "idempotent": false
  },
  {
    "id": "automazioni.simula",
    "method": "POST",
    "path": "/v2/automazioni/simula",
    "scope": "automations:write",
    "group": "Campagne e automazioni",
    "title": "Simula un'automazione sugli ultimi 30 giorni",
    "idempotent": false
  },
  {
    "id": "automazioni.esecuzioni",
    "method": "GET",
    "path": "/v2/flussi/esecuzioni",
    "scope": "automations:write",
    "group": "Campagne e automazioni",
    "title": "Elenca le esecuzioni delle automazioni",
    "idempotent": false
  },
  {
    "id": "webhook.elenca",
    "method": "GET",
    "path": "/v2/webhook",
    "scope": "webhooks:write",
    "group": "Attivatori",
    "title": "Elenca gli indirizzi iscritti",
    "idempotent": false
  },
  {
    "id": "webhook.iscrivi",
    "method": "POST",
    "path": "/v2/webhook",
    "scope": "webhooks:write",
    "group": "Attivatori",
    "title": "Iscrive un indirizzo alle attività",
    "idempotent": false
  },
  {
    "id": "webhook.elimina",
    "method": "DELETE",
    "path": "/v2/webhook/{id}",
    "scope": "webhooks:write",
    "group": "Attivatori",
    "title": "Toglie un indirizzo iscritto",
    "idempotent": false
  },
  {
    "id": "webhook.prova",
    "method": "POST",
    "path": "/v2/webhook/{id}/prova",
    "scope": "webhooks:write",
    "group": "Attivatori",
    "title": "Manda un evento di prova",
    "idempotent": false
  },
  {
    "id": "webhook.consegne",
    "method": "GET",
    "path": "/v2/webhook/{id}/consegne",
    "scope": "webhooks:write",
    "group": "Attivatori",
    "title": "Registro delle consegne",
    "idempotent": false
  }
] as const;

export const eventi = [
  {
    "value": "message.received",
    "name": "Messaggio ricevuto"
  },
  {
    "value": "message.sent",
    "name": "Messaggio inviato (anche dal telefono)"
  },
  {
    "value": "message.status",
    "name": "Stato di consegna (consegnato, letto)"
  },
  {
    "value": "message.reaction",
    "name": "Reazione a un messaggio"
  },
  {
    "value": "message.edited",
    "name": "Messaggio modificato"
  },
  {
    "value": "message.deleted",
    "name": "Messaggio cancellato"
  },
  {
    "value": "call.received",
    "name": "Chiamata ricevuta"
  },
  {
    "value": "call.accepted",
    "name": "Chiamata accettata dal telefono"
  },
  {
    "value": "call.rejected",
    "name": "Chiamata rifiutata (dal telefono o da una regola di RisveglIA)"
  },
  {
    "value": "label.changed",
    "name": "Etichetta di WhatsApp aggiunta o tolta"
  },
  {
    "value": "number.connected",
    "name": "Numero collegato"
  },
  {
    "value": "number.disconnected",
    "name": "Numero scollegato"
  }
] as const;
