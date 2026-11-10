export type FlutterPrefType = 'string' | 'int' | 'double' | 'bool' | 'string_list';

export interface PrefEntry {
  key: string;
  type: FlutterPrefType;
  value: string | number | boolean | string[];
  description?: string;
  updatedAt: number;
}

export interface SupportedLocale {
  code: string; // e.g. en_US
  name: string; // e.g. English (United States)
  nativeName: string; // e.g. English
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  isRtl?: boolean;
}

export interface ActivityRecord {
  id: string;
  title: string;
  category: 'expense' | 'income' | 'savings' | 'task';
  amount?: number;
  currency: string;
  timestamp: number;
  isCompleted?: boolean;
  note?: string;
}

export type ViewTab = 'simulator' | 'inspector' | 'intl-lab' | 'dart-code' | 'apk-build';
export type DeviceFrameType = 'iphone' | 'pixel' | 'fluid';
export type FlutterThemeMode = 'system' | 'light' | 'dark';
