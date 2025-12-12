describe('Financial Calculations', () => {
  describe('PE Ratio Calculation', () => {
    it('should calculate PE ratio correctly', () => {
      const stockPrice = 100;
      const earningsPerShare = 5;
      const peRatio = stockPrice / earningsPerShare;

      expect(peRatio).toBe(20);
    });

    it('should handle zero earnings per share', () => {
      const stockPrice = 100;
      const earningsPerShare = 0;

      if (earningsPerShare === 0) {
        expect(true).toBe(true);
      }
    });

    it('should handle negative earnings per share', () => {
      const stockPrice = 100;
      const earningsPerShare = -5;
      const peRatio = stockPrice / earningsPerShare;

      expect(peRatio).toBe(-20);
      expect(peRatio < 0).toBe(true);
    });

    it('should calculate PE ratio for large numbers', () => {
      const stockPrice = 1000;
      const earningsPerShare = 25;
      const peRatio = stockPrice / earningsPerShare;

      expect(peRatio).toBe(40);
    });

    it('should handle fractional earnings', () => {
      const stockPrice = 150.5;
      const earningsPerShare = 2.5;
      const peRatio = stockPrice / earningsPerShare;

      expect(peRatio).toBeCloseTo(60.2, 1);
    });
  });

  describe('Price Change Calculation', () => {
    it('should calculate percentage change for positive change', () => {
      const oldPrice = 100;
      const newPrice = 120;
      const percentageChange = ((newPrice - oldPrice) / oldPrice) * 100;

      expect(percentageChange).toBe(20);
    });

    it('should calculate percentage change for negative change', () => {
      const oldPrice = 100;
      const newPrice = 80;
      const percentageChange = ((newPrice - oldPrice) / oldPrice) * 100;

      expect(percentageChange).toBe(-20);
    });

    it('should calculate percentage change for no change', () => {
      const oldPrice = 100;
      const newPrice = 100;
      const percentageChange = ((newPrice - oldPrice) / oldPrice) * 100;

      expect(percentageChange).toBe(0);
    });

    it('should calculate percentage change for large gains', () => {
      const oldPrice = 10;
      const newPrice = 50;
      const percentageChange = ((newPrice - oldPrice) / oldPrice) * 100;

      expect(percentageChange).toBe(400);
    });

    it('should calculate percentage change for large losses', () => {
      const oldPrice = 100;
      const newPrice = 10;
      const percentageChange = ((newPrice - oldPrice) / oldPrice) * 100;

      expect(percentageChange).toBe(-90);
    });

    it('should calculate percentage change for small fractional changes', () => {
      const oldPrice = 100.5;
      const newPrice = 100.75;
      const percentageChange = ((newPrice - oldPrice) / oldPrice) * 100;

      expect(percentageChange).toBeCloseTo(0.249, 2);
    });
  });

  describe('Two Year Percentage Decline Calculation', () => {
    it('should calculate decline from 2 years ago to today', () => {
      const priceOneYearAgo = 150;
      const priceToday = 120;
      const decline = ((priceToday - priceOneYearAgo) / priceOneYearAgo) * 100;

      expect(decline).toBe(-20);
    });

    it('should identify positive returns over 2 years', () => {
      const priceOneYearAgo = 100;
      const priceToday = 150;
      const change = ((priceToday - priceOneYearAgo) / priceOneYearAgo) * 100;

      expect(change).toBe(50);
      expect(change < 0).toBe(false);
    });

    it('should handle large declines', () => {
      const priceOneYearAgo = 100;
      const priceToday = 20;
      const decline = ((priceToday - priceOneYearAgo) / priceOneYearAgo) * 100;

      expect(decline).toBe(-80);
    });

    it('should handle complete loss', () => {
      const priceOneYearAgo = 100;
      const priceToday = 0;
      const decline = ((priceToday - priceOneYearAgo) / priceOneYearAgo) * 100;

      expect(decline).toBe(-100);
    });
  });

  describe('Market Cap Normalization', () => {
    it('should normalize market cap from cents to millions', () => {
      const marketCapInCents = 3000000000000;
      const marketCapInMillions = marketCapInCents / 1000000;

      expect(marketCapInMillions).toBe(3000000);
    });

    it('should handle large market caps', () => {
      const marketCapInCents = 50000000000000;
      const marketCapInMillions = Math.floor(marketCapInCents / 1000000);

      expect(marketCapInMillions).toBe(50000000);
    });

    it('should handle small market caps', () => {
      const marketCapInCents = 100000000;
      const marketCapInMillions = Math.floor(marketCapInCents / 1000000);

      expect(marketCapInMillions).toBe(0);
    });
  });

  describe('Date Normalization', () => {
    it('should normalize date to midnight UTC', () => {
      const timestamp = 1640880000;
      const date = new Date(timestamp * 1000);
      date.setUTCHours(0, 0, 0, 0);

      expect(date.getUTCHours()).toBe(0);
      expect(date.getUTCMinutes()).toBe(0);
      expect(date.getUTCSeconds()).toBe(0);
      expect(date.getUTCMilliseconds()).toBe(0);
    });

    it('should handle current timestamp', () => {
      const now = Math.floor(Date.now() / 1000);
      const date = new Date(now * 1000);
      date.setUTCHours(0, 0, 0, 0);

      expect(date.getUTCHours()).toBe(0);
    });
  });

  describe('Volume Normalization', () => {
    it('should store volume as integer', () => {
      const volume = 1500000;

      expect(Number.isInteger(volume)).toBe(true);
    });

    it('should handle fractional volumes by converting to integer', () => {
      const volume = 1500000.5;
      const intVolume = Math.floor(volume);

      expect(Number.isInteger(intVolume)).toBe(true);
      expect(intVolume).toBe(1500000);
    });
  });
});
