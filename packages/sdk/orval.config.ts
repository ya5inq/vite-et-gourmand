import { defineConfig } from 'orval';

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

// Le premier tag de chaque opération est le scope (public, protected, admin).
// On le mappe vers une collection capitalisée (Public, Protected, Admin) afin que
// orval (mode tags-split) génère un fichier/collection par scope :
//   src/public/public.api.ts    -> getPublicApiCollection
//   src/protected/protected.api.ts -> getProtectedApiCollection
//   src/admin/admin.api.ts      -> getAdminApiCollection
const getCollectionTag = (tags: string[]): string => {
  if (tags.length === 0) return 'Default';
  return capitalize(tags[0]);
};

const input = {
  target: '../../backend/src/entrypoints/api/openApi/openapi.json',
  validation: false
} as const;

export default defineConfig({
  // Cible 1 : client axios + models TypeScript
  // (le formatage prettier est lancé par scripts/postProcess.mjs après génération)
  axios: {
    input,
    output: {
      override: {
        title: (title) => `${title}ApiCollection`,
        transformer: (options) => {
          const collectionTag = getCollectionTag(options.tags || []);
          return {
            ...options,
            tags: [collectionTag]
          };
        }
      },
      client: 'axios',
      mode: 'tags-split',
      target: './',
      schemas: './models',
      fileExtension: '.api.ts',
      workspace: './src/'
    }
  },
  // Cible 2 : schémas zod (réutilisables côté front pour la validation de formulaires)
  zod: {
    input,
    output: {
      override: {
        transformer: (options) => {
          const collectionTag = getCollectionTag(options.tags || []);
          return {
            ...options,
            tags: [collectionTag],
            operationName: 'zod' + capitalize(options.operationName || '')
          };
        }
      },
      client: 'zod',
      mode: 'tags-split',
      target: './',
      schemas: './models',
      fileExtension: '.zod.ts',
      workspace: './src/'
    }
  }
});
