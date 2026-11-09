import {
  NodeConnectionTypes,
  NodeOperationError,
  type IDataObject,
  type IHookFunctions,
  type ILoadOptionsFunctions,
  type INodePropertyOptions,
  type INodeType,
  type INodeTypeDescription,
  type IWebhookFunctions,
  type IWebhookResponseData,
} from "n8n-workflow";
import { eventi } from "./catalogo";
import { firmaValida, INTESTAZIONE_FIRMA } from "./firma";
import { CREDENZIALE, chiama } from "./richiesta";

type Iscrizione = { id: string; url: string };

/**
 * Attivatore: quando il flusso si attiva iscrive l'indirizzo di n8n agli eventi di RisveglIA (webhook in uscita, payload
 * v1), quando si disattiva lo toglie. Ogni evento arriva firmato: senza firma valida il flusso non parte.
 * Serve un token con l'ambito Attivatori; l'indirizzo di n8n deve essere pubblico e in https.
 */
export class RisveglIaTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: "RisveglIA Trigger",
    name: "risveglIaTrigger",
    icon: "file:risveglia.svg",
    group: ["trigger"],
    version: 1,
    subtitle: '={{($parameter["eventi"] || []).join(", ") || "Tutte le attività"}}',
    description: "Fa partire il flusso a ogni messaggio, chiamata o cambio di etichetta su RisveglIA",
    defaults: { name: "RisveglIA Trigger" },
    inputs: [],
    outputs: [NodeConnectionTypes.Main],
    credentials: [{ name: CREDENZIALE, required: true }],
    webhooks: [{ name: "default", httpMethod: "POST", responseMode: "onReceived", path: "webhook" }],
    properties: [
      {
        displayName: "Eventi",
        name: "eventi",
        type: "multiOptions",
        options: eventi.map((e) => ({ name: e.name, value: e.value })),
        default: [],
        description: "Vuoto: tutte le attività, anche quelle che RisveglIA aggiungerà in futuro",
      },
      {
        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
        displayName: "Numero",
        name: "numero",
        type: "options",
        typeOptions: { loadOptionsMethod: "numeri" },
        default: "",
        // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
        description: "Solo gli eventi di questo numero. Vuoto: tutti i numeri.",
      },
      {
        displayName: "Nome Iscrizione",
        name: "nome",
        type: "string",
        default: "n8n",
        description: "Come appare in RisveglIA, Impostazioni, Webhook",
      },
    ],
  };

  methods = {
    loadOptions: {
      async numeri(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const res = await chiama(this, { method: "GET", path: "/api/v2/numeri" });
        const items = (res.body as { items?: { id: string; label: string | null; phone: string | null }[] }).items ?? [];
        return [{ name: "Tutti", value: "" }, ...items.map((n) => ({ name: n.label || n.phone || n.id, value: n.id }))];
      },
    },
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const data = this.getWorkflowStaticData("node");
        if (!data.webhookId) return false;
        const res = await chiama(this, { method: "GET", path: "/api/v2/webhook" });
        const url = this.getNodeWebhookUrl("default");
        const found = ((res.body as { webhooks?: Iscrizione[] }).webhooks ?? []).some((w) => w.id === data.webhookId && w.url === url);
        if (!found) {
          delete data.webhookId;
          delete data.secret;
        }
        return found;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        const url = this.getNodeWebhookUrl("default");
        if (!url?.startsWith("https://")) throw new NodeOperationError(this.getNode(), "RisveglIA manda gli eventi solo a indirizzi https: pubblica n8n con un indirizzo https.");
        const numero = this.getNodeParameter("numero", "") as string;
        const body: IDataObject = {
          name: (this.getNodeParameter("nome", "n8n") as string) || "n8n",
          url,
          events: this.getNodeParameter("eventi", []) as string[],
          ...(numero ? { numberId: numero } : {}),
        };
        const res = await chiama(this, { method: "POST", path: "/api/v2/webhook", body });
        const out = res.body as { webhook: { id: string }; secret: string };
        const data = this.getWorkflowStaticData("node");
        data.webhookId = out.webhook.id;
        data.secret = out.secret;
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        const data = this.getWorkflowStaticData("node");
        if (data.webhookId) {
          try {
            await chiama(this, { method: "DELETE", path: `/api/v2/webhook/${String(data.webhookId)}` });
          } catch (error) {
            // Già tolta dal portale: va bene lo stesso. Ogni altro errore si mostra.
            if ((error as { httpCode?: string }).httpCode !== "404") throw new NodeOperationError(this.getNode(), error as Error);
          }
        }
        delete data.webhookId;
        delete data.secret;
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const secret = this.getWorkflowStaticData("node").secret as string | undefined;
    const raw = req.rawBody ? req.rawBody.toString("utf8") : JSON.stringify(this.getBodyData());
    const header = this.getHeaderData()[INTESTAZIONE_FIRMA];
    if (!secret || !firmaValida(secret, typeof header === "string" ? header : undefined, raw)) {
      this.getResponseObject().status(401).json({ error: "firma non valida" });
      return { noWebhookResponse: true };
    }
    return { workflowData: [[{ json: this.getBodyData() }]] };
  }
}
