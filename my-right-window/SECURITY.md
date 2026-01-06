# Security Policy

## 🔒 Supported Versions

The following versions of Law-gically Yours are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🛡️ Reporting a Vulnerability

We take the security of Law-gically Yours seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Send an email to [ratnakirtiscr@gmail.com](mailto:ratnakirtiscr@gmail.com) with details
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact of the vulnerability
   - Any suggested fixes (optional)

### What to Expect

- **Initial Response**: Within 48 hours of your report
- **Status Update**: Within 7 days with our assessment
- **Resolution Timeline**: Critical vulnerabilities will be addressed within 14 days

### Disclosure Policy

- Please give us reasonable time to address the issue before public disclosure
- We will acknowledge your contribution in the release notes (unless you prefer to remain anonymous)
- We follow responsible disclosure practices

## 🔐 Security Best Practices

When using Law-gically Yours, please follow these security guidelines:

### Environment Variables

- Never commit `.env` files to version control
- Use strong, unique values for `VITE_SUPABASE_ANON_KEY`
- Rotate API keys periodically

### Authentication

- Use strong passwords for admin accounts
- Enable Row Level Security (RLS) in Supabase
- Regularly review user permissions

### Deployment

- Always use HTTPS in production
- Keep dependencies updated
- Enable security headers in your hosting configuration

## 📋 Security Checklist for Contributors

Before submitting a pull request, ensure:

- [ ] No sensitive data (API keys, passwords) is included in the code
- [ ] Dependencies are from trusted sources
- [ ] Input validation is implemented where necessary
- [ ] No SQL injection vulnerabilities in database queries
- [ ] XSS prevention measures are in place for user-generated content

## 🔄 Dependency Updates

We regularly update dependencies to patch known vulnerabilities. You can check for vulnerabilities using:

```bash
npm audit
```

To fix automatically fixable issues:

```bash
npm audit fix
```

## 📞 Contact

For security-related inquiries:

- **Email**: [ratnakirtiscr@gmail.com](mailto:ratnakirtiscr@gmail.com)
- **Discord**: [Ratna For Nerds](https://discord.gg/zUWK77Yn)

---

Thank you for helping keep Law-gically Yours secure! 🙏
