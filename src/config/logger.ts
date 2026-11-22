import { randomUUID } from 'node:crypto';
import { pino, type LoggerOptions } from 'pino';
import { pinoHttp } from 'pino-http';

const env = process.env.NODE_ENV ?? 'development';
export const isProduction = env === 'production';
const isTest = env === 'test';

const defaultLevel = isProduction ? 'info' : isTest ? 'silent' : 'debug';

const options: LoggerOptions = {
  level: process.env.LOG_LEVEL ?? defaultLevel,

  base: { service: process.env.APP_NAME || 'adec-api', env },
  timestamp: pino.stdTimeFunctions.isoTime,

  formatters: { level: (label) => ({ level: label }) },
  // Nunca vazar credenciais nos logs
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token'],
    censor: '[REDACTED]',
  },
};

if (!isProduction && !isTest) {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss.l',
      // req/res/responseTime já estão resumidos na mensagem ("GET /x 200 12ms")
      ignore: 'pid,hostname,service,env,req,res,responseTime',
      messageFormat: '{if req.id}[{req.id}] {end}{msg}',
    },
  };
}

export const logger = pino(options);

export const httpLogger = pinoHttp({
  logger,
  // Reaproveita o x-request-id do proxy (Render envia um) para correlacionar logs
  genReqId: (req, res) => {
    const id = (req.headers['x-request-id'] as string | undefined) ?? randomUUID();
    res.setHeader('x-request-id', id);
    return id;
  },
  // Health check do Render roda a cada poucos segundos — não polui o log
  autoLogging: { ignore: (req) => req.url === '/health' },
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res, responseTime) =>
    `${req.method} ${req.url} ${res.statusCode} ${Math.round(responseTime)}ms`,
  customErrorMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,

  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url, ip: req.remoteAddress }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});
