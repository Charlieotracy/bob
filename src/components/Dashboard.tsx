import React, { useState, useMemo, useEffect } from 'react';
import { FinancialData } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, Wallet, Receipt, TrendingUp, 
  LogOut, Menu, DollarSign, AlertCircle,
  Sliders, RefreshCcw, ArrowRight
} from 'lucide-react';
import { ChatWidget } from './ChatWidget';
import { initializeGemini } from '../services/gemini';

interface DashboardProps {
  data: FinancialData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // State for simulation
  const [revenueAdj, setRevenueAdj] = useState(0);
  const [expenseAdj, setExpenseAdj] = useState(0);

  const handleAction = (action: string) => {
    console.log(`Action disabled: ${action}`);
  };

  const resetSimulation = () => {
    setRevenueAdj(0);
    setExpenseAdj(0);
  };

  const isSimulating = revenueAdj !== 0 || expenseAdj !== 0;

  // Ensure Gemini is initialized when the Dashboard mounts with data
  useEffect(() => {
    try {
      initializeGemini(data);
    } catch (err) {
      console.error('Failed to initialize Gemini from Dashboard:', err);
    }
  }, [data]);

  // Calculate simulated metrics
  const sim = useMemo(() => {
    const annRev = data.annualRevenue * (1 + revenueAdj / 100);
    const monExp = data.monthlyExpenses * (1 + expenseAdj / 100);
    const annExp = monExp * 12;
    const net = annRev - annExp;
    const cash = net / 12;
    let score = annRev > 0 ? (net / annRev) * 100 : 0;
    score = Math.min(100, Math.max(0, Math.round(score)));
    
    return {
        annualRevenue: annRev,
        monthlyExpenses: monExp,
        netIncome: net,
        cashFlow: cash,
        healthScore: score
    };
  }, [data, revenueAdj, expenseAdj]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#191919] text-white fixed h-full z-20">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-[#299D91] flex items-center gap-2">
            <TrendingUp /> Bob's Business
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          <NavItem active icon={LayoutDashboard} label="Dashboard" onClick={() => handleAction('Dashboard')} />
        </nav>

        <div className="p-4 border-t border-gray-800 mt-auto">
           <button 
             onClick={() => handleAction('Logout')}
             className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors w-full"
           >
             <LogOut size={20} />
             <span className="font-medium">Logout</span>
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 min-h-screen transition-all duration-300">
        
        {/* TOP NAVIGATION */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
             <div className="md:hidden">
               <Menu size={24} />
             </div>
             <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-[#299D91] rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-teal-900/20">
               {data.companyName.substring(0, 2).toUpperCase()}
             </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8 space-y-8">
          
          {/* WELCOME */}
          <div className="flex justify-between items-end">
            <div>
                <h3 className="text-xl font-medium text-slate-600">Welcome back, <span className="text-slate-900 font-bold">{data.companyName}</span></h3>
                <p className="text-slate-500 text-sm mt-1">Here's what's happening with your business today.</p>
            </div>
            {isSimulating && (
                <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-bold border border-teal-100 animate-pulse">
                    <Sliders size={16} />
                    Simulation Active
                </div>
            )}
          </div>

          {/* KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Annual Revenue" 
              value={`$${Math.round(sim.annualRevenue).toLocaleString()}`} 
              icon={DollarSign} 
              color={isSimulating ? "text-teal-600" : "text-[#299D91]"}
              bg={isSimulating ? "bg-teal-100" : "bg-teal-50"}
              isSimulated={isSimulating && revenueAdj !== 0}
            />
            <StatCard 
              label="Monthly Expenses" 
              value={`$${Math.round(sim.monthlyExpenses).toLocaleString()}`} 
              icon={Receipt} 
              color={isSimulating ? "text-purple-600" : "text-red-600"}
              bg={isSimulating ? "bg-purple-100" : "bg-red-50"}
              isSimulated={isSimulating && expenseAdj !== 0}
            />
            <StatCard 
              label="Cash Flow" 
              value={`$${Math.round(sim.cashFlow).toLocaleString()}`} 
              subValue="Monthly Net"
              icon={Wallet} 
              color={sim.cashFlow >= 0 ? "text-[#299D91]" : "text-orange-600"} 
              bg={sim.cashFlow >= 0 ? "bg-teal-50" : "bg-orange-50"}
              isSimulated={isSimulating}
            />
            <HealthScoreGauge score={sim.healthScore} isSimulated={isSimulating} />
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* REVENUE TREND */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Revenue History</h3>
                <select className="text-sm border-slate-200 rounded-md text-slate-500" onChange={() => handleAction('Filter Change')}>
                  <option>Last 12 Months</option>
                </select>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.monthlyRevenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#299D91" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#299D91" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="#64748B" />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#64748B" tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#299D91" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* FORECAST */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle size={16} className="text-[#299D91]" /> 
                  AI Forecast
                </h3>
                <button onClick={() => handleAction('View Forecast Report')} className="text-sm text-[#299D91] font-medium">View Report</button>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.forecastData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="#64748B" />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#64748B" tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip cursor={{fill: '#F1F5F9'}} />
                    <Bar dataKey="value" fill="#299D91" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* SIMULATION WIDGET (Replacing Transactions) */}
          <div className="bg-white rounded-xl shadow-lg border border-teal-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-purple-500"></div>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Sliders className="text-teal-600" /> 
                            "What-If" Scenario Planner
                        </h3>
                        <p className="text-slate-500 mt-1">Adjust the levers below to simulate future outcomes for <span className="font-semibold">{data.companyName}</span>.</p>
                    </div>
                    {isSimulating && (
                        <button 
                            onClick={resetSimulation}
                            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 px-4 py-2 bg-slate-100 rounded-lg transition-colors"
                        >
                            <RefreshCcw size={14} /> Reset Default
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Sliders */}
                    <div className="space-y-8">
                        {/* Revenue Slider */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <label className="font-bold text-slate-700">Revenue Growth</label>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${revenueAdj > 0 ? 'bg-teal-100 text-teal-700' : revenueAdj < 0 ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {revenueAdj > 0 ? '+' : ''}{revenueAdj}%
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="-50" 
                                max="50" 
                                step="5"
                                value={revenueAdj}
                                onChange={(e) => setRevenueAdj(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                                <span>-50%</span>
                                <span>Current</span>
                                <span>+50%</span>
                            </div>
                        </div>

                        {/* Expenses Slider */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <label className="font-bold text-slate-700">Operational Costs</label>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${expenseAdj > 0 ? 'bg-orange-100 text-orange-700' : expenseAdj < 0 ? 'bg-teal-100 text-teal-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {expenseAdj > 0 ? '+' : ''}{expenseAdj}%
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="-50" 
                                max="50" 
                                step="5"
                                value={expenseAdj}
                                onChange={(e) => setExpenseAdj(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                                <span>-50%</span>
                                <span>Current</span>
                                <span>+50%</span>
                            </div>
                        </div>
                    </div>

                    {/* Impact Summary */}
                    <div className="flex flex-col justify-center space-y-6">
                         <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Projected Impact</h4>
                         
                         <div className="space-y-4">
                            <ImpactRow 
                                label="Health Score" 
                                current={data.healthScore} 
                                projected={sim.healthScore} 
                                inverse={false}
                                suffix="/100"
                            />
                             <ImpactRow 
                                label="Monthly Cash Flow" 
                                current={data.cashFlow} 
                                projected={sim.cashFlow} 
                                inverse={false}
                                isCurrency
                            />
                             <ImpactRow 
                                label="Annual Profit" 
                                current={data.annualRevenue - (data.monthlyExpenses * 12)} 
                                projected={sim.annualRevenue - (sim.monthlyExpenses * 12)} 
                                inverse={false}
                                isCurrency
                            />
                         </div>

                         <div className="mt-6 bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                            <AlertCircle className="text-blue-500 mt-1 shrink-0" size={18} />
                            <p className="text-sm text-blue-800 leading-relaxed">
                                {revenueAdj === 0 && expenseAdj === 0 
                                    ? "Adjust the sliders to see how changes in revenue and expenses impact your business health."
                                    : "This simulation is based on simplified linear projections. Consult 'Bob' for detailed strategies on how to achieve these numbers."
                                }
                            </p>
                         </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </main>
      
      <ChatWidget 
        financialContext={sim} 
        isSimulating={isSimulating} 
      />
    </div>
  );
};

// Helper component for Impact Row
const ImpactRow = ({ label, current, projected, inverse, suffix = '', isCurrency = false }: any) => {
    const diff = projected - current;
    const isPositive = diff > 0;
    const isNeutral = diff === 0;
    
    const colorClass = isNeutral 
        ? 'text-slate-400' 
        : (isPositive && !inverse) || (!isPositive && inverse) 
            ? 'text-teal-600' 
            : 'text-red-600';

    const format = (val: number) => isCurrency ? `$${Math.round(val).toLocaleString()}` : Math.round(val);

    return (
        <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
            <span className="text-slate-600 font-medium">{label}</span>
            <div className="flex items-center gap-4">
                <span className="text-slate-400 text-sm line-through decoration-slate-300">{format(current)}{suffix}</span>
                <ArrowRight size={14} className="text-slate-300" />
                <span className={`font-bold text-lg ${colorClass}`}>
                    {format(projected)}{suffix}
                </span>
            </div>
        </div>
    )
}

const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all ${
      active 
        ? 'bg-[#299D91] text-white shadow-lg shadow-teal-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

// Updated StatCard to handle isSimulated prop
const StatCard = ({ label, value, subValue, icon: Icon, color, bg, isSimulated }: any) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border transition-all duration-300 flex items-start justify-between hover:shadow-md ${isSimulated ? 'border-teal-200 ring-1 ring-teal-50 transform scale-[1.02]' : 'border-slate-200'}`}>
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <h4 className={`text-2xl font-bold ${isSimulated ? color : 'text-slate-900'} transition-colors`}>{value}</h4>
      {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
    </div>
    <div className={`p-3 rounded-lg ${bg} ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

const HealthScoreGauge = ({ score, isSimulated }: { score: number, isSimulated?: boolean }) => {
  const radius = 70;
  const stroke = 12;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const arcLength = Math.PI * radius;
  const arcOffset = arcLength * ((100 - normalizedScore) / 100);
  
  let color = "#22c55e"; 
  let label = "Excellent";
  let labelColor = "text-green-500";
  let bgLabel = "bg-green-100";
  
  if (score < 60) {
    color = "#ef4444"; 
    label = "Poor";
    labelColor = "text-red-600";
    bgLabel = "bg-red-100";
  } else if (score < 80) {
    color = "#f59e0b"; 
    label = "Fair";
    labelColor = "text-amber-600";
    bgLabel = "bg-amber-100";
  }

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border transition-all duration-300 flex flex-col justify-between hover:shadow-md ${isSimulated ? 'border-teal-200 ring-1 ring-teal-50 transform scale-[1.02]' : 'border-slate-200'}`}>
       <div className="w-full flex justify-between items-start mb-4">
         <div>
           <p className="text-slate-500 text-sm font-medium mb-1">Health Score</p>
           <div className="flex items-baseline gap-1">
             <h4 className={`text-3xl font-bold ${isSimulated ? labelColor : 'text-slate-900'} transition-colors`}>{score}</h4>
             <span className="text-sm text-slate-400">/100</span>
           </div>
         </div>
         <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bgLabel} ${labelColor}`}>
           {label}
         </span>
       </div>
      
      <div className="relative flex items-center justify-center pb-2">
         <svg width="160" height="85" viewBox="0 0 160 85" className="overflow-visible">
            <path 
               d="M 10,80 A 70,70 0 0 1 150,80"
               fill="none"
               stroke="#f1f5f9"
               strokeWidth={stroke}
               strokeLinecap="round"
            />
            <path 
               d="M 10,80 A 70,70 0 0 1 150,80"
               fill="none"
               stroke={color}
               strokeWidth={stroke}
               strokeLinecap="round"
               strokeDasharray={`${arcLength} ${arcLength}`}
               strokeDashoffset={arcOffset}
               className="transition-all duration-1000 ease-out"
            />
            <circle cx="80" cy="80" r="4" fill="#94a3b8" />
            <g transform={`translate(80, 80) rotate(${(normalizedScore / 100) * 180 - 90})`} className="transition-transform duration-1000 ease-out">
               <path d="M -4,0 L 0,-65 L 4,0 Z" fill="#475569" />
            </g>
         </svg>
      </div>
    </div>
  );
};