import PQueue from 'p-queue';
import logger from './logger';

export class RateLimiter {
  private queue: PQueue;
  private intervalMs: number;
  private maxConcurrent: number;

  constructor(intervalMs: number = 100, maxConcurrent: number = 1) {
    this.intervalMs = intervalMs;
    this.maxConcurrent = maxConcurrent;
    this.queue = new PQueue({
      concurrency: maxConcurrent,
      interval: intervalMs,
      intervalCap: 1,
    });
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    try {
      const result = await this.queue.add(fn) as T;
      return result;
    } catch (error) {
      logger.error(`Rate limiter execution failed: ${error}`);
      throw error;
    }
  }

  getSize(): number {
    return this.queue.size;
  }

  getPending(): number {
    return this.queue.pending;
  }

  async waitForEmpty(): Promise<void> {
    await this.queue.onEmpty();
  }
}

export default RateLimiter;
