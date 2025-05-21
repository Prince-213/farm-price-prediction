/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { prisma } from "@/app/prisma";
import { redirect } from "next/navigation";
import { predictYield } from "@/lib/api";
import {
  calculatePercentageChange,
  getCropPriceByName,
  sendEmail
} from "./utils";

interface ActionResult {
  prediction: number | null;
  error: string | null;
  message: string;
}

// Mapping objects for form values to model numeric inputs

export const predictPrice = async (prevState: any, formData: FormData) => {
  console.log(formData);

  /*  const data = predictNigeriaCropPrice(
    cropType,
    season,
    quantity,
    quality,
    period
  ); */

  try {
    /* await prisma.pricePrediction.create({
      data: {
        crop: cropType,
        predictedPrice: data.predictedPrice,
        pricePerKg: data.pricePerKg,
        totalPrice: data.totalPrice,
        currency: data.currency,
        explanation: data.explanation,
        quantity: quantity,

        season: season,
        quality: quality,

        projectedDate: data.projectedDate,
        timePeriod: period,

        farmersId: cookieStore.get("id")?.value.toString() || ""
      }
    }); */

    const input = {
      region: parseInt(formData.get("region") as string),
      soil_type: parseInt(formData.get("soil_type") as string),
      crop: parseInt(formData.get("crop") as string),
      rainfall: parseInt(formData.get("rainfall") as string),
      temperature: parseInt(formData.get("temperature") as string),
      fertilizer: parseInt(formData.get("fertilizer") as string),
      irrigation: parseInt(formData.get("irrigation") as string),
      weather: parseInt(formData.get("weather") as string),
      days_to_harvest: parseInt(formData.get("harvest") as string)
    };

    const result = await predictYield(input);
    console.log(`Predicted Yield: ${result.yield_tons} tons`);
    console.log(`Estimated Value: ₦${result.naira_value.toLocaleString()}`);
    console.log("Details:", result.human_readable);

    return { message: "success", prediction: result.naira_value };
  } catch (error) {
    console.log(error);
    return { message: "unsuccess" };
  }
};

export const loginFarmer = async (prevState: any, formData: FormData) => {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  console.log(email);
  console.log(password);

  const data = await prisma.farmer.findUnique({
    where: {
      email: email
    }
  });

  if (data) {
    if (data?.password === password) {
      const cookieStore = await cookies();
      cookieStore.set("email", data.email, { secure: true });
      cookieStore.set("name", data.name, { secure: true });

      cookieStore.set("id", data.id, { secure: true });

      return redirect("/dash/farm"); // ✅ Return redirect instead of just calling it
    } else {
      return { message: "unsuccess" };
    }
  } else {
    return { message: "not" };
  }
};
export const createFarmer = async (prevState: any, formData: FormData) => {
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  try {
    await prisma.farmer.create({
      data: {
        name: name,
        email: email,
        password: password
      }
    });

    return { message: "success" };
  } catch (err) {
    console.error(err);
    return { message: "success" };
  }
};

export const postForumPost = async (prevState: any, formData: FormData) => {
  console.log(formData);

  const cookieStore = await cookies();

  const reply = formData.get("reply")?.toString() || "";

  try {
    await prisma.post.create({
      data: {
        content: reply,
        name: cookieStore.get("name")?.value.toString() || "",
        authorId: cookieStore.get("id")?.value.toString() || ""
      }
    });

    return { message: "success" };
  } catch (error) {
    console.log(error);
    return { message: "unsuccess" };
  }
};

export const updatePrice = async (prevState: any, formData: FormData) => {
  console.log(formData);

  const crop = formData.get("crop")?.toString() || "";
  const amount = parseInt(formData.get("amount")?.toString() || "0");

  const data = await prisma.farmer.findMany();

  try {
    const currentCropPrice = await getCropPriceByName(crop);

    const priceDifference = Math.abs(currentCropPrice - amount);

    const percentPriceDiff = calculatePercentageChange(
      currentCropPrice,
      amount
    );

    await prisma.notifications.create({
      data: {
        crop: crop,
        priceChange: priceDifference.toString(),
        percentChange: percentPriceDiff.toString(),
        previousPrice: currentCropPrice.toString(),
        currentPrice: amount.toString(),
        isIncrease: currentCropPrice > amount ? false : true
      }
    });

    await prisma.prices.update({
      where: {
        crop: crop
      },
      data: {
        pricePerKg: amount
      }
    });

    data.forEach(async (farmer) => {
      await sendEmail({
        email: farmer.email,
        produce: crop,
        price: amount.toString()
      });
    });

    console.log("email functionality loaded");

    return { message: "success" };
  } catch (error) {
    console.log(error);

    return { message: "unsuccess" };
  }
};

export const logOut = async (formData: FormData) => {
  console.log(formData);

  const cookieStore = await cookies();
  cookieStore.delete("name");
  cookieStore.delete("email");
  cookieStore.delete("id");

  return redirect("/");
};

export const loginAdmin = async (prevState: any, formData: FormData) => {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  console.log(email);
  console.log(password);

  if (email === "admin@gmail.com" && password === "pass") {
    const cookieStore = await cookies();
    cookieStore.set("name", "admin", { secure: true });
    cookieStore.set("admin", "skajfwe88wehs", { secure: true });

    return redirect("/dash/admin"); // ✅ Return redirect instead of just calling it
  } else {
    return { message: "unsuccess" };
  }
};

export const logoutFarmer = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("email");
  cookieStore.delete("name");

  cookieStore.delete("id");

  return redirect("/"); // ✅ Return redirect instead of just calling it
};

export const logoutAdmin = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("admin");
  cookieStore.delete("name");

  return redirect("/"); // ✅ Return redirect instead of just calling it
};
