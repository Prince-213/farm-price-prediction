import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define types for our crop price data
type CropType =
  | "maize"
  | "rice"
  | "sorghum"
  | "cassava"
  | "yam"
  | "beans"
  | "millet"
  | "soybeans";

interface CropPrice {
  crop: CropType;
  pricePerKg: number;
  unit: string;
  lastUpdated: string;
  season: "planting" | "harvest" | "off-season";
}

// Current prices as of June 2023 (sample data in Naira)

export function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return new Date(date).toLocaleDateString("en-US", options);
}

export function formatCurrency(
  amount: number,
  currency: string = "NGN"
): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

export const seedPrices = async () => {
  try {
    await prisma.prices.createMany({
      data: [
        {
          crop: "maize",
          pricePerKg: 350,
          unit: "NGN",
          season: "harvest"
        },
        {
          crop: "rice",
          pricePerKg: 600,
          unit: "NGN",
          season: "harvest"
        },
        {
          crop: "sorghum",
          pricePerKg: 280,
          unit: "NGN",
          season: "harvest"
        },
        {
          crop: "cassava",
          pricePerKg: 200,
          unit: "NGN",
          season: "planting"
        },
        {
          crop: "yam",
          pricePerKg: 400,
          unit: "NGN",
          season: "harvest"
        },
        {
          crop: "beans",
          pricePerKg: 550,
          unit: "NGN",
          season: "harvest"
        },
        {
          crop: "millet",
          pricePerKg: 320,
          unit: "NGN",
          season: "planting"
        },
        {
          crop: "soybeans",
          pricePerKg: 450,
          unit: "NGN",
          season: "harvest"
        }
      ]
    });
  } catch (err) {
    console.error("Error seeding data", err);
  }
};

const getPrices = async () => {
  const data = await prisma.prices.findMany();

  return data;
};

export async function getPriceByCrop(cropName: string) {
  const data = await getPrices();

  const crop = data.find(
    (item) => item.crop.toLowerCase() === cropName.toLowerCase()
  );
  return crop ? crop.pricePerKg : null;
}

export async function sendEmail({
  email,
  produce,
  price
}: {
  email: string;
  produce: string;
  price: string;
}) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, produce, price })
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error sending email:", errorDetails.message);
      return false;
    }

    console.log("Email sent successfully!");
    return true;
  } catch (error) {
    console.error("There was a problem sending the email:", error);
    return false;
  }
}

export const getBaseUrl = (): string => {
  const siteUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://medilabni.netlify.app";

  return siteUrl;
};
