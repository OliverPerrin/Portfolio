# Oliver Perrin's Portfolio

<div align="center">

[![Live Site](https://img.shields.io/badge/Live-oliverperrin.com-667eea?style=for-the-badge)](https://oliverperrin.com)
[![Netlify Status](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://www.netlify.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A modern, responsive portfolio website showcasing projects, skills, and professional experience**

[View Live Site](https://oliverperrin.com) • [Report Bug](https://github.com/OliverPerrin/Portfolio/issues) • [Request Feature](https://github.com/OliverPerrin/Portfolio/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Performance](#performance)
- [Design Philosophy](#design-philosophy)
- [Contact](#contact)

---

## 🎯 Overview

This portfolio website serves as a comprehensive digital presence, highlighting my technical expertise, professional experience, and academic projects. Built with modern web technologies and optimized for both performance and user experience, it demonstrates proficiency in front-end development, responsive design, and deployment workflows.

**Key Highlights:**
- 🎨 **Dual Theme Support** – Seamless light/dark mode with persistent preferences
- ⚡ **Smooth Animations** – GSAP-powered scroll animations and Lenis smooth scrolling
- 📱 **Fully Responsive** – Mobile-first design optimized for all screen sizes
- 🚀 **Fast Performance** – Optimized assets and minimal bundle size
- ♿ **Accessible** – WCAG 2.1 compliant with semantic HTML and ARIA labels

---

## ✨ Features

### 🏠 **Interactive Homepage**
- Hero section with gradient text effects and social links
- Animated scroll indicators and smooth page transitions
- Contact information strip with direct links

### 👨‍💻 **About Page**
- Professional biography and career objectives
- Education section with coursework and academic projects
- Dynamic image presentation

### 💼 **Projects Showcase**
- **Multi-Task Transformer** – Advanced NLP system for document analysis
- **PlayAxis** – Full-stack multi-sport web application with API integrations
- **Formula 1 Statistics** – Interactive Tableau dashboard analyzing 70+ years of F1 data
- **Grammy.com Analytics** – Data-driven insights for The Recording Academy
- **Intel Sustainability Analysis** – SQL-based environmental impact evaluation
- **IoT Monitoring System** – Raspberry Pi-based industrial monitoring solution

### 🛠️ **Skills & Technologies**
Organized by category:
- **Languages** – Python, JavaScript, Java, SQL, HTML/CSS
- **Frameworks & Libraries** – React, Node.js, TensorFlow, PyTorch, GSAP
- **Tools & Platforms** – Git, Docker, Tableau, Jupyter, PostgreSQL
- **Cloud & Deployment** – Netlify, Koyeb, AWS basics

### 📚 **Experience Timeline**
- Software Engineering Internship at Triaxis Technologies
- Texas Governor's Cybersecurity Apprenticeship participation
- Leadership roles and technical achievements

### 🎓 **Certifications**
- DeepLearning.AI Coursera Specializations (Machine Learning, Deep Learning)
- Texas Governor's Cybersecurity Certifications (OpenAI, Intel, Grammy Foundation)
- CITI Program Research Ethics

### 📬 **Contact Section**
- Direct email and phone links
- Social media integration (LinkedIn, GitHub)
- Interactive contact form (ready for backend integration)

---

## 🛠️ Tech Stack

### **Core Technologies**
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

### **Animation & Interaction**
- **[GSAP](https://greensock.com/gsap/)** (v3.12.5) – Industry-standard animation library
- **[ScrollTrigger](https://greensock.com/scrolltrigger/)** – Scroll-based animations plugin
- **[Lenis](https://github.com/studio-freight/lenis)** (v1.0.34) – Smooth scroll implementation

### **Design System**
- **Inter Font Family** – Modern, readable typeface via Google Fonts
- **Custom CSS Variables** – Consistent theming and easy maintenance
- **Linear Gradients** – Dynamic color schemes for visual hierarchy

### **Hosting & Deployment**
- **[Netlify](https://www.netlify.com/)** – Continuous deployment from GitHub
- **Custom Domain** – Professional branding with SSL/TLS
- **Git Version Control** – Collaborative development workflow

---

## 📁 Project Structure

```
Portfolio/
├── index.html              # Homepage with hero section
├── about.html              # About page with bio and education
├── projects.html           # Featured projects showcase
├── experience.html         # Professional timeline
├── certifications.html     # Credentials and certificates
├── contact.html            # Contact form and information
├── app.css                 # Global styles and theme system
├── app.js                  # GSAP animations and theme toggle
├── _header.html            # Shared navigation component
├── _footer.html            # Shared footer component
├── package.json            # Dependencies (jsdom for testing)
├── sitemap.xml             # SEO optimization
├── .gitignore              # Git exclusions
└── assets/                 # Images, PDFs, and media files
    ├── *.jpg               # Project thumbnails and photos
    ├── *.png               # Logos and icons
    └── *.pdf               # Project documentation and resume
```

---

## 🚀 Getting Started

### **Prerequisites**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: Node.js 16+ (for local development server)

### **Local Development**

1. **Clone the repository**
   ```bash
   git clone https://github.com/OliverPerrin/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies** (optional, for development tools)
   ```bash
   npm install
   ```

3. **Open in browser**
   ```bash
   # Option 1: Direct file opening
   open index.html
   
   # Option 2: Using Python HTTP server
   python3 -m http.server 8000
   
   # Option 3: Using Node.js http-server
   npx http-server
   ```

4. **Access the site**
   ```
   Navigate to: http://localhost:8000
   ```

### **Making Changes**

The project uses vanilla HTML, CSS, and JavaScript for maximum simplicity and performance:

- **Styling** – Edit `app.css` for global styles and theme variables
- **Interactivity** – Modify `app.js` for animations and theme logic
- **Content** – Update individual HTML pages for text and structure
- **Assets** – Add images/PDFs to the root directory and reference in HTML

---

## 🌐 Deployment

This portfolio is deployed on **Netlify** with continuous deployment from the `main` branch.

### **Deployment Configuration**

```toml
# netlify.toml
[build]
  publish = "."
  command = "echo 'Static site - no build required'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Automatic Deployments**
- Every push to `main` triggers a new build
- Preview deployments for pull requests
- Instant rollback capability
- Custom domain with automatic HTTPS

### **Manual Deployment**
1. Fork or clone this repository
2. Connect to Netlify via GitHub
3. Set publish directory to `.` (root)
4. Deploy! No build step required.

---

## ⚡ Performance

### **Optimization Techniques**
- ✅ Minimal external dependencies (only GSAP and Lenis via CDN)
- ✅ Optimized images (compressed JPG/PNG formats)
- ✅ CSS minification in production
- ✅ Lazy loading for images below the fold
- ✅ Efficient CSS selectors and specificity
- ✅ Hardware-accelerated animations (transform, opacity)

### **Lighthouse Scores** (Target)
- 🟢 Performance: 95+
- 🟢 Accessibility: 95+
- 🟢 Best Practices: 100
- 🟢 SEO: 100

---

## 🎨 Design Philosophy

### **Visual Hierarchy**
- Clear typographic scale using `clamp()` for fluid typography
- Strategic use of white space and content grouping
- Consistent border-radius and shadow system

### **Color System**
```css
/* Dark Theme (Default) */
Background: #0a0a0a → #1a1a1a (gradient)
Text: #ffffff (primary), rgba(255,255,255,0.8) (secondary)
Accent: Linear gradients (#667eea → #764ba2)

/* Light Theme */
Background: #ffffff → #f5f7fb
Text: #0a0a0a (primary), #333333 (secondary)
Accent: Same gradients with adjusted opacity
```

### **Animation Principles**
- Smooth easing functions (ease-in-out, cubic-bezier)
- Purposeful motion that guides attention
- Reduced motion respect for accessibility
- Scroll-triggered reveals for engagement

### **Responsive Breakpoints**
```css
Mobile:  < 768px  (single column, stacked navigation)
Tablet:  768px+   (adaptive grid, visible navigation)
Desktop: 1400px+  (max-width constraint, optimal line length)
```

---

## 📧 Contact

**Oliver Perrin**

- 🌐 Website: [oliverperrin.com](https://oliverperrin.com)
- 💼 LinkedIn: [linkedin.com/in/oliverperrin](https://www.linkedin.com/in/oliverperrin)
- 💻 GitHub: [@OliverPerrin](https://github.com/OliverPerrin)
- 📧 Email: [oliver@oliverperrin.com](mailto:oliver@oliverperrin.com)
- 📱 Phone: +1 (562) 312-9040

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **GSAP** by GreenSock for powerful animation capabilities
- **Lenis** by Studio Freight for smooth scrolling
- **Inter** typeface by Rasmus Andersson
- **Netlify** for seamless deployment and hosting
- **Unsplash** for placeholder imagery during development

---

<div align="center">

**⭐ If you found this portfolio inspiring, please consider starring the repository!**

Built with 💙 by Oliver Perrin | © 2025

</div>