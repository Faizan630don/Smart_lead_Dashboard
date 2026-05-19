import { env } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    
    if (env.NODE_ENV === 'production') {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...(meta ? { meta } : {}),
      });
    }

    const colors = {
      info: '\x1b[36m', // Cyan
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      debug: '\x1b[90m', // Gray
      reset: '\x1b[0m',
    };

    return `[${timestamp}] ${colors[level]}${level.toUpperCase()}${colors.reset}: ${message}${metaString}`;
  }

  public info(message: string, meta?: any): void {
    process.stdout.write(this.formatMessage('info', message, meta) + '\n');
  }

  public warn(message: string, meta?: any): void {
    process.stdout.write(this.formatMessage('warn', message, meta) + '\n');
  }

  public error(message: string, error?: any): void {
    let errorMeta = error;
    if (error instanceof Error) {
      errorMeta = {
        message: error.message,
        stack: error.stack,
      };
    }
    process.stderr.write(this.formatMessage('error', message, errorMeta) + '\n');
  }

  public debug(message: string, meta?: any): void {
    if (env.NODE_ENV === 'development') {
      process.stdout.write(this.formatMessage('debug', message, meta) + '\n');
    }
  }
}

export const logger = new Logger();
export default logger;
