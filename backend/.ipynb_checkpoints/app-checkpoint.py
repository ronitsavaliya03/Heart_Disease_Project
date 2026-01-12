from flask import Flask, request, render_template
import numpy as np
import pickle

# ==========================================
# 1. PASTE YOUR CUSTOM CLASS HERE
# (The app needs this to understand the saved model)
# ==========================================
class LogisticRegressionFromScratch:
    def __init__(self, learning_rate=0.01, num_iterations=1000):
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.weights = None
        self.bias = None

    def _sigmoid(self, z):
        return 1 / (1 + np.exp(-z))

    def fit(self, X, y):
        # We don't need the training logic here, but the class structure must match.
        pass

    def predict(self, X):
        linear_model = np.dot(X, self.weights) + self.bias
        y_predicted = self._sigmoid(linear_model)
        y_predicted_cls = [1 if i > 0.5 else 0 for i in y_predicted]
        return np.array(y_predicted_cls)

# ==========================================
# 2. INITIALIZE FLASK & LOAD MODEL
# ==========================================
app = Flask(__name__)

# Load the trained model
# Make sure model.pkl is in the same folder or adjust path
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully!")
except FileNotFoundError:
    print("Error: model.pkl not found. Make sure you saved it in the app folder!")

# ==========================================
# 3. DEFINE ROUTES
# ==========================================

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        try:
            # A. GET DATA FROM FORM
            # We convert them to float because the model does math
            age_years = float(request.form['age'])
            gender = float(request.form['gender'])
            height = float(request.form['height'])
            weight = float(request.form['weight'])
            ap_hi = float(request.form['ap_hi'])
            ap_lo = float(request.form['ap_lo'])
            cholesterol = float(request.form['cholesterol'])
            gluc = float(request.form['gluc'])
            smoke = float(request.form['smoke'])
            alco = float(request.form['alco'])
            active = float(request.form['active'])

            # B. FEATURE ENGINEERING (Must match your Notebook!)
            # 1. Calculate BMI
            # Height in form is cm, but BMI calc usually uses meters. 
            # If you used cm in notebook, keep cm. Assuming standard formula:
            bmi = weight / ((height / 100) ** 2)

            # 2. Calculate Pulse Pressure
            pulse_pressure = ap_hi - ap_lo

            # C. PREPARE INPUT ARRAY
            # The order MUST match X_train columns exactly from your notebook
            # [age_years, gender, height, weight, ap_hi, ap_lo, cholesterol, gluc, smoke, alco, active, bmi, pulse_pressure]
            
            features = np.array([[
                age_years, gender, height, weight, ap_hi, ap_lo, 
                cholesterol, gluc, smoke, alco, active, bmi, pulse_pressure
            ]])

            # D. NORMALIZATION (IMPORTANT!)
            # Your model expects inputs between 0 and 1.
            # Ideally, you load the scaler from the notebook. 
            # For this simple project, you can skip strict scaling if the weights adapted, 
            # OR ideally, manually scale strictly if predictions look wrong.
            # features = (features - min_vals) / (max_vals - min_vals) 

            # E. PREDICT
            prediction = model.predict(features)
            
            # F. DISPLAY RESULT
            if prediction[0] == 1:
                result = "High Risk of Cardiovascular Disease. Please consult a doctor."
            else:
                result = "Low Risk. Keep maintaining a healthy lifestyle!"

            return render_template('index.html', prediction_text=result)

        except Exception as e:
            return render_template('index.html', prediction_text=f"Error: {str(e)}")

if __name__ == "__main__":
    app.run(debug=True)