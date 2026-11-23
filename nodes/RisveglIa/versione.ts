/**
 * Versione del nodo, mandata a ogni chiamata nell'intestazione X-Risveglia-Client («n8n/0.9.0»): RisveglIA sa chi usa
 * n8n e con quale versione, e avvisa nel portale e per email quando ne esce una nuova (va aggiornata a mano in n8n).
 * Deve coincidere con package.json e con integrationClientVersions.n8n di @risveglia/contracts (test N0).
 */
export const VERSIONE_NODO = "0.9.0";
export const CLIENTE = `n8n/${VERSIONE_NODO}`;
