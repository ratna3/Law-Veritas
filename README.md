# Law-gically Yours ⚖️

<div align="center">

![Law-gically Yours](https://img.shields.io/badge/Law--gically_Yours-1a365d?style=for-the-badge&logo=scale&logoColor=gold)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)

### 🌐 A Modern Legal Insights Blog Platform

*Built with React, Vite, and Supabase — Empowering legal knowledge sharing*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-lawgicallyours.vercel.app-00C7B7?style=for-the-badge)](https://lawgicallyours.vercel.app)

[📖 Documentation](#-installation) · [🐛 Report Bug](https://github.com/ratna3/Law-Veritas/issues) · [✨ Request Feature](https://github.com/ratna3/Law-Veritas/issues)

</div>

---

## ✨ What is Law-gically Yours?

**Law-gically Yours** is a professional legal blog platform designed to share legal insights, case analyses, and constitutional law articles. Whether you're a law student, legal professional, or someone curious about the law, this platform makes legal knowledge accessible and engaging.

### 🎯 Key Highlights

| Feature | Description |
|---------|-------------|
| 🎨 **Premium Design** | Clean, professional UI with elegant amber & warm color palette |
| ✍️ **Rich Content** | Full GitHub Flavored Markdown support with syntax highlighting |
| 🔐 **Secure Admin** | Protected dashboard for content management |
| 💬 **User Engagement** | Real-time comments, likes with Google OAuth authentication |
| 📱 **Fully Responsive** | Seamless experience across all devices |
| 🎭 **Interactive 3D** | Beautiful Three.js animations on the homepage |
| ⚡ **Lightning Fast** | Optimized performance with Vite and lazy loading |

---

## 🚀 Features

### 📝 Blog Features
- **Markdown Rendering** — Headings, bold, italic, links, lists, blockquotes, code blocks, and tables
- **Image Gallery** — Upload and display multiple images per article
- **PDF Attachments** — Embed and view PDF documents inline
- **Social Sharing** — Share articles on Twitter, LinkedIn, and more
- **Like & Comment System** — Real-time user engagement with Supabase Realtime

### 🔧 Admin Features
- **Blog Editor** — Create and edit articles with live markdown preview
- **Media Upload** — Drag & drop images and PDFs to Supabase storage
- **Draft/Publish** — Control article visibility and featured status
- **Tag Management** — Organize content with custom tags
- **Password Protection** — Secure admin access with bcrypt hashing

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose | Version |
|:----------:|:-------:|:-------:|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="30"/> | UI Framework | 18.3+ |
| <img src="https://vitejs.dev/logo.svg" width="30"/> | Build Tool | 5.4+ |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="30"/> | Styling | 4.1 |
| <img src="https://www.vectorlogo.zone/logos/supaaborase/supabase-icon.svg" width="30"/> | Backend & DB | Latest |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" width="30"/> | 3D Graphics | Latest |

</div>

**Additional Technologies:**
- **React Router** — Client-side routing
- **Zustand** — Lightweight state management
- **React Markdown** — GFM rendering with remark/rehype plugins
- **React Three Fiber** — Declarative Three.js bindings

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/ratna3/Law-Veritas.git

# Navigate to project directory
cd Law-Veritas/my-right-window

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 📁 Project Structure

```
my-right-window/
├── 📁 public/              # Static assets & favicon
├── 📁 src/
│   ├── 📁 components/      # Reusable UI components
│   │   ├── 📁 3d/          # Three.js 3D components
│   │   ├── 📁 blog/        # Blog-specific components
│   │   ├── 📁 common/      # Shared UI elements
│   │   └── 📁 layout/      # Layout wrappers
│   ├── 📁 pages/           # Route page components
│   │   └── 📁 Admin/       # Admin dashboard pages
│   ├── 📁 services/        # Supabase API services
│   ├── 📁 store/           # Zustand state management
│   └── 📁 data/            # Demo/mock blog data
├── 📁 supabase/            # Database migrations
├── 📄 package.json
└── 📄 vite.config.js
```

---

## 🗄️ Database Schema

The platform uses Supabase with the following tables:

| Table | Description |
|-------|-------------|
| `blogs` | Blog posts with title, content, slug, images, tags |
| `user_profiles` | User information linked to Supabase Auth |
| `likes` | Blog like tracking (user_id, blog_id) |
| `comments` | Threaded comments with parent_id support |

**Storage Buckets:** `images`, `pdfs`

---

## 📝 Markdown Support

Full GitHub Flavored Markdown (GFM) support:

```markdown
# Heading 1
## Heading 2

**Bold text** and *italic text*

[Links](https://example.com)

- Bullet lists
- [x] Task lists

> Blockquotes for legal citations

| Case Name | Year | Ruling |
|-----------|------|--------|
| Example v. State | 2024 | ✓ |

`inline code` and fenced code blocks
```

---

## 🚀 Deployment

The project is deployed on **Vercel** with automatic deployments from the main branch.

**Live URL:** [https://lawgicallyours.vercel.app](https://lawgicallyours.vercel.app)

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ratna3/Law-Veritas)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

<div align="center">

### **Ratna Kirti**

[![Website](https://img.shields.io/badge/🌐_Website-lawgicallyours.vercel.app-00C7B7?style=for-the-badge)](https://lawgicallyours.vercel.app)

[![Email](https://img.shields.io/badge/Email-ratnakirtiscr%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ratnakirtiscr@gmail.com)
[![Discord](https://img.shields.io/badge/Discord-Ratna%20For%20Nerds-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/n2Zrr4c5NU)
[![GitHub](https://img.shields.io/badge/GitHub-%40ratna3-181717?style=for-the-badge&logo=github)](https://github.com/ratna3)
[![Twitter](https://img.shields.io/badge/X-%40RatnaKirti1-000000?style=for-the-badge&logo=x)](https://x.com/RatnaKirti1)

</div>

---

<div align="center">

### 💖 Support the Project

If you find **Law-gically Yours** helpful, please consider:

⭐ **Starring** this repository  
🐛 **Reporting** bugs and issues  
💡 **Suggesting** new features  
🔀 **Contributing** code improvements  

---

**Made with ❤️ and ⚖️ by [Ratna Kirti](https://github.com/ratna3)**

*"Justice is the constant and perpetual will to render to everyone that which is their due."*

</div>
