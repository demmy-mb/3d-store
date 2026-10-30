# 3D Store & Art Experience

An interactive 3D web experience combining minimalist digital fashion showroom curation and a circular architectural graffiti museum rotunda.

Built with **React**, **Vite**, **Three.js**, and modern shader/physics math.

---

## 🌟 Experiences

### 1. Atelier Éthos (Showroom)
- **Dynamic 8-Bone Cloth Rig**: Procedural skeletal hierarchy with spring-damping physics, rack sliding inertia, and realistic hang drape.
- **Interactive Sliding Rail**: Scandinavian minimalist steel clothing rail with 6 curated colorways.
- **Fabric Detail Mode**: Smooth camera transition to inspect micro-knit woven cotton textures.
- **Hover Micro-Dock**: Adaptive UI dock for color switching and garment inspection.

### 2. Rude Boys (Museum Gallery)
- **Circular Rotunda Architecture**: Smooth 128-segment circular gallery with bright museum-white walls and polished terrazzo floor.
- **Natural Skylights (Skyholes)**: Central architectural Oculus casting natural sunlight shafts and dynamic floor sun pools, plus satellite ceiling skyholes.
- **Brutalist Metal-Pop Canvases**: 8 radial street graffiti artworks created with procedural canvas textures and dedicated spotlighting.
- **Split Artwork Inspector**: Seamless viewport-offset camera math that frames clicked artwork on the right third of the display while an editorial glassmorphism catalog slides in on the left.

### 3. Portal Landing Page
- Dual-split aesthetic selection screen with smooth interactive previews and editorial typography.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **3D Engine**: Three.js (r187)
- **Physics**: Procedural Verlet/Euler spring-mass cloth simulation
- **Styling**: Modern CSS with glassmorphism, responsive viewports, and custom typography (`Syne`, `Plus Jakarta Sans`)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/demmy-mb/3d-store.git

# Navigate into directory
cd 3d-store

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📄 License
MIT
