"use client";
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend 
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  Database, AlertTriangle, Info, CheckCircle, 
  BarChart2, FileText, ExternalLink, Download, 
  Users, GitBranch, Stethoscope, Activity 
} from 'lucide-react';

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Static data for Demographics (Based on the actual Kaggle Dataset stats)
  const genderData = [
    { name: 'Female', value: 45530, fill: '#ec4899' }, // Pink
    { name: 'Male', value: 24470, fill: '#3b82f6' },   // Blue
  ];

  const ageData = [
    { name: '30-40', value: 500 },
    { name: '40-50', value: 15000 },
    { name: '50-60', value: 35000 },
    { name: '60+', value: 19500 },
  ];

  useEffect(() => {
    fetch('/api/insights')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load insights", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600">
      <div className="animate-pulse flex flex-col items-center">
        <Activity size={48} className="mb-4 animate-spin" />
        <span className="font-semibold text-lg">Loading AI Analytics...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- HEADER WITH ACTIONS --- */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-8 gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                    Model Version 1.2
                </span>
                <span className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle size={14} /> System Operational
                </span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Model Insights & Logic
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Transparent analysis of the Random Forest algorithm, training data distribution, and performance benchmarks.
            </p>
          </div>
     
        </div>

        {/* --- SECTION 1: DATASET DEMOGRAPHICS (NEW) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Info Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-blue-600 rounded-2xl shadow-lg text-white p-8 flex flex-col justify-between relative overflow-hidden"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4 opacity-90">
                        <Database size={20} /> <span>Data Source</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Cardio Train Dataset</h2>
                    <p className="text-blue-100 leading-relaxed mb-6">
                        Objective clinical records from 70,000 patients. The data is balanced to ensure fair prediction across different patient profiles.
                    </p>
                    <a 
                    href="https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset" 
                    target="_blank" 
                    className="inline-flex items-center gap-2 text-sm bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition font-bold"
                    >
                    Verify on Kaggle <ExternalLink size={14} />
                    </a>
                </div>
                {/* Background Decor */}
                <Database size={200} className="absolute -bottom-10 -right-10 opacity-10" />
            </motion.div>

            {/* Gender Distribution */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <h3 className="text-gray-700 font-bold mb-2 flex items-center gap-2">
                    <Users size={18} /> Gender Distribution
                </h3>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" />
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">N = 70,000 Records</p>
            </div>

             {/* Age Distribution */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <h3 className="text-gray-700 font-bold mb-2 flex items-center gap-2">
                    <Activity size={18} /> Age Group Spread
                </h3>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageData}>
                            <XAxis dataKey="name" fontSize={12} stroke="#9ca3af" />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="value" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">Avg Age: ~53 Years</p>
            </div>
        </div>


        {/* --- SECTION 2: FEATURE INTELLIGENCE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Feature Importance Chart (8 Cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Global Feature Importance</h3>
                    <p className="text-sm text-gray-500">Relative weight of each clinical factor in the final decision.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-bold uppercase">
                    Method: Gini Impurity
                </div>
            </div>
            
            <div className="h-[350px] w-full">
              {data && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.featureImportance} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" hide />
                    
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={120} 
                      tick={{fill: '#374151', fontSize: 13, fontWeight: 600}} 
                    />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                      {data.featureImportance.map((entry:any, index:number) => (
                        <Cell key={`cell-${index}`} fill={index < 3 ? '#2563eb' : '#cbd5e1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Key Takeaways (4 Cols) - NEW */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-md flex-1">
                <div className="flex items-center gap-2 mb-4 text-indigo-200">
                    <Stethoscope size={20} />
                    <span className="font-bold uppercase text-xs tracking-wider">Clinical Findings</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Systolic BP is the Dominant Factor</h3>
                <p className="text-indigo-100 opacity-80 leading-relaxed mb-6">
                    The model identifies Systolic Blood Pressure (`ap_hi`) as the single strongest predictor of cardiovascular disease, followed closely by Age and Cholesterol levels.
                </p>
                <div className="border-t border-indigo-700 pt-4 mt-auto">
                    <div className="flex justify-between text-sm">
                        <span className="text-indigo-300">Top Predictor Power</span>
                        <span className="font-bold text-white">~45% Impact</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <GitBranch size={18} className="text-blue-500"/> Algorithm Architecture
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                    <strong>Random Forest Ensemble:</strong> 
                    
                    We utilize 100 parallel Decision Trees. Each tree votes on the outcome, and the majority class determines the final prediction.
                </p>
                <div className="flex gap-2 text-xs font-semibold">
                   <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">Max Depth: 10</span>
                   <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">Estimators: 100</span>
                </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: PERFORMANCE METRICS --- */}
        <div className="border-t border-gray-200 pt-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Model Performance</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 h-full content-start">
                <MetricCard label="Accuracy" value="73.6%" sub="Overall Correctness" color="bg-green-50 text-green-700 border-green-100" />
                <MetricCard label="Precision" value="74.6%" sub="Trust in Positive Predictions" color="bg-blue-50 text-blue-700 border-blue-100" />
                <MetricCard label="Recall" value="72.9%" sub="Ability to Find Cases" color="bg-purple-50 text-purple-700 border-purple-100" />
                <MetricCard label="F1-Score" value="73.7%" sub="Balanced Metric" color="bg-orange-50 text-orange-700 border-orange-100" />
            </div>

            {/* Confusion Matrix Visual */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex justify-between">
                    <span>Confusion Matrix</span>
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">Test Set: 13,000 samples</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-1 text-center">
                    {/* Headers */}
                    <div className="text-xs font-bold text-gray-400 pb-2">PREDICTED HEALTHY</div>
                    <div className="text-xs font-bold text-gray-400 pb-2">PREDICTED DISEASE</div>
                    
                    {/* Matrix */}
                    <div className="bg-green-50 p-6 rounded-tl-xl border border-white hover:border-green-200 transition">
                        <div className="text-3xl font-extrabold text-green-700">{data?.confusionMatrix[0]['Predicted Healthy']}</div>
                        <div className="text-xs font-bold text-green-600 mt-1 uppercase tracking-wider">True Healthy</div>
                    </div>
                    <div className="bg-red-50 p-6 rounded-tr-xl border border-white hover:border-red-200 transition">
                        <div className="text-3xl font-extrabold text-red-700">{data?.confusionMatrix[0]['Predicted Disease']}</div>
                        <div className="text-xs font-bold text-red-500 mt-1 uppercase tracking-wider">False Alarm (Type I)</div>
                    </div>
                    <div className="bg-red-50 p-6 rounded-bl-xl border border-white hover:border-red-200 transition">
                        <div className="text-3xl font-extrabold text-red-700">{data?.confusionMatrix[1]['Predicted Healthy']}</div>
                        <div className="text-xs font-bold text-red-500 mt-1 uppercase tracking-wider">Missed Case (Type II)</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-br-xl border border-white hover:border-green-200 transition">
                        <div className="text-3xl font-extrabold text-green-700">{data?.confusionMatrix[1]['Predicted Disease']}</div>
                        <div className="text-xs font-bold text-green-600 mt-1 uppercase tracking-wider">True Disease</div>
                    </div>
                </div>
            </div>
            </div>
        </div>

        {/* --- SECTION 4: DISCLAIMER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl flex gap-5 items-start"
        >
            <div className="bg-yellow-100 p-3 rounded-full shrink-0">
                 <AlertTriangle className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-yellow-900">Medical Disclaimer</h3>
              <p className="mt-1 text-yellow-800 text-sm leading-relaxed max-w-4xl">
                This tool is for <strong>educational and research purposes only</strong>. The predictions provided by this AI model are based on statistical patterns found in historical data and <strong>do not constitute a medical diagnosis</strong>. 
                Machine learning models can make errors (False Positives/Negatives). Never use this result as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
        </motion.div>

      </div>
    </div>
  );
}

// Helper for Metric Cards
function MetricCard({ label, value, sub, color }: any) {
  return (
    <div className={`p-6 rounded-2xl flex flex-col items-center justify-center border ${color}`}>
      <span className="text-4xl font-extrabold tracking-tight">{value}</span>
      <span className="text-sm font-bold uppercase opacity-80 mt-1">{label}</span>
      <span className="text-xs opacity-60 mt-2 text-center">{sub}</span>
    </div>
  );
}