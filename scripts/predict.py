import sys
import json
import pandas as pd
from joblib import load

def load_model():
    try:
        # Update this path to your actual model file location
        return load('./20250415_040509_decision_tree.joblib')
    except Exception as e:
        print(f"Model loading error: {str(e)}", file=sys.stderr)
        sys.exit(1)

def main():
    try:
        # Parse input data
        input_data = json.loads(sys.argv[1])
        
        # Validate input (optional additional validation)
        if not all(key in input_data for key in [
            'region', 'soil_type', 'crop', 'rainfall',
            'temperature', 'fertilizer', 'irrigation',
            'weather', 'harvest'
        ]):
            raise ValueError("Missing required fields in input data")

        # Prepare data for prediction
        new_data = pd.DataFrame({
            'Region': [input_data['region']],
            'Soil_Type': [input_data['soil_type']],
            'Crop': [input_data['crop']],
            'Rainfall_mm': [float(input_data['rainfall'])],
            'Temperature_Celsius': [float(input_data['temperature'])],
            'Fertilizer_Used': [input_data['fertilizer']],
            'Irrigation_Used': [input_data['irrigation']],
            'Weather_Condition': [input_data['weather']],
            'Days_to_Harvest': [int(input_data['harvest'])]
        })

        # Load model and predict
        model = load_model()
        prediction = model.predict(new_data)
        
        # Return result as JSON
        print(json.dumps({
            'prediction': float(prediction[0]),
            'status': 'success'
        }))

    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'status': 'error'
        }), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
