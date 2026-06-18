import { ContainerModule, interfaces } from 'inversify';

/**
 * Application services container.
 * Empty in Phase 0 (scaffold) — business services are bound in later phases.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const serviceContainer = new ContainerModule((_bind: interfaces.Bind) => {
  // No bindings yet.
});

export { serviceContainer };
