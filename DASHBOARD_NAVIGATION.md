# Dashboard Navigation - DATAVA

## 🎯 Unified Dashboard Layout

Semua halaman dashboard sekarang menggunakan layout yang sama dengan navigasi sidebar yang persistent.

## 📱 Features

### Desktop View
- **Sidebar tetap (fixed)** di sisi kiri
- Lebar sidebar: 256px (w-64)
- Menu navigasi selalu terlihat
- Active state highlighting dengan neon effect

### Mobile View
- **Hamburger menu** button di top bar
- Sidebar slide-in dari kiri
- Backdrop overlay saat sidebar terbuka
- Auto-close saat memilih menu item

## 🗂️ Menu Navigasi

1. **Dashboard** (`/dashboard`)
   - Main dashboard dengan overview
   - File upload & AI inference testing

2. **Marketplace** (`/dashboard/marketplace`)
   - Browse available datasets
   - Purchase data untuk AI training

3. **Upload Dataset** (`/dashboard/upload`)
   - Upload datasets ke Walrus storage
   - Register datasets on-chain

4. **AI Inference** (`/dashboard/inference`)
   - Run AI inference dengan datasets
   - Test model performance

5. **My Datasets** (`/dashboard/my-datasets`)
   - Manage uploaded datasets
   - View dataset statistics

6. **Rewards** (`/dashboard/rewards`)
   - Track earnings dari data contribution
   - View reward history

## 🎨 Design System

### Colors
- Sidebar background: `bg-sidebar`
- Sidebar border: `border-sidebar-border`
- Active item: `bg-sidebar-accent` + `neon-text`
- Text: `text-sidebar-foreground`

### Transitions
- Smooth hover effects (200ms)
- Mobile sidebar slide animation (300ms)
- Icon + label layout untuk clarity

## 📂 File Structure

```
apps/web/
├── app/
│   └── dashboard/
│       ├── layout.tsx          # Main dashboard layout
│       ├── page.tsx            # Dashboard home
│       ├── marketplace/
│       ├── upload/
│       ├── inference/
│       ├── my-datasets/
│       └── rewards/
└── src/
    └── components/
        ├── Sidebar.tsx         # Desktop sidebar
        ├── MobileSidebar.tsx   # Mobile sidebar
        └── DashboardHeader.tsx # Top bar header
```

## 🚀 Benefits

1. **Konsistensi**: Semua halaman dashboard punya look & feel yang sama
2. **Easy Navigation**: Satu klik ke halaman manapun
3. **Responsive**: Works perfectly di mobile & desktop
4. **User Experience**: Clear visual feedback untuk active page
5. **Maintainable**: Centralized layout logic

## 💡 Usage

Tidak perlu konfigurasi tambahan! Semua halaman di dalam `app/dashboard/` otomatis menggunakan layout ini.

Untuk menambah menu baru:
1. Buat folder baru di `app/dashboard/[nama-menu]/`
2. Tambahkan route di `menuItems` array di `Sidebar.tsx` dan `MobileSidebar.tsx`
3. Done! Menu baru langsung muncul di sidebar.
