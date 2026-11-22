import React from 'react';
import { FileText, Users, History, Settings as SettingsIcon, Plus } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, customerCount, receiptCount, onNewReceipt }) {
  const tabs = [
    { id: 'generate', label: 'Generate', desktopLabel: 'Generate Receipt', icon: FileText },
    { id: 'customers', label: 'Tenants', desktopLabel: 'Customers', icon: Users, count: customerCount },
    { id: 'history', label: 'History', desktopLabel: 'Receipt History', icon: History, count: receiptCount },
    { id: 'settings', label: 'Settings', desktopLabel: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Top App Header (Both Mobile & Desktop) */}
      <header className="no-print bg-white border-b border-stone-200 sticky top-0 z-30 pt-safe">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo / Brand */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-stone-900 rounded-md flex items-center justify-center text-white font-bold text-base md:text-lg font-typewriter shadow-xs shrink-0">
                R
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm md:text-base font-semibold text-stone-900 tracking-tight leading-none truncate m-0">
                    Rent Receipt
                  </h1>
                  <span className="hidden xs:inline-block text-[9px] uppercase font-mono tracking-wider bg-stone-100 text-stone-600 px-1 py-0.5 rounded border border-stone-200">
                    SPA
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-mono mt-0.5 truncate hidden sm:block">
                  Buxipur, Sher Kothi Gorakhpur
                </p>
              </div>
            </div>

            {/* Desktop Nav Tabs (Hidden on mobile <md) */}
            <nav className="hidden md:flex items-center space-x-1.5" aria-label="Main Navigation">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                      isActive
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.desktopLabel}</span>
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

            {/* Quick Action: New Receipt Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onNewReceipt}
                className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 border border-stone-300 rounded-md transition-colors cursor-pointer min-h-[44px] min-w-[44px] justify-center"
                title="Reset form and create new receipt"
                aria-label="New Receipt"
              >
                <Plus className="w-4 h-4 text-stone-700 shrink-0" />
                <span className="font-semibold">New</span>
                <span className="hidden sm:inline font-normal">Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (<md only) */}
      <nav
        className="md:hidden no-print mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 pb-[max(env(safe-area-inset-bottom),8px)]"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-4 items-center h-14 max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center h-full py-1 min-h-[48px] rounded-lg transition-colors cursor-pointer touch-manipulation ${
                  isActive
                    ? 'text-stone-950 font-bold'
                    : 'text-stone-500 hover:text-stone-800 active:text-stone-950'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${tab.desktopLabel}${tab.count !== undefined ? ` (${tab.count})` : ''}`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'stroke-[2.5px] scale-105' : 'stroke-[1.75px]'
                    }`}
                  />
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`absolute -top-1.5 -right-3 text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-mono font-bold leading-none ${
                        isActive
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-4 h-0.5 bg-stone-900 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
