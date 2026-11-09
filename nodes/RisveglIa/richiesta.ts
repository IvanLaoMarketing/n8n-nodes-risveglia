import { NodeApiError, type IDataObject, type IExecuteFunctions, type IHookFunctions, type IHttpRequestMethods, type ILoadOptionsFunctions, type JsonObject } from "n8n-workflow";

export const CREDENZIALE = "risveglIaApi";
/** Percorso dell'API per n8n e Make sotto l'indirizzo di RisveglIA (https://app.risveglia.it/api). */
export const PREFISSO = "/v1/integrazioni";

type Contesto = IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions;

export type Risposta = { status: number; body: unknown; headers: Record<string, string | string[] | undefined> };

/** Messaggio leggibile di un errore di RisveglIA ({ error: { code, message } }), anche quando il corpo è un buffer. */
export function erroreDi(body: unknown): { code?: string; message: string } {
  let data = body;
  if (Buffer.isBuffer(data) || data instanceof ArrayBuffer) {
    try {
      data = JSON.parse(Buffer.from(data as ArrayBuffer).toString("utf8"));
    } catch {
      data = undefined;
    }
  }
  const err = (data as { error?: { code?: string; message?: string } } | undefined)?.error;
  return { code: err?.code, message: err?.message ?? "RisveglIA non ha accettato la richiesta." };
}

/**
 * Chiamata all'API per n8n e Make con il token della credenziale. Gli errori di RisveglIA diventano errori del nodo con
 * il messaggio in italiano e il codice (ambito_mancante, troppe_richieste, ...), così il flusso può ramificarsi.
 */
export async function chiama(
  ctx: Contesto,
  opts: { method: IHttpRequestMethods; path: string; body?: unknown; qs?: IDataObject; headers?: Record<string, string>; binario?: boolean; itemIndex?: number },
): Promise<Risposta> {
  const cred = await ctx.getCredentials(CREDENZIALE);
  const base = String(cred.baseUrl ?? "https://app.risveglia.it/api").replace(/\/+$/, "");
  const conCorpo = opts.body !== undefined && opts.method !== "GET" && opts.method !== "DELETE";
  const res = (await ctx.helpers.httpRequestWithAuthentication.call(ctx, CREDENZIALE, {
    method: opts.method,
    url: `${base}${PREFISSO}${opts.path}`,
    ...(opts.headers ? { headers: opts.headers } : {}),
    ...(opts.qs && Object.keys(opts.qs).length > 0 ? { qs: opts.qs } : {}),
    ...(conCorpo ? { body: opts.body as IDataObject, json: true } : { json: !opts.binario }),
    ...(opts.binario ? { encoding: "arraybuffer" as const } : {}),
    returnFullResponse: true,
    ignoreHttpStatusErrors: true,
  })) as { statusCode: number; body: unknown; headers: Record<string, string | string[] | undefined> };
  if (res.statusCode >= 400) {
    const { code, message } = erroreDi(res.body);
    throw new NodeApiError(ctx.getNode(), { code: code ?? String(res.statusCode), message } as JsonObject, {
      message,
      description: code ? `Codice RisveglIA: ${code}` : undefined,
      httpCode: String(res.statusCode),
      ...(opts.itemIndex !== undefined ? { itemIndex: opts.itemIndex } : {}),
    });
  }
  return { status: res.statusCode, body: res.body, headers: res.headers ?? {} };
}
