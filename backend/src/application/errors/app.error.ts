import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { Logger } from '@/adapters/logger/logger';

import { AppErrorCodes, AppErrorInterface, AppErrorOptions } from './app.error.interface';

export class AppError extends Error implements AppErrorInterface {
  public message: string;
  public code: AppErrorCodes;
  public context?: unknown;
  public cause?: unknown;
  public privateContext?: unknown;
  public isAppError = true;
  public error = Error;

  // Logger singleton for AppError (lazy initialization)
  private static _logger: LoggerInterface | null = null;

  /**
   * Configure the logger for AppError (call once at application startup)
   * @param logger - Logger instance to use for all AppError logging
   */
  public static setLogger(logger: LoggerInterface): void {
    AppError._logger = logger;
  }

  /**
   * Get the logger instance (lazy initialization if not configured)
   * @returns Logger instance
   * @private
   */
  private static getLogger(): LoggerInterface {
    if (!AppError._logger) {
      // Lazy initialization for backward compatibility
      // In production, setLogger should be called at app startup
      AppError._logger = new Logger();
    }
    return AppError._logger;
  }

  constructor({ code, message, context, privateContext, error, silent = false }: AppErrorOptions) {
    const cause = error instanceof Error ? error.cause : undefined;

    super(message, { cause });
    this.message = message;
    this.context = context;
    this.privateContext = privateContext;
    this.code = code;
    this.cause = cause;

    Object.setPrototypeOf(this, new.target.prototype);

    if (!silent) {
      const logger = AppError.getLogger();
      logger.debug(message, { context, privateContext });
    }
  }
}
