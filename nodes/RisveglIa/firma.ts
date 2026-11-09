import { createHmac, timingSafeEqual } from "node:crypto";

/** Intestazioni degli eventi di RisveglIA (webhook in uscita, payload v1). */
export const INTESTAZIONE_FIRMA = "x-risveglia-signature";
export const INTESTAZIONE_EVENTO = "x-risveglia-event";

/**
 * Verifica la firma "t=<secondi>,v1=<hex>": HMAC SHA-256 di "<t>.<corpo>" con il segreto dell'iscrizione, orario entro
 * 5 minuti. Così nessuno può far partire il flusso con un evento inventato o ripetere più tardi uno vero.
 */
export function firmaValida(segreto: string, intestazione: string | undefined, corpo: string, adesso = Date.now(), tolleranzaS = 300): boolean {
  if (!intestazione) return false;
  const parti = Object.fromEntries(intestazione.split(",").map((p) => p.trim().split("=", 2) as [string, string]));
  const t = Number(parti.t);
  const v1 = parti.v1;
  if (!Number.isInteger(t) || !v1 || !/^[0-9a-f]{64}$/.test(v1)) return false;
  if (Math.abs(Math.floor(adesso / 1000) - t) > tolleranzaS) return false;
  const atteso = createHmac("sha256", segreto).update(`${t}.${corpo}`).digest();
  return timingSafeEqual(atteso, Buffer.from(v1, "hex"));
}
