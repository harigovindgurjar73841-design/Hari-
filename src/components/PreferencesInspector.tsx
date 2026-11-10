import React, { useState, useEffect } from 'react';
import { prefs } from '../services/sharedPreferencesService';
import { FlutterPrefType, PrefEntry } from '../types';
import {
  Database,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Copy,
  RefreshCw,
  FileCode,
  Download,
  Upload,
  Search,
  Key,
} from 'lucide-react';

export const PreferencesInspector: React.FC = () => {
  const [entries, setEntries] = useState<PrefEntry[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | FlutterPrefType>('all');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // New Key Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newType, setNewType] = useState<FlutterPrefType>('string');
  const [newVal, setNewVal] = useState('');

  // Import JSON Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  const refreshEntries = () => {
    setEntries(prefs.getAllEntries());
  };

  useEffect(() => {
    refreshEntries();
    const unsub = prefs.subscribe(refreshEntries);
    return () => unsub();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleStartEdit = (entry: PrefEntry) => {
    setEditingKey(entry.key);
    if (entry.type === 'string_list' && Array.isArray(entry.value)) {
      setEditValue(entry.value.join(', '));
    } else {
      setEditValue(String(entry.value));
    }
  };

  const handleSaveEdit = (entry: PrefEntry) => {
    try {
      if (entry.type === 'string') {
        prefs.setString(entry.key, editValue);
      } else if (entry.type === 'int') {
        const parsed = parseInt(editValue, 10);
        if (isNaN(parsed)) return;
        prefs.setInt(entry.key, parsed);
      } else if (entry.type === 'double') {
        const parsed = parseFloat(editValue);
        if (isNaN(parsed)) return;
        prefs.setDouble(entry.key, parsed);
      } else if (entry.type === 'bool') {
        prefs.setBool(entry.key, editValue.toLowerCase() === 'true');
      } else if (entry.type === 'string_list') {
        const list = editValue.split(',').map((s) => s.trim()).filter(Boolean);
        prefs.setStringList(entry.key, list);
      }
      setEditingKey(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    if (newType === 'string') {
      prefs.setString(newKey.trim(), newVal);
    } else if (newType === 'int') {
      prefs.setInt(newKey.trim(), parseInt(newVal, 10) || 0);
    } else if (newType === 'double') {
      prefs.setDouble(newKey.trim(), parseFloat(newVal) || 0.0);
    } else if (newType === 'bool') {
      prefs.setBool(newKey.trim(), newVal.toLowerCase() === 'true');
    } else if (newType === 'string_list') {
      const list = newVal.split(',').map((s) => s.trim()).filter(Boolean);
      prefs.setStringList(newKey.trim(), list);
    }

    setShowAddModal(false);
    setNewKey('');
    setNewVal('');
  };

  const handleDelete = (key: string) => {
    prefs.remove(key);
  };

  const handleExportJson = () => {
    const json = prefs.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shared_preferences_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    setImportError('');
    const success = prefs.importJson(importJsonText);
    if (success) {
      setShowImportModal(false);
      setImportJsonText('');
    } else {
      setImportError('Invalid JSON format. Expected key-value object.');
    }
  };

  const getDartSnippet = (entry: PrefEntry) => {
    switch (entry.type) {
      case 'string':
        return `final String? ${entry.key} = prefs.getString('${entry.key}');\nawait prefs.setString('${entry.key}', 'new_value');`;
      case 'int':
        return `final int? ${entry.key} = prefs.getInt('${entry.key}');\nawait prefs.setInt('${entry.key}', 100);`;
      case 'double':
        return `final double? ${entry.key} = prefs.getDouble('${entry.key}');\nawait prefs.setDouble('${entry.key}', 99.99);`;
      case 'bool':
        return `final bool? ${entry.key} = prefs.getBool('${entry.key}');\nawait prefs.setBool('${entry.key}', true);`;
      case 'string_list':
        return `final List<String>? ${entry.key} = prefs.getStringList('${entry.key}');\nawait prefs.setStringList('${entry.key}', ['item1', 'item2']);`;
    }
  };

  const filteredEntries = entries.filter((e) => {
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const valStr = typeof e.value === 'object' ? JSON.stringify(e.value) : String(e.value);
      return e.key.toLowerCase().includes(q) || valStr.toLowerCase().includes(q);
    }
    return true;
  });

  const rawJson = prefs.exportJson();
  const byteSize = new Blob([rawJson]).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner / Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-500" />
            SharedPreferences Database Inspector
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time reflection of Flutter's key-value persistent storage (<code className="text-sky-500 font-mono">shared_preferences: ^2.2.2</code>).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="min-h-[40px] px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Key
          </button>
          <button
            onClick={handleExportJson}
            className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button
            onClick={() => {
              prefs.seedDefaults();
              setCopyFeedback('Seeded Defaults');
              setTimeout(() => setCopyFeedback(null), 2000);
            }}
            className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Restore sample Flutter preferences"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button
            onClick={() => {
              if (confirm('Clear all stored preferences in SharedPreferences?')) {
                prefs.clear();
              }
            }}
            className="min-h-[40px] px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Stored Keys
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {entries.length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Storage Footprint
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {(byteSize / 1024).toFixed(2)} KB
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Supported Data Types
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1 block">
            String, int, double, bool, List&lt;String&gt;
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Active Locale Key
          </span>
          <span className="text-sm font-mono font-bold text-sky-600 dark:text-sky-400 mt-1 block">
            {prefs.getString('locale') || 'en_US'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search key name or raw value..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-900 dark:text-white focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
          {(['all', 'string', 'int', 'double', 'bool', 'string_list'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                typeFilter === t
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === 'string_list' ? 'List<String>' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Database Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Key Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Stored Value</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No keys found matching query.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const isEditing = editingKey === entry.key;

                  return (
                    <tr
                      key={entry.key}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Key */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-sky-500" />
                          <span>{entry.key}</span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {entry.type === 'string_list' ? 'List<String>' : entry.type}
                        </span>
                      </td>

                      {/* Value / Inline Edit */}
                      <td className="py-3.5 px-4 font-mono max-w-md truncate">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="px-2 py-1 text-xs font-mono bg-white dark:bg-slate-800 border border-sky-500 rounded outline-none text-slate-900 dark:text-white w-full"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(entry)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingKey(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleStartEdit(entry)}
                            className="cursor-pointer hover:text-sky-500 truncate"
                            title="Click to edit value"
                          >
                            {entry.type === 'string_list' && Array.isArray(entry.value) ? (
                              <span className="text-slate-700 dark:text-slate-300">
                                [{entry.value.map((v) => `"${v}"`).join(', ')}]
                              </span>
                            ) : entry.type === 'bool' ? (
                              <span
                                className={`font-bold ${
                                  entry.value ? 'text-emerald-500' : 'text-rose-500'
                                }`}
                              >
                                {String(entry.value)}
                              </span>
                            ) : (
                              <span className="text-slate-800 dark:text-slate-200">
                                {String(entry.value)}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Updated */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] tabular-nums whitespace-nowrap">
                        {new Date(entry.updatedAt).toLocaleTimeString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => copyToClipboard(getDartSnippet(entry), `Copied Dart for ${entry.key}`)}
                            className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Copy Dart code to read/write this key"
                          >
                            <FileCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStartEdit(entry)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Edit value"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.key)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Delete key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Copy Feedback Toast */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg">
          {copyFeedback}
        </div>
      )}

      {/* Modal: Add New Key */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add SharedPreferences Key
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddKey} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. user_session_token"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Value Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as FlutterPrefType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-mono focus:border-sky-500"
                >
                  <option value="string">String</option>
                  <option value="int">int</option>
                  <option value="double">double</option>
                  <option value="bool">bool</option>
                  <option value="string_list">List&lt;String&gt;</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Value {newType === 'string_list' && '(comma separated)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    newType === 'bool'
                      ? 'true or false'
                      : newType === 'string_list'
                      ? 'apple, banana, cherry'
                      : 'Initial value'
                  }
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-sm"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import JSON */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Import SharedPreferences JSON
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-500">
              Paste exported JSON or a key-value dictionary to load directly into the persistent cache.
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{\n  "custom_token": { "type": "string", "value": "xyz123" }\n}'
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white focus:border-sky-500"
            />

            {importError && <p className="text-rose-500 font-semibold">{importError}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJson}
                className="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-sm"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
