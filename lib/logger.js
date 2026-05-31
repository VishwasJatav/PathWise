const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CURRENT_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL
  ? LOG_LEVELS[process.env.NEXT_PUBLIC_LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO
  : (process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG);

function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();

  // Format as JSON in production for log aggregators (e.g. Sentry, Datadog, CloudWatch, Vercel logs)
  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  }

  // Colored console output for local development
  const colors = {
    DEBUG: '\x1b[36m', // Cyan
    INFO: '\x1b[32m',  // Green
    WARN: '\x1b[33m',  // Yellow
    ERROR: '\x1b[31m', // Red
    RESET: '\x1b[0m',
  };

  const metaString = Object.keys(meta).length ? ` | meta: ${JSON.stringify(meta)}` : '';
  return `${colors[level] || ''}[${timestamp}] [${level}] ${message}${metaString}${colors.RESET}`;
}

export const logger = {
  debug: (message, meta = {}) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
      console.debug(formatLog('DEBUG', message, meta));
    }
  },
  info: (message, meta = {}) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
      console.info(formatLog('INFO', message, meta));
    }
  },
  warn: (message, meta = {}) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(formatLog('WARN', message, meta));
    }
  },
  error: (message, errorOrMeta = {}) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
      let meta = {};
      if (errorOrMeta instanceof Error) {
        meta = {
          error: {
            message: errorOrMeta.message,
            stack: errorOrMeta.stack,
          },
        };
      } else {
        meta = errorOrMeta;
      }
      console.error(formatLog('ERROR', message, meta));
    }
  },
};
