# 📱 Dokumentasi Lengkap Setup Moba-Engine di Sketchware Pro v7

**Game Engine Profesional untuk Mobile Native Development**

---

## 📋 Daftar Isi

1. [Persiapan Awal](#persiapan-awal)
2. [Prasyarat Sistem](#prasyarat-sistem)
3. [Clone Repository](#clone-repository)
4. [Setup Environment](#setup-environment)
5. [Import Project ke Sketchware Pro v7](#import-project-ke-sketchware-pro-v7)
6. [Ekspor dari Sketchware](#ekspor-dari-sketchware)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Persiapan Awal

### A. Download dan Install Tools yang Diperlukan

#### 1. **Node.js & NPM**
```bash
# Download dari: https://nodejs.org/ (LTS Version)
# Versi minimum: Node.js v16.0.0 atau lebih tinggi
# Versi NPM minimum: v8.0.0

# Verifikasi instalasi
node --version
npm --version
```

#### 2. **Git**
```bash
# Download dari: https://git-scm.com/
# Atau gunakan package manager:
# Windows (Chocolatey): choco install git
# macOS (Homebrew): brew install git
# Linux (apt): sudo apt-get install git

# Verifikasi instalasi
git --version
```

#### 3. **Sketchware Pro v7**
- Download dari: Google Play Store atau APK resmi
- Pastikan versi minimal v7.0.0 terinstall di perangkat Android
- Memiliki storage minimal 500MB

#### 4. **Code Editor (Opsional tapi Disarankan)**
- Visual Studio Code: https://code.visualstudio.com/
- Android Studio: https://developer.android.com/studio
- WebStorm: https://www.jetbrains.com/webstorm/

---

## ⚙️ Prasyarat Sistem

### Kebutuhan Minimum
```
✅ OS: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)
✅ RAM: 8GB minimum (16GB direkomendasikan)
✅ Storage: 10GB free space
✅ Node.js: v16.0.0 atau lebih tinggi
✅ NPM: v8.0.0 atau lebih tinggi
✅ Git: v2.0.0 atau lebih tinggi
```

### Paket Tambahan (Opsional)
```bash
# TypeScript globally
npm install -g typescript

# Sketchware CLI tools
npm install -g sketchware-cli

# Java Development Kit (untuk Android build)
# Download dari: https://www.oracle.com/java/technologies/downloads/
```

---

## 📥 Clone Repository Moba-Engine

### Langkah 1: Persiapan Folder Project

```bash
# Buka Terminal/Command Prompt

# 1. Buat folder untuk project
mkdir -p ~/Projects/MobileGameDev
cd ~/Projects/MobileGameDev

# 2. Verifikasi posisi folder
pwd  # macOS/Linux
cd   # Windows
```

### Langkah 2: Clone Repository

```bash
# Clone repository Moba-Engine
git clone https://github.com/hbowo430-sudo/Moba-Engine.git

# Masuk ke folder project
cd Moba-Engine

# Verifikasi berhasil clone
git status
```

**Output yang diharapkan:**
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### Langkah 3: Verifikasi File Project

```bash
# List file dan folder utama
ls -la  # macOS/Linux
dir     # Windows

# Output yang diharapkan:
# ├── src/
# ├── dist/
# ├── tests/
# ├── scripts/
# ├── docs/
# ├── package.json
# ├── tsconfig.json
# ├── README.md
# └── ... file lainnya
```

---

## 🔨 Setup Environment

### Langkah 1: Install Dependencies

```bash
# 1. Pastikan sudah di folder Moba-Engine
cd Moba-Engine

# 2. Install semua dependencies
npm install

# atau jika menggunakan yarn
yarn install
```

**Waktu instalasi:** 3-5 menit (tergantung kecepatan internet)

### Langkah 2: Verifikasi Instalasi

```bash
# Cek versi paket utama
npm list --depth=0

# Output yang diharapkan harus menampilkan:
# ├── @capacitor/app@5.0.6
# ├── @capacitor/core@5.0.6
# ├── @capacitor/device@5.0.6
# ├── @capacitor/filesystem@5.0.6
# ├── @capacitor/storage@5.0.6
# ├── crypto-js@4.1.1
# ├── eventemitter3@5.0.0
# ├── hammerjs@2.0.8
# ├── jszip@3.10.1
# ├── lodash-es@4.17.21
# └── tslib@2.5.0
```

### Langkah 3: Build Project

```bash
# 1. Build project dengan TypeScript
npm run build

# 2. Generate dokumentasi API (opsional)
npm run doc

# 3. Verifikasi build output
ls -la dist/

# Output yang diharapkan:
# ├── moba-engine.js
# ├── moba-engine.esm.js
# ├── moba-engine.d.ts
# └── ... file lainnya
```

### Langkah 4: Test Build (Opsional)

```bash
# Jalankan unit tests
npm run test

# Jalankan test dengan coverage
npm run test:coverage

# Jalankan E2E tests
npm run test:e2e

# Test performa
npm run test:performance
```

---

## 📤 Import Project ke Sketchware Pro v7

### Metode 1: Menggunakan Script Export Sketchware

#### A. Siapkan Project
```bash
# 1. Di folder Moba-Engine, jalankan script export
npm run export:sketchware

# 2. Tunggu proses selesai (1-2 menit)

# 3. File output akan ada di: ./export/sketchware-project/
```

#### B. Paket yang Dihasilkan
```
./export/sketchware-project/
├── build/
├── src/
├── AndroidManifest.xml
├── gradle/
├── project.properties
├── settings.gradle
└── build.gradle
```

### Metode 2: Manual Export untuk Sketchware

```bash
# 1. Export project dengan custom config
npm run export:project -- --target=sketchware --format=zip

# 2. File akan di-save sebagai: moba-engine-sketchware.zip
```

### Metode 3: Import via Sketchware Pro App

#### Di Perangkat Android:

**Step 1: Transfer File**
```
1. Hubungkan perangkat Android ke PC via USB
2. Copy file dari: export/sketchware-project/
3. Paste ke folder Sketchware di Android:
   /sdcard/Sketchware/projects/
```

**Step 2: Buka Sketchware Pro v7**
```
1. Buka aplikasi Sketchware Pro v7
2. Tap menu "Projects"
3. Tap tombol "Import"
4. Pilih folder: Moba-Engine (atau sesuai nama)
5. Tap "Import Project"
```

**Step 3: Tunggu Proses Import**
```
✓ Sketchware akan scan dan import semua file
✓ Proses akan indexing code selama 2-5 menit
✓ Setelah selesai, project siap untuk di-edit
```

---

## 📋 Clone Project dengan Script Otomatis

### Menggunakan Clone Script

```bash
# 1. Di folder Moba-Engine, jalankan script clone
npm run clone:project -- --name=MyGameProject --platform=android

# 2. Script akan membuat:
#    - Copy folder project
#    - Setup dependencies
#    - Generate config files
#    - Ready untuk development
```

### Output Script

```
✓ Project 'MyGameProject' berhasil di-clone
✓ Location: ./projects/MyGameProject/
✓ Dependencies installed
✓ Ready for development

Next steps:
1. cd projects/MyGameProject
2. npm run dev
3. Buka di browser: http://localhost:5173
```

---

## 💾 Ekspor & Impor Project

### A. Ekspor Project dari Moba-Engine

#### Format 1: ZIP Archive
```bash
# Export sebagai ZIP
npm run export:project -- --format=zip --output=./exports/

# File output: ./exports/moba-engine-v1.0.0.zip
```

#### Format 2: APK Build
```bash
# Build APK untuk Android
npm run build
# Kemudian sign dengan Android keystore

# Output: ./dist/app-release.apk
```

#### Format 3: Sketchware Format
```bash
# Export khusus untuk Sketchware
npm run export:sketchware

# Output: ./export/sketchware-project/
```

### B. Import Project ke Sketchware

#### Cara 1: Via Folder Import
```
1. Kompres folder export/sketchware-project/ → MyProject.zip
2. Transfer ke Android: /sdcard/Download/MyProject.zip
3. Di Sketchware: Projects → Import → Pilih MyProject.zip
4. Tunggu proses scanning dan import
```

#### Cara 2: Via Direct Folder Copy
```
1. Connect Android USB
2. Copy export/sketchware-project/* ke /sdcard/Sketchware/projects/MyProject/
3. Di Sketchware: Projects → Refresh/Scan
4. Project akan muncul di list
```

#### Cara 3: Via Sketchware Project Manager
```bash
# Pada PC, jalankan:
npm run export:project -- --target=sketchware --device-path=/sdcard/Sketchware/projects/

# Script akan langsung transfer ke perangkat
# (memerlukan ADB setup)
```

---

## 🎮 Struktur Project di Sketchware

Setelah import, project di Sketchware akan memiliki struktur:

```
MyGameProject (Sketchware)
├── src/
│   ├── components/      # UI Components
│   ├── scenes/          # Game Scenes
│   ├── sprites/         # Game Assets
│   ├── systems/         # Game Systems
│   ├── utils/           # Utility Functions
│   └── main.ts          # Entry Point
├── assets/
│   ├── images/
│   ├── sounds/
│   ├── fonts/
│   └── animations/
├── res/
│   ├── layout/
│   ├── drawable/
│   ├── values/
│   └── raw/
└── AndroidManifest.xml
```

---

## 🚀 Development Workflow

### 1. Inisialisasi Development Environment

```bash
# Terminal 1: Development Server
npm run dev

# Server akan berjalan di: http://localhost:5173
# Hot-reload aktif
```

### 2. Edit Code di Sketchware

```
1. Buka project di Sketchware Pro v7
2. Edit source code
3. Klik tombol "Build" atau "Run"
4. Test aplikasi di emulator/device
```

### 3. Sinkronisasi dengan Repository

```bash
# Terminal 2: Sync with Git
git add .
git commit -m "Update game logic"
git push origin main
```

### 4. Build untuk Production

```bash
# Build optimized version
npm run build

# Generate APK
# (Memerlukan Android SDK setup)
```

---

## 📝 Konfigurasi Sketchware

### File Penting untuk Konfigurasi

#### 1. **package.json** - Konfigurasi Project
```json
{
  "name": "moba-engine",
  "version": "1.0.0",
  "main": "dist/moba-engine.js",
  "scripts": {
    "export:sketchware": "node scripts/export-sketchware.js",
    "import:project": "node scripts/import-project.js"
  }
}
```

#### 2. **tsconfig.json** - TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

#### 3. **sketchware.config.js** - Sketchware Integration
```javascript
module.exports = {
  projectName: 'Moba-Engine',
  platform: 'android',
  apiLevel: 21,
  targetSdk: 33,
  minSdk: 21,
  exportFormats: ['zip', 'apk', 'aab']
};
```

---

## 🧹 Troubleshooting

### Problem 1: Clone Repository Gagal

**Error:** 
```
fatal: unable to access 'https://github.com/hbowo430-sudo/Moba-Engine.git': Could not resolve host
```

**Solusi:**
```bash
# 1. Cek koneksi internet
ping google.com

# 2. Coba dengan SSH (jika Git SSH configured)
git clone git@github.com:hbowo430-sudo/Moba-Engine.git

# 3. Clear Git cache
git config --global --unset http.proxy
git config --global --unset https.proxy

# 4. Retry clone
git clone https://github.com/hbowo430-sudo/Moba-Engine.git
```

### Problem 2: Dependencies Install Gagal

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solusi:**
```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Delete node_modules dan package-lock.json
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s node_modules                   # Windows

# 3. Install dengan flag legacy
npm install --legacy-peer-deps

# 4. Atau update npm
npm install -g npm@latest
npm install
```

### Problem 3: Build Error TypeScript

**Error:**
```
error TS2339: Property 'xyz' does not exist on type 'ABC'
```

**Solusi:**
```bash
# 1. Clear dist folder
rm -rf dist/

# 2. Rebuild dengan verbose
npm run build -- --listFiles

# 3. Check TypeScript version
npm list typescript

# 4. Update TypeScript
npm install -g typescript@latest
npm update typescript
```

### Problem 4: Sketchware Import Gagal

**Masalah:** Project tidak muncul di Sketchware setelah import

**Solusi:**
```bash
# 1. Cek folder permissions
chmod -R 755 export/sketchware-project/

# 2. Validate struktur project
npm run validate

# 3. Re-export dengan force
npm run export:sketchware -- --force --verbose

# 4. Manual copy ke Sketchware folder
adb push export/sketchware-project/ /sdcard/Sketchware/projects/MyProject/
```

### Problem 5: Performance Issues

**Masalah:** Sketchware berjalan lambat saat membuka project

**Solusi:**
```bash
# 1. Optimize build
npm run build -- --minify

# 2. Remove unused dependencies
npm prune

# 3. Clear Sketchware cache (di perangkat)
# Settings → App → Sketchware Pro → Clear Cache

# 4. Reduce project size
npm run build -- --sourcemap=false
```

---

## 🔍 Verifikasi Setup

### Checklist Verifikasi

```bash
# 1. Cek Node.js & NPM
node --version    # v16.0.0 atau lebih tinggi ✓
npm --version     # v8.0.0 atau lebih tinggi ✓

# 2. Cek Git
git --version     # v2.0.0 atau lebih tinggi ✓

# 3. Cek Repository Clone
cd Moba-Engine
git status        # On branch main ✓

# 4. Cek Dependencies
npm list --depth=0  # Semua paket terinstall ✓

# 5. Cek Build
npm run build     # Selesai tanpa error ✓

# 6. Cek Export
npm run export:sketchware  # File ada di ./export/ ✓
```

---

## 📚 Referensi Penting

### Official Documentation
- **Moba-Engine**: https://github.com/hbowo430-sudo/Moba-Engine
- **Capacitor Docs**: https://capacitorjs.com/
- **TypeScript**: https://www.typescriptlang.org/
- **Vite**: https://vitejs.dev/

### Community & Support
- **GitHub Issues**: https://github.com/hbowo430-sudo/Moba-Engine/issues
- **Stack Overflow**: Tag `sketchware`, `game-engine`
- **Sketchware Community**: https://forum.sketchware.com/

### Useful Tools
- **Android Studio**: https://developer.android.com/studio
- **Visual Studio Code**: https://code.visualstudio.com/
- **ADB (Android Debug Bridge)**: https://developer.android.com/studio/command-line/adb

---

## 💡 Tips & Best Practices

### 1. Manajemen Version Control
```bash
# Selalu create branch untuk fitur baru
git checkout -b feature/my-feature

# Commit dengan pesan yang jelas
git commit -m "feat: add new game mechanic"

# Push dan buat Pull Request
git push origin feature/my-feature
```

### 2. Optimasi Performance
```bash
# Minify production build
npm run build

# Test performance
npm run test:performance

# Analyze bundle size
npm run analyze
```

### 3. Testing
```bash
# Selalu test sebelum push
npm run lint      # Code quality
npm run test      # Unit tests
npm run test:e2e  # End-to-end tests
```

### 4. Documentation
```bash
# Generate API docs
npm run doc

# Baca README.md
cat README.md

# Cek CHANGELOG
cat CHANGELOG.md
```

---

## 🎯 Next Steps

1. **Clone Repository** → Mengikuti langkah di "[Clone Repository](#clone-repository)"
2. **Setup Environment** → Mengikuti langkah di "[Setup Environment](#setup-environment)"
3. **Export ke Sketchware** → Mengikuti langkah di "[Ekspor & Impor Project](#ekspor--impor-project)"
4. **Import ke Sketchware Pro v7** → Mengikuti langkah di "[Import Project ke Sketchware](#import-project-ke-sketchware-pro-v7)"
5. **Development** → Mulai edit project di Sketchware
6. **Build & Deploy** → Build APK dan deploy ke Google Play

---

## 📞 Bantuan Tambahan

Jika mengalami masalah:

1. **Cek Dokumentasi** → Baca bagian Troubleshooting
2. **Search Issues** → GitHub Issues: https://github.com/hbowo430-sudo/Moba-Engine/issues
3. **Ask Community** → Sketchware Community Forum
4. **Report Bug** → Create new issue di GitHub

---

**Selamat memulai pengembangan game mobile dengan Moba-Engine! 🚀**

*Last Updated: 2026-07-01*  
*Version: 1.0.0*  
*Author: hbowo430-sudo*
