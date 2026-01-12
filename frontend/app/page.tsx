"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Activity, ShieldCheck, BarChart3, ArrowRight, 
  Stethoscope, Heart, Apple, Dumbbell, Brain, Clock 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
              v1.0 Public Release
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
              Predict Heart Disease <br />
              <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                With AI Precision.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              An advanced diagnostic tool powered by Random Forest & XGBoost algorithms. 
              Analyze patient vitals in seconds with 76%+ accuracy.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <Link href="/diagnose">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 transition flex items-center gap-2">
                  Start Analysis <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="/insights">
                <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition">
                  View How It Works
                </button>
              </Link>
            </div>
          </motion.div>

        </div>
        {/* Background Decorative Blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -z-10" />
      </section>


      {/* --- SECTION 2: HOW IT WORKS (New) --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
                <p className="text-gray-500 mt-2">Three simple steps to generate your risk profile.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop Only) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10" />

                {/* Step 1 */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="flex flex-col items-center text-center bg-white"
                >
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                        <Stethoscope className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Input Vitals</h3>
                    <p className="text-gray-500">Enter standard clinical data including Blood Pressure, BMI, Glucose, and Cholesterol levels.</p>
                </motion.div>

                {/* Step 2 */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="flex flex-col items-center text-center bg-white"
                >
                    <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                        <Brain className="text-purple-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. AI Processing</h3>
                    <p className="text-gray-500">Our machine learning engine (Random Forest) analyzes your data against 70,000 historical records.</p>
                </motion.div>

                {/* Step 3 */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                    className="flex flex-col items-center text-center bg-white"
                >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                        <Activity className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Instant Results</h3>
                    <p className="text-gray-500">Receive an immediate risk assessment with confidence scores and interpretable factors.</p>
                </motion.div>
            </div>
        </div>
      </section>


      {/* --- SECTION 3: TECH FEATURES (Existing) --- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why CardioAI?</h2>
            <p className="text-gray-500 mt-2">Professional-grade machine learning features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6"><Activity className="text-green-600" size={24} /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Model Analysis</h3>
              <p className="text-gray-500">Choose between Logistic Regression (Scratch), Random Forest, and XGBoost.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6"><ShieldCheck className="text-blue-600" size={24} /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Validation</h3>
              <p className="text-gray-500">Smart validation ensures no impossible medical values are processed.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6"><BarChart3 className="text-purple-600" size={24} /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Glass-Box Transparency</h3>
              <p className="text-gray-500">We don't hide the math. View feature importance charts on our dashboard.</p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* --- SECTION 4: HEART HEALTH ESSENTIALS (New) --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Heart className="text-red-500 fill-red-500" /> Heart Health Essentials
                    </h2>
                    <p className="text-gray-500 mt-4 text-lg">
                        Prevention is better than cure. Regardless of your AI results, maintaining 
                        a healthy heart requires consistent lifestyle habits.
                        

[Image of human heart anatomy]

                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Tip 1: Diet */}
                <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100 hover:shadow-md transition">
                    <Apple className="text-orange-500 mb-4" size={32} />
                    <h3 className="font-bold text-gray-900 mb-2">Balanced Diet</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Focus on fruits, vegetables, whole grains, and lean proteins. Reduce sodium to lower blood pressure.
                    </p>
                </div>

                {/* Tip 2: Exercise */}
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 hover:shadow-md transition">
                    <Dumbbell className="text-blue-500 mb-4" size={32} />
                    <h3 className="font-bold text-gray-900 mb-2">Regular Activity</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Aim for at least 150 minutes of moderate-intensity aerobic activity every week.
                    </p>
                </div>

                {/* Tip 3: Stress */}
                <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100 hover:shadow-md transition">
                    <Brain className="text-purple-500 mb-4" size={32} />
                    <h3 className="font-bold text-gray-900 mb-2">Stress Management</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Chronic stress can damage arteries. Practice mindfulness, sleep well, and stay connected.
                    </p>
                </div>

                 {/* Tip 4: Checkups */}
                 <div className="p-6 rounded-2xl bg-red-50 border border-red-100 hover:shadow-md transition">
                    <Clock className="text-red-500 mb-4" size={32} />
                    <h3 className="font-bold text-gray-900 mb-2">Regular Checkups</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Monitor Blood Pressure and Cholesterol annually. Early detection is key to prevention.
                    </p>
                </div>

            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 text-center border border-gray-200">
                <strong>Medical Disclaimer:</strong> The advice above is general in nature. Always follow the specific treatment plan provided by your certified healthcare professional.
            </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to check your vitals?</h2>
            <p className="text-gray-400 mb-8 text-lg">
                It takes less than 30 seconds to run a preliminary AI assessment.
            </p>
            <Link href="/diagnose">
                <button className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition shadow-lg shadow-blue-900/50">
                    Run Diagnosis Now
                </button>
            </Link>
        </div>
      </section>

    </div>
  );
}