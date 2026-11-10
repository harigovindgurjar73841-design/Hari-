import React from 'react';
import { ViewTab } from '../types';
import { Moon, Sun, Smartphone, Monitor } from 'lucide-react';

interface TopBarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  frameMode: 'mobile' | 'fluid';
  onToggleFrameMode: () => void;
  onExportConfig: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  frameMode,
  onToggleFrameMode,
  onExportConfig,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('simulator')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M14.314 0L2.3 12 6 15.7 21.686 0h-7.372zM14.314 10.743L8.143 16.914 11.843 20.614 21.686 10.743h-7.372z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
              FlutterSphere
            </span>
          </button>
        </div>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onTabChange('simulator')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'simulator'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mobile Simulator
          </button>
          <button
            onClick={() => onTabChange('inspector')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'inspector'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Preferences DB
          </button>
          <button
            onClick={() => onTabChange('intl-lab')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'intl-lab'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Intl Lab
          </button>
          <button
            onClick={() => onTabChange('dart-code')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'dart-code'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dart Code Hub
          </button>
          <button
            onClick={() => onTabChange('apk-build')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'apk-build'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            APK Release Hub
          </button>
        </nav>

        {/* Zone 3: 1 primary action + compact controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {activeTab === 'simulator' && (
            <button
              onClick={onToggleFrameMode}
              title={frameMode === 'mobile' ? 'Switch to fluid canvas' : 'Switch to mobile device frame'}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {frameMode === 'mobile' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onToggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onExportConfig}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Mobile-only subnav tabs */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 overflow-x-auto px-4 py-2 gap-2 text-xs">
        <button
          onClick={() => onTabChange('simulator')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'simulator' ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Simulator
        </button>
        <button
          onClick={() => onTabChange('inspector')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'inspector' ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Preferences
        </button>
        <button
          onClick={() => onTabChange('intl-lab')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'intl-lab' ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Intl Lab
        </button>
        <button
          onClick={() => onTabChange('dart-code')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'dart-code' ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Dart Code
        </button>
        <button
          onClick={() => onTabChange('apk-build')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'apk-build' ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          APK Release
        </button>
      </div>
    </header>
  );
};
