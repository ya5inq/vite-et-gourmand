// Orchestre la génération du SDK : nettoyage -> orval -> post-traitement.
//
// orval >= 7 charge dynamiquement des fichiers JSON (package.json) et requiert
// Node >= 20.10 (les versions 20.5..20.9 lèvent ERR_IMPORT_ASSERTION_TYPE_MISSING).
// Si le Node courant est trop ancien, on tente de re-spawn ce script avec une
// version nvm compatible déjà installée, afin que `pnpm generate` fonctionne
// quel que soit le Node par défaut du shell.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgDir = path.resolve(__dirname, '..');

const MIN_MAJOR = 20;
const MIN_MINOR = 10;

function versionTooOld(version) {
  const [maj, min] = version.replace(/^v/, '').split('.').map(Number);
  if (maj > MIN_MAJOR) return false;
  if (maj < MIN_MAJOR) return true;
  return min < MIN_MINOR;
}

function findCompatibleNvmNode() {
  const base = path.join(os.homedir(), '.nvm', 'versions', 'node');
  if (!fs.existsSync(base)) return null;
  const candidates = fs
    .readdirSync(base)
    .filter((v) => !versionTooOld(v))
    .sort((a, b) => {
      const pa = a.replace(/^v/, '').split('.').map(Number);
      const pb = b.replace(/^v/, '').split('.').map(Number);
      for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
      return 0;
    });
  if (candidates.length === 0) return null;
  // Préfère la plus récente des versions 20.x si dispo, sinon la plus récente.
  const node20 = candidates.filter((v) => v.startsWith('v20.'));
  const chosen = (node20.length ? node20 : candidates).pop();
  const bin = path.join(base, chosen, 'bin', 'node');
  return fs.existsSync(bin) ? { bin, version: chosen } : null;
}

if (versionTooOld(process.version)) {
  const compat = findCompatibleNvmNode();
  if (!compat) {
    console.error(
      `[sdk] Node ${process.version} est trop ancien pour orval (>= 20.10 requis) ` +
        `et aucune version nvm compatible n'a été trouvée. Installez Node >= 20.10.`
    );
    process.exit(1);
  }
  console.error(
    `[sdk] Node ${process.version} trop ancien pour orval -> relance avec ${compat.version}`
  );
  const res = spawnSync(compat.bin, [fileURLToPath(import.meta.url)], {
    stdio: 'inherit',
    cwd: pkgDir
  });
  process.exit(res.status ?? 1);
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', cwd: pkgDir });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

// 1. clean
for (const dir of ['public', 'protected', 'admin', 'models']) {
  fs.rmSync(path.join(pkgDir, 'src', dir), { recursive: true, force: true });
}
fs.rmSync(path.join(pkgDir, 'src', 'index.ts'), { force: true });

// 2. orval — on invoque l'entrée JS d'orval directement avec le Node courant
// (et NON le wrapper node_modules/.bin/orval, qui re-résout `node` depuis le
// PATH et pourrait repartir sur une version trop ancienne).
function resolveOrvalEntry() {
  // Localise l'entrée JS d'orval via le package "orval" (symlink pnpm), puis lit
  // bin.orval dans son package.json. On évite le wrapper shell node_modules/.bin
  // qui re-résout `node` depuis le PATH (potentiellement trop ancien).
  const pkgCandidates = [
    path.join(pkgDir, 'node_modules', 'orval'),
    path.join(pkgDir, '..', '..', 'node_modules', 'orval')
  ];
  for (const orvalDir of pkgCandidates) {
    const pj = path.join(orvalDir, 'package.json');
    if (!fs.existsSync(pj)) continue;
    const meta = JSON.parse(fs.readFileSync(pj, 'utf8'));
    const rel = typeof meta.bin === 'string' ? meta.bin : meta.bin.orval;
    const entry = path.join(orvalDir, rel);
    if (fs.existsSync(entry)) return entry;
  }
  throw new Error('[sdk] binaire orval introuvable. Lancez `pnpm install`.');
}

run(process.execPath, [resolveOrvalEntry(), '--config', 'orval.config.ts']);

// 3. post-traitement (injection de l'instance axios + prettier)
run(process.execPath, [path.join(__dirname, 'postProcess.mjs')]);

console.log('[sdk] Génération terminée.');
