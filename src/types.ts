export interface FinancialData {
  companyName: string;
  industry: string;
  annualRevenue: number;
  monthlyExpenses: number;
  cashFlow: number;
  healthScore: number; // 0-100
  recentTransactions: Transaction[];
  monthlyRevenueData: MonthlyMetric[];
  forecastData: MonthlyMetric[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface MonthlyMetric {
  month: string;
  value: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
}