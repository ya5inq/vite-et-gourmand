type ShutdownCallback = () => Promise<void>;

const shutdownCallbacks: Map<string, ShutdownCallback> = new Map();

/**
 * Register a cleanup callback to be called during graceful shutdown.
 * Services can self-register their cleanup logic.
 */
export const registerShutdownCallback = (name: string, callback: ShutdownCallback): void => {
  shutdownCallbacks.set(name, callback);
};

/**
 * Run all registered shutdown callbacks.
 * Called by the main shutdown handler.
 */
export const runShutdownCallbacks = async (onError?: (name: string, error: Error) => void): Promise<void> => {
  for (const [name, callback] of shutdownCallbacks) {
    try {
      await callback();
    } catch (error) {
      onError?.(name, error as Error);
    }
  }
  shutdownCallbacks.clear();
};
