import React, { useState } from 'react';
import {
  FLUTTER_PUBSPEC_YAML,
  FLUTTER_PREFERENCES_SERVICE_DART,
  FLUTTER_INTL_FORMATTERS_DART,
  FLUTTER_MAIN_DART,
  FLUTTER_DASHBOARD_SCREEN_DART,
} from '../services/flutterCodeTemplates';
import { FileCode, Copy, Check, Download, Terminal, Info, ExternalLink } from 'lucide-react';

type CodeTab = 'pubspec' | 'prefs' | 'intl' | 'main' | 'screen';

export const DartCodeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CodeTab>('pubspec');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const getFileDetails = (tab: CodeTab) => {
    switch (tab) {
      case 'pubspec':
        return {
          filename: 'pubspec.yaml',
          language: 'yaml',
          content: FLUTTER_PUBSPEC_YAML,
          desc: 'Declarative dependencies specifying shared_preferences and intl packages.',
        };
      case 'prefs':
        return {
          filename: 'lib/services/preferences_service.dart',
          language: 'dart',
          content: FLUTTER_PREFERENCES_SERVICE_DART,
          desc: 'Singleton service with ValueNotifier bindings, typed getters/setters, and JSON serialization.',
        };
      case 'intl':
        return {
          filename: 'lib/utils/intl_formatters.dart',
          language: 'dart',
          content: FLUTTER_INTL_FORMATTERS_DART,
          desc: 'Intl formatting utilities for currencies, relative timestamps, and compact figures.',
        };
      case 'main':
        return {
          filename: 'lib/main.dart',
          language: 'dart',
          content: FLUTTER_MAIN_DART,
          desc: 'Application root with WidgetsFlutterBinding initialization and localization delegates.',
        };
      case 'screen':
        return {
          filename: 'lib/screens/dashboard_screen.dart',
          language: 'dart',
          content: FLUTTER_DASHBOARD_SCREEN_DART,
          desc: 'Full Material 3 UI component interacting with SharedPreferences and Intl.',
        };
    }
  };

  const currentFile = getFileDetails(activeTab);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedTab(id);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.filename.split('/').pop() || 'file.dart';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-sky-500" />
            Flutter & Dart Production Code Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete, copy-pasteable Flutter 3.x source files implementing <code className="text-sky-500 font-mono">shared_preferences: ^2.2.2</code> and <code className="text-sky-500 font-mono">intl: ^0.19.0</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(currentFile.content, 'active-code')}
            className="min-h-[40px] px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            {copiedTab === 'active-code' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy {currentFile.filename.split('/').pop()}
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      {/* Terminal Quick Start Snippet */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-sky-400" /> CLI Setup Commands
          </span>
          <button
            onClick={() =>
              handleCopy(
                'flutter create my_app && cd my_app\nflutter pub add shared_preferences:^2.2.2 intl:^0.19.0',
                'cli'
              )
            }
            className="hover:text-white"
          >
            {copiedTab === 'cli' ? 'Copied!' : 'Copy Shell'}
          </button>
        </div>
        <div className="font-mono text-sky-300 bg-black/40 p-2.5 rounded-lg select-all">
          flutter pub add shared_preferences:^2.2.2 intl:^0.19.0
        </div>
      </div>

      {/* Code File Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs font-medium">
        {(
          [
            { id: 'pubspec', label: 'pubspec.yaml' },
            { id: 'prefs', label: 'preferences_service.dart' },
            { id: 'intl', label: 'intl_formatters.dart' },
            { id: 'main', label: 'main.dart' },
            { id: 'screen', label: 'dashboard_screen.dart' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white dark:bg-slate-800 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description of active code file */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl">
        <Info className="w-4 h-4 text-sky-500 shrink-0" />
        <span>{currentFile.desc}</span>
      </div>

      {/* Code Viewer */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <span>{currentFile.filename}</span>
          <button
            onClick={() => handleCopy(currentFile.content, 'code-box')}
            className="flex items-center gap-1 hover:text-white text-[11px]"
          >
            {copiedTab === 'code-box' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy</span>
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[580px] scrollbar-thin">
          <code>{currentFile.content}</code>
        </pre>
      </div>

      {/* Best Practices Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white">
            1. WidgetsFlutterBinding Rule
          </h4>
          <p className="text-slate-500 leading-relaxed">
            In Flutter, calling asynchronous platform channels like <code className="text-sky-500">SharedPreferences.getInstance()</code> before <code className="text-sky-500">runApp()</code> will throw an assertion error unless you execute <code className="text-sky-500">WidgetsFlutterBinding.ensureInitialized()</code> first.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white">
            2. Localization Delegates Setup
          </h4>
          <p className="text-slate-500 leading-relaxed">
            When pairing <code className="text-sky-500">intl</code> with <code className="text-sky-500">MaterialApp</code>, you must add <code className="text-sky-500">flutter_localizations</code> to your pubspec to provide default translation delegates for dialog buttons, date pickers, and accessibility tags.
          </p>
        </div>
      </div>
    </div>
  );
};
