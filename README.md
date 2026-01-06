# Law-gically Yours ⚖️

<div align="center">

![Law-gically Yours](https://img.shields.io/badge/Law--gically_Yours-1a365d?style=for-the-badge&logo=scale&logoColor=gold)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

**A modern legal insights blog platform built with React, Vite, and Supabase**

[Live Demo](https://law-veritas.netlify.app) · [Report Bug](https://github.com/ratna3/Law-Veritas/issues) · [Request Feature](https://github.com/ratna3/Law-Veritas/issues)

</div>

---

## 📖 About

Law-gically Yours is a professional legal blog platform designed to share legal insights, case analyses, and constitutional law articles. Built with modern web technologies, it features:

- 🎨 **Beautiful UI** - Clean, professional design with elegant typography
- ✍️ **Rich Markdown Support** - Full markdown rendering with GitHub Flavored Markdown (GFM)
- 🔒 **Admin Dashboard** - Secure content management system
- 💬 **Engagement Features** - Comments, likes, and social sharing
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎭 **3D Animations** - Interactive Three.js elements on the homepage

## 🚀 Features

### Blog Features
- **Markdown Rendering** - Supports headings, bold, italic, links, lists, blockquotes, code blocks, and tables
- **Image Gallery** - Upload and display multiple images per article
- **PDF Attachments** - Embed and view PDF documents
- **Social Sharing** - Share articles on social media platforms
- **Like & Comment System** - User engagement with real-time updates

### Admin Features
- **Blog Editor** - Create and edit articles with live preview
- **Media Upload** - Upload images and PDFs to Supabase storage
- **Draft/Publish** - Control article visibility
- **Tag Management** - Organize content with tags

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev) | UI Framework |
| [Vite](https://vitejs.dev) | Build Tool |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [Supabase](https://supabase.com) | Backend & Database |
| [React Router](https://reactrouter.com) | Routing |
| [Zustand](https://zustand-demo.pmnd.rs) | State Management |
| [React Markdown](https://github.com/remarkjs/react-markdown) | Markdown Rendering |
| [Three.js](https://threejs.org) | 3D Graphics |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | Three.js React Bindings |

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ratna3/Law-Veritas.git
   cd Law-Veritas/my-right-window
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
my-right-window/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── 3d/         # Three.js components
│   │   ├── blog/       # Blog-related components
│   │   ├── common/     # Common UI components
│   │   └── layout/     # Layout components
│   ├── pages/          # Page components
│   │   └── Admin/      # Admin dashboard pages
│   ├── services/       # API services
│   ├── store/          # Zustand store
│   └── data/           # Mock data
├── supabase/           # Database migrations
└── package.json
```

## 📝 Markdown Support

The blog supports full GitHub Flavored Markdown (GFM):

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

[Links](https://example.com)

- Bullet lists
- [x] Task lists

> Blockquotes

| Tables | Support |
|--------|---------|
| Yes    | ✓       |

`inline code` and code blocks
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

<div align="center">

**Ratna Kirti**

[![Email](https://img.shields.io/badge/Email-ratnakirtiscr%40gmail.com-red?style=for-the-badge&logo=gmail)](mailto:ratnakirtiscr@gmail.com)
[![Discord](https://img.shields.io/badge/Discord-Ratna%20For%20Nerds-5865F2?style=for-the-badge&logo=discord)](https://discord.gg/zUWK77Yn)
[![GitHub](https://img.shields.io/badge/GitHub-%40ratna3-181717?style=for-the-badge&logo=github)](https://github.com/ratna3)
[![Twitter](https://img.shields.io/badge/X-%40RatnaKirti1-000000?style=for-the-badge&logo=x)](https://x.com/RatnaKirti1)

</div>

---

<div align="center">

Made with ❤️ by [Ratna Kirti](https://github.com/ratna3)

⭐ Star this repo if you find it helpful!

</div>
