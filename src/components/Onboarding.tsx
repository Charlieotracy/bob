import React, { useState } from 'react';
import { FinancialData, MonthlyMetric } from '../types';
import { Button } from './Button';
import { Building2, PieChart, TrendingUp, Zap } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: FinancialData) => void;
  
}

const INDUSTRIES = [
  "Automotive",
  "Retail",
  "Pool/Beach",
  "Tech",
  "Food/Beverage",
  "Child Care"
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  
  // Initialize with 12 months of empty data
  const [monthlyData, setMonthlyData] = useState(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(m => ({ month: m, revenue: '', expense: '' }));
  });

  const handleMonthChange = (index: number, field: 'revenue' | 'expense', value: string) => {
    const newData = [...monthlyData];
    newData[index] = { ...newData[index], [field]: value };
    setMonthlyData(newData);
  };

  // Helper to fill data quickly for demos
  const handleQuickFill = () => {
    const baseRevenue = 12000 + Math.random() * 5000;
    const baseExpense = 9000 + Math.random() * 2000;
    
    const newData = monthlyData.map((item, i) => {
        // Simulate some seasonality and growth
        const growthFactor = 1 + (i * 0.015) + (Math.random() * 0.05 - 0.025);
        return {
            ...item,
            revenue: Math.round(baseRevenue * growthFactor).toString(),
            expense: Math.round(baseExpense * (1 + (i * 0.005))).toString()
        };
    });
    setMonthlyData(newData);
  };

  const calculateFinancials = () => {
    setLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      // Parse inputs
      const parsedData = monthlyData.map(d => ({
        month: d.month,
        revenue: parseFloat(d.revenue) || 0,
        expense: parseFloat(d.expense) || 0
      }));

      const totalRevenue = parsedData.reduce((acc, cur) => acc + cur.revenue, 0);
      const totalExpenses = parsedData.reduce((acc, cur) => acc + cur.expense, 0);
      
      // Calculations
      const avgExpenses = totalExpenses / 12;
      const netIncome = totalRevenue - totalExpenses;
      const monthlyCashFlow = netIncome / 12;

      // Health Score Calculation Logic
      let score = (netIncome/totalRevenue) * 100;      

      score = Math.min(100, Math.max(0, Math.round(score)));

      // Format for Charts
      const monthlyRevenueData: MonthlyMetric[] = parsedData.map(d => ({
        month: d.month,
        value: d.revenue
      }));

      // Forecast (Linear projection based on recent trend)
      const lastMonthRev = parsedData[11].revenue;
      // Simple trend: (Last Month - First Month) / 11
      const trend = (lastMonthRev - parsedData[0].revenue) / 11;
      const safeTrend = Math.max(trend, 0); // Optimistic forecast for demo

      const forecastData: MonthlyMetric[] = [];
      for (let i = 1; i <= 6; i++) {
         const projected = lastMonthRev + (safeTrend * i);
         forecastData.push({
             month: `Next +${i}`,
             value: Math.round(projected)
         });
      }

      const financialData: FinancialData = {
        companyName,
        industry,
        annualRevenue: totalRevenue,
        monthlyExpenses: avgExpenses,
        cashFlow: monthlyCashFlow,
        healthScore: score,
        recentTransactions: [
          { id: '1', date: 'Recent', description: 'Service Revenue', amount: parsedData[11].revenue * 0.4, type: 'income' },
          { id: '2', date: 'Recent', description: 'Operational Costs', amount: parsedData[11].expense * 0.3, type: 'expense' },
          { id: '3', date: 'Recent', description: 'Software Licenses', amount: 500, type: 'expense' },
          { id: '4', date: 'Recent', description: 'Consulting', amount: parsedData[11].revenue * 0.2, type: 'income' },
          { id: '5', date: 'Recent', description: 'Marketing', amount: parsedData[11].expense * 0.2, type: 'expense' },
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
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[800px] max-h-[90vh]">
        
        {/* Left Sidebar (Info) */}
        <div className="bg-[#191919] p-8 text-white flex-shrink-0 md:w-80 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-teal-900/30 to-transparent"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-900/50">
              <TrendingUp size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Bob's Business</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Let's build your financial profile. Enter your data month-by-month for the most accurate AI analysis.
            </p>
          </div>

          <div className="space-y-6 relative z-10 mt-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Building2 size={14} /> Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Bob's Business"
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-white/5 focus:bg-white/10 focus:border-teal-500 outline-none text-white placeholder:text-gray-600 transition-all"
              />
            </div>

            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <PieChart size={14} /> Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-white/5 focus:bg-white/10 focus:border-teal-500 outline-none text-white transition-all [&>option]:bg-[#191919]"
              >
                {INDUSTRIES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative z-10 mt-auto pt-8">
             <button 
               onClick={handleQuickFill}
               className="flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 transition-colors"
             >
               <Zap size={14} />
               <span>Auto-fill with demo data</span>
             </button>
          </div>
        </div>

        {/* Right Side (Data Entry) */}
        <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-lg">Financial Data (Last 12 Months)</h2>
            <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Values in USD
            </div>
          </div>

          {/* Scrollable Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 mb-2 px-2">
              <div className="text-xs font-bold text-slate-400 uppercase">Month</div>
              <div className="text-xs font-bold text-slate-400 uppercase">Revenue</div>
              <div className="text-xs font-bold text-slate-400 uppercase">Expenses</div>
            </div>
            
            <div className="space-y-3">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-teal-200 transition-colors">
                  <div className="font-medium text-slate-700 pl-2">{data.month}</div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={data.revenue}
                      onChange={(e) => handleMonthChange(index, 'revenue', e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={data.expense}
                      onChange={(e) => handleMonthChange(index, 'expense', e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              onClick={calculateFinancials} 
              isLoading={loading} 
              className="w-full sm:w-auto px-8 py-3 text-lg shadow-xl shadow-teal-600/20"
              disabled={!companyName}
            >
              Analyze Business
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};