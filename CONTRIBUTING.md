# Contributing to Law-gically Yours

First off, thank you for considering contributing to Law-gically Yours! 🎉

It's people like you that make Law-gically Yours such a great platform for legal insights.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [Git](https://git-scm.com/)

### Fork the Repository

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/Law-Veritas.git
cd Law-Veritas/my-right-window
```

3. Add the original repository as an upstream remote:

```bash
git remote add upstream https://github.com/ratna3/Law-Veritas.git
```

## 💡 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear title** for the issue
- **Provide a detailed description** of the proposed feature
- **Explain why** this enhancement would be useful
- **List any alternatives** you've considered

### Your First Code Contribution

Looking for something to work on? Check out:

- Issues labeled `good first issue` - great for newcomers
- Issues labeled `help wanted` - needs community assistance
- Issues labeled `documentation` - help improve our docs

## 🛠️ Development Setup

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Start the development server**

```bash
npm run dev
```

4. **Run linting**

```bash
npm run lint
```

5. **Build for production**

```bash
npm run build
```

## 📝 Style Guidelines

### JavaScript/React

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow the existing color scheme (navy, gold, etc.)
- Ensure responsive design for all screen sizes
- Maintain consistent spacing

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(blog): add markdown rendering for blog posts
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

## 🔄 Pull Request Process

1. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

- Write clean, readable code
- Add tests if applicable
- Update documentation as needed

3. **Commit your changes**

```bash
git add .
git commit -m "feat(scope): your descriptive message"
```

4. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

5. **Create a Pull Request**

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your fork and branch
- Fill out the PR template with:
  - Description of changes
  - Related issue numbers
  - Screenshots (if UI changes)
  - Testing performed

6. **Code Review**

- Address any feedback from reviewers
- Make requested changes
- Keep the PR updated with the main branch

### PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Self-reviewed my code
- [ ] Commented on complex sections
- [ ] Updated documentation if needed
- [ ] No new warnings or errors
- [ ] Tests pass locally
- [ ] Branch is up to date with main

## 🌐 Community

Join our community to discuss ideas, get help, and connect with other contributors:

- **Discord**: [Ratna For Nerds](https://discord.gg/zUWK77Yn)
- **GitHub Discussions**: [Start a discussion](https://github.com/ratna3/Law-Veritas/discussions)
- **Twitter/X**: [@RatnaKirti1](https://x.com/RatnaKirti1)

## 📧 Questions?

If you have questions, feel free to:

- Open a GitHub issue
- Reach out on Discord
- Email: [ratnakirtiscr@gmail.com](mailto:ratnakirtiscr@gmail.com)

---

Thank you for contributing to Law-gically Yours! ⚖️

Made with ❤️ by the Law-gically Yours community
