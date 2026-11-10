import { SupportedLocale } from '../types';

export const SUPPORTED_LOCALES: SupportedLocale[] = [
  {
    code: 'en_US',
    name: 'English (United States)',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    isRtl: false,
  },
  {
    code: 'es_ES',
    name: 'Spanish (Spain)',
    nativeName: 'Español',
    flag: '🇪🇸',
    currencyCode: 'EUR',
    currencySymbol: '€',
    isRtl: false,
  },
  {
    code: 'hi_IN',
    name: 'Hindi (India)',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    currencyCode: 'INR',
    currencySymbol: '₹',
    isRtl: false,
  },
  {
    code: 'fr_FR',
    name: 'French (France)',
    nativeName: 'Français',
    flag: '🇫🇷',
    currencyCode: 'EUR',
    currencySymbol: '€',
    isRtl: false,
  },
  {
    code: 'de_DE',
    name: 'German (Germany)',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    currencyCode: 'EUR',
    currencySymbol: '€',
    isRtl: false,
  },
  {
    code: 'ja_JP',
    name: 'Japanese (Japan)',
    nativeName: '日本語',
    flag: '🇯🇵',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    isRtl: false,
  },
  {
    code: 'ar_SA',
    name: 'Arabic (Saudi Arabia)',
    nativeName: 'العربية',
    flag: '🇸🇦',
    currencyCode: 'SAR',
    currencySymbol: 'ر.س',
    isRtl: true,
  },
  {
    code: 'pt_BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
    currencyCode: 'BRL',
    currencySymbol: 'R$',
    isRtl: false,
  },
];

interface Messages {
  appName: string;
  tagline: string;
  dashboard: string;
  activityLedger: string;
  totalBalance: string;
  monthlySpend: string;
  streakCount: string;
  quickActions: string;
  addTransaction: string;
  all: string;
  expenses: string;
  income: string;
  savings: string;
  tasks: string;
  settings: string;
  language: string;
  theme: string;
  lightTheme: string;
  darkTheme: string;
  systemTheme: string;
  clearCache: string;
  activeLocale: string;
  syncedPreferences: string;
  recordCount: (count: number) => string;
  noRecords: string;
  newRecordTitle: string;
  titlePlaceholder: string;
  amountPlaceholder: string;
  categoryLabel: string;
  saveButton: string;
  cancelButton: string;
  completed: string;
  pending: string;
}

const TRANSLATIONS: Record<string, Messages> = {
  en_US: {
    appName: 'Flutter Ledger',
    tagline: 'State via shared_preferences, localized with intl',
    dashboard: 'Dashboard',
    activityLedger: 'Activity Ledger',
    totalBalance: 'Available Balance',
    monthlySpend: 'Monthly Velocity',
    streakCount: 'Active Streak',
    quickActions: 'Quick Entry',
    addTransaction: 'Add Transaction',
    all: 'All',
    expenses: 'Expenses',
    income: 'Income',
    savings: 'Savings',
    tasks: 'Tasks',
    settings: 'Settings',
    language: 'Language & Locale',
    theme: 'Appearance',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    systemTheme: 'System',
    clearCache: 'Reset Cache',
    activeLocale: 'Active Locale',
    syncedPreferences: 'Synced to SharedPreferences',
    recordCount: (n) => (n === 1 ? '1 entry recorded' : `${n} entries recorded`),
    noRecords: 'No activity found in local storage.',
    newRecordTitle: 'Create Entry',
    titlePlaceholder: 'Description (e.g. Workspace Desk)',
    amountPlaceholder: 'Amount',
    categoryLabel: 'Category',
    saveButton: 'Save to Preferences',
    cancelButton: 'Cancel',
    completed: 'Completed',
    pending: 'Pending',
  },
  es_ES: {
    appName: 'Libro Flutter',
    tagline: 'Estado vía shared_preferences, localizado con intl',
    dashboard: 'Panel',
    activityLedger: 'Registro de Actividad',
    totalBalance: 'Saldo Disponible',
    monthlySpend: 'Velocidad Mensual',
    streakCount: 'Racha Activa',
    quickActions: 'Entrada Rápida',
    addTransaction: 'Añadir Transacción',
    all: 'Todos',
    expenses: 'Gastos',
    income: 'Ingresos',
    savings: 'Ahorros',
    tasks: 'Tareas',
    settings: 'Ajustes',
    language: 'Idioma y Región',
    theme: 'Apariencia',
    lightTheme: 'Claro',
    darkTheme: 'Oscuro',
    systemTheme: 'Sistema',
    clearCache: 'Restablecer Caché',
    activeLocale: 'Región Activa',
    syncedPreferences: 'Sincronizado con SharedPreferences',
    recordCount: (n) => (n === 1 ? '1 registro guardado' : `${n} registros guardados`),
    noRecords: 'Sin actividad en el almacenamiento local.',
    newRecordTitle: 'Crear Registro',
    titlePlaceholder: 'Descripción (ej. Mesa de trabajo)',
    amountPlaceholder: 'Importe',
    categoryLabel: 'Categoría',
    saveButton: 'Guardar en Preferencias',
    cancelButton: 'Cancelar',
    completed: 'Completado',
    pending: 'Pendiente',
  },
  hi_IN: {
    appName: 'फ्लटर लेजर',
    tagline: 'shared_preferences द्वारा डेटा, intl द्वारा स्थानीयकरण',
    dashboard: 'डैशबोर्ड',
    activityLedger: 'गतिविधि बहीखाता',
    totalBalance: 'उपलब्ध शेष राशि',
    monthlySpend: 'मासिक व्यय',
    streakCount: 'सक्रिय स्ट्रीक',
    quickActions: 'त्वरित प्रविष्टि',
    addTransaction: 'लेनदेन जोड़ें',
    all: 'सभी',
    expenses: 'खर्चे',
    income: 'आय',
    savings: 'बचत',
    tasks: 'कार्य',
    settings: 'सेटिंग्स',
    language: 'भाषा और क्षेत्र',
    theme: 'थीम',
    lightTheme: 'लाइट',
    darkTheme: 'डार्क',
    systemTheme: 'सिस्टम',
    clearCache: 'कैश रीसेट करें',
    activeLocale: 'सक्रिय भाषा',
    syncedPreferences: 'SharedPreferences में संग्रहीत',
    recordCount: (n) => (n === 1 ? '1 प्रविष्टि दर्ज' : `${n} प्रविष्टियां दर्ज`),
    noRecords: 'स्थानीय संग्रहण में कोई गतिविधि नहीं मिली।',
    newRecordTitle: 'नई प्रविष्टि बनाएं',
    titlePlaceholder: 'विवरण (जैसे कार्यस्थल)',
    amountPlaceholder: 'राशि',
    categoryLabel: 'श्रेणी',
    saveButton: 'सहेजें',
    cancelButton: 'रद्द करें',
    completed: 'पूर्ण',
    pending: 'लंबित',
  },
  fr_FR: {
    appName: 'Grand Livre Flutter',
    tagline: 'État via shared_preferences, localisé avec intl',
    dashboard: 'Tableau de bord',
    activityLedger: 'Grand Livre d\'Activité',
    totalBalance: 'Solde Disponible',
    monthlySpend: 'Dépenses du Mois',
    streakCount: 'Série Active',
    quickActions: 'Entrée Rapide',
    addTransaction: 'Ajouter une Transaction',
    all: 'Tous',
    expenses: 'Dépenses',
    income: 'Revenus',
    savings: 'Épargne',
    tasks: 'Tâches',
    settings: 'Paramètres',
    language: 'Langue et Région',
    theme: 'Apparence',
    lightTheme: 'Clair',
    darkTheme: 'Sombre',
    systemTheme: 'Système',
    clearCache: 'Vider le Cache',
    activeLocale: 'Région Active',
    syncedPreferences: 'Synchronisé avec SharedPreferences',
    recordCount: (n) => (n === 1 ? '1 entrée enregistrée' : `${n} entrées enregistrées`),
    noRecords: 'Aucune activité dans la mémoire locale.',
    newRecordTitle: 'Créer une Entrée',
    titlePlaceholder: 'Description (ex. Bureau de travail)',
    amountPlaceholder: 'Montant',
    categoryLabel: 'Catégorie',
    saveButton: 'Enregistrer dans les Préférences',
    cancelButton: 'Annuler',
    completed: 'Terminé',
    pending: 'En attente',
  },
  de_DE: {
    appName: 'Flutter Journal',
    tagline: 'Zustand via shared_preferences, lokalisiert mit intl',
    dashboard: 'Übersicht',
    activityLedger: 'Aktivitätsjournal',
    totalBalance: 'Verfügbares Guthaben',
    monthlySpend: 'Monatliche Ausgaben',
    streakCount: 'Aktive Serie',
    quickActions: 'Schnelleingabe',
    addTransaction: 'Transaktion hinzufügen',
    all: 'Alle',
    expenses: 'Ausgaben',
    income: 'Einnahmen',
    savings: 'Ersparnisse',
    tasks: 'Aufgaben',
    settings: 'Einstellungen',
    language: 'Sprache & Region',
    theme: 'Erscheinungsbild',
    lightTheme: 'Hell',
    darkTheme: 'Dunkel',
    systemTheme: 'System',
    clearCache: 'Cache leeren',
    activeLocale: 'Aktive Region',
    syncedPreferences: 'Mit SharedPreferences synchronisiert',
    recordCount: (n) => (n === 1 ? '1 Eintrag gespeichert' : `${n} Einträge gespeichert`),
    noRecords: 'Keine Aktivität im lokalen Speicher vorhanden.',
    newRecordTitle: 'Eintrag erstellen',
    titlePlaceholder: 'Beschreibung (z.B. Bürotisch)',
    amountPlaceholder: 'Betrag',
    categoryLabel: 'Kategorie',
    saveButton: 'In Einstellungen speichern',
    cancelButton: 'Abbrechen',
    completed: 'Erledigt',
    pending: 'Ausstehend',
  },
  ja_JP: {
    appName: 'Flutter 家計簿',
    tagline: 'shared_preferencesによる状態管理、intlによる多言語化',
    dashboard: 'ダッシュボード',
    activityLedger: '活動記録',
    totalBalance: '利用可能残高',
    monthlySpend: '今月の支出',
    streakCount: '連続達成日数',
    quickActions: 'クイック登録',
    addTransaction: '新規取引の追加',
    all: 'すべて',
    expenses: '支出',
    income: '収入',
    savings: '貯蓄',
    tasks: 'タスク',
    settings: '設定',
    language: '言語と地域',
    theme: '外観モード',
    lightTheme: 'ライト',
    darkTheme: 'ダーク',
    systemTheme: 'システム設定に従う',
    clearCache: 'キャッシュ初期化',
    activeLocale: '現在のロケール',
    syncedPreferences: 'SharedPreferencesに同期済み',
    recordCount: (n) => `${n} 件の記録`,
    noRecords: 'ローカルストレージに記録がありません。',
    newRecordTitle: '新規レコード作成',
    titlePlaceholder: '内容（例：デスク購入）',
    amountPlaceholder: '金額',
    categoryLabel: 'カテゴリー',
    saveButton: 'ローカルに保存',
    cancelButton: 'キャンセル',
    completed: '完了',
    pending: '未完了',
  },
  ar_SA: {
    appName: 'دفتر فلاتر',
    tagline: 'الحالة عبر shared_preferences والتعريب بواسطة intl',
    dashboard: 'لوحة التحكم',
    activityLedger: 'سجل العمليات',
    totalBalance: 'الرصيد المتاح',
    monthlySpend: 'معدل الإنفاق الشهري',
    streakCount: 'سلسلة الإنجاز',
    quickActions: 'إدخال سريع',
    addTransaction: 'إضافة معاملة',
    all: 'الكل',
    expenses: 'المصروفات',
    income: 'الإيرادات',
    savings: 'المدخرات',
    tasks: 'المهام',
    settings: 'الإعدادات',
    language: 'اللغة والمنطقة',
    theme: 'المظهر',
    lightTheme: 'فاتح',
    darkTheme: 'داكن',
    systemTheme: 'النظام',
    clearCache: 'إعادة تعيين الذاكرة',
    activeLocale: 'اللغة النشطة',
    syncedPreferences: 'متزامن مع SharedPreferences',
    recordCount: (n) => (n === 1 ? 'سجل واحد محفوظ' : `${n} سجلات محفوظة`),
    noRecords: 'لا توجد بيانات مسجلة في الذاكرة المحلية.',
    newRecordTitle: 'إنشاء سجل جديد',
    titlePlaceholder: 'الوصف (مثال: مستلزمات المكتب)',
    amountPlaceholder: 'المبلغ',
    categoryLabel: 'الفئة',
    saveButton: 'حفظ في التفضيلات',
    cancelButton: 'إلغاء',
    completed: 'مكتمل',
    pending: 'معلق',
  },
  pt_BR: {
    appName: 'Livro Flutter',
    tagline: 'Estado via shared_preferences, localizado com intl',
    dashboard: 'Painel',
    activityLedger: 'Extrato de Atividades',
    totalBalance: 'Saldo Disponível',
    monthlySpend: 'Gasto Mensal',
    streakCount: 'Sequência Ativa',
    quickActions: 'Entrada Rápida',
    addTransaction: 'Nova Transação',
    all: 'Todos',
    expenses: 'Despesas',
    income: 'Receitas',
    savings: 'Poupança',
    tasks: 'Tarefas',
    settings: 'Configurações',
    language: 'Idioma e Região',
    theme: 'Aparência',
    lightTheme: 'Claro',
    darkTheme: 'Escuro',
    systemTheme: 'Sistema',
    clearCache: 'Limpar Cache',
    activeLocale: 'Região Ativa',
    syncedPreferences: 'Sincronizado no SharedPreferences',
    recordCount: (n) => (n === 1 ? '1 registro salvo' : `${n} registros salvos`),
    noRecords: 'Nenhuma atividade no armazenamento local.',
    newRecordTitle: 'Criar Registro',
    titlePlaceholder: 'Descrição (ex. Mesa de trabalho)',
    amountPlaceholder: 'Valor',
    categoryLabel: 'Categoria',
    saveButton: 'Salvar nas Preferências',
    cancelButton: 'Cancelar',
    completed: 'Concluído',
    pending: 'Pendente',
  },
};

export class IntlService {
  public static getMessages(localeCode: string): Messages {
    return TRANSLATIONS[localeCode] || TRANSLATIONS['en_US'];
  }

  public static getLocaleInfo(code: string): SupportedLocale {
    return SUPPORTED_LOCALES.find((l) => l.code === code) || SUPPORTED_LOCALES[0];
  }

  // --- Flutter intl: DateFormat emulation ---

  public static formatMediumDate(date: Date | number, localeCode: string): string {
    const d = typeof date === 'number' ? new Date(date) : date;
    const locale = localeCode.replace('_', '-');
    try {
      return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(d);
    } catch {
      return d.toLocaleDateString();
    }
  }

  public static formatFullDate(date: Date | number, localeCode: string): string {
    const d = typeof date === 'number' ? new Date(date) : date;
    const locale = localeCode.replace('_', '-');
    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(d);
    } catch {
      return d.toDateString();
    }
  }

  public static formatTime(date: Date | number, localeCode: string): string {
    const d = typeof date === 'number' ? new Date(date) : date;
    const locale = localeCode.replace('_', '-');
    try {
      return new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
      }).format(d);
    } catch {
      return d.toLocaleTimeString();
    }
  }

  public static formatRelative(timestamp: number, localeCode: string): string {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    const locale = localeCode.replace('_', '-');
    try {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      if (diffDay > 0) return rtf.format(-diffDay, 'day');
      if (diffHour > 0) return rtf.format(-diffHour, 'hour');
      if (diffMin > 0) return rtf.format(-diffMin, 'minute');
      return rtf.format(-diffSec, 'second');
    } catch {
      if (diffDay > 0) return `${diffDay}d ago`;
      if (diffHour > 0) return `${diffHour}h ago`;
      return `${Math.max(1, diffMin)}m ago`;
    }
  }

  // --- Flutter intl: NumberFormat emulation ---

  public static formatCurrency(amount: number, localeCode: string, currencyCode?: string): string {
    const info = this.getLocaleInfo(localeCode);
    const curr = currencyCode || info.currencyCode;
    const locale = localeCode.replace('_', '-');

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: curr,
        maximumFractionDigits: curr === 'JPY' ? 0 : 2,
        minimumFractionDigits: curr === 'JPY' ? 0 : 2,
      }).format(amount);
    } catch {
      return `${info.currencySymbol}${amount.toFixed(2)}`;
    }
  }

  public static formatCompact(value: number, localeCode: string): string {
    const locale = localeCode.replace('_', '-');
    try {
      return new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(value);
    } catch {
      return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
    }
  }

  public static formatPercent(ratio: number, localeCode: string): string {
    const locale = localeCode.replace('_', '-');
    try {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(ratio);
    } catch {
      return `${(ratio * 100).toFixed(1)}%`;
    }
  }

  public static formatDecimal(num: number, localeCode: string): string {
    const locale = localeCode.replace('_', '-');
    try {
      return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
      }).format(num);
    } catch {
      return String(num);
    }
  }
}
