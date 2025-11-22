import React from 'react';
import { FinancialData } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, Wallet, Receipt, TrendingUp, Settings, 
  LogOut, Bell, Search, Menu, DollarSign, Activity, AlertCircle
} from 'lucide-react';
import { ChatWidget } from './ChatWidget';

interface DashboardProps {
  data: FinancialData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Disabled handlers
  const handleAction = (action: string) => {
    console.log(`Action disabled: ${action}`);
  };

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
          <NavItem icon={Wallet} label="Revenue" onClick={() => handleAction('Revenue')} />
          <NavItem icon={Receipt} label="Expenses" onClick={() => handleAction('Expenses')} />
          <NavItem icon={Activity} label="Forecast" onClick={() => handleAction('Forecast')} />
          <NavItem icon={Settings} label="Settings" onClick={() => handleAction('Settings')} />
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
             <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2">
               <Search size={18} className="text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="bg-transparent border-none outline-none text-sm ml-2 w-48"
                 onChange={() => handleAction('Search')}
               />
             </div>
             <button onClick={() => handleAction('Notifications')} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <div className="w-10 h-10 bg-[#299D91] rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-teal-900/20">
               {data.companyName.substring(0, 2).toUpperCase()}
             </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8 space-y-8">
          
          {/* WELCOME */}
          <div>
            <h3 className="text-xl font-medium text-slate-600">Welcome back, <span className="text-slate-900 font-bold">{data.companyName}</span></h3>
            <p className="text-slate-500 text-sm mt-1">Here's what's happening with your business today.</p>
          </div>

          {/* KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Annual Revenue" 
              value={`$${data.annualRevenue.toLocaleString()}`} 
              icon={DollarSign} 
              color="text-[#299D91]" 
              bg="bg-teal-50"
            />
            <StatCard 
              label="Monthly Expenses" 
              value={`$${data.monthlyExpenses.toLocaleString()}`} 
              icon={Receipt} 
              color="text-red-600" 
              bg="bg-red-50"
            />
            <StatCard 
              label="Cash Flow" 
              value={`$${data.cashFlow.toLocaleString()}`} 
              subValue="Monthly Net"
              icon={Wallet} 
              color={data.cashFlow >= 0 ? "text-[#299D91]" : "text-orange-600"} 
              bg={data.cashFlow >= 0 ? "bg-teal-50" : "bg-orange-50"}
            />
            <HealthScoreGauge score={data.healthScore} />
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

          {/* TRANSACTIONS */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Recent Transactions</h3>
              <button onClick={() => handleAction('View All Transactions')} className="text-sm text-[#299D91] font-medium hover:text-[#228479]">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.recentTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">{t.date}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{t.description}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          t.type === 'income' ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${
                        t.type === 'income' ? 'text-[#299D91]' : 'text-slate-900'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
      
      <ChatWidget />
    </div>
  );
};

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

const StatCard = ({ label, value, subValue, icon: Icon, color, bg }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
    </div>
    <div className={`p-3 rounded-lg ${bg} ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

const HealthScoreGauge = ({ score }: { score: number }) => {
  const radius = 70;
  const stroke = 12;
  const normalizedScore = Math.min(100, Math.max(0, score));
  // Arc calculations: semi-circle from 180 (left) to 0 (right)
  const arcLength = Math.PI * radius;
  const arcOffset = arcLength * ((100 - normalizedScore) / 100);
  
  let color = "#22c55e"; // green-500
  let label = "Excellent";
  let labelColor = "text-green-500";
  let bgLabel = "bg-green-100";
  
  if (score < 60) {
    color = "#ef4444"; // red-500
    label = "Poor";
    labelColor = "text-red-600";
    bgLabel = "bg-red-100";
  } else if (score < 80) {
    color = "#f59e0b"; // amber-500
    label = "Fair";
    labelColor = "text-amber-600";
    bgLabel = "bg-amber-100";
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
       <div className="w-full flex justify-between items-start mb-4">
         <div>
           <p className="text-slate-500 text-sm font-medium mb-1">Health Score</p>
           <div className="flex items-baseline gap-1">
             <h4 className="text-3xl font-bold text-slate-900">{score}</h4>
             <span className="text-sm text-slate-400">/100</span>
           </div>
         </div>
         <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bgLabel} ${labelColor}`}>
           {label}
         </span>
       </div>
      
      <div className="relative flex items-center justify-center pb-2">
         <svg width="160" height="85" viewBox="0 0 160 85" className="overflow-visible">
            {/* Background Track */}
            <path 
               d="M 10,80 A 70,70 0 0 1 150,80"
               fill="none"
               stroke="#f1f5f9"
               strokeWidth={stroke}
               strokeLinecap="round"
            />
            {/* Progress Track */}
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
            {/* Needle */}
            <circle cx="80" cy="80" r="4" fill="#94a3b8" />
            <g transform={`translate(80, 80) rotate(${(normalizedScore / 100) * 180 - 90})`} className="transition-transform duration-1000 ease-out">
               <path d="M -4,0 L 0,-65 L 4,0 Z" fill="#475569" />
            </g>
         </svg>
      </div>
    </div>
  );
};
