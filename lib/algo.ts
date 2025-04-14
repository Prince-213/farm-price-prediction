interface PricePrediction {
  predictedPrice: number;
  pricePerKg: number;
  totalPrice: number;
  currency: string;
  explanation: string;
  timestamp: string;
  projectedDate: string;
  historicalPrices: HistoricalPriceRecord[];
}

interface HistoricalPriceRecord {
  year: number;
  price: number;
  season: Season;
  quality: Quality;
}

interface CropTrendData {
  basePrice: number;
  annualInflation: number;
  volatilityFactor: number;
  historicalRecords: HistoricalPriceRecord[];
}

// Database of current and historical prices (now complete)
const CROP_PRICE_DATABASE: Record<CropType, CropTrendData> = {
  maize: {
    basePrice: 350,
    annualInflation: 0.15,
    volatilityFactor: 1.2,
    historicalRecords: [
      { year: 2020, price: 280, season: "harvest", quality: "medium" },
      { year: 2021, price: 310, season: "harvest", quality: "medium" },
      { year: 2022, price: 340, season: "harvest", quality: "medium" },
      { year: 2023, price: 350, season: "harvest", quality: "medium" }
    ]
  },
  rice: {
    basePrice: 600,
    annualInflation: 0.18,
    volatilityFactor: 1.15,
    historicalRecords: [
      { year: 2020, price: 480, season: "harvest", quality: "medium" },
      { year: 2021, price: 520, season: "harvest", quality: "medium" },
      { year: 2022, price: 570, season: "harvest", quality: "medium" },
      { year: 2023, price: 600, season: "harvest", quality: "medium" }
    ]
  },
  sorghum: {
    basePrice: 280,
    annualInflation: 0.12,
    volatilityFactor: 1.1,
    historicalRecords: [
      { year: 2020, price: 230, season: "harvest", quality: "medium" },
      { year: 2021, price: 250, season: "harvest", quality: "medium" },
      { year: 2022, price: 270, season: "harvest", quality: "medium" },
      { year: 2023, price: 280, season: "harvest", quality: "medium" }
    ]
  },
  cassava: {
    basePrice: 200,
    annualInflation: 0.1,
    volatilityFactor: 1.3,
    historicalRecords: [
      { year: 2020, price: 170, season: "planting", quality: "medium" },
      { year: 2021, price: 180, season: "planting", quality: "medium" },
      { year: 2022, price: 190, season: "planting", quality: "medium" },
      { year: 2023, price: 200, season: "planting", quality: "medium" }
    ]
  },
  yam: {
    basePrice: 400,
    annualInflation: 0.14,
    volatilityFactor: 1.25,
    historicalRecords: [
      { year: 2020, price: 320, season: "off-season", quality: "medium" },
      { year: 2021, price: 350, season: "off-season", quality: "medium" },
      { year: 2022, price: 380, season: "off-season", quality: "medium" },
      { year: 2023, price: 400, season: "off-season", quality: "medium" }
    ]
  },
  beans: {
    basePrice: 550,
    annualInflation: 0.16,
    volatilityFactor: 1.18,
    historicalRecords: [
      { year: 2020, price: 450, season: "harvest", quality: "medium" },
      { year: 2021, price: 480, season: "harvest", quality: "medium" },
      { year: 2022, price: 520, season: "harvest", quality: "medium" },
      { year: 2023, price: 550, season: "harvest", quality: "medium" }
    ]
  },
  millet: {
    basePrice: 320,
    annualInflation: 0.13,
    volatilityFactor: 1.15,
    historicalRecords: [
      { year: 2020, price: 270, season: "planting", quality: "medium" },
      { year: 2021, price: 290, season: "planting", quality: "medium" },
      { year: 2022, price: 310, season: "planting", quality: "medium" },
      { year: 2023, price: 320, season: "planting", quality: "medium" }
    ]
  },
  soybeans: {
    basePrice: 450,
    annualInflation: 0.2,
    volatilityFactor: 1.3,
    historicalRecords: [
      { year: 2020, price: 350, season: "harvest", quality: "medium" },
      { year: 2021, price: 380, season: "harvest", quality: "medium" },
      { year: 2022, price: 420, season: "harvest", quality: "medium" },
      { year: 2023, price: 450, season: "harvest", quality: "medium" }
    ]
  },
  plantain: {
    basePrice: 300,
    annualInflation: 0.17,
    volatilityFactor: 1.4,
    historicalRecords: [
      { year: 2020, price: 240, season: "off-season", quality: "medium" },
      { year: 2021, price: 260, season: "off-season", quality: "medium" },
      { year: 2022, price: 280, season: "off-season", quality: "medium" },
      { year: 2023, price: 300, season: "off-season", quality: "medium" }
    ]
  },
  groundnut: {
    basePrice: 500,
    annualInflation: 0.15,
    volatilityFactor: 1.2,
    historicalRecords: [
      { year: 2020, price: 400, season: "harvest", quality: "medium" },
      { year: 2021, price: 430, season: "harvest", quality: "medium" },
      { year: 2022, price: 470, season: "harvest", quality: "medium" },
      { year: 2023, price: 500, season: "harvest", quality: "medium" }
    ]
  }
};

export function predictNigeriaCropPrice(
  cropType: CropType,
  season: Season,
  quantity: number,
  quality: Quality,
  timePeriod: TimePeriod = "current"
): PricePrediction {
  // Validate inputs with proper type checking
  if (!cropType || !Object.keys(CROP_PRICE_DATABASE).includes(cropType)) {
    throw new Error(`Invalid crop type: ${cropType}`);
  }
  if (!["planting", "harvest", "off-season"].includes(season)) {
    throw new Error(`Invalid season: ${season}`);
  }
  if (!["low", "medium", "high"].includes(quality)) {
    throw new Error(`Invalid quality: ${quality}`);
  }
  if (isNaN(quantity) || quantity <= 0) {
    throw new Error(`Invalid quantity: ${quantity}`);
  }
  if (!["current", "1-2-years", "2-5-years", "5+-years"].includes(timePeriod)) {
    throw new Error(`Invalid time period: ${timePeriod}`);
  }

  // Get crop data with null checks
  const cropData = CROP_PRICE_DATABASE[cropType];
  if (!cropData) {
    throw new Error(`No data available for ${cropType}`);
  }

  // Initialize with safe defaults
  const SEASONAL_FACTORS = {
    planting: 1.25,
    harvest: 0.85,
    "off-season": 1.15
  };

  const QUALITY_FACTORS = {
    low: 0.8,
    medium: 1.0,
    high: 1.3
  };

  const TIME_FACTORS = {
    "1-2-years": 1.1,
    "2-5-years": 1.3,
    "5+-years": 1.5
  };

  // Safe calculation functions
  const getProjectedDate = (period: TimePeriod): string => {
    try {
      const date = new Date();
      if (period === "1-2-years") date.setFullYear(date.getFullYear() + 2);
      if (period === "2-5-years") date.setFullYear(date.getFullYear() + 5);
      if (period === "5+-years") date.setFullYear(date.getFullYear() + 7);
      return date.toISOString().split("T")[0];
    } catch (e) {
      return "current";
    }
  };

  const calculateTimeProjection = (
    basePrice: number,
    period: TimePeriod
  ): number => {
    try {
      const years = period === "1-2-years" ? 2 : period === "2-5-years" ? 5 : 7;

      const inflationFactor = Math.pow(
        1 + (cropData.annualInflation || 0),
        years
      );
      const timeFactor = TIME_FACTORS[period] || 1;

      return basePrice * Math.max(inflationFactor, timeFactor);
    } catch (e) {
      return basePrice; // Fallback to base price if calculation fails
    }
  };

  const getQuantityDiscount = (qty: number): number => {
    if (isNaN(qty)) return 1.0;
    if (qty > 10000) return 0.9;
    if (qty > 5000) return 0.95;
    return 1.0;
  };

  // Start with base price or default if invalid
  let price = cropData.basePrice || 0;
  if (isNaN(price)) price = 0;

  // Apply factors with safety checks
  price *= SEASONAL_FACTORS[season] || 1;
  price *= QUALITY_FACTORS[quality] || 1;
  price *= getQuantityDiscount(quantity);

  // Apply time projection if not current
  if (timePeriod !== "current") {
    price = calculateTimeProjection(price, timePeriod);
  }

  // Apply volatility with bounds checking
  const volatilityFactor = Math.min(
    Math.max(cropData.volatilityFactor || 1, 1),
    2
  ); // Cap between 1-2
  const volatility = 1 + Math.random() * 0.05 * volatilityFactor;
  price *= volatility;

  // Ensure final price is valid number
  if (isNaN(price)) price = 0;
  price = Math.max(0, Math.round(price / 10) * 10); // Ensure non-negative

  // Build explanation
  const explanations = [
    `Current base price for ${cropType}: ₦${cropData.basePrice}/kg`,
    `${season} season adjustment`,
    `${quality} quality multiplier`,
    quantity > 5000 ? `Bulk discount for ${quantity}kg` : null,
    timePeriod !== "current"
      ? `Projected ${timePeriod.replace(/-/g, " ")} inflation (${(
          (cropData.annualInflation || 0) * 100
        ).toFixed(0)}% annual)`
      : null,
    `Market volatility factor applied`,
    `Final ${timePeriod.replace(/-/g, " ")} price prediction`
  ].filter(Boolean) as string[];

  return {
    predictedPrice: price,
    pricePerKg: price,
    totalPrice: price * quantity,
    currency: "NGN",
    explanation: explanations.join("\n• "),
    timestamp: new Date().toISOString(),
    projectedDate:
      timePeriod !== "current" ? getProjectedDate(timePeriod) : "current",
    historicalPrices: cropData.historicalRecords || []
  };
}

// Example Usage with error handling
try {
  const prediction = predictNigeriaCropPrice(
    "rice",
    "harvest",
    5000,
    "high",
    "current"
  );
  console.log(prediction);
} catch (error) {
  console.error("Prediction failed:", error.message);
}
