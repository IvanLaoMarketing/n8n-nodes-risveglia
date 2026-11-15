import {
  NodeConnectionTypes,
  NodeOperationError,
  type IDataObject,
  type IExecuteFunctions,
  type ILoadOptionsFunctions,
  type INodeExecutionData,
  type INodeProperties,
  type INodePropertyOptions,
  type INodeType,
  type INodeTypeDescription,
} from "n8n-workflow";
import { gruppi, operazioni } from "./catalogo";
import { CREDENZIALE, chiama } from "./richiesta";

type Operazione = (typeof operazioni)[number];

/** Valore della risorsa nel nodo: il gruppo del catalogo senza spazi né accenti. */
export const risorsaDi = (gruppo: string) =>
  gruppo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const RISORSA_STRUMENTI = "letture";
const OPERAZIONE_STRUMENTO = "strumento.esegui";

/** Parametri del percorso (fra graffe) di un'operazione, nell'ordine in cui compaiono. */
export const parametriDi = (op: Pick<Operazione, "path">) => [...op.path.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!);
const conCorpo = (op: Operazione) => op.method === "POST" || op.method === "PUT" || op.method === "PATCH";

/** Esempi di corpo e di parametri per le operazioni più usate: il resto parte da {}. */
const esempiCorpo: Record<string, IDataObject> = {
  "invii.crea": { kind: "testo", conversationId: "", text: "" },
  "etichette.crea": { name: "" },
  "chat.etichette": { labelIds: [] },
  "promemoria.crea": { title: "", chatId: "", dueAt: "", timezone: "Europe/Rome" },
  "promemoria.aggiorna": { status: "done", version: 1 },
  "trattative.card.crea": { chatId: "" },
  "trattative.card.sposta": { stageId: "", version: 1 },
  "webhook.iscrivi": { name: "", url: "https://", events: [] },
};
const esempiQuery: Record<string, IDataObject> = {
  "invii.elenca": { conversationId: "" },
  "allegati.elenca": { messageId: "" },
};

/** «Invia a un numero» ha campi suoi al posto del corpo JSON: numero mittente e template si scelgono da elenchi. */
export const OPERAZIONE_NUMERO = "numero.invia";
const suNumero = { show: { operation: [OPERAZIONE_NUMERO] } };
const coppie = (displayName: string, name: string, description: string): INodeProperties => ({
  displayName,
  name,
  type: "fixedCollection",
  typeOptions: { multipleValues: true },
  default: {},
  displayOptions: suNumero,
  description,
  options: [
    {
      name: "voce",
      displayName: "Variabile",
      values: [
        { displayName: "Variabile", name: "chiave", type: "string", default: "", description: "1, 2… per il testo, header:1 per l'intestazione, button:0 per un link" },
        { displayName: "Valore", name: "valore", type: "string", default: "" },
      ],
    },
  ],
});
function campiNumero(): INodeProperties[] {
  return [
    {
      // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
      displayName: "Numero Mittente",
      name: "numeroMittente",
      type: "options",
      typeOptions: { loadOptionsMethod: "numeriCanali" },
      required: true,
      default: "",
      displayOptions: suNumero,
      // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
      description: "Tra parentesi i canali collegati adesso: QR, API o tutti e due. Scegli dall'elenco o usa un'espressione.",
    },
    { displayName: "Telefono Destinatario", name: "telefono", type: "string", default: "", displayOptions: suNumero, description: "Con il prefisso internazionale (senza prefisso vale l'Italia). In alternativa compila la chat." },
    { displayName: "Chat", name: "chatId", type: "string", default: "", displayOptions: suNumero, description: "ID di una chat già in archivio sul numero mittente, al posto del telefono" },
    {
      displayName: "Canale",
      name: "canale",
      type: "options",
      default: "automatico",
      displayOptions: suNumero,
      options: [
        { name: "Automatico", value: "automatico", description: "Con un testo: API se il contatto ha scritto nelle ultime 24 ore, altrimenti QR code. Con un template: API." },
        { name: "Collegamento Con QR Code", value: "qr" },
        { name: "WhatsApp Business API", value: "api" },
      ],
      description: "Se il canale scelto non è collegato l'invio si rifiuta, senza ripieghi",
    },
    { displayName: "Testo", name: "testo", type: "string", typeOptions: { rows: 4 }, default: "", displayOptions: suNumero, description: "Compila il testo oppure il template, non tutti e due" },
    {
      // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
      displayName: "Template",
      name: "template",
      type: "options",
      typeOptions: { loadOptionsMethod: "templateNumero", loadOptionsDependsOn: ["numeroMittente"] },
      default: "",
      displayOptions: suNumero,
      // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
      description: "Solo i template approvati del numero scelto: si creano e si modificano nel portale o da un assistente collegato",
    },
    coppie("Variabili del template", "variabili", "Valori delle variabili del template"),
    { displayName: "File Libreria Media", name: "mediaId", type: "string", default: "", displayOptions: suNumero, description: "ID di un file della libreria: allegato del testo via QR o intestazione del template" },
    {
      // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
      displayName: "Template Alternativo",
      name: "templateRiserva",
      type: "options",
      typeOptions: { loadOptionsMethod: "templateNumero", loadOptionsDependsOn: ["numeroMittente"] },
      default: "",
      displayOptions: suNumero,
      // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
      description: "Canale Automatico con un testo, fuori dalle 24 ore e senza QR code: parte questo template invece di rifiutare",
    },
    coppie("Variabili del template di riserva", "variabiliRiserva", "Valori delle variabili del template di riserva"),
    { displayName: "Fonte Consenso", name: "consensoFonte", type: "string", default: "", displayOptions: suNumero, description: "Obbligatoria per il primo messaggio a un numero nuovo: dove ha dato il consenso, per esempio il modulo del sito" },
    { displayName: "Data Consenso", name: "consensoData", type: "dateTime", default: "", displayOptions: suNumero },
    {
      displayName: "Scopo Consenso",
      name: "consensoScopo",
      type: "options",
      default: "utilita",
      displayOptions: suNumero,
      options: [
        { name: "Servizio", value: "utilita" },
        { name: "Marketing", value: "marketing" },
      ],
    },
  ];
}

type Coppie = { voce?: { chiave?: string; valore?: string }[] };
const daCoppie = (v: Coppie | undefined) => {
  const voci = (v?.voce ?? []).filter((x) => x.chiave?.trim());
  return voci.length ? Object.fromEntries(voci.map((x) => [x.chiave!.trim(), x.valore ?? ""])) : undefined;
};

/** Corpo di «Invia a un numero» dai campi del nodo: i campi vuoti non si mandano. */
export function corpoNumero(get: (nome: string) => unknown): IDataObject {
  const t = (nome: string) => String(get(nome) ?? "").trim();
  const body: IDataObject = { numberId: t("numeroMittente"), channel: t("canale") || "automatico" };
  for (const [campo, chiave] of [["telefono", "phone"], ["chatId", "chatId"], ["testo", "text"], ["template", "templateId"], ["mediaId", "mediaId"], ["templateRiserva", "fallbackTemplateId"]] as const) {
    const v = t(campo);
    if (v) body[chiave] = v;
  }
  const variables = daCoppie(get("variabili") as Coppie);
  if (variables) body.variables = variables;
  const fallbackVariables = daCoppie(get("variabiliRiserva") as Coppie);
  if (fallbackVariables) body.fallbackVariables = fallbackVariables;
  if (t("consensoFonte")) body.consent = { source: t("consensoFonte"), date: t("consensoData") || new Date().toISOString(), purpose: t("consensoScopo") || "utilita" };
  return body;
}

const nomiParametri: Record<string, { displayName: string; description: string }> = {
  id: { displayName: "ID", description: "Identificativo dell'elemento, come lo restituisce un'altra operazione di RisveglIA" },
  azione: { displayName: "Azione", description: "Nome dell'azione, come indicato nella guida dell'operazione" },
};

function proprieta(): INodeProperties[] {
  const risorse: INodePropertyOptions[] = [
    ...gruppi.map((g) => ({ name: g, value: risorsaDi(g) })),
    { name: "Archivio", value: RISORSA_STRUMENTI, description: "Chat, messaggi, contatti, trattative, promemoria e telefonate" },
  ];
  const props: INodeProperties[] = [
    { displayName: "Risorsa", name: "resource", type: "options", noDataExpression: true, options: risorse, default: risorsaDi("Messaggi") },
  ];
  for (const g of gruppi) {
    const ops = operazioni.filter((o) => o.group === g);
    const primaOperazione: string = ops[0]?.id ?? "";
    props.push({
      displayName: "Operazione",
      name: "operation",
      type: "options",
      noDataExpression: true,
      displayOptions: { show: { resource: [risorsaDi(g)] } },
      options: ops.map((o) => ({ name: o.title, value: o.id, action: o.title, description: `${o.method} ${o.path}` })),
      default: primaOperazione,
    });
  }
  props.push(
    {
      displayName: "Operazione",
      name: "operation",
      type: "options",
      noDataExpression: true,
      displayOptions: { show: { resource: [RISORSA_STRUMENTI] } },
      options: [{ name: "Leggi", value: OPERAZIONE_STRUMENTO, action: "Leggi archivio" }],
      default: OPERAZIONE_STRUMENTO,
    },
    {
      // Nomi in italiano: la regola chiede «Name or ID» e la frase inglese, che qui stonerebbero con il resto del nodo.
      // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
      displayName: "Lettura",
      name: "strumento",
      type: "options",
      typeOptions: { loadOptionsMethod: "strumenti" },
      displayOptions: { show: { operation: [OPERAZIONE_STRUMENTO] } },
      default: "",
      required: true,
      // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
      description: "Le letture ammesse dal token. Scegli dall'elenco o usa un'espressione.",
    },
    {
      displayName: "Argomenti (JSON)",
      name: "argomenti",
      type: "json",
      displayOptions: { show: { operation: [OPERAZIONE_STRUMENTO] } },
      default: "{}",
      description: "Argomenti della lettura, per esempio {\"query\": \"preventivo\"}",
    },
  );
  const nomi = [...new Set(operazioni.flatMap((o) => parametriDi(o)))];
  for (const nome of nomi) {
    props.push({
      displayName: nomiParametri[nome]?.displayName ?? nome,
      name: `percorso_${nome}`,
      type: "string",
      required: true,
      default: "",
      displayOptions: { show: { operation: operazioni.filter((o) => parametriDi(o).includes(nome)).map((o) => o.id) } },
      description: nomiParametri[nome]?.description ?? "",
    });
  }
  props.push(...campiNumero());
  for (const op of operazioni) {
    if (op.id === OPERAZIONE_NUMERO) continue;
    if (conCorpo(op))
      props.push({
        displayName: "Corpo (JSON)",
        name: "corpo",
        type: "json",
        default: JSON.stringify(esempiCorpo[op.id] ?? {}, null, 2),
        displayOptions: { show: { operation: [op.id] } },
        description: "Dati dell'operazione, come nella documentazione dell'API di RisveglIA",
      });
    else
      props.push({
        displayName: "Parametri (JSON)",
        name: "parametri",
        type: "json",
        default: JSON.stringify(esempiQuery[op.id] ?? {}, null, 2),
        displayOptions: { show: { operation: [op.id] } },
        description: "Filtri dell'operazione, come nella documentazione dell'API di RisveglIA",
      });
  }
  props.push({
    displayName: "Chiave di idempotenza",
    name: "chiaveIdempotenza",
    type: "string",
    default: "",
    displayOptions: { show: { operation: operazioni.filter((o) => o.idempotent).map((o) => o.id) } },
    description: "Facoltativa: con la stessa chiave (da 8 a 200 caratteri) un nuovo tentativo restituisce quello già creato invece di farne un doppione, per esempio l'ID dell'elemento che ha fatto partire il flusso",
  });
  props.push({
    displayName: "Campo del file",
    name: "campoFile",
    type: "string",
    default: "data",
    displayOptions: { show: { operation: operazioni.filter((o) => o.binary).map((o) => o.id) } },
    description: "Nome del campo binario in cui mettere il file scaricato (immagine, vocale, video o documento)",
  });
  return props;
}

function json(ctx: IExecuteFunctions, nome: string, i: number): IDataObject {
  const raw = ctx.getNodeParameter(nome, i, "{}") as string | IDataObject;
  if (typeof raw !== "string") return raw;
  if (raw.trim() === "") return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as IDataObject;
  } catch {
    // sotto
  }
  throw new NodeOperationError(ctx.getNode(), `Il campo ${nome} deve essere un oggetto JSON.`, { itemIndex: i });
}

export class RisveglIa implements INodeType {
  description: INodeTypeDescription = {
    displayName: "RisveglIA",
    name: "risveglIa",
    icon: "file:risveglia.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: "Risposte WhatsApp, contatti e trattative, gruppi e canali, agente AI, media e attivatori di RisveglIA",
    defaults: { name: "RisveglIA" },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [{ name: CREDENZIALE, required: true }],
    properties: proprieta(),
  };

  methods = {
    loadOptions: {
      /** Letture ammesse dal token, dall'elenco dell'API: cambiano con gli ambiti del token, non con la versione del nodo. */
      async strumenti(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const res = await chiama(this, { method: "GET", path: "/operazioni" });
        const tools = (res.body as { tools?: { name: string; title?: string; description?: string }[] }).tools ?? [];
        return tools.map((t) => ({ name: t.title || t.name, value: t.name, description: t.description }));
      },
      /** Numeri mittenti con i canali collegati adesso. */
      async numeriCanali(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const res = await chiama(this, { method: "GET", path: "/api/v2/invii/numero/canali" });
        const numbers = (res.body as { numbers?: { id: string; label: string; channels: string }[] }).numbers ?? [];
        return numbers.map((n) => ({ name: `${n.label} (${n.channels})`, value: n.id }));
      },
      /** Template approvati del numero scelto: solo questi, gli altri non si possono mandare. */
      async templateNumero(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const numero = String(this.getCurrentNodeParameter("numeroMittente") ?? "");
        const res = await chiama(this, { method: "GET", path: "/api/v2/invii/numero/canali" });
        const numbers = (res.body as { numbers?: { id: string; templates: { id: string; name: string; language: string; category: string; preview: string }[] }[] }).numbers ?? [];
        const templates = numbers.find((n) => n.id === numero)?.templates ?? [];
        return [{ name: "Nessuno", value: "" }, ...templates.map((t) => ({ name: `${t.name} · ${t.language.toUpperCase()} · ${t.category}`, value: t.id, description: t.preview.slice(0, 200) }))];
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const out: INodeExecutionData[] = [];
    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter("operation", i) as string;
        if (operation === OPERAZIONE_STRUMENTO) {
          const nome = this.getNodeParameter("strumento", i) as string;
          const res = await chiama(this, { method: "POST", path: `/strumenti/${encodeURIComponent(nome)}`, body: json(this, "argomenti", i), itemIndex: i });
          out.push({ json: res.body as IDataObject, pairedItem: { item: i } });
          continue;
        }
        const op = operazioni.find((o) => o.id === operation);
        if (!op) throw new NodeOperationError(this.getNode(), `Operazione sconosciuta: ${operation}`, { itemIndex: i });
        let path: string = op.path;
        for (const nome of parametriDi(op)) {
          // Gli allegati compaiono nei messaggi come media:<id>: il prefisso si accetta e si toglie.
          const valore = String(this.getNodeParameter(`percorso_${nome}`, i)).trim().replace(/^media:/i, "");
          if (!/^[A-Za-z0-9-]{1,64}$/.test(valore)) throw new NodeOperationError(this.getNode(), `Valore non valido per ${nomiParametri[nome]?.displayName ?? nome}.`, { itemIndex: i });
          path = path.replace(`{${nome}}`, valore);
        }
        const binario = op.binary;
        const chiave = op.idempotent ? String(this.getNodeParameter("chiaveIdempotenza", i, "")).trim() : "";
        const res = await chiama(this, {
          method: op.method,
          path: `/api${path}`,
          ...(op.id === OPERAZIONE_NUMERO
            ? { body: corpoNumero((nome) => this.getNodeParameter(nome, i, "")) }
            : conCorpo(op)
              ? { body: json(this, "corpo", i) }
              : { qs: json(this, "parametri", i) }),
          binario,
          ...(chiave ? { headers: { "Idempotency-Key": chiave } } : {}),
          itemIndex: i,
        });
        if (binario) {
          const campo = this.getNodeParameter("campoFile", i, "data") as string;
          const tipo = String(res.headers["content-type"] ?? "application/octet-stream");
          const nomeFile = /filename="?([^";]+)"?/.exec(String(res.headers["content-disposition"] ?? ""))?.[1];
          const dati = await this.helpers.prepareBinaryData(Buffer.from(res.body as ArrayBuffer), nomeFile, tipo);
          out.push({ json: { id: path.split("/")[3], fileName: dati.fileName ?? null, mimeType: dati.mimeType, sizeBytes: (res.body as ArrayBuffer).byteLength }, binary: { [campo]: dati }, pairedItem: { item: i } });
          continue;
        }
        const body = res.body;
        if (Array.isArray(body)) out.push(...body.map((b) => ({ json: b as IDataObject, pairedItem: { item: i } })));
        else out.push({ json: (body ?? { ok: true }) as IDataObject, pairedItem: { item: i } });
      } catch (error) {
        if (this.continueOnFail()) {
          out.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
      }
    }
    return [out];
  }
}
