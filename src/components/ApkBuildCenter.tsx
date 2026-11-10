import React, { useState } from 'react';
import {
  generateFlutterProjectZip,
  ANDROID_APP_BUILD_GRADLE,
  GITHUB_ACTIONS_WORKFLOW_YML,
  README_MD,
} from '../services/flutterProjectZip';
import {
  Terminal,
  Play,
  Download,
  Copy,
  Check,
  Cpu,
  Layers,
  FileCheck,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info,
  Archive,
} from 'lucide-react';

interface ApkArtifact {
  name: string;
  architecture: string;
  description: string;
  size: string;
  savings: string;
  deviceCoverage: string;
  recommendedFor: string;
}

const ARTIFACTS: ApkArtifact[] = [
  {
    name: 'app-arm64-v8a-release.apk',
    architecture: 'ARM64 (AArch64)',
    description: 'Targeted for modern 64-bit Android smartphones & tablets.',
    size: '21.2 MB',
    savings: '63.7% smaller',
    deviceCoverage: '~95% of active Android devices',
    recommendedFor: 'Primary distribution APK for direct customer downloads',
  },
  {
    name: 'app-armeabi-v7a-release.apk',
    architecture: 'ARMv7 (32-bit)',
    description: 'Targeted for legacy 32-bit entry-level Android devices.',
    size: '18.4 MB',
    savings: '68.5% smaller',
    deviceCoverage: '~4% of active Android devices',
    recommendedFor: 'Legacy Android 5.0 - 8.1 support',
  },
  {
    name: 'app-x86_64-release.apk',
    architecture: 'x86_64 (Intel/AMD)',
    description: 'Targeted for Android Studio emulators, Chromebooks, and Intel tablets.',
    size: '23.8 MB',
    savings: '59.2% smaller',
    deviceCoverage: '~1% of market (high emulator usage)',
    recommendedFor: 'QA testing, CI automated test runs & emulator testing',
  },
];

export const ApkBuildCenter: React.FC = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [buildCompleted, setBuildCompleted] = useState(true);
  const [enableObfuscate, setEnableObfuscate] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeConfigTab, setActiveConfigTab] = useState<'command' | 'gradle' | 'github-actions' | 'readme'>('command');
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const defaultLogs = [
    '$ flutter build apk --split-per-abi' + (enableObfuscate ? ' --obfuscate --split-debug-info=build/symbols' : ''),
    'Running "flutter pub get" in flutter_sphere_app...',
    'Resolving dependencies...',
    '  intl 0.19.0',
    '  shared_preferences 2.2.2',
    '  shared_preferences_android 2.2.14',
    'Got dependencies! (0.8s)',
    'Running Gradle task \'assembleRelease\'...',
    'Initializing Gradle daemon using JVM 17.0.10...',
    'Compiling Kotlin sources for :shared_preferences_android...',
    'Running R8 code shrinking and optimization...',
    'Compiling Dart kernel to AOT machine code (Impeller engine)...',
    '  ✓ lib/main.dart -> arm64-v8a binary',
    '  ✓ lib/main.dart -> armeabi-v7a binary',
    '  ✓ lib/main.dart -> x86_64 binary',
    'Stripping native debug symbols & aligning zip archives...',
    '--------------------------------------------------------------------------------',
    '✓ Built build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk (18.4 MB)',
    '✓ Built build/app/outputs/flutter-apk/app-arm64-v8a-release.apk (21.2 MB)',
    '✓ Built build/app/outputs/flutter-apk/app-x86_64-release.apk (23.8 MB)',
    '--------------------------------------------------------------------------------',
    'Split APK build completed successfully in 32.4s.',
  ];

  const handleRunBuildSimulation = () => {
    setIsBuilding(true);
    setBuildCompleted(false);
    setBuildLogs([]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < defaultLogs.length) {
        setBuildLogs((prev) => [...prev, defaultLogs[step]]);
        step++;
      } else {
        clearInterval(interval);
        setIsBuilding(false);
        setBuildCompleted(true);
      }
    }, 140);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      const blob = await generateFlutterProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flutter_sphere_split_apk_project.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to generate project zip', e);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const activeCommandString = `flutter build apk --split-per-abi${
    enableObfuscate ? ' --obfuscate --split-debug-info=build/symbols' : ''
  } --release`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-500" />
            Flutter Android APK Build Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build command analyzer, ABI artifact breakdown, and project packager for{' '}
            <code className="text-sky-500 font-mono">flutter build apk --split-per-abi</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingZip ? 'Packaging Zip...' : 'Download Project ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Hero Overview: Why Split Per ABI? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Universal "Fat" APK Size
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-400 line-through tabular-nums">
              58.4 MB
            </span>
            <span className="text-xs text-rose-500 font-medium font-mono">Bundles all 3 ABIs</span>
          </div>
          <p className="text-xs text-slate-500">
            Bundles armeabi-v7a, arm64-v8a, and x86_64 libraries together. Causes high download friction and user abandonment.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent border border-sky-500/20 rounded-2xl space-y-2">
          <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
            Split-per-ABI Size (arm64-v8a)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-sky-600 dark:text-sky-400 tabular-nums">
              21.2 MB
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              -63.7% smaller
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Only includes the native shared libraries for the specific CPU architecture of the target device.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Target Output Directory
          </span>
          <div className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
            build/app/outputs/flutter-apk/
          </div>
          <p className="text-xs text-slate-500">
            Generates 3 ready-to-install APK files directly in your Flutter project's build output tree.
          </p>
        </div>
      </div>

      {/* Terminal Build Console & Flag Controls */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-mono text-slate-400 ml-2">flutter-cli — bash</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={enableObfuscate}
                onChange={(e) => setEnableObfuscate(e.target.checked)}
                className="rounded accent-sky-500"
              />
              <span className="font-mono text-[11px]">--obfuscate</span>
            </label>

            <button
              onClick={handleRunBuildSimulation}
              disabled={isBuilding}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isBuilding ? 'Compiling...' : 'Simulate Build'}</span>
            </button>

            <button
              onClick={() => handleCopy(activeCommandString, 'main-cmd')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1"
            >
              {copiedKey === 'main-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Command</span>
            </button>
          </div>
        </div>

        {/* Terminal Screen */}
        <div className="p-4 font-mono text-xs text-slate-300 leading-relaxed max-h-[360px] overflow-y-auto space-y-1">
          {(buildLogs.length > 0 ? buildLogs : defaultLogs).map((line, idx) => {
            const isCommand = line.startsWith('$');
            const isSuccess = line.startsWith('✓');
            const isSeparator = line.startsWith('---');

            return (
              <div
                key={idx}
                className={`${
                  isCommand
                    ? 'text-sky-400 font-bold'
                    : isSuccess
                    ? 'text-emerald-400 font-semibold'
                    : isSeparator
                    ? 'text-slate-600'
                    : 'text-slate-300'
                }`}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Artifacts Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Archive className="w-4 h-4 text-sky-500" />
            Generated Split-ABI Artifacts
          </h3>
          <p className="text-xs text-slate-500">
            The three individual APKs generated by <code className="text-sky-500 font-mono">--split-per-abi</code>:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ARTIFACTS.map((art) => (
            <div
              key={art.name}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {art.architecture}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold">
                    {art.size}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-500 break-all bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg">
                  {art.name}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                  {art.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5 text-slate-500">
                <div className="flex justify-between">
                  <span>Coverage:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{art.deviceCoverage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bandwidth Saved:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {art.savings}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  {art.recommendedFor}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration & Build Guides Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-500" />
            Build Configuration & CI/CD Recipes
          </h3>
          <p className="text-xs text-slate-500">
            Inspect the required Gradle settings, GitHub Actions workflow, and command variations.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs font-medium">
          <button
            onClick={() => setActiveConfigTab('command')}
            className={`px-3 py-2 rounded-t-lg transition-colors whitespace-nowrap ${
              activeConfigTab === 'command'
                ? 'bg-slate-900 text-white dark:bg-slate-800 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Command Variants
          </button>
          <button
            onClick={() => setActiveConfigTab('gradle')}
            className={`px-3 py-2 rounded-t-lg transition-colors whitespace-nowrap ${
              activeConfigTab === 'gradle'
                ? 'bg-slate-900 text-white dark:bg-slate-800 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            android/app/build.gradle
          </button>
          <button
            onClick={() => setActiveConfigTab('github-actions')}
            className={`px-3 py-2 rounded-t-lg transition-colors whitespace-nowrap ${
              activeConfigTab === 'github-actions'
                ? 'bg-slate-900 text-white dark:bg-slate-800 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            .github/workflows/build_apk.yml
          </button>
          <button
            onClick={() => setActiveConfigTab('readme')}
            className={`px-3 py-2 rounded-t-lg transition-colors whitespace-nowrap ${
              activeConfigTab === 'readme'
                ? 'bg-slate-900 text-white dark:bg-slate-800 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            README Instructions
          </button>
        </div>

        {/* Config Tab Content */}
        {activeConfigTab === 'command' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">1. Standard Split Build</span>
                <button
                  onClick={() => handleCopy('flutter build apk --split-per-abi', 'cmd-1')}
                  className="text-sky-500 hover:underline"
                >
                  {copiedKey === 'cmd-1' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-slate-200">
                flutter build apk --split-per-abi
              </div>
              <p className="text-slate-500">
                Standard release build splitting native code into arm64-v8a, armeabi-v7a, and x86_64.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">2. Obfuscated Production Build</span>
                <button
                  onClick={() =>
                    handleCopy(
                      'flutter build apk --split-per-abi --obfuscate --split-debug-info=build/app/outputs/symbols',
                      'cmd-2'
                    )
                  }
                  className="text-sky-500 hover:underline"
                >
                  {copiedKey === 'cmd-2' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-slate-200">
                flutter build apk --split-per-abi --obfuscate --split-debug-info=build/symbols
              </div>
              <p className="text-slate-500">
                Obfuscates Dart code to prevent reverse engineering and saves debug symbols for crash symbolication.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">3. Direct Device Install</span>
                <button
                  onClick={() => handleCopy('flutter install -d <device_id>', 'cmd-3')}
                  className="text-sky-500 hover:underline"
                >
                  {copiedKey === 'cmd-3' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-slate-200">
                flutter install
              </div>
              <p className="text-slate-500">
                Flutter automatically determines your connected device's ABI and installs the matching split APK.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">4. Google Play App Bundle (AAB)</span>
                <button
                  onClick={() => handleCopy('flutter build appbundle', 'cmd-4')}
                  className="text-sky-500 hover:underline"
                >
                  {copiedKey === 'cmd-4' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-slate-200">
                flutter build appbundle
              </div>
              <p className="text-slate-500">
                For Google Play Store submission, use App Bundle (AAB) where Google Play handles ABI splitting automatically.
              </p>
            </div>
          </div>
        )}

        {activeConfigTab === 'gradle' && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-400 font-mono">
              <span>android/app/build.gradle</span>
              <button
                onClick={() => handleCopy(ANDROID_APP_BUILD_GRADLE, 'gradle-code')}
                className="hover:text-white"
              >
                {copiedKey === 'gradle-code' ? 'Copied' : 'Copy File'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto font-mono text-slate-200 max-h-[380px]">
              <code>{ANDROID_APP_BUILD_GRADLE}</code>
            </pre>
          </div>
        )}

        {activeConfigTab === 'github-actions' && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-400 font-mono">
              <span>.github/workflows/build_apk.yml</span>
              <button
                onClick={() => handleCopy(GITHUB_ACTIONS_WORKFLOW_YML, 'actions-code')}
                className="hover:text-white"
              >
                {copiedKey === 'actions-code' ? 'Copied' : 'Copy File'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto font-mono text-slate-200 max-h-[380px]">
              <code>{GITHUB_ACTIONS_WORKFLOW_YML}</code>
            </pre>
          </div>
        )}

        {activeConfigTab === 'readme' && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-400 font-mono">
              <span>README.md</span>
              <button
                onClick={() => handleCopy(README_MD, 'readme-code')}
                className="hover:text-white"
              >
                {copiedKey === 'readme-code' ? 'Copied' : 'Copy File'}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto font-mono text-slate-200 max-h-[380px]">
              <code>{README_MD}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
