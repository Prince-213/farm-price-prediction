/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { predictNigeriaCropPrice } from "./algo";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";
import {
  calculatePercentageChange,
  getCropPriceByName,
  sendEmail
} from "./utils";

export const predictPrice = async (prevState: any, formData: FormData) => {
  console.log(formData);

  const cookieStore = await cookies();

  const cropType = formData.get("crop")?.toString() as CropType;

  const season = formData.get("season")?.toString() as Season;
  const quantity = parseInt(formData.get("quantity")?.toString() || "0");
  const quality = formData.get("quality")?.toString() as Quality;
  const period = formData.get("period")?.toString() as TimePeriod;

  const data = predictNigeriaCropPrice(
    cropType,
    season,
    quantity,
    quality,
    period
  );

  console.log(data);

  try {
    await prisma.pricePrediction.create({
      data: {
        crop: cropType  ,
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
    });

    return { message: "success" };
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
