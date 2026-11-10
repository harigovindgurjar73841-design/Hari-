import React, { useState, useEffect } from 'react';
import { prefs } from '../services/sharedPreferencesService';
import { IntlService, SUPPORTED_LOCALES } from '../services/intlService';
import { ActivityRecord, SupportedLocale } from '../types';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  CheckSquare,
  Globe,
  Settings,
  Search,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  X,
  CreditCard,
  Flame,
  Layers,
} from 'lucide-react';

interface FlutterMobileAppProps {
  frameMode: 'mobile' | 'fluid';
  onNavigateToInspector: () => void;
  onNavigateToIntl: () => void;
}

export const FlutterMobileApp: React.FC<FlutterMobileAppProps> = ({
  frameMode,
  onNavigateToInspector,
  onNavigateToIntl,
}) => {
  const [localeCode, setLocaleCode] = useState<string>(() => prefs.getString('locale') || 'en_US');
  const [currencyCode, setCurrencyCode] = useState<string>(() => prefs.getString('currency_code') || 'USD');
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'expense' | 'income' | 'savings' | 'task'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLocaleSheet, setShowLocaleSheet] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'ledger' | 'stats' | 'settings'>('home');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // New Record Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'expense' | 'income' | 'savings' | 'task'>('expense');
  const [newAmount, setNewAmount] = useState('18.50');
  const [newNote, setNewNote] = useState('');

  // Subscribe to SharedPreferences changes
  useEffect(() => {
    const loadState = () => {
      const loc = prefs.getString('locale') || 'en_US';
      const curr = prefs.getString('currency_code') || 'USD';
      setLocaleCode(loc);
      setCurrencyCode(curr);

      const raw = prefs.getString('ledger_records_json');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setRecords(Array.isArray(parsed) ? parsed : []);
        } catch {
          setRecords([]);
        }
      }
    };

    loadState();
    const unsubscribe = prefs.subscribe(loadState);
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  const currentLocale = IntlService.getLocaleInfo(localeCode);
  const messages = IntlService.getMessages(localeCode);

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedAmt = newCategory === 'task' ? undefined : parseFloat(newAmount) || 0;
    const newRecord: ActivityRecord = {
      id: 'rec-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      amount: parsedAmt,
      currency: currencyCode,
      timestamp: Date.now(),
      isCompleted: newCategory === 'task' ? false : true,
      note: newNote.trim() || undefined,
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    prefs.setString('ledger_records_json', JSON.stringify(updated));

    // Also update a streak or metric in SharedPreferences
    const currentStreak = prefs.getInt('daily_goal_streak') || 0;
    prefs.setInt('daily_goal_streak', currentStreak + 1);

    setShowAddModal(false);
    setNewTitle('');
    setNewNote('');
    showToast('Saved to SharedPreferences');
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    prefs.setString('ledger_records_json', JSON.stringify(updated));
    showToast('Entry removed from storage');
  };

  const handleToggleTask = (id: string) => {
    const updated = records.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
    setRecords(updated);
    prefs.setString('ledger_records_json', JSON.stringify(updated));
  };

  const handleSelectLocale = (locale: SupportedLocale) => {
    prefs.setString('locale', locale.code);
    prefs.setString('currency_code', locale.currencyCode);
    setLocaleCode(locale.code);
    setCurrencyCode(locale.currencyCode);
    setShowLocaleSheet(false);
    showToast(`Locale set to ${locale.name}`);
  };

  // Metrics
  const totalIncome = records
    .filter((r) => r.category === 'income')
    .reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalExpenses = records
    .filter((r) => r.category === 'expense')
    .reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalSavings = records
    .filter((r) => r.category === 'savings')
    .reduce((sum, r) => sum + (r.amount || 0), 0);
  const availableBalance = totalIncome - totalExpenses - totalSavings;
  const budgetCap = prefs.getDouble('monthly_budget_cap') || 3500.0;
  const streak = prefs.getInt('daily_goal_streak') || 14;

  // Filtered list
  const filteredRecords = records.filter((r) => {
    if (filter !== 'all' && r.category !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || (r.note && r.note.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div
      className={`mx-auto transition-all duration-300 ${
        frameMode === 'mobile'
          ? 'max-w-[420px] my-6 rounded-[44px] p-3 bg-slate-900 shadow-2xl ring-1 ring-slate-800'
          : 'w-full max-w-5xl my-4'
      }`}
      dir={currentLocale.isRtl ? 'rtl' : 'ltr'}
    >
      {/* Phone Hardware Mockup Outer Shell (only in mobile frame mode) */}
      <div
        className={`relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col ${
          frameMode === 'mobile'
            ? 'rounded-[36px] min-h-[820px] max-h-[860px]'
            : 'rounded-2xl min-h-[700px]'
        }`}
      >
        {/* Device Dynamic Island / Notch bar */}
        {frameMode === 'mobile' && (
          <div className="pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-800 dark:text-slate-200 select-none bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-30">
            <span>9:41</span>
            <div className="w-24 h-4 bg-black dark:bg-slate-950 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
                <div className="w-3 h-1.5 bg-current rounded-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Top App Bar (Flutter AppBar) */}
        <header className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              FL
            </div>
            <div className="truncate">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">
                {messages.appName}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {currentLocale.flag} {currentLocale.nativeName} · SharedPreferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowLocaleSheet(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Change Locale & Currency"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToInspector}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Inspect SharedPreferences Storage"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {activeBottomTab === 'home' && (
            <>
              {/* Flutter Material 3 KPI Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <svg className="w-28 h-28 fill-current" viewBox="0 0 24 24">
                    <path d="M14.314 0L2.3 12 6 15.7 21.686 0h-7.372zM14.314 10.743L8.143 16.914 11.843 20.614 21.686 10.743h-7.372z" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-xs text-sky-200/90 font-medium mb-1">
                  <span>{messages.totalBalance}</span>
                  <span className="flex items-center gap-1 font-mono text-[11px] bg-sky-900/40 px-2 py-0.5 rounded-md">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {streak}d streak
                  </span>
                </div>

                <div className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
                  {IntlService.formatCurrency(availableBalance, localeCode, currencyCode)}
                </div>

                {/* Submetrics Row */}
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-left">
                  <div>
                    <span className="text-[10px] text-sky-300/80 block uppercase tracking-wider font-semibold">
                      {messages.income}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 font-mono tabular-nums">
                      +{IntlService.formatCompact(totalIncome, localeCode)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-sky-300/80 block uppercase tracking-wider font-semibold">
                      {messages.expenses}
                    </span>
                    <span className="text-xs font-semibold text-rose-300 font-mono tabular-nums">
                      -{IntlService.formatCompact(totalExpenses, localeCode)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-sky-300/80 block uppercase tracking-wider font-semibold">
                      {messages.savings}
                    </span>
                    <span className="text-xs font-semibold text-sky-300 font-mono tabular-nums">
                      {IntlService.formatCompact(totalSavings, localeCode)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    setNewCategory('expense');
                    setShowAddModal(true);
                  }}
                  className="min-h-[44px] flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-slate-200 text-center"
                >
                  <TrendingDown className="w-4 h-4 text-rose-500 mb-1" />
                  <span className="text-[11px] font-medium leading-none">Expense</span>
                </button>
                <button
                  onClick={() => {
                    setNewCategory('income');
                    setShowAddModal(true);
                  }}
                  className="min-h-[44px] flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-slate-200 text-center"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-500 mb-1" />
                  <span className="text-[11px] font-medium leading-none">Income</span>
                </button>
                <button
                  onClick={() => {
                    setNewCategory('savings');
                    setShowAddModal(true);
                  }}
                  className="min-h-[44px] flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-slate-200 text-center"
                >
                  <PiggyBank className="w-4 h-4 text-sky-500 mb-1" />
                  <span className="text-[11px] font-medium leading-none">Save</span>
                </button>
                <button
                  onClick={() => {
                    setNewCategory('task');
                    setShowAddModal(true);
                  }}
                  className="min-h-[44px] flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-slate-200 text-center"
                >
                  <CheckSquare className="w-4 h-4 text-indigo-500 mb-1" />
                  <span className="text-[11px] font-medium leading-none">Task</span>
                </button>
              </div>

              {/* Search & Segmented Filter Bar */}
              <div className="space-y-2 pt-1">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search ledger entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-sky-500 dark:focus:border-sky-400 rounded-xl outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
                  {(['all', 'expense', 'income', 'savings', 'task'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`min-h-[36px] px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex-1 capitalize ${
                        filter === cat
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ledger Items Feed */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                  <span>{messages.activityLedger}</span>
                  <span className="font-mono">{messages.recordCount(filteredRecords.length)}</span>
                </div>

                {filteredRecords.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
                    <CreditCard className="w-8 h-8 mx-auto opacity-40 text-slate-500" />
                    <p className="text-xs font-medium">{messages.noRecords}</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="text-xs text-sky-500 hover:underline font-semibold"
                    >
                      + Create first entry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {filteredRecords.map((item) => {
                      const isInc = item.category === 'income';
                      const isSav = item.category === 'savings';
                      const isTask = item.category === 'task';

                      return (
                        <div
                          key={item.id}
                          className="group p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-3 shadow-xs"
                        >
                          {/* Left: Icon or Checkbox */}
                          <div className="flex items-center gap-3 truncate">
                            {isTask ? (
                              <button
                                onClick={() => handleToggleTask(item.id)}
                                className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-colors"
                              >
                                {item.isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-400" />
                                )}
                              </button>
                            ) : (
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                  isInc
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : isSav
                                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                }`}
                              >
                                {isInc ? (
                                  <ArrowDownRight className="w-4 h-4" />
                                ) : isSav ? (
                                  <PiggyBank className="w-4 h-4" />
                                ) : (
                                  <ArrowUpRight className="w-4 h-4" />
                                )}
                              </div>
                            )}

                            <div className="truncate text-left">
                              <h4
                                className={`text-xs font-semibold text-slate-900 dark:text-white truncate ${
                                  isTask && item.isCompleted ? 'line-through opacity-60' : ''
                                }`}
                              >
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                <span>{IntlService.formatRelative(item.timestamp, localeCode)}</span>
                                <span aria-hidden="true">·</span>
                                <span className="capitalize">{item.category}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Amount & Delete */}
                          <div className="flex items-center gap-2 shrink-0">
                            {item.amount !== undefined && (
                              <span
                                className={`text-xs font-bold font-mono tabular-nums ${
                                  isInc
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : isSav
                                    ? 'text-sky-600 dark:text-sky-400'
                                    : 'text-slate-900 dark:text-slate-100'
                                }`}
                              >
                                {isInc ? '+' : '-'}
                                {IntlService.formatCurrency(item.amount, localeCode, currencyCode)}
                              </span>
                            )}

                            <button
                              onClick={() => handleDeleteRecord(item.id)}
                              className="opacity-0 group-hover:opacity-100 focus:opacity-100 min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

            {activeBottomTab === 'ledger' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {messages.activityLedger} Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All transactions stored in SharedPreferences under key{' '}
                    <code className="text-sky-600 dark:text-sky-400 font-mono">ledger_records_json</code>.
                  </p>
                </div>

                <div className="space-y-2">
                  {records.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-semibold block text-slate-900 dark:text-white">{r.title}</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {IntlService.formatFullDate(r.timestamp, localeCode)} · {IntlService.formatTime(r.timestamp, localeCode)}
                        </span>
                      </div>
                      <span className="font-mono font-bold">
                        {r.amount !== undefined ? IntlService.formatCurrency(r.amount, localeCode, currencyCode) : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeBottomTab === 'stats' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Intl Formatter Audit</h3>
                  <p className="text-xs text-slate-500">
                    Live format output generated via <code className="text-sky-500 font-mono">intl: ^0.19.0</code>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      DateFormat.yMMMMd()
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {IntlService.formatMediumDate(Date.now(), localeCode)}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      DateFormat.jm()
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {IntlService.formatTime(Date.now(), localeCode)}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      NumberFormat.compact()
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {IntlService.formatCompact(148500, localeCode)}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      NumberFormat.percent()
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {IntlService.formatPercent(0.842, localeCode)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onNavigateToIntl}
                  className="w-full min-h-[44px] py-2 px-4 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 font-medium text-xs hover:bg-sky-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" /> Open Deep Intl Sandbox
                </button>
              </div>
            )}

            {activeBottomTab === 'settings' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Flutter App Settings</h3>
                  <p className="text-xs text-slate-500">Managed via SharedPreferences Key-Value store</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div
                    onClick={() => setShowLocaleSheet(true)}
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-sky-500 transition-colors"
                  >
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">
                        {messages.language}
                      </span>
                      <span className="text-slate-500">
                        {currentLocale.flag} {currentLocale.name}
                      </span>
                    </div>
                    <span className="text-sky-500 font-medium">Change</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Monthly Budget Cap</span>
                      <span className="text-slate-500 font-mono">
                        {IntlService.formatCurrency(budgetCap, localeCode, currencyCode)}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={budgetCap}
                      onChange={(e) => prefs.setDouble('monthly_budget_cap', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 text-right font-mono bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 text-xs"
                    />
                  </div>

                  <button
                    onClick={() => {
                      prefs.seedDefaults();
                      showToast('Defaults restored in SharedPreferences');
                    }}
                    className="w-full min-h-[44px] py-2 px-4 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-medium text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    Reset SharedPreferences to Defaults
                  </button>
                </div>
              </div>
            )}
        </main>

        {/* Floating Action Button for Adding Record */}
        <div className="absolute right-5 bottom-20 z-20">
          <button
            onClick={() => setShowAddModal(true)}
            className="min-h-[48px] min-w-[48px] px-4 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white shadow-lg flex items-center gap-2 text-xs font-bold active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New</span>
          </button>
        </div>

        {/* Mobile Fixed Bottom Tab Bar (Pattern 1) */}
        <nav className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md grid grid-cols-4 items-center h-16 z-20 px-2 shrink-0">
          <button
            onClick={() => setActiveBottomTab('home')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeBottomTab === 'home'
                ? 'text-sky-600 dark:text-sky-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveBottomTab('ledger')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeBottomTab === 'ledger'
                ? 'text-sky-600 dark:text-sky-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Ledger</span>
          </button>

          <button
            onClick={() => setActiveBottomTab('stats')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeBottomTab === 'stats'
                ? 'text-sky-600 dark:text-sky-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Intl Audit</span>
          </button>

          <button
            onClick={() => setActiveBottomTab('settings')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeBottomTab === 'settings'
                ? 'text-sky-600 dark:text-sky-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Settings</span>
          </button>
        </nav>

        {/* Floating Feedback Toast */}
        {feedbackToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm pointer-events-none transition-all">
            {feedbackToast}
          </div>
        )}

        {/* Bottom Sheet Modal: Add Transaction */}
        {showAddModal && (
          <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[90%] overflow-y-auto">
              <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {messages.newRecordTitle}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRecord} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {messages.categoryLabel}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['expense', 'income', 'savings', 'task'] as const).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={`min-h-[40px] px-2 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                          newCategory === cat
                            ? 'bg-sky-500 text-white font-semibold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Title & Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={messages.titlePlaceholder}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:border-sky-500"
                  />
                </div>

                {newCategory !== 'task' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {messages.amountPlaceholder} ({currencyCode})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:border-sky-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Reference memo or tag"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:border-sky-500"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    {messages.cancelButton}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md transition-colors"
                  >
                    {messages.saveButton}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Sheet Modal: Change Locale & Currency */}
        {showLocaleSheet && (
          <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[80%] overflow-y-auto">
              <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Select Language & Locale
                  </h3>
                  <p className="text-xs text-slate-500">Formats powered by Flutter intl package</p>
                </div>
                <button
                  onClick={() => setShowLocaleSheet(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {SUPPORTED_LOCALES.map((loc) => {
                  const isSelected = loc.code === localeCode;
                  return (
                    <button
                      key={loc.code}
                      onClick={() => handleSelectLocale(loc)}
                      className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl border flex items-center justify-between text-left transition-colors ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{loc.flag}</span>
                        <div>
                          <div className="text-xs font-semibold">{loc.nativeName}</div>
                          <div className="text-[11px] text-slate-500">{loc.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold">{loc.currencyCode}</span>
                        <span className="text-[11px] text-slate-400 block">{loc.currencySymbol}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
