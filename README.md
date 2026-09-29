<div align="center">

# 🌿 GreenCart

### *Farm-direct produce from the Konkan coast to your door*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/Prem759-0/curd-ecomm/pulls)
[![GitHub Stars](https://img.shields.io/github/stars/Prem759-0/curd-ecomm?style=flat-square&color=yellow)](https://github.com/Prem759-0/curd-ecomm/stargazers)

---

> 🥭 **Mangoes** · 🌿 **Herbs** · 🥥 **Coconuts** · 🌶️ **Kokum** · 🍋 **Turmeric**
> 
> *Zero middlemen. Fair prices. Picked this week.*

---

</div>

## 📸 Preview

| 🏠 Home — Hero & Stats | 🛍️ Shop — Product Grid |
|:---:|:---:|
| Animated hero banner with floating badges | Dark-theme grid with hover overlays |

| 📦 Product Page — Image Gallery | 📝 Add Product — Drag & Drop |
|:---:|:---:|
| Prev/next arrows · thumbnails · dot indicators | 5-image upload with progress bar & reorder |

---

## ✨ Feature Highlights

### 🎨 Design & Animations
| Feature | Detail |
|---|---|
| 🌑 **Dark premium theme** | Deep `#080e12` base with glassmorphism cards |
| 🔤 **Custom fonts** | *Playfair Display* (hero) + *Space Grotesk* (body) |
| 🌊 **Ambient orbs** | Floating radial gradient blobs behind every page |
| ⚡ **Scroll reveal** | Sections animate up as you scroll into view |
| 🔄 **Page loader** | Spinning ring fades out after content loads |
| 💀 **Skeleton loader** | Shimmer cards while products are fetching |
| 🏷️ **Ticker banner** | Infinite-scroll produce announcements |
| 🦸 **Hero text rise** | Words slide up on load with staggered delay |
| 🎯 **Gradient text** | Hero accent animates green → lime → amber |

### 🛒 E-commerce
| Feature | Detail |
|---|---|
| 🛒 **Cart sidebar** | Slides in from right with item list, qty controls, total |
| ❤️ **Wishlist** | Toggle hearts on any product, persists per session |
| ⭐ **Quick add** | "Add to cart" button appears on tile hover |
| 🔢 **Qty selector** | +/− controls on product detail page |
| 🖼️ **Multi-image** | Up to **5 images** per product with drag-to-reorder |
| 🖱️ **Drag & drop** | Drop zone with animated progress bar |
| 📸 **Image gallery** | Prev/next arrows, thumbnail strip, dot indicators |
| 📋 **Live preview** | See product card update as you type in the form |

### 🔐 Auth & Security
| Feature | Detail |
|---|---|
| 🔑 **JWT Auth** | Short-lived access tokens (15 min) + refresh tokens (7 days) |
| 🍪 **HttpOnly cookies** | Refresh tokens stored securely, never in JS |
| 👤 **Protected routes** | Add/edit products only when signed in |
| 🛡️ **Ownership check** | Edit/delete only your own listings |
| ✅ **Input validation** | Server-side validation on all routes (express-validator) |

---

## 🗂️ Project Structure

```
greencart/
│
├── 📁 client/                     # React + Vite frontend
│   ├── 📁 public/
│   │   └── 📁 products/           # SVG produce illustrations
│   │       ├── mango.svg
│   │       ├── drumstick.svg
│   │       ├── kokum.svg
│   │       └── ...
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 🧭 Navbar.jsx      # Sticky nav with cart badge
│   │   │   ├── 🛒 CartSidebar.jsx # Slide-in cart drawer
│   │   │   ├── 🃏 ProductTile.jsx  # Card with wishlist & quick-add
│   │   │   ├── ✏️  Field.jsx       # Reusable form field
│   │   │   ├── 🍊 Hero3D.jsx      # Three.js 3D fruit scene
│   │   │   └── ⚙️  OwnerActions.jsx
│   │   ├── 📁 pages/
│   │   │   ├── 🏠 Home.jsx        # Landing page (8 sections)
│   │   │   ├── 🛍️  Shop.jsx        # Product grid with search/filter
│   │   │   ├── 📦 ProductPage.jsx # Detail page with image gallery
│   │   │   ├── 📝 ProductForm.jsx # Add/edit with drag-drop images
│   │   │   └── 🔐 Auth.jsx        # Login / Register
│   │   ├── 🎨 styles.css          # All design tokens & components
│   │   ├── 🔗 api.js              # Axios instance + token refresh
│   │   ├── 🔑 AuthContext.jsx     # Auth + Cart + Wishlist state
│   │   └── ⚛️  main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── 📁 server/                     # Express + MongoDB API
│   ├── 📁 src/
│   │   ├── 📁 controllers/
│   │   │   ├── 🔐 auth.js         # Register, login, logout, refresh, me
│   │   │   └── 📦 product.js      # CRUD for products
│   │   ├── 📁 middleware/
│   │   │   ├── 🛡️  authenticate.js # JWT verification middleware
│   │   │   └── ✅ validate.js     # express-validator error handler
│   │   ├── 📁 models/
│   │   │   ├── 👤 User.js         # name, email, passwordHash
│   │   │   └── 📦 Product.js      # name, price, stock, images[], ...
│   │   ├── 📁 routes/
│   │   │   ├── 🔐 auth.js
│   │   │   └── 📦 product.js
│   │   ├── ✅ validators.js       # All validation rule sets
│   │   ├── 🌱 seed.js             # Demo data seeder
│   │   └── 🚀 index.js            # Express app entry
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── 📄 README.md
```

---

## 🔄 Application Flow

### 🔐 Authentication Flow

```mermaid
flowchart TD
    A([👤 User visits site]) --> B{Has valid\naccess token?}
    B -->|✅ Yes| C([🏠 Load app normally])
    B -->|❌ No| D{Has refresh\ncookie?}
    D -->|✅ Yes| E[🔄 POST /auth/refresh]
    E --> F{Token valid?}
    F -->|✅ Yes| G[💾 Store new access token]
    G --> C
    F -->|❌ Expired| H([🔐 Redirect to /login])
    D -->|❌ No cookie| H
    H --> I[📝 User fills login form]
    I --> J[📤 POST /auth/login]
    J --> K{Credentials\nvalid?}
    K -->|✅ Yes| L[🍪 Set refresh cookie\n💾 Return access token]
    L --> C
    K -->|❌ No| M([🚨 Show error message])
    M --> I

    style A fill:#22c55e,color:#000
    style C fill:#22c55e,color:#000
    style H fill:#f43f5e,color:#fff
    style M fill:#f43f5e,color:#fff
    style L fill:#4ade80,color:#000
```

---

### 🛒 Shopping Flow

```mermaid
flowchart LR
    A([🏠 Home Page]) -->|Browse produce| B([🛍️ Shop Page])
    B -->|Search / filter| B
    B -->|Click product| C([📦 Product Detail])
    C -->|🖼️ Browse gallery| C
    C -->|+ Add to Cart| D([🛒 Cart Sidebar opens])
    D -->|Change qty| D
    D -->|Remove item| D
    D -->|Continue shopping| B
    D -->|Checkout →| E([💳 Checkout])

    A -->|❤️ Wishlist heart| F([💗 Wishlist])
    C -->|❤️ Wishlist heart| F
    F -->|View wishlisted items| B

    style A fill:#0d1a14,color:#4ade80,stroke:#22c55e
    style B fill:#0d1a14,color:#4ade80,stroke:#22c55e
    style C fill:#0d1a14,color:#4ade80,stroke:#22c55e
    style D fill:#16a34a,color:#fff,stroke:#22c55e
    style E fill:#22c55e,color:#000,stroke:#4ade80
    style F fill:#f43f5e,color:#fff,stroke:#be123c
```

---

### 📦 Product Listing Flow (Seller)

```mermaid
flowchart TD
    A([🌱 Grower signs up]) --> B[/Fill name · email · password/]
    B --> C{Validation\npassed?}
    C -->|❌ Errors| B
    C -->|✅ OK| D([🔑 Logged in])
    D --> E([📝 Add Product form])
    E --> F{Upload method?}
    F -->|📤 Drag & Drop| G[Drop up to 5 images\nAnimated progress bar\nDrag to reorder]
    F -->|🖼️ Preset SVGs| H[Pick from\n8 produce illustrations]
    F -->|🔗 Paste URL| I[Add image URLs\none at a time]
    G --> J[/Fill name · price · stock · category/]
    H --> J
    I --> J
    J --> K{Server\nvalidation?}
    K -->|❌ Field error| L[🚨 Show field errors]
    L --> J
    K -->|✅ Valid| M[💾 Save to MongoDB]
    M --> N([🛍️ Product live in Shop])
    N --> O{Need to edit?}
    O -->|✏️ Edit| E
    O -->|🗑️ Delete| P([❌ Product removed])

    style A fill:#22c55e,color:#000
    style D fill:#22c55e,color:#000
    style N fill:#4ade80,color:#000
    style L fill:#f43f5e,color:#fff
    style P fill:#f43f5e,color:#fff
    style M fill:#16a34a,color:#fff
```

---

### 🏗️ System Architecture

```mermaid
graph TB
    subgraph CLIENT ["🖥️ Client — Vite + React (port 5173)"]
        direction TB
        NAV[🧭 Navbar]
        HOME[🏠 Home]
        SHOP[🛍️ Shop]
        DETAIL[📦 ProductPage]
        FORM[📝 ProductForm]
        AUTH_PAGE[🔐 Auth]
        CART_CTX[🛒 CartContext]
        AUTH_CTX[🔑 AuthContext]
        AXIOS[🔗 Axios + Auto-refresh]
    end

    subgraph SERVER ["⚙️ Server — Express (port 4000)"]
        direction TB
        AUTH_ROUTE[🔐 /api/auth]
        PROD_ROUTE[📦 /api/products]
        MIDDLEWARE[🛡️ JWT Middleware]
        VALIDATOR[✅ Validators]
        CONTROLLERS[📋 Controllers]
    end

    subgraph DB ["🍃 MongoDB Atlas"]
        USERS[(👤 Users)]
        PRODUCTS[(📦 Products)]
    end

    CLIENT -->|HTTP + Bearer token| SERVER
    SERVER --> DB
    AUTH_CTX --> AXIOS
    CART_CTX --> SHOP
    CART_CTX --> DETAIL
    AXIOS --> AUTH_ROUTE
    AXIOS --> PROD_ROUTE
    AUTH_ROUTE --> MIDDLEWARE
    PROD_ROUTE --> MIDDLEWARE
    MIDDLEWARE --> VALIDATOR
    VALIDATOR --> CONTROLLERS
    CONTROLLERS --> USERS
    CONTROLLERS --> PRODUCTS

    style CLIENT fill:#0d1a14,color:#4ade80,stroke:#22c55e,stroke-width:2px
    style SERVER fill:#080e12,color:#60a5fa,stroke:#3b82f6,stroke-width:2px
    style DB fill:#1a1200,color:#fbbf24,stroke:#d97706,stroke-width:2px
```

---

### 🔑 JWT Token Lifecycle

```mermaid
sequenceDiagram
    actor U as 👤 User
    participant C as 🖥️ Client
    participant S as ⚙️ Server
    participant DB as 🍃 MongoDB

    U->>C: Login (email + password)
    C->>S: POST /auth/login
    S->>DB: Find user, verify password
    DB-->>S: ✅ User found
    S-->>C: accessToken (15min) + 🍪 refreshToken cookie (7d)
    C->>C: Store accessToken in memory

    Note over C,S: Every API request

    C->>S: GET /api/products (Bearer accessToken)
    S->>S: Verify token ✅
    S-->>C: 200 OK + data

    Note over C,S: When accessToken expires

    C->>S: POST /auth/refresh (cookie auto-sent)
    S->>S: Verify refresh token ✅
    S-->>C: New accessToken (15min)
    C->>C: Retry original request

    Note over C,S: Logout

    U->>C: Click Sign out
    C->>S: POST /auth/logout
    S->>S: Clear refresh cookie
    C->>C: Clear accessToken from memory
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:---:|:---:|:---|
| ⚛️ | **React 18** | UI components & routing |
| ⚡ | **Vite 5** | Dev server & bundler |
| 🎨 | **Vanilla CSS** | All styling (no Tailwind) |
| 🔤 | **Playfair Display** | Hero display font |
| 🔤 | **Space Grotesk** | Body & UI font |
| 🍊 | **Three.js** | 3D fruit in hero scene |
| 🔗 | **Axios** | HTTP client with interceptors |
| 🧭 | **React Router v6** | Client-side routing |
| ⚙️ | **Express 4** | REST API server |
| 🍃 | **Mongoose** | MongoDB ODM |
| 🔐 | **jsonwebtoken** | JWT generation & verification |
| 🔒 | **bcryptjs** | Password hashing |
| ✅ | **express-validator** | Server-side validation |
| 🌱 | **MongoDB Atlas** | Cloud database |

</div>

---

## 🚀 Getting Started

### 📋 Prerequisites

```
✅ Node.js 18+
✅ npm 9+
✅ MongoDB Atlas account (free tier works great)
```

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Prem759-0/curd-ecomm.git
cd curd-ecomm
```

### 2️⃣ Set up the Server

```bash
cd server
npm install
```

Create your `.env` file (copy from example):

```bash
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/greencart
ACCESS_TOKEN_SECRET=<generate a long random string>
REFRESH_TOKEN_SECRET=<generate a different long random string>
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES_DAYS=7
CLIENT_URL=http://localhost:5173
SEED_PASSWORD=demopassword123
```

Start the server:

```bash
npm run dev        # 🚀 http://localhost:4000
```

Optionally seed demo data:

```bash
npm run seed       # 🌱 Creates demo products & users
```

### 3️⃣ Set up the Client

```bash
cd ../client
npm install
npm run dev        # ⚡ http://localhost:5173
```

### ✅ You're live!

| URL | What you'll see |
|---|---|
| `http://localhost:5173` | 🏠 Home page with hero, stats, testimonials |
| `http://localhost:5173/shop` | 🛍️ Browse all products |
| `http://localhost:5173/register` | 📝 Create a grower account |
| `http://localhost:5173/login` | 🔐 Sign in |
| `http://localhost:5173/products/new` | ➕ Add a product (must be logged in) |

---

## 🌐 API Reference

### 🔐 Auth Endpoints

| Method | Route | Auth | Description |
|:---:|---|:---:|---|
| `POST` | `/api/auth/register` | ❌ | Create account |
| `POST` | `/api/auth/login` | ❌ | Login → returns accessToken |
| `POST` | `/api/auth/logout` | ❌ | Clears refresh cookie |
| `POST` | `/api/auth/refresh` | 🍪 Cookie | Get new access token |
| `GET` | `/api/auth/me` | 🔑 Bearer | Get current user |

### 📦 Product Endpoints

| Method | Route | Auth | Description |
|:---:|---|:---:|---|
| `GET` | `/api/products` | ❌ | List products (paginated, searchable) |
| `GET` | `/api/products/:id` | ❌ | Get single product |
| `POST` | `/api/products` | 🔑 Bearer | Create product |
| `PUT` | `/api/products/:id` | 🔑 Bearer | Update product (owner only) |
| `DELETE` | `/api/products/:id` | 🔑 Bearer | Delete product (owner only) |

### 🔍 Query Parameters — `GET /api/products`

```
?page=1          📄 Page number (default: 1)
?limit=12        📏 Items per page (max 50)
?search=mango    🔍 Search by product name
?category=Fruits 📂 Filter by category
```

### 📦 Product Schema

```json
{
  "name":        "Alphonso Mangoes",
  "description": "Fresh from Ratnagiri, zero pesticides",
  "price":       280,
  "stock":       50,
  "category":    "Fruits",
  "image":       "https://... (legacy single image)",
  "images":      ["https://...", "https://...", "..."],
  "createdBy":   "<userId>"
}
```

---

## 🎨 Design System

### 🎨 Color Palette

| Token | Value | Usage |
|:---:|---|---|
| `--bg` | `#080e12` | Page background |
| `--bg2` | `#0d1a14` | Section backgrounds |
| `--green` | `#22c55e` | Primary accent |
| `--lime` | `#a3e635` | Gradient end |
| `--amber` | `#fbbf24` | Highlights, ratings |
| `--rose` | `#f43f5e` | Danger, wishlist active |
| `--ink` | `#f0fdf4` | Primary text |
| `--ink-muted` | `rgba(240,253,244,0.55)` | Secondary text |

### 🔤 Typography

| Font | Weight | Used for |
|---|---|---|
| **Playfair Display** | 700–900, italic | Hero headlines |
| **Plus Jakarta Sans** | 700–900 | Section headings, h2–h4 |
| **Space Grotesk** | 300–700 | Body text, buttons, nav |

### ✨ Animation Catalogue

| Name | Duration | Effect |
|---|---|---|
| `rise` | 0.9s | Text lines slide up on load |
| `fade` | 0.8s | Opacity fade-in |
| `gradient-shift` | 4s∞ | Background position loop |
| `orb-drift` | 12s∞ | Ambient orbs float |
| `float-badge` | 4s∞ | Hero badges bob up/down |
| `shimmer` | 1.6s∞ | Skeleton loader shimmer |
| `spin` | 0.9s∞ | Page loader & button spinner |
| `pop` | 0.3s | Cart badge scale-in |
| `pulse-ring` | 3s∞ | Ring around 3D hero |
| `ticker` | 25s∞ | Horizontal news scroll |
| `drop-pulse` | 0.5s∞ | Drop zone border glow on drag |
| `loader-out` | 0.4s→ | Page loader fades out |

---

## 📄 Pages Overview

### 🏠 Home — 8 sections
```
┌─────────────────────────────────────┐
│  🌿 HERO — Animated headline        │
│     Floating product badges          │
│     3D fruit scene (Three.js)        │
├─────────────────────────────────────┤
│  📊 STATS BAR                        │
│     1,200+ Growers · 35K+ Customers  │
├─────────────────────────────────────┤
│  📢 TICKER — Scrolling produce news  │
├─────────────────────────────────────┤
│  🚚 FEATURES BANNER — 4 columns      │
│     Delivery · Quality · No fees     │
├─────────────────────────────────────┤
│  📂 CATEGORY STRIP — Emoji cards     │
│     Fruits · Vegetables · Herbs      │
├─────────────────────────────────────┤
│  🛍️ FEATURED PRODUCTS — Grid         │
├─────────────────────────────────────┤
│  💬 TESTIMONIALS — 3 review cards    │
├─────────────────────────────────────┤
│  📧 NEWSLETTER — Email signup        │
└─────────────────────────────────────┘
```

---

## 🤝 Contributing

```bash
# 1. Fork & clone
git clone https://github.com/YOUR-USERNAME/curd-ecomm.git

# 2. Create a feature branch
git checkout -b feat/amazing-feature

# 3. Make your changes & commit
git add -A
git commit -m "feat: add amazing feature"

# 4. Push & open a PR
git push origin feat/amazing-feature
```

---

## 📜 License

```
MIT License — feel free to use, modify, and distribute.
```

---

<div align="center">

### 🌿 Built with love for growers along the Konkan coast

**Made in India** 🇮🇳

[![GitHub](https://img.shields.io/badge/GitHub-Prem759--0-181717?style=for-the-badge&logo=github)](https://github.com/Prem759-0/curd-ecomm)

*If this project helped you, give it a ⭐ on GitHub!*

*Prem759-0*

</div>
