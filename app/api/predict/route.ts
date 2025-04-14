/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body;

  try {
    // Check Content-Type before parsing
    if (request.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid Content-Type. Expected application/json" },
        { status: 400 }
      );
    }

    body = await request.json();

    console.log("Received Body:", body);

    const { cropType, season, quantity, quality, timePeriod } = body;

    if (!cropType || !season || !quantity || !quality) {
      return NextResponse.json({ error: "Error" }, { status: 500 });
    }

    if (!Object.keys(CROP_PRICE_DATABASE).includes(cropType)) {
      return NextResponse.json({ error: "Error" }, { status: 500 });
    }

    const prediction = predictNigeriaCropPrice(
      cropType as CropType,
      season as Season,
      Number(quantity),
      quality as Quality,
      (timePeriod as TimePeriod) || "current"
    );

    console.log(prediction);

    return NextResponse.json({ data: prediction }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing ", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
