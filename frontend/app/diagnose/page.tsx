"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, AlertCircle, CheckCircle, ChevronRight, 
  Brain, Zap, Code, HeartPulse, Stethoscope, ShieldCheck, Lock, Info 
} from 'lucide-react';

export default function DiagnosePage() {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  
  const [formData, setFormData] = useState({
    model: 'rf', // Default model
    age: '', gender: '', height: '', weight: '',
    ap_hi: '', ap_lo: '',
    cholesterol: '1', gluc: '1',
    smoke: '0', alco: '0', active: '1'
  });

  // --- VALIDATION LOGIC ---
  const validateField = (name: string, value: any) => {
    let error = "";
    const val = parseFloat(value);

    switch (name) {
      case 'age':
        if (val < 10 || val > 120) error = "Age must be realistic (10-120).";
        break;
      case 'height':
        if (val < 50 || val > 250) error = "Height must be between 50-250cm.";
        break;
      case 'weight':
        if (val < 20 || val > 300) error = "Weight must be between 20-300kg.";
        break;
      case 'ap_hi':
        if (val < 60 || val > 260) error = "Invalid Systolic BP range.";
        break;
      case 'ap_lo':
        if (val < 30 || val > 200) error = "Invalid Diastolic BP range.";
        if (formData.ap_hi && val >= parseFloat(formData.ap_hi)) error = "Diastolic must be lower than Systolic.";
        break;
    }
    return error;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Trigger validation
    const error = validateField(name, value);
    setErrors((prev: any) => ({ ...prev, [name]: error }));
  };

  const handleModelSelect = (modelKey: string) => {
    setFormData(prev => ({ ...prev, model: modelKey }));
  };

  // --- API SUBMISSION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Convert strings to numbers for API
      const payload = {
        model: formData.model,
        age: parseFloat(formData.age),
        gender: parseInt(formData.gender),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        ap_hi: parseFloat(formData.ap_hi),
        ap_lo: parseFloat(formData.ap_lo),
        cholesterol: parseInt(formData.cholesterol),
        gluc: parseInt(formData.gluc),
        smoke: parseInt(formData.smoke),
        alco: parseInt(formData.alco),
        active: parseInt(formData.active),
      };

      const res = await axios.post('/api/predict', payload);
      setResult(res.data);
    } catch (err) {
      alert("Error connecting to server. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* EXPANDED CONTAINER WIDTH: max-w-7xl */}
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-700 font-medium text-sm mb-4 border border-blue-100">
            <Activity size={16} /> Clinical Research Tool v1.0
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 flex justify-center items-center gap-3">
            <Stethoscope className="text-blue-600" size={40} />
            Patient Diagnostics
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced machine learning assessment for cardiovascular risk factors. 
            Please ensure all vitals are measured accurately.
          </p>
        </div>

        {/* MEDICAL DISCLAIMER BANNER (NEW PROFESSIONAL ELEMENT) */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg flex items-start gap-3">
           <Info className="text-yellow-600 shrink-0 mt-0.5" size={20} />
           <div className="text-sm text-yellow-800">
             <strong>Clinical Disclaimer:</strong> This tool utilizes statistical models (Random Forest/XGBoost) for research and educational purposes. 
             Results should not be interpreted as a definitive medical diagnosis. Always consult a certified cardiologist.
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: FORM (Takes up 8/12 columns) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. MODEL SELECTION CARDS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Select AI Architecture</h3>
                 <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Backend: Python/Flask</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Random Forest */}
                <div 
                  onClick={() => handleModelSelect('rf')}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center ${formData.model === 'rf' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                >
                  <Brain size={24} className={formData.model === 'rf' ? 'text-blue-600' : 'text-gray-400'} />
                  <span className="font-bold text-sm mt-2 text-gray-800">Random Forest</span>
                  <span className="text-xs text-green-600 font-semibold mt-1">Recommended</span>
                </div>

                {/* XGBoost */}
                <div 
                  onClick={() => handleModelSelect('xgboost')}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center ${formData.model === 'xgboost' ? 'border-purple-500 bg-purple-50' : 'border-gray-100 hover:border-purple-200'}`}
                >
                  <Zap size={24} className={formData.model === 'xgboost' ? 'text-purple-600' : 'text-gray-400'} />
                  <span className="font-bold text-sm mt-2 text-gray-800">XGBoost</span>
                  <span className="text-xs text-gray-500 mt-1">High Accuracy</span>
                </div>

                {/* Custom */}
                <div 
                  onClick={() => handleModelSelect('custom')}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center ${formData.model === 'custom' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
                >
                  <Code size={24} className={formData.model === 'custom' ? 'text-orange-600' : 'text-gray-400'} />
                  <span className="font-bold text-sm mt-2 text-gray-800">Logistic Reg.</span>
                  <span className="text-xs text-gray-500 mt-1">Experimental</span>
                </div>
              </div>
            </div>

            {/* 2. INPUT FIELDS */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
              
              {/* Section: Personal */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                  Demographics & Body Composition
                </h4>
                {/* Updated Grid to 3 Columns for wider screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <InputGroup label="Age (Years)" name="age" type="number" placeholder="45" value={formData.age} onChange={handleChange} error={errors.age} />
                  
                  {/* Gender Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 rounded-lg border text-black border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white" required>
                      <option value="" disabled>Select...</option>
                      <option value="2">Male</option>
                      <option value="1">Female</option>
                    </select>
                  </div>

                  <InputGroup label="Height (cm)" name="height" type="number" placeholder="175" value={formData.height} onChange={handleChange} error={errors.height} />
                  <InputGroup label="Weight (kg)" name="weight" type="number" placeholder="70" value={formData.weight} onChange={handleChange} error={errors.weight} />
                </div>
              </div>

              {/* Section: Medical */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">2</span>
                  Clinical Vitals
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <InputGroup label="Systolic BP" name="ap_hi" type="number" placeholder="120" value={formData.ap_hi} onChange={handleChange} error={errors.ap_hi} />
                  <InputGroup label="Diastolic BP" name="ap_lo" type="number" placeholder="80" value={formData.ap_lo} onChange={handleChange} error={errors.ap_lo} />
                  
                  <SelectGroup label="Cholesterol" name="cholesterol" value={formData.cholesterol} onChange={handleChange} options={[
                    { val: '1', txt: 'Normal' }, { val: '2', txt: 'Above Normal' }, { val: '3', txt: 'High' }
                  ]} />
                  
                  <SelectGroup label="Glucose" name="gluc" value={formData.gluc} onChange={handleChange} options={[
                    { val: '1', txt: 'Normal' }, { val: '2', txt: 'Above Normal' }, { val: '3', txt: 'High' }
                  ]} />
                </div>
              </div>

              {/* Section: Lifestyle */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">3</span>
                  Lifestyle Factors
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SelectGroup label="Smoking Status" name="smoke" value={formData.smoke} onChange={handleChange} options={[{ val: '0', txt: 'Non-Smoker' }, { val: '1', txt: 'Smoker' }]} />
                  <SelectGroup label="Alcohol Intake" name="alco" value={formData.alco} onChange={handleChange} options={[{ val: '0', txt: 'No' }, { val: '1', txt: 'Yes' }]} />
                  <SelectGroup label="Physical Activity" name="active" value={formData.active} onChange={handleChange} options={[{ val: '1', txt: 'Active' }, { val: '0', txt: 'Inactive' }]} />
                </div>
              </div>

              <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={loading || Object.values(errors).some(e => e !== "")}
                    className="w-full bg-gray-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-black transition disabled:bg-gray-400 flex justify-center items-center gap-3 shadow-lg shadow-gray-200"
                >
                    {loading ? "Processing Algorithms..." : <>Generate Risk Analysis <ChevronRight size={20} /></>}
                </button>
              </div>
            </form>
          </div>

          {/* --- RIGHT COLUMN: RESULTS PANEL (Takes up 4/12 columns) --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Result Card */}
              <AnimatePresence>
                {!result && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center min-h-[400px] flex flex-col justify-center items-center text-gray-400 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 opacity-50" />
                    <HeartPulse size={64} className="mb-6 opacity-20 text-blue-500 animate-pulse" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">Ready to Analyze</h3>
                    <p className="text-sm max-w-xs mx-auto">Fill in the patient's clinical data and select a model to generate a risk profile.</p>
                  </motion.div>
                )}

                {result && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-8 rounded-2xl shadow-xl border-2 text-center ${result.prediction === 1 ? 'bg-white border-red-100 ring-4 ring-red-50' : 'bg-white border-green-100 ring-4 ring-green-50'}`}
                  >
                    {result.prediction === 1 ? (
                      <>
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                          <AlertCircle className="text-red-500" size={40} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-red-600 mb-2">High Risk</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">The AI algorithms indicate a significant statistical probability of cardiovascular disease.</p>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                          <CheckCircle className="text-green-500" size={40} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-green-600 mb-2">Low Risk</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">The AI algorithms suggests the patient's vitals are currently within a healthy range.</p>
                      </>
                    )}

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                        <span className="text-sm text-gray-500 font-medium">Confidence Score</span>
                        <span className="font-mono text-lg font-bold text-gray-900">{result.probability || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 font-medium">Engine</span>
                        <span className="text-xs font-bold uppercase tracking-wide bg-gray-200 text-gray-700 px-2 py-1 rounded">{result.model_used || "Unknown"}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Security & Info Badge (NEW) */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-xs text-gray-500">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <ShieldCheck size={18} />
                </div>
                <div>
                    <p className="font-semibold text-gray-700">Data Privacy</p>
                    <p>Inputs are processed locally or securely. No patient PII is stored.</p>
                </div>
              </div>

              {/* Calculation Note */}
              <div className="p-4 rounded-xl text-xs text-blue-600 bg-blue-50/50 border border-blue-100">
                <strong>Automated Calculations:</strong> <br/>BMI (Body Mass Index) and Pulse Pressure are derived automatically by the backend engine.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- REUSABLE COMPONENTS FOR CLEANER CODE ---

const InputGroup = ({ label, name, type, placeholder, value, onChange, error }: any) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full p-3.5 rounded-lg border text-black bg-white ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'} outline-none transition duration-200`}
        required
      />
      {error && <AlertCircle className="absolute right-3 top-3.5 text-red-500" size={18} />}
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><AlertCircle size={10} /> {error}</p>}
  </div>
);

const SelectGroup = ({ label, name, value, onChange, options }: any) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
        <select 
        name={name} value={value} onChange={onChange}
        className="w-full p-3.5 rounded-lg border text-black bg-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none appearance-none"
        >
        {options.map((opt: any) => (
            <option key={opt.val} value={opt.val}>{opt.txt}</option>
        ))}
        </select>
        <div className="absolute right-3 top-4 pointer-events-none text-gray-400">
            <ChevronRight size={16} className="rotate-90" />
        </div>
    </div>
  </div>
);