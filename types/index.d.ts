interface Prediction {
  id: string;
  date: string;
  produce: string;
  quantity: number;
  season: string;
  quality: string;
  predictedPrice: number;
  actualPrice: number | null;
}

type CropType =
  | "maize"
  | "rice"
  | "sorghum"
  | "cassava"
  | "yam"
  | "beans"
  | "millet"
  | "soybeans"
  | "plantain"
  | "groundnut";
type Season = "planting" | "harvest" | "off-season";
type Quality = "low" | "medium" | "high";
type TimePeriod = "current" | "1-2-years" | "2-5-years" | "5+-years";

// Define enums based on your Prisma schema
type Season = "SPRING" | "SUMMER" | "FALL" | "WINTER";
type Quality = "LOW" | "MEDIUM" | "HIGH";
type CropType = "CORN" | "WHEAT" | "RICE"; // Update with actual crop types
type TimePeriod = "SHORT_TERM" | "MEDIUM_TERM" | "LONG_TERM";

// Define interface for HistoricalPrice
interface HistoricalPrice {
  id: string;
  year: number;
  price: number;
  season: Season;
  quality: Quality;
}

// Define interface for PricePrediction
interface PricePrediction {
  id: string;
  crop: CropType;
  predictedPrice: number;
  pricePerKg: number;
  totalPrice: number;
  currency: string;
  explanation: string;
  timestamp: Date;
  projectedDate: string;
  timePeriod: TimePeriod;
  historicalPrices: HistoricalPrice[];
}

// Define interface for Comment
interface Comment {
  name: string;
  content: string;
  createdAt: Date;
}

// Define interface for Post
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  comments: Comment[];
}

// Define interface for Farmer (excluding password for client-side safety)
interface Farmer {
  id: string;
  name: string;
  email: string;
  predictions: PricePrediction[];
  posts: Post[];
}

// Update the fetcher with proper typing

interface CropPrice {
  id: string;
  crop: string;
  pricePerKg: number;
  unit: string;
  season: string;
  lastUpdated: string; // or Date, depending on usage
}
