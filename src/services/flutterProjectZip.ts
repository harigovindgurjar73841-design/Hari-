import JSZip from 'jszip';
import {
  FLUTTER_PUBSPEC_YAML,
  FLUTTER_PREFERENCES_SERVICE_DART,
  FLUTTER_INTL_FORMATTERS_DART,
  FLUTTER_MAIN_DART,
  FLUTTER_DASHBOARD_SCREEN_DART,
} from './flutterCodeTemplates';

export const ANDROID_BUILD_GRADLE = `// android/build.gradle
buildscript {
    ext.kotlin_version = '1.9.22'
    repositories {
        google()
        mavenCentral()
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.1'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.buildDir = '../build'
subprojects {
    project.buildDir = "\${rootProject.buildDir}/\${project.name}"
}
subprojects {
    project.evaluationDependsOn(':app')
}

tasks.register("clean", Delete) {
    delete rootProject.buildDir
}
`;

export const ANDROID_APP_BUILD_GRADLE = `// android/app/build.gradle
plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0'
}

android {
    namespace "com.example.flutter_sphere_app"
    compileSdk 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        applicationId "com.example.flutter_sphere_app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName

        // Split per ABI configuration
        ndk {
            abiFilters 'armeabi-v7a', 'arm64-v8a', 'x86_64'
        }
    }

    // Split per ABI config for standalone APKs
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a', 'x86_64'
            universalApk false // Set to true if you also want a combined fallback APK
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug // Replace with custom release keystore for Google Play
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

flutter {
    source '../..'
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlin_version"
}
`;

export const ANDROID_MANIFEST_XML = `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <application
        android:label="FlutterSphere"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`;

export const GITHUB_ACTIONS_WORKFLOW_YML = `name: Build Flutter Split APKs

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Set up Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          channel: 'stable'
          cache: true

      - name: Install Dependencies
        run: flutter pub get

      - name: Build Split APKs
        run: flutter build apk --split-per-abi --release

      - name: List Generated APK Artifacts
        run: ls -lh build/app/outputs/flutter-apk/

      - name: Upload APKs as Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: flutter-split-apks
          path: build/app/outputs/flutter-apk/app-*-release.apk
`;

export const README_MD = `# FlutterSphere App (Split-per-ABI Build Package)

This project is configured for Flutter with:
- \`shared_preferences: ^2.2.2\` (persistent storage)
- \`intl: ^0.19.0\` (localization & formatters)

## Building Split APKs for Android

Running the split-per-abi build command will compile individual APKs targeted for each Android CPU architecture:

\`\`\`bash
# 1. Install dependencies
flutter pub get

# 2. Build Split APKs
flutter build apk --split-per-abi --release
\`\`\`

### Output Files
After compilation, check \`build/app/outputs/flutter-apk/\`:
- \`app-arm64-v8a-release.apk\` (~21 MB) -> For modern 64-bit phones (95%+ of active devices).
- \`app-armeabi-v7a-release.apk\` (~18 MB) -> For legacy 32-bit Android phones.
- \`app-x86_64-release.apk\` (~24 MB) -> For emulators, Chromebooks, and Intel-based tablets.

### Why use --split-per-abi?
A universal fat APK bundles all 3 native CPU binaries together, resulting in a ~58MB file.
Using \`--split-per-abi\` reduces the APK download and install size by over **60%**!
`;

export async function generateFlutterProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file('pubspec.yaml', FLUTTER_PUBSPEC_YAML);
  zip.file('README.md', README_MD);

  // lib directory
  const lib = zip.folder('lib');
  lib?.file('main.dart', FLUTTER_MAIN_DART);

  const services = lib?.folder('services');
  services?.file('preferences_service.dart', FLUTTER_PREFERENCES_SERVICE_DART);

  const utils = lib?.folder('utils');
  utils?.file('intl_formatters.dart', FLUTTER_INTL_FORMATTERS_DART);

  const screens = lib?.folder('screens');
  screens?.file('dashboard_screen.dart', FLUTTER_DASHBOARD_SCREEN_DART);

  // android directory
  const android = zip.folder('android');
  android?.file('build.gradle', ANDROID_BUILD_GRADLE);
  android?.file('settings.gradle', `include ':app'\n`);

  const app = android?.folder('app');
  app?.file('build.gradle', ANDROID_APP_BUILD_GRADLE);

  const srcMain = app?.folder('src')?.folder('main');
  srcMain?.file('AndroidManifest.xml', ANDROID_MANIFEST_XML);

  // GitHub Actions CI/CD
  const github = zip.folder('.github')?.folder('workflows');
  github?.file('build_apk.yml', GITHUB_ACTIONS_WORKFLOW_YML);

  return await zip.generateAsync({ type: 'blob' });
}
