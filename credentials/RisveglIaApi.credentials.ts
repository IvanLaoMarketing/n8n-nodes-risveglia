import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from "n8n-workflow";

/**
 * Token personale di RisveglIA (rsv_pat_...): si crea nel portale, Impostazioni, Integrazioni, con gli ambiti che servono
 * al flusso. Il token agisce come la persona che l'ha creato, con il suo ruolo e i suoi permessi di adesso.
 */
export class RisveglIaApi implements ICredentialType {
  name = "risveglIaApi";
  displayName = "RisveglIA API";
  documentationUrl = "https://risveglia.it/guide";
  icon = "file:../nodes/RisveglIa/risveglia.svg" as const;
  properties: INodeProperties[] = [
    {
      displayName: "Token personale",
      name: "token",
      type: "string",
      typeOptions: { password: true },
      default: "",
      required: true,
      placeholder: "rsv_pat_...",
      description: "Crealo in RisveglIA: Impostazioni, Integrazioni, Crea un token personale. Si vede una sola volta.",
    },
    {
      displayName: "Indirizzo di RisveglIA",
      name: "baseUrl",
      type: "string",
      default: "https://app.risveglia.it/api",
      description: "Lascia il valore proposto, salvo indicazioni diverse dell'assistenza.",
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: { headers: { Authorization: "=Bearer {{$credentials.token}}" } },
  };

  test: ICredentialTestRequest = {
    request: { baseURL: "={{$credentials.baseUrl.replace(/\\/+$/, '')}}", url: "/v1/integrazioni/io", method: "GET" },
  };
}
