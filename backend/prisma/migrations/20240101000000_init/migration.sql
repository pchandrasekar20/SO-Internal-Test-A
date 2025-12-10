-- CreateTable
CREATE TABLE "stocks" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT,
    "industry" TEXT,
    "marketCap" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pe_ratios" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "ratio" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pe_ratios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historical_prices" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "volume" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historical_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stocks_symbol_key" ON "stocks"("symbol");

-- CreateIndex
CREATE INDEX "stocks_symbol_idx" ON "stocks"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "pe_ratios_stockId_date_key" ON "pe_ratios"("stockId", "date");

-- CreateIndex
CREATE INDEX "pe_ratios_stockId_idx" ON "pe_ratios"("stockId");

-- CreateIndex
CREATE INDEX "pe_ratios_ratio_idx" ON "pe_ratios"("ratio");

-- CreateIndex
CREATE INDEX "pe_ratios_date_idx" ON "pe_ratios"("date");

-- CreateIndex
CREATE UNIQUE INDEX "historical_prices_stockId_date_key" ON "historical_prices"("stockId", "date");

-- CreateIndex
CREATE INDEX "historical_prices_stockId_idx" ON "historical_prices"("stockId");

-- CreateIndex
CREATE INDEX "historical_prices_date_idx" ON "historical_prices"("date");

-- CreateIndex
CREATE INDEX "historical_prices_close_idx" ON "historical_prices"("close");

-- AddForeignKey
ALTER TABLE "pe_ratios" ADD CONSTRAINT "pe_ratios_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historical_prices" ADD CONSTRAINT "historical_prices_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
