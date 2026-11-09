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
};

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
  for (const op of operazioni) {
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
    displayOptions: { show: { operation: ["media.file"] } },
    description: "Nome del campo binario in cui mettere il file scaricato",
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
          const valore = String(this.getNodeParameter(`percorso_${nome}`, i)).trim();
          if (!/^[A-Za-z0-9-]{1,64}$/.test(valore)) throw new NodeOperationError(this.getNode(), `Valore non valido per ${nomiParametri[nome]?.displayName ?? nome}.`, { itemIndex: i });
          path = path.replace(`{${nome}}`, valore);
        }
        const binario = op.id === "media.file";
        const chiave = op.idempotent ? String(this.getNodeParameter("chiaveIdempotenza", i, "")).trim() : "";
        const res = await chiama(this, {
          method: op.method,
          path: `/api${path}`,
          ...(conCorpo(op) ? { body: json(this, "corpo", i) } : { qs: json(this, "parametri", i) }),
          binario,
          ...(chiave ? { headers: { "Idempotency-Key": chiave } } : {}),
          itemIndex: i,
        });
        if (binario) {
          const campo = this.getNodeParameter("campoFile", i, "data") as string;
          const tipo = String(res.headers["content-type"] ?? "application/octet-stream");
          const nomeFile = /filename="?([^";]+)"?/.exec(String(res.headers["content-disposition"] ?? ""))?.[1];
          const dati = await this.helpers.prepareBinaryData(Buffer.from(res.body as ArrayBuffer), nomeFile, tipo);
          out.push({ json: { id: path.split("/")[3] }, binary: { [campo]: dati }, pairedItem: { item: i } });
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
