//  /lib/logger.ts

import pino from 'pino';

// Create a Pino logger instance
const logger = pino({ level: 'debug' });

export { logger };