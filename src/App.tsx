/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { FlutterMobileApp } from './components/FlutterMobileApp';
import { PreferencesInspector } from './components/PreferencesInspector';
import { IntlLab } from './components/IntlLab';
import { DartCodeHub } from './components/DartCodeHub';
import { ApkBuildCenter } from './components/ApkBuildCenter';
import { ViewTab } from './types';
import { prefs } from './services/sharedPreferencesService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('apk-build');
  const [frameMode, setFrameMode] = useState<'mobile' | 'fluid'>('mobile');
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = prefs.getString('theme_mode');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Keep dark class on <html> in sync with isDark state
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      prefs.setString('theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      prefs.setString('theme_mode', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const toggleFrameMode = () => {
    setFrameMode((prev) => (prev === 'mobile' ? 'fluid' : 'mobile'));
  };

  const handleExportConfig = () => {
    const json = prefs.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flutter_preferences_config_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar adhering to Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        frameMode={frameMode}
        onToggleFrameMode={toggleFrameMode}
        onExportConfig={handleExportConfig}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'simulator' && (
          <FlutterMobileApp
            frameMode={frameMode}
            onNavigateToInspector={() => setActiveTab('inspector')}
            onNavigateToIntl={() => setActiveTab('intl-lab')}
          />
        )}

        {activeTab === 'inspector' && <PreferencesInspector />}

        {activeTab === 'intl-lab' && <IntlLab />}

        {activeTab === 'dart-code' && <DartCodeHub />}

        {activeTab === 'apk-build' && <ApkBuildCenter />}
      </div>

      {/* Quiet, unpretentious footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-3 font-mono text-[11px]">
          <span>flutter: sdk</span>
          <span aria-hidden="true">·</span>
          <span>shared_preferences: ^2.2.2</span>
          <span aria-hidden="true">·</span>
          <span>intl: ^0.19.0</span>
          <span aria-hidden="true">·</span>
          <span className="text-sky-500">flutter build apk --split-per-abi</span>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          FlutterSphere Studio · Interactive SharedPreferences persistence, Intl localization & APK release workbench
        </p>
      </footer>
    </div>
  );
}
