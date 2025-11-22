import React, { useState } from 'react';
import { FinancialData } from '../types';
import { Button } from './Button';
import { Building2, DollarSign, PieChart, TrendingUp, UploadCloud } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: FinancialData) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'Technology',
    annualRevenue: '',
    monthlyExpenses: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateMockData = () => {
    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const revenue = parseFloat(formData.annualRevenue) || 0;
      const expenses = parseFloat(formData.monthlyExpenses) || 0;
      const monthlyRev = revenue / 12;
      const netIncome = monthlyRev - expenses;
      
      // Calculate a basic health score
      let score = 50;
      if (netIncome > 0) score += 20;
      if (expenses < monthlyRev * 0.5) score += 15;
      if (revenue > 100000) score += 10;
      score = Math.min(100, Math.max(0, score)); // clamp 0-100

      // Mock historical data based on inputs
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyRevenueData = months.map(m => ({
        month: m,
        value: monthlyRev * (0.8 + Math.random() * 0.4) // Random variation around average
      }));

      // Mock forecast
      const forecastData = months.slice(0, 6).map((m, i) => ({
        month: `Next ${m}`,
        value: monthlyRev * (1 + (i * 0.05)) // 5% growth projection
      }));

      const financialData: FinancialData = {
        companyName: formData.companyName,
        industry: formData.industry,
        annualRevenue: revenue,
        monthlyExpenses: expenses,
        cashFlow: netIncome,
        healthScore: Math.floor(score),
        recentTransactions: [
          { id: '1', date: '2023-10-24', description: 'Client Payment', amount: revenue * 0.05, type: 'income' },
          { id: '2', date: '2023-10-22', description: 'Server Costs', amount: expenses * 0.1, type: 'expense' },
          { id: '3', date: '2023-10-20', description: 'Office Supplies', amount: 250, type: 'expense' },
          { id: '4', date: '2023-10-18', description: 'Marketing', amount: 1200, type: 'expense' },
          { id: '5', date: '2023-10-15', description: 'Consulting', amount: 3000, type: 'income' },
        ],
        monthlyRevenueData,
        forecastData
      };

      onComplete(financialData);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-[#191919] p-8 text-white text-center relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mx-auto w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-900/50">
              <TrendingUp size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Bob's Business</h1>
            <p className="text-slate-400">Let's analyze your financial health.</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Building2 size={14} /> Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all outline-none text-slate-800 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <PieChart size={14} /> Industry
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all outline-none text-slate-800 font-medium"
              >
                <option value="Technology">Technology</option>
                <option value="Retail">Retail</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <DollarSign size={14} /> Annual Revenue (Est.)
              </label>
              <input
                type="number"
                name="annualRevenue"
                value={formData.annualRevenue}
                onChange={handleChange}
                placeholder="150000"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all outline-none text-slate-800 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={14} /> Monthly Expenses (Avg.)
              </label>
              <input
                type="number"
                name="monthlyExpenses"
                value={formData.monthlyExpenses}
                onChange={handleChange}
                placeholder="5000"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all outline-none text-slate-800 font-medium"
              />
            </div>
          </div>

          <div className="pt-4">
            <div className="bg-slate-50 border-2 border-slate-100 border-dashed rounded-xl p-6 text-center mb-6 group hover:border-teal-300 transition-colors cursor-pointer">
              <UploadCloud className="mx-auto h-10 w-10 text-slate-300 group-hover:text-teal-500 transition-colors mb-2" />
              <p className="text-sm text-slate-500 font-medium mb-1">Upload Financial Statements</p>
              <p className="text-xs text-slate-400">Supports CSV, PDF, XLS</p>
            </div>

            <Button 
              onClick={calculateMockData} 
              isLoading={loading} 
              className="w-full py-4 text-lg shadow-xl shadow-teal-600/20"
              disabled={!formData.companyName || !formData.annualRevenue}
            >
              Analyze My Business
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};