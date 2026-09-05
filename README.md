# Heaven Furniture Mart — Digital Showroom & Landing Page

An editorial, conversion-focused luxury landing page built for **Heaven Furniture Mart** as part of the RACDOX Hackathon[cite: 1]. 

Heaven Furniture Mart is a bespoke interior and custom furniture brand based in Chattogram, Bangladesh[cite: 1]. Founded in 2020 by Managing Director Abul Kalam Bhuiyan, the brand operates on the core pitch: *"Designed. Crafted. Customized."*. Rather than functioning like a standard, crowded e-commerce catalog, this project delivers the feel of an upscale, physical design studio.

---

## Key Features

* **Scroll-Driven 3D Furniture Storytelling:** Dynamic WebGL/Canvas layer that transitions through signature interior pieces (Living, Dining, Bedroom, and Executive lines) as the user scrolls.
* **Realistic Studio Lighting & PBR Shading:** PBR-tuned materials highlighting fabric sheens, Chittagong Teak clearcoats, and soft contact floor shadows without visual distortion.
* **Readable Editorial Layout:** Glassmorphic translucent cards layered over high-contrast serif headlines to preserve typography legibility over dynamic 3D scenes.
* **Conversion Architecture:** Focused conversion points directing visitors toward quick consultations and direct WhatsApp interactions.
* **Trust Points & Heritage Milestones:** Includes showroom details, the MD quote, and milestone tracking from inception to BFIOA recognition.

---

## Tech Stack

* **Framework:** React.js / Next.js
* **Styling:** Tailwind CSS (Luxury Palette: Deep Charcoal-Teal, Warm Ivory, Muted Gold/Brass, Deep Walnut)
* **3D & Canvas:** Three.js / `@react-three/fiber` / `@react-three/drei`
* **Animation & Scroll:** GSAP (ScrollTrigger) / Framer Motion
* **Icons:** Lucide React

---
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/20e2d0c8-8bc0-4956-9483-1e10b0e13e92" />
## Project Structure

```text
├── public/              # Optimized static assets & brand media
├── src/
│   ├── components/
│   │   ├── 3d/          # Canvas, Lighting, Camera, & 3D Stage orchestration
│   │   ├── sections/    # Hero, Collections, Bespoke Studio, Heritage, CTA
│   │   └── ui/          # Buttons, Modal, Glassmorphic cards, Navbar
│   ├── hooks/           # Scroll interpolation & resize observers
│   ├── App.jsx          # Root application
│   └── main.jsx         # Entry point
├── package.json
└── README.md


