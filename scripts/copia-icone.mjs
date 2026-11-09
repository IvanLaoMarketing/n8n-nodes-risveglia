import { copyFileSync, mkdirSync } from "node:fs";

// tsc non copia le icone: n8n le legge accanto al file del nodo compilato.
mkdirSync("dist/nodes/RisveglIa", { recursive: true });
copyFileSync("nodes/RisveglIa/risveglia.svg", "dist/nodes/RisveglIa/risveglia.svg");
