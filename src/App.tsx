import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { AppView, FinancialData } from './types';
import { initializeGemini } from './services/gemini';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ONBOARDING);
  const [data, setData] = useState<FinancialData | null>(null);

  const handleOnboardingComplete = (financialData: FinancialData) => {
    setData(financialData);
    // Initialize Gemini with the context of the user's data
    initializeGemini(financialData);
    setCurrentView(AppView.DASHBOARD);
  };

  // Simple animation fade wrapper could go here, but keeping it simple for now
  return (
    <div className="antialiased font-sans text-slate-900 bg-slate-50">
      {currentView === AppView.ONBOARDING && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {currentView === AppView.DASHBOARD && data && (
        <Dashboard data={data} />
      )}
    </div>
  );
};

export default App;