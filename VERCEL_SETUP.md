# Vercel Deployment Setup untuk DATAVA

## Masalah Saat Ini
URL deployment menampilkan halaman login Vercel, bukan aplikasi DATAVA.

## Root Cause
Vercel project tidak dikonfigurasi dengan benar untuk monorepo structure.

## Solusi: Update Vercel Project Settings

### 1. Pergi ke Vercel Dashboard
- Buka: https://vercel.com/dashboard
- Pilih project DATAVA

### 2. Project Settings → General
Update konfigurasi berikut:

**Root Directory:**
```
apps/web
```
☑️ Include source files outside of the Root Directory in the Build Step

**Framework Preset:**
```
Next.js
```

**Build Command:**
```
pnpm build
```

**Install Command:**
```
pnpm install
```

**Output Directory:**
```
.next
```
(Biarkan default, jangan diubah)

### 3. Environment Variables
Tambahkan environment variables di Settings → Environment Variables:

```env
NEXT_PUBLIC_PACKAGE_ID=0x986febba40134633f8e3ba7b79fff66792e868274516f03c5d6b75da169091bd
NEXT_PUBLIC_POOL_ID=0x8679e33657185a5c97daac9f5b8e93cf4c00182ee91d1318a1e5851f61033c2b
NEXT_PUBLIC_WALRUS_RELAY=https://your-walrus-relay-url.com
NEXT_PUBLIC_INFERENCE_URL=https://your-inference-api-url.com
```

**⚠️ PENTING:** Update URL untuk production (jangan gunakan localhost)

### 4. Redeploy
Setelah update settings:
- Klik tab "Deployments"
- Pilih deployment terbaru
- Klik "..." → "Redeploy"
- Centang "Use existing Build Cache" jika ingin lebih cepat
- Klik "Redeploy"

## Alternative: Deploy via Vercel CLI

Jika masih bermasalah, gunakan Vercel CLI:

```bash
# Install Vercel CLI (jika belum)
pnpm add -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy
vercel --prod
```

Saat setup, jawab:
- **Set up and deploy?** Y
- **Which scope?** (Pilih account Anda)
- **Link to existing project?** Y
- **Project name?** DATAVA
- **Directory?** apps/web

## Verifikasi Deployment Berhasil

Setelah redeploy, cek:
1. URL utama: `https://datava-[hash].vercel.app/`
2. Dashboard: `https://datava-[hash].vercel.app/dashboard`

Jika masih menampilkan login page, berarti:
- Root directory belum di-set ke `apps/web`
- Atau project masih dalam mode "Private" (perlu permission)
