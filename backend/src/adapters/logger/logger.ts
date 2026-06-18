import { injectable } from 'inversify';
import pino, { LoggerOptions } from 'pino';

import { LoggerInterface } from '@/domain/interfaces/logger/logger.interface';

import { EnvConfig } from '@/adapters/envConfig/envConfig';
import { asyncLocalStorage } from '@/entrypoints/api/middlewares/requestId/requestId.middleware';

// Helper pour le formatage des niveaux de log pour Google Cloud Logging
const formatGoogleCloudLogLevel = (label: string, number: number) => {
  let severity = 'DEFAULT';
  if (number === 10) {
    severity = 'DEBUG';
  } // pino: trace
  else if (number === 20) {
    severity = 'DEBUG';
  } // pino: debug
  else if (number === 30) {
    severity = 'INFO';
  } else if (number === 40) {
    severity = 'WARNING';
  } else if (number === 50) {
    severity = 'ERROR';
  } else if (number === 60) {
    severity = 'CRITICAL';
  } // pino: fatal
  return { severity, level: label };
};

// Options pour pino-pretty en développement
const developmentPrettyPrintOptions = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname,level,severity',
    messageFormat: '{requestId} {if err.stack}{err.stack}{else}{if err.message}{err.message}{end}{end} {msg}',
  },
};

@injectable()
export class Logger implements LoggerInterface {
  private logger: pino.Logger;

  constructor() {
    const envConfig = new EnvConfig();
    const isProduction = envConfig.nodeEnv === 'production';

    // Options de base communes à tous les environnements
    const basePinoOptions: LoggerOptions = {
      level: envConfig.logLevel,
      serializers: {
        ...pino.stdSerializers.err,
      },
    };

    // Options spécifiques à l'environnement de production
    const productionPinoOptions: LoggerOptions = {
      messageKey: 'message',
      formatters: {
        level: formatGoogleCloudLogLevel,
      },
      base: undefined,
      timestamp: false,
    };

    // Options spécifiques à l'environnement de développement
    const developmentPinoOptions: LoggerOptions = {
      transport: developmentPrettyPrintOptions,
    };

    // Fusionner les options de base avec celles spécifiques à l'environnement
    const finalPinoOptions: LoggerOptions = {
      ...basePinoOptions,
      ...(isProduction ? productionPinoOptions : developmentPinoOptions),
    };

    this.logger = pino(finalPinoOptions);
  }

  private getBaseContext(): { requestId?: string } {
    const requestId = asyncLocalStorage.getStore()?.requestId;
    return requestId ? { requestId } : {};
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug({ ...this.getBaseContext(), ...context }, message);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info({ ...this.getBaseContext(), ...context }, message);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn({ ...this.getBaseContext(), ...context }, message);
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    this.logger.error(
      {
        ...context,
        err: error,
        requestId: this.getBaseContext().requestId,
      },
      message,
    );
  }
}
