// Post-traitement des fichiers `*.api.ts` générés par orval.
//
// Par défaut orval (client 'axios', mode 'tags-split') génère des factories
// `export const getXxxApiCollection = () => { ... axios.default.get(...) }`
// qui instancient axios en interne. On les transforme pour qu'elles reçoivent
// une instance axios en argument :
// `export const getXxxApiCollection = (axios: AxiosInstance) => { ... axios.get(...) }`
//
// Cela permet aux fronts de faire :
//   import { getAdminApiCollection } from '@vite-et-gourmand/sdk';
//   const AdminApi = getAdminApiCollection(axiosInstance);

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '..', 'src');

function processFile(filePath) {
  let data = fs.readFileSync(filePath, 'utf8');

  // Retire `import axios from 'axios';` et `import * as axios from 'axios';`
  data = data.replace(/import axios from ["']axios["'];\n?/g, '');
  data = data.replace(/import \* as axios from ["']axios["'];\n?/g, '');

  // Ajoute AxiosInstance au bloc d'import de type d'axios (mono ou multi-ligne),
  // sauf s'il y est déjà présent.
  data = data.replace(
    /import type \{([\s\S]*?)\} from ["']axios["'];/g,
    (match, inner) => {
      if (/\bAxiosInstance\b/.test(inner)) return match;
      const names = inner
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean);
      names.push('AxiosInstance');
      return `import type { ${names.join(', ')} } from 'axios';`;
    }
  );

  // Injecte le paramètre `axios: AxiosInstance` dans la factory de collection
  data = data.replace(
    /export const get(\w+)ApiCollection = \(\) => \{/g,
    'export const get$1ApiCollection = (axios: AxiosInstance) => {'
  );

  // axios.default.X(...) -> axios.X(...)
  data = data.replace(/axios\.default\.(\w+)\(/g, 'axios.$1(');

  fs.writeFileSync(filePath, data, 'utf8');
  console.log(`Post-processed ${path.relative(srcDir, filePath)}`);
}

function traverse(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) traverse(full);
    else if (entry.isFile() && entry.name.endsWith('.api.ts')) processFile(full);
  }
}

if (fs.existsSync(srcDir)) traverse(srcDir);

// Formate l'ensemble du code généré avec prettier (résolu depuis node_modules,
// pour ne pas dépendre du PATH dans l'environnement pnpm).
try {
  const require = createRequire(import.meta.url);
  const prettierBin = require.resolve('prettier/bin/prettier.cjs');
  const result = spawnSync(process.execPath, [prettierBin, '--write', srcDir], {
    stdio: 'inherit'
  });
  if (result.status !== 0) {
    console.warn('prettier formatting skipped (non-zero exit).');
  }
} catch (err) {
  console.warn('prettier not found, skipping formatting:', err.message);
}
