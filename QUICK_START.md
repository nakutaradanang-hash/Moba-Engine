# ⚡ Quick Start Guide - Moba-Engine untuk Sketchware Pro v7

**Setup Cepat dalam 15 Menit!**

---

## 🚀 5 Langkah Cepat Setup

### Step 1: Clone Repository (2 menit)

```bash
# Buka Terminal/Command Prompt

# 1. Buat folder project
mkdir -p ~/Projects
cd ~/Projects

# 2. Clone repository
git clone https://github.com/hbowo430-sudo/Moba-Engine.git
cd Moba-Engine

# 3. Verify berhasil
git status
# Output: On branch main ✓
```

### Step 2: Install Dependencies (3 menit)

```bash
# 1. Install npm packages
npm install

# 2. Tunggu proses (progress bar akan muncul)
# ✓ added 500+ packages

# 3. Verify instalasi
npm list --depth=0
# Output: semua paket terinstall ✓
```

### Step 3: Build Project (3 menit)

```bash
# 1. Build dengan TypeScript
npm run build

# 2. Tunggu proses complete
# ✓ Built in 45.3s

# 3. Verify output exists
ls dist/
# Output: moba-engine.js, moba-engine.esm.js, dll ✓
```

### Step 4: Export untuk Sketchware (5 menit)

```bash
# 1. Jalankan export script
npm run export:sketchware

# 2. Tunggu sampai selesai
# ✓ Export completed

# 3. Verify file exists
ls -lh export/moba-engine-sketchware-v1.zip
# Output: ~3-5MB ✓

# 4. Atau export ke folder
ls export/sketchware-project/
# Output: src/, build.gradle, dll ✓
```

### Step 5: Import ke Sketchware (2 menit setup)

**Di Perangkat Android:**

```
1. Transfer file ke device:
   - Via USB: Copy dari PC ke /sdcard/Download/
   - Via Cloud: Download dari Google Drive
   - Via Email: Download dari attachment

2. Buka Sketchware Pro v7 di Android:
   ⊞ Projects tab → ➕ New → Import Project

3. Select file:
   /sdcard/Download/moba-engine-sketchware-v1.zip

4. Tunggu import selesai (2-5 menit):
   - Extracting files...
   - Indexing project...
   - Done! ✓

5. Project "Moba-Engine" muncul di list
   Tap untuk membuka & mulai develop
```

---

## 📋 Pre-Requirements Checklist

Sebelum mulai, pastikan sudah punya:

```
✅ Hardware & Software
□ PC/Laptop dengan 8GB RAM minimal
□ Storage kosong minimal 10GB
□ Internet connection stabil
□ Android device dengan Sketchware Pro v7

✅ Software di PC/Laptop
□ Node.js v16+ installed
□ NPM v8+ installed
□ Git installed
□ Code editor (optional: VS Code)

✅ Android Device Setup
□ USB Debugging enabled (di device)
□ Sketchware Pro v7 installed
□ Storage kosong minimal 500MB
□ Android 5.0+ (optimal: Android 9+)

✅ Internet & Account
□ GitHub account (optional)
□ Google Drive/Cloud account (optional)
```

**Verify Prerequisites:**

```bash
# Jalankan di Terminal/CMD:

# 1. Check Node.js
node --version
# Output: v16.0.0 atau lebih tinggi ✓

# 2. Check NPM
npm --version
# Output: v8.0.0 atau lebih tinggi ✓

# 3. Check Git
git --version
# Output: git version 2.x.x ✓

# Jika ada yang tidak terinstall, lihat:
# https://github.com/hbowo430-sudo/Moba-Engine/blob/main/DOKUMENTASI_SKETCHWARE_PRO_V7.md#prasyarat-sistem
```

---

## 🎯 Workflow Singkat Harian

### Saat Mulai Development

```bash
# 1. Buka Terminal
# 2. Navigate ke project
cd ~/Projects/Moba-Engine

# 3. Mulai dev server
npm run dev

# Output:
# ✓ Server running at http://localhost:5173

# 4. Browser auto-open
# Hot-reload aktif - setiap save langsung reload

# 5. Edit file di src/ dengan code editor favorit
```

### Saat Selesai Development

```bash
# 1. Stop dev server
Ctrl+C

# 2. Commit changes
git add .
git commit -m "feat: add new game mechanic"

# 3. Push ke GitHub (optional)
git push origin main

# 4. Build untuk production
npm run build

# 5. Export ke Sketchware
npm run export:sketchware

# 6. Transfer ke device dan import
# Lihat Step 5 di atas
```

---

## 🔗 Struktur Folder Project

```
Moba-Engine/
│
├── 📄 src/                          # Source code
│   ├── main.ts                      # Entry point
│   ├── components/                  # UI components
│   ├── scenes/                      # Game scenes
│   └── utils/                       # Helper functions
│
├── 📄 dist/                         # Build output (auto-generated)
│   ├── moba-engine.js
│   ├── moba-engine.esm.js
│   └── moba-engine.d.ts
│
├── 📄 export/                       # Export files
│   ├── sketchware-project/          # Folder export
│   └── moba-engine-sketchware.zip   # ZIP export
│
├── 📄 tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── 📄 scripts/                      # Build scripts
│   ├── export-sketchware.js
│   └── export-project.js
│
├── 📄 docs/                         # Documentation
│   ├── api/
│   ├── guides/
│   └── README.md
│
├── 📄 public/                       # Static assets
│   ├── assets/
│   ├── images/
│   └── sounds/
│
└── 📄 Config files
    ├── package.json                 # Project metadata
    ├── tsconfig.json                # TypeScript config
    ├── vite.config.ts               # Vite config
    └── README.md                    # Main documentation
```

---

## 💻 Useful Commands Reference

### Development Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Start dev server | http://localhost:5173 |
| `npm run build` | Build untuk production | dist/ folder |
| `npm run preview` | Preview build output | http://localhost:4173 |
| `npm run lint` | Check code quality | List of issues |
| `npm run format` | Auto-format code | Formatted files |
| `npm run test` | Run unit tests | Test results |

### Export & Import Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run export:sketchware` | Export untuk Sketchware | export/sketchware-project/ |
| `npm run export:project` | Export format custom | export/custom/ |
| `npm run clone:project` | Clone project | projects/MyProject/ |
| `npm run import:project` | Import existing project | Updated project |

### Documentation Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run doc` | Generate API docs | docs/api/index.html |
| `npm list` | List all packages | Package tree |
| `npm outdated` | Check for updates | List of outdated packages |

### Git Commands

```bash
# Check status
git status

# Commit changes
git commit -m "message"

# Push to GitHub
git push origin main

# Pull latest
git pull origin main

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main

# Merge branch
git merge feature-name

# Tag release
git tag v1.0.0
```

---

## 🚨 Common Issues Quick Fix

### Issue: "npm: command not found"

**Fix dalam 30 detik:**
```bash
# 1. Install Node.js dari https://nodejs.org/
# 2. Restart Terminal/CMD
# 3. Verify:
node --version  # Should show v16+

# Done! ✓
```

### Issue: Port 5173 Already in Use

**Fix dalam 30 detik:**
```bash
# 1. Kill proses yang pakai port
# macOS/Linux:
lsof -i :5173 | grep node | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :5173 | for /f "tokens=5" %a in ('findstr /R /C:".*"') do taskkill /PID %a /F

# 2. Start dev server lagi
npm run dev

# Done! ✓
```

### Issue: Export Failed - Permission Denied

**Fix dalam 30 detik:**
```bash
# 1. Fix permissions
chmod -R 755 export/

# 2. Try export again
npm run export:sketchware

# Done! ✓
```

### Issue: Sketchware Import Failed

**Fix dalam 2 menit:**
```bash
# 1. Re-export
rm export/moba-engine-sketchware-v1.zip
npm run export:sketchware

# 2. Verify ZIP
unzip -t export/moba-engine-sketchware-v1.zip

# 3. Transfer ke device baru
adb push export/moba-engine-sketchware-v1.zip /sdcard/Download/

# 4. Import di Sketchware lagi

# Done! ✓
```

---

## 📱 Transfer File ke Android - 3 Metode

### Metode 1: USB Cable (Recommended)

```bash
# 1. Connect device via USB
adb devices
# Output: device serial number

# 2. Push file
adb push export/moba-engine-sketchware-v1.zip /sdcard/Download/

# 3. Verify
adb shell ls -lh /sdcard/Download/moba-engine-sketchware-v1.zip

# Done! File siap import di Sketchware ✓
```

### Metode 2: Cloud (Google Drive/Dropbox)

```
1. Upload file ke Google Drive
2. Share atau publish link
3. Di Android browser, buka link
4. Tap Download
5. File otomatis di /sdcard/Download/

Done! File siap import ✓
```

### Metode 3: Email/Messenger

```
1. Attach file ke email
2. Send ke email device Anda
3. Di Android, buka email app
4. Tap Download attachment
5. File tersimpan di /sdcard/Download/

Done! File siap import ✓
```

---

## 🎮 Pertama Kali Buka Sketchware

### Setup Project di Sketchware

```
1. Buka Sketchware Pro v7
   
2. Tap ⊞ Projects tab (jika belum)

3. Lihat list project yang sudah ada:
   - Moba-Engine
   - (project lain jika ada)

4. Tap "Moba-Engine" untuk membuka

5. Project akan loading:
   - "Indexing project..."
   - (tunggu 2-5 menit first time)
   - ✓ Project ready

6. Interface Sketchware:
   ┌─────────────────────────────────┐
   │ [Design] [Code] [Logic] [Build] │ ← Tabs
   └─────────────────────────────────┘
   
   [Design Tab]
   - Visual layout editor
   - Drag & drop UI elements

   [Code Tab]
   - Source code editor
   - Browse project files

   [Logic Tab]
   - Visual programming
   - Event handlers

   [Build Tab]
   - Compile & run
   - Generate APK

7. Explore interface dan familiarize
```

---

## 📚 Documentation Reference

Sudah ada 3 file dokumentasi lengkap:

1. **DOKUMENTASI_SKETCHWARE_PRO_V7.md** (15KB)
   - Setup lengkap step-by-step
   - Prasyarat sistem detail
   - Troubleshooting menyeluruh
   - [Baca file](DOKUMENTASI_SKETCHWARE_PRO_V7.md)

2. **PANDUAN_EXPORT_IMPORT.md** (22KB)
   - 5 metode export & import
   - Format file & struktur detail
   - Validasi & testing
   - Advanced options
   - [Baca file](PANDUAN_EXPORT_IMPORT.md)

3. **TROUBLESHOOTING_BEST_PRACTICES.md** (26KB)
   - 20+ common issues & fixes
   - Performance optimization
   - Security & deployment
   - Best practices
   - FAQ & quick reference
   - [Baca file](TROUBLESHOOTING_BEST_PRACTICES.md)

---

## 🎓 Next Steps

### Setelah Setup Berhasil

```
✓ Step 1: Clone & Install (Done!)
    ↓
□ Step 2: Buka project di code editor
    Pilih: VS Code, Android Studio, atau text editor apapun
    
□ Step 3: Explore source code
    Folder: src/
    Main files: main.ts, components/, scenes/
    
□ Step 4: Buat perubahan kecil
    Misalnya: ubah warna, tambah text, dll
    Save & rebuild
    
□ Step 5: Test di Sketchware
    Export → Import → Build & Run di device
    Lihat perubahan live
    
□ Step 6: Commit & push
    git add .
    git commit -m "My first change"
    git push origin main
    
□ Step 7: Repeat!
    Development cycle berkelanjutan
    Explore features lebih lanjut
```

---

## 🆘 Butuh Bantuan?

### Resources

- **GitHub Issues**: https://github.com/hbowo430-sudo/Moba-Engine/issues
- **Documentation**: Lihat 3 files di atas
- **Stack Overflow**: Tag `moba-engine`, `sketchware`
- **Community**: https://forum.sketchware.com/

### Troubleshooting Guide

- **Quick fixes**: Lihat section "🚨 Common Issues Quick Fix" di atas
- **Detailed help**: Buka `TROUBLESHOOTING_BEST_PRACTICES.md`
- **Export issues**: Buka `PANDUAN_EXPORT_IMPORT.md`
- **Setup issues**: Buka `DOKUMENTASI_SKETCHWARE_PRO_V7.md`

---

## 📝 Ringkasan 15 Menit Setup

| Waktu | Aktivitas | Command |
|-------|-----------|---------|
| 0:00-2:00 | Clone repo | `git clone ... && cd Moba-Engine` |
| 2:00-5:00 | Install deps | `npm install` |
| 5:00-8:00 | Build | `npm run build` |
| 8:00-13:00 | Export | `npm run export:sketchware` |
| 13:00-15:00 | Transfer & Import | Copy zip ke Android, import di Sketchware |

**Total: ~15 menit** ✓

---

## ✨ Tips & Tricks

### Development Tips

```bash
# 1. Save time dengan npm scripts
npm run lint:fix    # Auto-fix linting issues
npm run format      # Auto-format code
npm run test        # Quick test

# 2. Hot-reload dengan dev server
npm run dev
# Edit file → Auto save → Auto reload
# Tidak perlu restart!

# 3. Incremental build
npm run build       # Full build
npm run dev         # Faster dev mode

# 4. Multi-terminal workflow
# Terminal 1: npm run dev (dev server)
# Terminal 2: git commands (version control)
# Terminal 3: adb commands (device management)
```

### Optimization Tips

```bash
# 1. Reduce export size
npm run export:sketchware -- --optimize-size=true

# 2. Fast build
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# 3. Clean before export
rm -rf dist export
npm run build
npm run export:sketchware
```

---

## 🎯 Success Criteria

Anda berhasil ketika:

✅ Clone repository tanpa error
✅ `npm install` selesai dengan 500+ packages
✅ `npm run build` menghasilkan dist/ folder
✅ `npm run export:sketchware` menghasilkan ZIP file
✅ ZIP dapat di-transfer ke device
✅ Sketchware bisa import project
✅ Project muncul di Sketchware list
✅ Bisa buka project di Sketchware
✅ Bisa edit code di Sketchware
✅ Bisa build & run di device

---

## 🚀 You're All Set!

Selamat! Anda sudah ready untuk:

- ✅ Mengembangkan game engine
- ✅ Eksperimen dengan Sketchware Pro
- ✅ Build aplikasi mobile profesional
- ✅ Explore advanced features

**Mulai development sekarang! 🎮**

---

## 📞 Support

| Issue | Solution | Resource |
|-------|----------|----------|
| Setup error | Read setup guide | DOKUMENTASI_SKETCHWARE_PRO_V7.md |
| Export/Import issue | Read export guide | PANDUAN_EXPORT_IMPORT.md |
| Runtime error | Check troubleshooting | TROUBLESHOOTING_BEST_PRACTICES.md |
| Still stuck | Post GitHub issue | https://github.com/hbowo430-sudo/Moba-Engine/issues |

---

**Last Updated: 2026-07-01**  
**Version: 1.0.0**  
**Quick Start Time: 15 minutes ⚡**

Happy Coding! 🚀
