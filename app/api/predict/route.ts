import { spawn } from "child_process";
import path from "path";

// Helper function to validate input data
const validateInput = (data) => {
  const requiredFields = [
    "region",
    "soil_type",
    "crop",
    "rainfall",
    "temperature",
    "fertilizer",
    "irrigation",
    "weather",
    "harvest"
  ];

  const missingFields = requiredFields.filter((field) => !(field in data));
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // Additional validation rules can be added here
  if (typeof data.rainfall !== "number" || data.rainfall < 0) {
    throw new Error("Rainfall must be a positive number");
  }
  // Add more validations as needed
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .json({
        message: "Method not allowed",
        allowedMethods: ["POST"]
      });
  }

  try {
    // Validate input data
    validateInput(req.body);

    const pythonProcess = spawn("python", [
      path.join(process.cwd(), "scripts/predict.py"),
      JSON.stringify(req.body)
    ]);

    // Set timeout for the Python process (10 seconds)
    const timeout = setTimeout(() => {
      pythonProcess.kill();
      res.status(504).json({ error: "Prediction timed out" });
    }, 10000);

    let result = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      clearTimeout(timeout);

      if (code !== 0 || error) {
        console.error("Python error:", error);
        return res.status(500).json({
          error: "Prediction failed",
          details: error.trim() || "Unknown Python error"
        });
      }

      try {
        const parsedResult = JSON.parse(result);
        res.status(200).json(parsedResult);
      } catch (parseError) {
        console.error("Result parsing error:", parseError);
        res.status(500).json({
          error: "Result parsing failed",
          details: parseError.message
        });
      }
    });
  } catch (err) {
    console.error("API error:", err);
    if (err.message.startsWith("Missing required fields")) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({
        error: "Internal server error",
        details: err.message
      });
    }
  }
}
