import React, { useState } from 'react';
import { IntlService, SUPPORTED_LOCALES } from '../services/intlService';
import { prefs } from '../services/sharedPreferencesService';
import {
  Globe,
  Calendar,
  DollarSign,
  Languages,
  Copy,
  Check,
  Code2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const IntlLab: React.FC = () => {
  const [selectedLocale, setSelectedLocale] = useState('en_US');
  const [testAmount, setTestAmount] = useState<number>(14299.75);
  const [testRatio, setTestRatio] = useState<number>(0.846);
  const [testCount, setTestCount] = useState<number>(3);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const activeLocaleInfo = IntlService.getLocaleInfo(selectedLocale);
  const now = new Date();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleApplyToApp = (locCode: string) => {
    prefs.setString('locale', locCode);
    const info = IntlService.getLocaleInfo(locCode);
    prefs.setString('currency_code', info.currencyCode);
    setSelectedLocale(locCode);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-500" />
            Flutter Intl Formatting & Localization Lab
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore formatting nuances, plurals, and date conventions powered by <code className="text-sky-500 font-mono">intl: ^0.19.0</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Active Test Locale:</span>
          <select
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500"
          >
            {SUPPORTED_LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name} ({l.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Formatter Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Controls */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-sky-500" />
            Sandbox Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Amount to Format
              </label>
              <input
                type="number"
                step="0.01"
                value={testAmount}
                onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Ratio (for PercentFormat)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={testRatio}
                onChange={(e) => setTestRatio(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Quantity (for Pluralization)
              </label>
              <input
                type="number"
                min="0"
                value={testCount}
                onChange={(e) => setTestCount(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:border-sky-500"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleApplyToApp(selectedLocale)}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-colors shadow-sm"
              >
                Apply {activeLocaleInfo.flag} {selectedLocale} to Simulator
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Live Dart Formatting Result Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Currency */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-2">
                <span>NumberFormat.currency()</span>
                <button
                  onClick={() =>
                    handleCopy(
                      `NumberFormat.currency(locale: '${selectedLocale}', name: '${activeLocaleInfo.currencyCode}').format(${testAmount})`,
                      'curr'
                    )
                  }
                  className="hover:text-sky-500"
                >
                  {copiedSnippet === 'curr' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {IntlService.formatCurrency(testAmount, selectedLocale, activeLocaleInfo.currencyCode)}
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-mono bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              locale: '{selectedLocale}' · code: {activeLocaleInfo.currencyCode}
            </div>
          </div>

          {/* Card 2: Compact */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-2">
                <span>NumberFormat.compact()</span>
                <button
                  onClick={() =>
                    handleCopy(
                      `NumberFormat.compact(locale: '${selectedLocale}').format(${testAmount})`,
                      'compact'
                    )
                  }
                  className="hover:text-sky-500"
                >
                  {copiedSnippet === 'compact' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {IntlService.formatCompact(testAmount, selectedLocale)}
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-mono bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              compact representation for KPI boards
            </div>
          </div>

          {/* Card 3: DateFormat.yMMMMd */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-2">
                <span>DateFormat.yMMMMd()</span>
                <button
                  onClick={() =>
                    handleCopy(
                      `DateFormat.yMMMMd('${selectedLocale}').format(DateTime.now())`,
                      'date'
                    )
                  }
                  className="hover:text-sky-500"
                >
                  {copiedSnippet === 'date' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {IntlService.formatMediumDate(now, selectedLocale)}
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-mono bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              Time: {IntlService.formatTime(now, selectedLocale)}
            </div>
          </div>

          {/* Card 4: Pluralization */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono mb-2">
                <span>Intl.plural(howMany)</span>
                <button
                  onClick={() =>
                    handleCopy(
                      `Intl.plural(${testCount}, zero: 'No items', one: '1 item', other: '\$howMany items', locale: '${selectedLocale}')`,
                      'plural'
                    )
                  }
                  className="hover:text-sky-500"
                >
                  {copiedSnippet === 'plural' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {testCount === 0 ? 'No items' : testCount === 1 ? '1 item recorded' : `${testCount} items recorded`}
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-mono bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
              ratio: {IntlService.formatPercent(testRatio, selectedLocale)}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Locale Side-by-Side Comparison Matrix */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Languages className="w-4 h-4 text-sky-500" />
            Cross-Locale Formatting Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Compare how the same currency, date, and decimal values render across international standards.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Locale</th>
                  <th className="py-3 px-4">Currency Format ({testAmount})</th>
                  <th className="py-3 px-4">Date Format (Today)</th>
                  <th className="py-3 px-4">Clock Time</th>
                  <th className="py-3 px-4">Compact (145,000)</th>
                  <th className="py-3 px-4 text-right">Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {SUPPORTED_LOCALES.map((loc) => {
                  const isCurrent = loc.code === selectedLocale;

                  return (
                    <tr
                      key={loc.code}
                      onClick={() => setSelectedLocale(loc.code)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-sky-50/50 dark:bg-sky-950/30 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{loc.flag}</span>
                          <span>{loc.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({loc.code})</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 tabular-nums">
                        {IntlService.formatCurrency(testAmount, loc.code, loc.currencyCode)}
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-sans">
                        {IntlService.formatMediumDate(now, loc.code)}
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {IntlService.formatTime(now, loc.code)}
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 tabular-nums">
                        {IntlService.formatCompact(145000, loc.code)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-sans uppercase ${
                            loc.isRtl
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {loc.isRtl ? 'RTL' : 'LTR'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
