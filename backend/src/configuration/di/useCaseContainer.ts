import { ContainerModule, interfaces } from 'inversify';

/**
 * Use cases container.
 * Empty in Phase 0 (scaffold) — use cases are bound in later phases.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useCaseContainer = new ContainerModule((_bind: interfaces.Bind) => {
  // No bindings yet.
});

export { useCaseContainer };
