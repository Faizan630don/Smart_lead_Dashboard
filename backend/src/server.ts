import app from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { logger } from './utils/logger';

// Start the HTTP Server and connect to MongoDB
const server = app.listen(env.PORT, async () => {
  await connectDB();
  logger.info(
    `🚀 Server booting: Listening on port ${env.PORT} in [${env.NODE_ENV}] environment.`
  );
});

/**
 * Handle process signals to shut down gracefully, release pooled sockets, and flush logs.
 */
const gracefulShutdown = async (signal: string) => {
  logger.warn(`Received signal: ${signal}. Commencing graceful server shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed successfully.');
    await disconnectDB();
    logger.info('Graceful shutdown procedure finalized.');
    process.exit(0);
  });

  // Forcefully exit if shutdown takes too long (e.g. 10s)
  setTimeout(() => {
    logger.error('Forceful shutdown triggered due to close timeout.');
    process.exit(1);
  }, 10000);
};

// Listen for process termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Watch for unhandled/uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('CRITICAL: Uncaught Exception detected in runtime:', error);
  // Give logger a chance to write stream before exiting
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('CRITICAL: Unhandled Promise Rejection detected in runtime:', reason);
  process.exit(1);
});
export default server;
