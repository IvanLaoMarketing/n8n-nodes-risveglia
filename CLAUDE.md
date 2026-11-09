# CLAUDE.md - n8n-nodes-risveglia

Lingua di lavoro con Ivan: italiano. Mai il trattino lungo.

**Pacchetto:** `@ivanlaomarketing/n8n-nodes-risveglia` (npm, ambito @ivanlaomarketing, utente npm `ivanlao`)
**GitHub:** https://github.com/IvanLaoMarketing/n8n-nodes-risveglia (pubblico)

## Da dove viene il codice

La fonte è il monorepo privato `ivanlaomarketing/risveglia`, cartella `packages/n8n-nodes-risveglia`: lì il catalogo `nodes/RisveglIa/catalogo.ts` si rigenera dal catalogo API (`pnpm --filter @ivanlaomarketing/n8n-nodes-risveglia genera`) e ci sono i test. In questo repo si copiano `nodes/` e `credentials/` dal monorepo, senza modificarli a mano.

## Comandi

```bash
npm install
npm run build      # tsc + copia dell'icona
npm run lint       # n8n-node lint (stesse regole della verifica n8n)
```

## Rilascio

1. Copia `nodes/` e `credentials/` aggiornati dal monorepo.
2. Alza la versione in `package.json` e aggiungi la voce in `CHANGELOG.md`.
3. `git tag vX.Y.Z && git push --tags`: GitHub Actions (`.github/workflows/publish.yml`) pubblica con `npm publish --provenance` tramite Trusted Publishing (OIDC, configurato su npmjs.com per repo `IvanLaoMarketing/n8n-nodes-risveglia` e workflow `publish.yml`): nessun token né segreto.

La provenance serve per la verifica n8n (Creator Portal) e per l'installazione su n8n Cloud.
