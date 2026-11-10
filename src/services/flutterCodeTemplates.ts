export const FLUTTER_PUBSPEC_YAML = `name: flutter_sphere_app
description: "A production Flutter app powered by shared_preferences and intl."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.2.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  shared_preferences: ^2.2.2
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
  generate: true
`;

export const FLUTTER_PREFERENCES_SERVICE_DART = `// lib/services/preferences_service.dart
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PreferencesService {
  PreferencesService._internal();
  static final PreferencesService instance = PreferencesService._internal();

  late SharedPreferences _prefs;
  bool _isInitialized = false;

  // ValueNotifier triggers reactive UI rebuilds when settings change
  final ValueNotifier<String> localeNotifier = ValueNotifier<String>('en_US');
  final ValueNotifier<String> themeModeNotifier = ValueNotifier<String>('dark');
  final ValueNotifier<double> budgetCapNotifier = ValueNotifier<double>(3500.0);

  Future<void> init() async {
    if (_isInitialized) return;
    _prefs = await SharedPreferences.getInstance();
    
    // Hydrate notifiers from disk
    localeNotifier.value = _prefs.getString('locale') ?? 'en_US';
    themeModeNotifier.value = _prefs.getString('theme_mode') ?? 'dark';
    budgetCapNotifier.value = _prefs.getDouble('monthly_budget_cap') ?? 3500.0;
    
    _isInitialized = true;
  }

  // --- String operations ---
  String getString(String key, {String defaultValue = ''}) {
    return _prefs.getString(key) ?? defaultValue;
  }

  Future<bool> setString(String key, String value) async {
    final result = await _prefs.setString(key, value);
    if (key == 'locale') localeNotifier.value = value;
    if (key == 'theme_mode') themeModeNotifier.value = value;
    return result;
  }

  // --- Numeric operations ---
  int getInt(String key, {int defaultValue = 0}) {
    return _prefs.getInt(key) ?? defaultValue;
  }

  Future<bool> setInt(String key, int value) => _prefs.setInt(key, value);

  double getDouble(String key, {double defaultValue = 0.0}) {
    return _prefs.getDouble(key) ?? defaultValue;
  }

  Future<bool> setDouble(String key, double value) async {
    final result = await _prefs.setDouble(key, value);
    if (key == 'monthly_budget_cap') budgetCapNotifier.value = value;
    return result;
  }

  // --- Boolean operations ---
  bool getBool(String key, {bool defaultValue = false}) {
    return _prefs.getBool(key) ?? defaultValue;
  }

  Future<bool> setBool(String key, bool value) => _prefs.setBool(key, value);

  // --- List<String> operations ---
  List<String> getStringList(String key) {
    return _prefs.getStringList(key) ?? <String>[];
  }

  Future<bool> setStringList(String key, List<String> value) =>
      _prefs.setStringList(key, value);

  // --- JSON Objects via String ---
  T? getJsonObject<T>(String key, T Function(Map<String, dynamic>) fromJson) {
    final raw = _prefs.getString(key);
    if (raw == null) return null;
    return fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  Future<bool> setJsonObject(String key, Map<String, dynamic> data) {
    return _prefs.setString(key, jsonEncode(data));
  }

  // --- Utility ---
  bool containsKey(String key) => _prefs.containsKey(key);
  Future<bool> remove(String key) => _prefs.remove(key);
  Future<bool> clearAll() => _prefs.clear();
}
`;

export const FLUTTER_INTL_FORMATTERS_DART = `// lib/utils/intl_formatters.dart
import 'package:intl/intl.dart';

class IntlFormatter {
  IntlFormatter._();

  /// Formats currency matching locale standards (e.g. $1,234.56 or 1.234,56 €)
  static String formatCurrency(
    num amount, {
    required String locale,
    String? currencyCode,
    int? decimalDigits,
  }) {
    final format = NumberFormat.currency(
      locale: locale,
      name: currencyCode,
      decimalDigits: decimalDigits ?? (currencyCode == 'JPY' ? 0 : 2),
    );
    return format.format(amount);
  }

  /// Compact number representation (e.g., 1.5K, 2.3M)
  static String formatCompact(num value, {required String locale}) {
    return NumberFormat.compact(locale: locale).format(value);
  }

  /// Medium date format: e.g. "Nov 4, 2026"
  static String formatMediumDate(DateTime date, {required String locale}) {
    return DateFormat.yMMMMd(locale).format(date);
  }

  /// Standard clock time: e.g. "8:21 AM" or "20:21"
  static String formatTime(DateTime date, {required String locale}) {
    return DateFormat.jm(locale).format(date);
  }

  /// Relative human-readable time calculation
  static String formatRelative(DateTime date, {required String locale}) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 30) {
      return DateFormat.yMMMd(locale).format(date);
    } else if (difference.inDays > 0) {
      return '\${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '\${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '\${difference.inMinutes}m ago';
    } else {
      return 'just now';
    }
  }

  /// Percentage formatting (e.g. "74.5%")
  static String formatPercentage(double ratio, {required String locale}) {
    return NumberFormat.percentPattern(locale).format(ratio);
  }
}
`;

export const FLUTTER_MAIN_DART = `// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'services/preferences_service.dart';
import 'screens/dashboard_screen.dart';

Future<void> main() async {
  // Ensure Flutter engine bindings are initialized prior to SharedPreferences access
  WidgetsFlutterBinding.ensureInitialized();

  // Hydrate persistent state from disk
  await PreferencesService.instance.init();

  runApp(const FlutterSphereApp());
}

class FlutterSphereApp extends StatelessWidget {
  const FlutterSphereApp({super.key});

  @override
  Widget build(BuildContext context) {
    final prefs = PreferencesService.instance;

    return ValueListenableBuilder<String>(
      valueListenable: prefs.localeNotifier,
      builder: (context, currentLocaleStr, _) {
        final parts = currentLocaleStr.split('_');
        final currentLocale = Locale(parts[0], parts.length > 1 ? parts[1] : null);

        return ValueListenableBuilder<String>(
          valueListenable: prefs.themeModeNotifier,
          builder: (context, themeModeStr, _) {
            final themeMode = switch (themeModeStr) {
              'light' => ThemeMode.light,
              'dark' => ThemeMode.dark,
              _ => ThemeMode.system,
            };

            return MaterialApp(
              title: 'FlutterSphere Ledger',
              debugShowCheckedModeBanner: false,
              themeMode: themeMode,
              theme: ThemeData(
                useMaterial3: true,
                colorSchemeSeed: const Color(0xFF0EA5E9),
                brightness: Brightness.light,
              ),
              darkTheme: ThemeData(
                useMaterial3: true,
                colorSchemeSeed: const Color(0xFF0EA5E9),
                brightness: Brightness.dark,
                scaffoldBackgroundColor: const Color(0xFF020617),
              ),
              // Locale & Intl delegations
              locale: currentLocale,
              supportedLocales: const [
                Locale('en', 'US'),
                Locale('es', 'ES'),
                Locale('hi', 'IN'),
                Locale('fr', 'FR'),
                Locale('de', 'DE'),
                Locale('ja', 'JP'),
                Locale('ar', 'SA'),
                Locale('pt', 'BR'),
              ],
              localizationsDelegates: const [
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
              ],
              home: const DashboardScreen(),
            );
          },
        );
      },
    );
  }
}
`;

export const FLUTTER_DASHBOARD_SCREEN_DART = `// lib/screens/dashboard_screen.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/preferences_service.dart';
import '../utils/intl_formatters.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final prefs = PreferencesService.instance;
  List<Map<String, dynamic>> _records = [];

  @override
  void initState() {
    super.initState();
    _loadRecords();
  }

  void _loadRecords() {
    final raw = prefs.getString('ledger_records_json', defaultValue: '[]');
    try {
      final list = jsonDecode(raw) as List;
      setState(() {
        _records = list.map((e) => Map<String, dynamic>.from(e as Map)).toList();
      });
    } catch (_) {
      _records = [];
    }
  }

  Future<void> _saveRecords() async {
    await prefs.setString('ledger_records_json', jsonEncode(_records));
  }

  @override
  Widget build(BuildContext context) {
    final locale = prefs.localeNotifier.value;
    final currency = prefs.getString('currency_code', defaultValue: 'USD');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutter Ledger'),
        actions: [
          IconButton(
            icon: const Icon(Icons.language),
            onPressed: () => _showLocaleDialog(context),
          ),
          IconButton(
            icon: Icon(
              prefs.themeModeNotifier.value == 'dark'
                  ? Icons.light_mode
                  : Icons.dark_mode,
            ),
            onPressed: () {
              final next = prefs.themeModeNotifier.value == 'dark' ? 'light' : 'dark';
              prefs.setString('theme_mode', next);
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildBalanceCard(locale, currency),
          const SizedBox(height: 16),
          Text(
            'Activity Ledger (\${_records.length})',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          ..._records.map((item) => _buildRecordTile(item, locale)),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddDialog,
        icon: const Icon(Icons.add),
        label: const Text('New Entry'),
      ),
    );
  }

  Widget _buildBalanceCard(String locale, String currency) {
    final total = _records.fold<double>(0.0, (acc, item) {
      final amt = (item['amount'] as num?)?.toDouble() ?? 0.0;
      return item['category'] == 'income' ? acc + amt : acc - amt;
    });

    return Card(
      elevation: 0,
      color: Theme.of(context).colorScheme.surfaceContainerHighest,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Available Balance', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 4),
            Text(
              IntlFormatter.formatCurrency(total, locale: locale, currencyCode: currency),
              style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecordTile(Map<String, dynamic> item, String locale) {
    final date = DateTime.fromMillisecondsSinceEpoch(item['timestamp'] as int);
    final amt = (item['amount'] as num?)?.toDouble() ?? 0.0;
    final isIncome = item['category'] == 'income';

    return ListTile(
      leading: CircleAvatar(
        backgroundColor: isIncome ? Colors.emerald.withOpacity(0.2) : Colors.sky.withOpacity(0.2),
        child: Icon(
          isIncome ? Icons.arrow_downward : Icons.credit_card,
          color: isIncome ? Colors.green : Colors.blue,
        ),
      ),
      title: Text(item['title'] as String),
      subtitle: Text(IntlFormatter.formatRelative(date, locale: locale)),
      trailing: Text(
        '\${isIncome ? '+' : '-'}\${IntlFormatter.formatCurrency(amt, locale: locale)}',
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: isIncome ? Colors.green : null,
        ),
      ),
    );
  }

  void _showLocaleDialog(BuildContext context) {
    // Allows toggling locale between en_US, es_ES, hi_IN, fr_FR, etc.
  }

  void _showAddDialog() {
    // Dialog to append a new item and persist to SharedPreferences
  }
}
`;
