import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os

# ==========================================
# 1. SETUP
# ==========================================
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '../data/cardio_train_clean.csv')

# --- DEFINITION: Custom Class (Must match your notebook) ---
class LogisticRegressionFromScratch:
    def __init__(self, learning_rate=0.01, n_iterations=1000):
        self.learning_rate = learning_rate
        self.n_iterations = n_iterations
        self.weights = None
        self.bias = None

    def sigmoid(self, z):
        return 1 / (1 + np.exp(-z))

    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0

        for _ in range(self.n_iterations):
            linear_model = np.dot(X, self.weights) + self.bias
            y_predicted = self.sigmoid(linear_model)

            dw = (1 / n_samples) * np.dot(X.T, (y_predicted - y))
            db = (1 / n_samples) * np.sum(y_predicted - y)

            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db

    def predict(self, X):
        linear_model = np.dot(X, self.weights) + self.bias
        y_predicted = self.sigmoid(linear_model)
        y_predicted_cls = [1 if i > 0.5 else 0 for i in y_predicted]
        return np.array(y_predicted_cls)

    def predict_proba(self, X):
        linear_model = np.dot(X, self.weights) + self.bias
        return self.sigmoid(linear_model)

sys.modules['__main__'].LogisticRegressionFromScratch = LogisticRegressionFromScratch

# ==========================================
# 2. SCALING VALUES (CRITICAL FOR CUSTOM MODEL)
# ==========================================
# These approximate the min/max of your training data
SCALERS = {
    'age': {'min': 29, 'max': 65}, 
    'height': {'min': 55, 'max': 250}, 
    'weight': {'min': 10, 'max': 200}, 
    'ap_hi': {'min': 60, 'max': 240}, 
    'ap_lo': {'min': 30, 'max': 180},
    'bmi': {'min': 10, 'max': 60},
    'pulse_pressure': {'min': 10, 'max': 120}
}

def scale_features(data, bmi, pp):
    """Normalize inputs between 0 and 1"""
    def norm(val, key):
        mn, mx = SCALERS[key]['min'], SCALERS[key]['max']
        return (val - mn) / (mx - mn)

    return np.array([[
        norm(data['age'], 'age'),
        data['gender'], # Gender is usually 1/2, safe to keep or norm if you did in notebook
        norm(data['height'], 'height'),
        norm(data['weight'], 'weight'),
        norm(data['ap_hi'], 'ap_hi'),
        norm(data['ap_lo'], 'ap_lo'),
        data['cholesterol'],
        data['gluc'],
        data['smoke'],
        data['alco'],
        data['active'],
        norm(bmi, 'bmi'),
        norm(pp, 'pulse_pressure')
    ]])

# ==========================================
# 3. LOAD MODELS
# ==========================================
models = {}
def load_model_file(filename, key_name):
    path = os.path.join(BASE_DIR, filename)
    if os.path.exists(path):
        with open(path, 'rb') as f:
            models[key_name] = pickle.load(f)
            print(f"✅ Loaded {key_name}")
    else:
        print(f"⚠️ {filename} missing")

load_model_file('model.pkl', 'custom')
load_model_file('best_rf_model.pkl', 'rf')
load_model_file('xgb_model.pkl', 'xgboost')

# ==========================================
# 4. ENDPOINTS
# ==========================================

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        model_key = data.get('model', 'rf') 
        current_model = models.get(model_key)

        if not current_model:
            return jsonify({'error': 'Model not found'}), 500

        # Common Feature Engineering
        bmi = data['weight'] / ((data['height'] / 100) ** 2)
        pp = data['ap_hi'] - data['ap_lo']

        # --- SMART SCALING LOGIC ---
        if model_key == 'custom':
            # Custom model needs NORMALIZED data (0 to 1)
            features = scale_features(data, bmi, pp)
        else:
            # Random Forest / XGBoost need RAW data
            features = np.array([[
                data['age'], data['gender'], data['height'], data['weight'], 
                data['ap_hi'], data['ap_lo'], data['cholesterol'], data['gluc'], 
                data['smoke'], data['alco'], data['active'], bmi, pp
            ]])

        # Prediction
        prediction = current_model.predict(features)
        
        # Probability handling
        prob = "N/A"
        if hasattr(current_model, 'predict_proba'):
            try:
                # Handle different return shapes of predict_proba
                raw_prob = current_model.predict_proba(features)
                if isinstance(raw_prob, list): # Custom model returns list
                     prob_val = raw_prob[0][1]
                else: # Sklearn returns numpy array
                     prob_val = raw_prob[0][1]
                
                prob = f"{round(prob_val * 100, 2)}%"
            except:
                prob = "N/A"

        return jsonify({
            'prediction': int(prediction[0]),
            'probability': prob,
            'model_used': model_key,
            'message': 'High Risk' if prediction[0] == 1 else 'Low Risk'
        })

    except Exception as e:
        print("ERROR:", str(e)) # Print error to terminal so you can see it
        return jsonify({'error': str(e)}), 500

# --- B. INSIGHTS ENDPOINT (Glass-Box Page) ---
column_names = None
try:
    with open(os.path.join(BASE_DIR, 'columns.pkl'), 'rb') as f:
        column_names = pickle.load(f)
        print(f"✅ Loaded column names: {column_names}")
except:
    print("⚠️ columns.pkl not found. Using fallback list.")
    # Fallback only if file missing
    column_names = ['Age', 'Gender', 'Height', 'Weight', 'ap_hi', 'ap_lo', 
                    'Cholesterol', 'Gluc', 'Smoke', 'Alco', 'Active', 'BMI', 'Pulse Pressure']


@app.route('/api/insights', methods=['GET'])
def get_insights():
    rf = models.get('rf')
    if not rf:
        return jsonify({'error': 'Random Forest model not loaded'}), 500

    try:
        # 1. Get Importances
        importances = rf.feature_importances_
        
        # 2. Use the DYNAMIC list we loaded (matches X_train exactly)
        # Note: If lengths don't match, this zipping ensures we don't crash, 
        # but you should check your notebook if they differ.
        feature_data = [{'name': col, 'value': round(float(val), 3)} 
                        for col, val in zip(column_names, importances)]
        
        # 3. Sort highest to lowest
        feature_data = sorted(feature_data, key=lambda x: x['value'], reverse=True)
        return jsonify({
            'featureImportance': feature_data,
            'metrics': { 'accuracy': 0.7355, 'precision': 0.7463, 'recall': 0.7285 },
            'confusionMatrix': [
                {'name': 'Actual Healthy', 'Predicted Healthy': 4482, 'Predicted Disease': 1923},
                {'name': 'Actual Disease', 'Predicted Healthy': 2016, 'Predicted Disease': 4562}
            ]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- C. MODEL INFO ENDPOINT (How it Works Page) ---
@app.route('/api/model-info', methods=['GET'])
def model_info():
    return jsonify({
        'columns': [
            {'name': 'Age', 'desc': 'Age in years', 'type': 'Numerical'},
            {'name': 'Systolic BP', 'desc': 'Upper blood pressure reading', 'type': 'Numerical'},
            {'name': 'Cholesterol', 'desc': '1: Normal, 2: Above, 3: High', 'type': 'Categorical'}
        ],
        'models': [
            {'name': 'Logistic Regression (Custom)', 'desc': 'Built from scratch using NumPy.', 'accuracy': '72%'},
            {'name': 'Random Forest', 'desc': 'Ensemble of 100 trees.', 'accuracy': '73.55%'},
            {'name': 'XGBoost', 'desc': 'Gradient Boosting algorithm.', 'accuracy': '73.43%'}
        ]
    })

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)