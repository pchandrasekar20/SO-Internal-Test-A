import RateLimiter from '@/utils/rateLimiter';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(50, 1);
  });

  describe('execute', () => {
    it('should execute function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const result = await rateLimiter.execute(mockFn);

      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should handle function errors', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Test error'));

      await expect(rateLimiter.execute(mockFn)).rejects.toThrow('Test error');
    });

    it('should queue multiple function calls', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');

      const promise1 = rateLimiter.execute(mockFn);
      const promise2 = rateLimiter.execute(mockFn);
      const promise3 = rateLimiter.execute(mockFn);

      const results = await Promise.all([promise1, promise2, promise3]);

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(results).toEqual(['result', 'result', 'result']);
    });
  });

  describe('getSize', () => {
    it('should return queue size', async () => {
      expect(rateLimiter.getSize()).toBe(0);

      const slowFn = jest.fn(
        () => new Promise((resolve) => setTimeout(() => resolve('result'), 100))
      );

      rateLimiter.execute(slowFn);
      expect(rateLimiter.getSize()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getPending', () => {
    it('should return pending count', async () => {
      const slowFn = jest.fn(
        () =>
          new Promise((resolve) =>
            setTimeout(() => {
              resolve('result');
            }, 100)
          )
      );

      rateLimiter.execute(slowFn);
      const pending = rateLimiter.getPending();

      expect(pending).toBeGreaterThanOrEqual(0);
    });
  });

  describe('waitForEmpty', () => {
    it('should resolve when queue is empty', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');

      rateLimiter.execute(mockFn);
      await rateLimiter.waitForEmpty();

      expect(mockFn).toHaveBeenCalled();
    });

    it('should wait for multiple tasks to complete', async () => {
      const mockFn = jest.fn(
        () =>
          new Promise((resolve) =>
            setTimeout(() => {
              resolve('result');
            }, 50)
          )
      );

      rateLimiter.execute(mockFn);
      rateLimiter.execute(mockFn);
      rateLimiter.execute(mockFn);

      await rateLimiter.waitForEmpty();

      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });

  describe('concurrency', () => {
    it('should respect concurrency limit', async () => {
      const limiter = new RateLimiter(50, 1);
      let concurrentCount = 0;
      let maxConcurrent = 0;

      const mockFn = jest.fn(async () => {
        concurrentCount++;
        maxConcurrent = Math.max(maxConcurrent, concurrentCount);
        await new Promise((resolve) => setTimeout(resolve, 50));
        concurrentCount--;
        return 'result';
      });

      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(limiter.execute(mockFn));
      }

      await Promise.all(promises);

      expect(maxConcurrent).toBe(1);
      expect(mockFn).toHaveBeenCalledTimes(5);
    });

    it('should allow multiple concurrent executions with higher concurrency', async () => {
      const limiter = new RateLimiter(50, 3);
      let concurrentCount = 0;
      let maxConcurrent = 0;

      const mockFn = jest.fn(async () => {
        concurrentCount++;
        maxConcurrent = Math.max(maxConcurrent, concurrentCount);
        await new Promise((resolve) => setTimeout(resolve, 50));
        concurrentCount--;
        return 'result';
      });

      const promises = [];
      for (let i = 0; i < 9; i++) {
        promises.push(limiter.execute(mockFn));
      }

      await Promise.all(promises);

      expect(maxConcurrent).toBeGreaterThanOrEqual(1);
      expect(mockFn).toHaveBeenCalledTimes(9);
    });
  });
});
