import React from 'react';
import { FileText, Users, History, Settings as SettingsIcon, Printer, PlusCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, customerCount, receiptCount, onNewReceipt }) {
  const tabs = [
    { id: 'generate', label: 'Generate Receipt', icon: FileText },
    { id: 'customers', label: 'Customers', icon: Users, count: customerCount },
    { id: 'history', label: 'Receipt History', icon: History, count: receiptCount },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="no-print bg-white border-b border-stone-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-stone-900 rounded-md flex items-center justify-center text-white font-bold text-lg font-typewriter shadow-sm">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-stone-900 tracking-tight leading-none m-0">
                  Rent Receipt Generator
                </h1>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                  SPA
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Buxipur, Sher Kothi Gorakhpur
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNewReceipt}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors"
              title="Reset and start new receipt"
            >
              <PlusCircle className="w-4 h-4 text-stone-700" />
              <span className="hidden md:inline">New Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

