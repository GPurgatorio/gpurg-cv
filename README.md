# 🎮 Interactive 2D Pixel-Art CV — Giulio Purgatorio (`cv.gpurg.com`)

Welcome to the interactive 2D retro pixel-art RPG portfolio of **Giulio Purgatorio**, AWS Tech Lead & Cloud Solution Architect.

Instead of a static resume, visitors can walk around a custom-built 2D town, enter themed buildings (**Projects Center**, **Career Journey**, and **Contact Lounge**), talk to NPCs, and inspect real-world enterprise AWS architecture blueprints and Infrastructure-as-Code (Terraform, Python, Kubernetes) implementations.

---

## ✨ Key Features

- **Zero External Dependencies**: Built entirely with Vanilla HTML5, CSS3, and ES6+ JavaScript. Zero external frameworks, zero bundlers, and zero third-party network requests.
- **Procedural 2D Pixel-Art Engine**: Every tile, building, character sprite, and animation frame is rendered procedurally in-memory onto off-screen HTML5 `<canvas>` buffers (`assets.js`)—requiring zero external image files.
- **Interactive Architecture Deep-Dives**: Talk to NPCs or interact with the **Projects Console** to view architecture diagrams and multi-tabbed code snippets (Terraform, Python, AWS IoT SQL, Penetration Testing).
- **Autonomous NPC AI**: Includes wandering town guides, an interactive Tech Recruiter escort pathfinder (BFS grid navigation), and a dynamic chase sequence between Azzurra and Leone.
- **Responsive Desktop & Mobile Controls**: Supports keyboard (`WASD` / Arrow keys + `Space` / `Enter`) on desktop and a custom 8-way virtual touch joystick + arcade action button + landscape toggle on mobile devices.

---

## 📁 Project Structure (GitHub Pages `/docs`)

```text
animated-cv/
├── README.md             # Repository documentation (not exposed on web root)
└── docs/                 # GitHub Pages web root (https://cv.gpurg.com)
    ├── .well-known/
    │   └── security.txt  # RFC 9116 Responsible Disclosure security contact
    ├── .nojekyll         # Disables Jekyll processing so .well-known/ is served natively
    ├── CNAME             # Custom domain binding (cv.gpurg.com) for GitHub Pages
    ├── index.html        # Main application entry point, HUD overlays, CSP, and 5-pillar legal modal
    ├── styles.css        # Retro console styling, glassmorphic modals, and responsive touch layouts
    ├── assets.js         # Procedural 16x16 tile & 16x24 character sprite matrix renderer
    ├── data.js           # Dialogue scripts, career milestones, and architecture blueprint tabs
    ├── game.js           # 60 FPS game loop, AABB collision detection, BFS pathfinding, and UI state
    ├── 404.html          # Custom retro-themed 404 error page
    └── robots.txt        # RFC 9309 crawler directives (Disallow: /)
```

---

## 🛡️ Governance, Privacy & Legal Compliance (`gpurg.com` 5-Pillar Standard)

1. **Privacy & Edge Logs (GDPR Art. 13 & Art. 6(1)(f))**: Static client-side application with zero application-level personal data collection or profiling. Transient edge logs (IP, User-Agent, timestamp) are processed by GitHub Pages / Fastly CDN strictly for network security and DDoS mitigation under legitimate interest. Contact: `info@gpurg.com`.
2. **Zero Cookies & Zero Client Storage (ePrivacy Art. 5(3))**: Zero cookies (`document.cookie`) and zero web storage (`localStorage`, `sessionStorage`, `IndexedDB`), exempting the site from cookie consent banners.
3. **Zero Third-Party Requests (Browser-Enforced CSP)**: Enforced via `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; ...">` and `<meta name="referrer" content="no-referrer">`.
4. **Non-Affiliation, Nominative Fair Use & Open-Source Credits**: Independent personal initiative not affiliated with or endorsed by any past or present employer, client, academic institution, or technology vendor. Trademarks and organization names (including AWS, Amazon Web Services, HashiCorp Terraform, Kubernetes, LinkedIn, and GitHub) belong to their respective owners and are used strictly under Nominative Fair Use. Inline UI icons are used under permissive open-source licenses from **Lucide / Feather Icons** (`ISC` / `MIT` License) and **Google Material Symbols** (`Apache-2.0` License).
5. **No Warranty & Limitation of Liability (`"AS IS"`)**: Provided strictly `"AS IS"` for informational and portfolio purposes without warranty or liability.
