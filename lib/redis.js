import Redis from 'ioredis';

const globalForRedis = globalThis;

function createRedisClient() {
  const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableReadyCheck: false,
    retryStrategy: (times) => {
      if (times > 3) return null; // Stop retrying after 3 attempts
      return Math.min(times * 200, 1000);
    },
  });

  // Suppress unhandled error events — Redis being unavailable is non-fatal
  client.on('error', (err) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Redis] Connection error (non-fatal):', err.message);
    }
  });

  return client;
}

export const redis =
  globalForRedis.redis || createRedisClient();

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
