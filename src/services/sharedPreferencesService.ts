import { FlutterPrefType, PrefEntry } from '../types';

const STORAGE_PREFIX = 'flutter_sp_';
const METADATA_KEY = 'flutter_sp___meta__';

type Listener = () => void;

class SharedPreferencesService {
  private static instance: SharedPreferencesService;
  private memoryCache: Map<string, { type: FlutterPrefType; value: any; updatedAt: number }> = new Map();
  private listeners: Set<Listener> = new Set();
  private initialized = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): SharedPreferencesService {
    if (!SharedPreferencesService.instance) {
      SharedPreferencesService.instance = new SharedPreferencesService();
    }
    return SharedPreferencesService.instance;
  }

  private init() {
    if (this.initialized) return;
    this.reloadFromStorage();
    if (this.memoryCache.size === 0) {
      this.seedDefaults();
    }
    this.initialized = true;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in SharedPreferences listener:', err);
      }
    });
  }

  private reloadFromStorage() {
    try {
      this.memoryCache.clear();
      const metaStr = localStorage.getItem(METADATA_KEY);
      const meta: Record<string, { type: FlutterPrefType; updatedAt: number }> = metaStr ? JSON.parse(metaStr) : {};

      for (let i = 0; i < localStorage.length; i++) {
        const rawKey = localStorage.key(i);
        if (!rawKey || !rawKey.startsWith(STORAGE_PREFIX) || rawKey === METADATA_KEY) continue;
        const key = rawKey.substring(STORAGE_PREFIX.length);
        const rawVal = localStorage.getItem(rawKey);
        if (rawVal === null) continue;

        const info = meta[key] || { type: 'string', updatedAt: Date.now() };
        let parsedVal: any = rawVal;
        try {
          if (info.type === 'int') parsedVal = parseInt(rawVal, 10);
          else if (info.type === 'double') parsedVal = parseFloat(rawVal);
          else if (info.type === 'bool') parsedVal = rawVal === 'true';
          else if (info.type === 'string_list') parsedVal = JSON.parse(rawVal);
          else parsedVal = rawVal;
        } catch {
          parsedVal = rawVal;
        }

        this.memoryCache.set(key, {
          type: info.type,
          value: parsedVal,
          updatedAt: info.updatedAt || Date.now(),
        });
      }
    } catch (e) {
      console.warn('LocalStorage unavailable or corrupted, using in-memory SharedPreferences.', e);
    }
  }

  private syncToStorage(key: string, type: FlutterPrefType, value: any) {
    try {
      const storageKey = STORAGE_PREFIX + key;
      if (type === 'string_list') {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } else {
        localStorage.setItem(storageKey, String(value));
      }

      // Update meta
      const metaStr = localStorage.getItem(METADATA_KEY);
      const meta: Record<string, { type: FlutterPrefType; updatedAt: number }> = metaStr ? JSON.parse(metaStr) : {};
      meta[key] = { type, updatedAt: Date.now() };
      localStorage.setItem(METADATA_KEY, JSON.stringify(meta));
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
  }

  private removeFromStorage(key: string) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      const metaStr = localStorage.getItem(METADATA_KEY);
      if (metaStr) {
        const meta = JSON.parse(metaStr);
        delete meta[key];
        localStorage.setItem(METADATA_KEY, JSON.stringify(meta));
      }
    } catch (e) {
      console.warn('Could not remove from localStorage:', e);
    }
  }

  public seedDefaults() {
    this.setString('locale', 'en_US');
    this.setString('theme_mode', 'dark');
    this.setString('user_name', 'Alex Mercer');
    this.setString('currency_code', 'USD');
    this.setBool('notifications_enabled', true);
    this.setBool('biometric_auth', false);
    this.setInt('daily_goal_streak', 14);
    this.setDouble('monthly_budget_cap', 3500.0);
    this.setStringList('active_categories', ['Groceries', 'Workspace', 'Transit', 'Coffee', 'Fitness']);
    this.setString('app_version', '2.4.1+29');
    this.setInt('launch_count', 42);

    // Initial records JSON string
    const sampleRecords = [
      {
        id: 'rec-1',
        title: 'Specialty Coffee & Roast',
        category: 'expense',
        amount: 6.85,
        currency: 'USD',
        timestamp: Date.now() - 3600000 * 2,
        isCompleted: true,
        note: 'Espresso blend at Blue Bottle',
      },
      {
        id: 'rec-2',
        title: 'Freelance UI/UX Retainer',
        category: 'income',
        amount: 850.0,
        currency: 'USD',
        timestamp: Date.now() - 3600000 * 26,
        isCompleted: true,
        note: 'Sprint milestone signoff',
      },
      {
        id: 'rec-3',
        title: 'High-Yield Savings Transfer',
        category: 'savings',
        amount: 250.0,
        currency: 'USD',
        timestamp: Date.now() - 3600000 * 48,
        isCompleted: true,
        note: 'Emergency fund buffer',
      },
      {
        id: 'rec-4',
        title: 'Review Flutter 3.24 Release Notes',
        category: 'task',
        timestamp: Date.now() - 3600000 * 12,
        isCompleted: true,
        note: 'Impeller engine benchmarks',
      },
      {
        id: 'rec-5',
        title: 'Subway Monthly Transit Pass',
        category: 'expense',
        amount: 128.0,
        currency: 'USD',
        timestamp: Date.now() - 3600000 * 72,
        isCompleted: true,
        note: 'Commuter card renewal',
      },
    ];
    this.setString('ledger_records_json', JSON.stringify(sampleRecords));
  }

  // --- Flutter SharedPreferences API Emulation ---

  public getString(key: string): string | null {
    const entry = this.memoryCache.get(key);
    return entry && entry.type === 'string' ? String(entry.value) : null;
  }

  public setString(key: string, value: string): Promise<boolean> {
    const updatedAt = Date.now();
    this.memoryCache.set(key, { type: 'string', value, updatedAt });
    this.syncToStorage(key, 'string', value);
    this.notify();
    return Promise.resolve(true);
  }

  public getInt(key: string): number | null {
    const entry = this.memoryCache.get(key);
    return entry && entry.type === 'int' ? Math.floor(Number(entry.value)) : null;
  }

  public setInt(key: string, value: number): Promise<boolean> {
    const intVal = Math.floor(value);
    const updatedAt = Date.now();
    this.memoryCache.set(key, { type: 'int', value: intVal, updatedAt });
    this.syncToStorage(key, 'int', intVal);
    this.notify();
    return Promise.resolve(true);
  }

  public getDouble(key: string): number | null {
    const entry = this.memoryCache.get(key);
    return entry && entry.type === 'double' ? Number(entry.value) : null;
  }

  public setDouble(key: string, value: number): Promise<boolean> {
    const updatedAt = Date.now();
    this.memoryCache.set(key, { type: 'double', value, updatedAt });
    this.syncToStorage(key, 'double', value);
    this.notify();
    return Promise.resolve(true);
  }

  public getBool(key: string): boolean | null {
    const entry = this.memoryCache.get(key);
    return entry && entry.type === 'bool' ? Boolean(entry.value) : null;
  }

  public setBool(key: string, value: boolean): Promise<boolean> {
    const updatedAt = Date.now();
    this.memoryCache.set(key, { type: 'bool', value, updatedAt });
    this.syncToStorage(key, 'bool', value);
    this.notify();
    return Promise.resolve(true);
  }

  public getStringList(key: string): string[] | null {
    const entry = this.memoryCache.get(key);
    return entry && entry.type === 'string_list' && Array.isArray(entry.value) ? [...entry.value] : null;
  }

  public setStringList(key: string, value: string[]): Promise<boolean> {
    const updatedAt = Date.now();
    const arr = [...value];
    this.memoryCache.set(key, { type: 'string_list', value: arr, updatedAt });
    this.syncToStorage(key, 'string_list', arr);
    this.notify();
    return Promise.resolve(true);
  }

  public containsKey(key: string): boolean {
    return this.memoryCache.has(key);
  }

  public getKeys(): string[] {
    return Array.from(this.memoryCache.keys()).sort();
  }

  public remove(key: string): Promise<boolean> {
    if (this.memoryCache.has(key)) {
      this.memoryCache.delete(key);
      this.removeFromStorage(key);
      this.notify();
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  public clear(): Promise<boolean> {
    const keys = Array.from(this.memoryCache.keys());
    keys.forEach((k) => this.removeFromStorage(k));
    this.memoryCache.clear();
    this.notify();
    return Promise.resolve(true);
  }

  public getAllEntries(): PrefEntry[] {
    const entries: PrefEntry[] = [];
    this.memoryCache.forEach((item, key) => {
      entries.push({
        key,
        type: item.type,
        value: item.value,
        updatedAt: item.updatedAt,
      });
    });
    return entries.sort((a, b) => a.key.localeCompare(b.key));
  }

  public exportJson(): string {
    const data: Record<string, any> = {};
    this.memoryCache.forEach((item, key) => {
      data[key] = {
        type: item.type,
        value: item.value,
      };
    });
    return JSON.stringify(data, null, 2);
  }

  public importJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (typeof data !== 'object' || data === null) return false;

      Object.entries(data).forEach(([key, valObj]: [string, any]) => {
        if (valObj && typeof valObj === 'object' && valObj.type) {
          const type = valObj.type as FlutterPrefType;
          if (type === 'string') this.setString(key, String(valObj.value));
          else if (type === 'int') this.setInt(key, Number(valObj.value));
          else if (type === 'double') this.setDouble(key, Number(valObj.value));
          else if (type === 'bool') this.setBool(key, Boolean(valObj.value));
          else if (type === 'string_list' && Array.isArray(valObj.value)) this.setStringList(key, valObj.value);
        } else {
          // direct value fallback
          if (typeof valObj === 'string') this.setString(key, valObj);
          else if (typeof valObj === 'number') this.setDouble(key, valObj);
          else if (typeof valObj === 'boolean') this.setBool(key, valObj);
          else if (Array.isArray(valObj)) this.setStringList(key, valObj.map(String));
        }
      });
      return true;
    } catch (e) {
      console.error('Failed to parse SharedPreferences JSON import:', e);
      return false;
    }
  }
}

export const prefs = SharedPreferencesService.getInstance();
