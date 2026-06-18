import { ContainerModule, interfaces } from 'inversify';

/**
 * Domain entities container.
 * Empty in Phase 0 (scaffold) — entities are bound in later phases.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const entityContainer = new ContainerModule((_bind: interfaces.Bind) => {
  // No bindings yet.
});

export { entityContainer };
