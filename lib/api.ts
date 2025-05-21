interface PredictionInput {
  region: number;
  soil_type: number;
  crop: number;
  rainfall: number;
  temperature: number;
  fertilizer: number;
  irrigation: number;
  weather: number;
  days_to_harvest: number;
}

interface PredictionResponse {
  yield_tons: number;
  naira_value: number;
  human_readable: {
    region: string;
    soil_type: string;
    crop: string;
    rainfall: number;
    temperature: number;
    fertilizer: boolean;
    irrigation: boolean;
    weather: string;
    days_to_harvest: number;
    price_per_ton: number;
  };
  status: "success";
}

export async function predictYield(
  input: PredictionInput
): Promise<PredictionResponse> {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Prediction failed");
  }

  return await response.json();
}
