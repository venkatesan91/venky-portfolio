# Angular Portfolio Website

A modern, responsive portfolio website built with Angular 18 and TailwindCSS. Features automatic resume PDF parsing using PDF.js, dark mode toggle, smooth animations, and ready for GitHub Pages deployment.

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

## ✨ Features

- **🤖 Automatic Resume Parsing** - Extracts data from PDF resume using PDF.js
- **🎨 Modern UI/UX** - Sleek, minimal design inspired by premium portfolios
- **🌙 Dark Mode** - Built-in theme toggle with localStorage persistence
- **📱 Fully Responsive** - Mobile-first design that works on all devices
- **⚡ Fast & Optimized** - Lighthouse-ready performance
- **🎭 Smooth Animations** - IntersectionObserver-driven scroll reveals
- **♿ Accessible** - ARIA labels, semantic HTML, keyboard navigation
- **🚀 GitHub Pages Ready** - Easy deployment with one command

## 📋 Prerequisites

- Node.js (v20.10.0 or higher recommended)
- npm (v10.2.3 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd angular-portfolio

# Install dependencies
npm install

# Start development server
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Development

```bash
# Start dev server
npm start

# Build for production
npm run build:prod

# Run tests
npm test

# Watch mode for development
npm run watch
```

## 📂 Project Structure

```
angular-portfolio/
├── src/
│   ├── app/
│   │   ├── components/          # All UI components
│   │   │   ├── navbar/
│   │   │   ├── hero/
│   │   │   ├── about/
│   │   │   ├── experience/
│   │   │   ├── projects/
│   │   │   ├── skills/
│   │   │   ├── contact/
│   │   │   └── footer/
│   │   ├── models/              # TypeScript interfaces
│   │   │   └── resume.interface.ts
│   │   ├── services/            # Services
│   │   │   └── resume.service.ts
│   │   ├── app.component.ts
│   │   └── app.config.ts
│   ├── assets/
│   │   ├── resume.pdf           # Your resume PDF
│   │   └── resume-sample.json   # Fallback data
│   └── styles.css               # Global styles
├── tailwind.config.js
├── angular.json
└── package.json
```

## 🎯 How It Works

### Resume PDF Parsing

1. On app initialization, the `ResumeService` loads `assets/resume.pdf`
2. PDF.js extracts text from all pages
3. Custom parsers extract structured data (name, email, experience, skills, etc.)
4. If parsing confidence is low, fallback to `resume-sample.json`
5. Components receive data via observables and render accordingly

### Customization

#### Update Your Resume

1. Replace `src/assets/resume.pdf` with your resume
2. Update `src/assets/resume-sample.json` with your fallback data
3. The app will automatically parse and display your information

#### Change Accent Color

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    500: '#10b981', // Change this to your preferred color
  }
}
```

#### Change Fonts

Edit `src/styles.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600;700&display=swap');

body {
  font-family: 'YourFont', system-ui, sans-serif;
}
```

#### Modify Content

If PDF parsing doesn't work perfectly, edit `src/assets/resume-sample.json`:

```json
{
  "personalInfo": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "your@email.com",
    ...
  },
  ...
}
```

## 🌐 GitHub Pages Deployment

### Step 1: Prepare Repository

```bash
# Create a GitHub repository
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Update Base Href

Edit `package.json` scripts section, replace `/angular-portfolio/` with your repo name:

```json
"deploy": "ng build --configuration production --base-href \"/YOUR-REPO-NAME/\" && npx angular-cli-ghpages --dir=dist/angular-portfolio/browser"
```

### Step 3: Deploy

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

### Step 4: Configure GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select `gh-pages` branch
4. Click **Save**
5. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR-REPO-NAME/`

### Alternative Manual Deployment

```bash
# Build for production
npm run build:prod

# Install gh-pages (if not already installed)
npm install -g gh-pages

# Deploy dist folder
gh-pages -d dist/angular-portfolio/browser
```

## 🎨 Sections

### Navbar
- Fixed position with scroll effect
- Mobile hamburger menu
- Dark mode toggle
- Smooth scroll to sections

### Hero
- Large name and title
- One-line summary
- Download Resume & View Projects CTAs
- Social media links
- Animated entrance

### About
- Avatar/photo
- Quick stats cards
- Personal bio
- Contact information

### Experience
- Timeline layout
- Company, role, dates
- Responsibilities as bullet points
- Technology tags

### Projects
- Responsive card grid
- Project images
- Tech stack tags
- GitHub and Live demo links
- Featured badge for highlighted projects

### Skills
- Categorized skill badges
- Hover effects
- Auto-populated from resume

### Contact
- Contact information cards
- Social media links
- Contact form (Formspree-ready)
- Form validation

### Footer
- Quick navigation
- Tech stack badges
- Scroll to top button
- Copyright notice

## 🔧 Advanced Configuration

### Integrate Formspree for Contact Form

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form and get your form ID
3. Update `contact.component.ts`:

```typescript
onSubmit() {
  const formData = new FormData();
  formData.append('name', this.contactForm.name);
  formData.append('email', this.contactForm.email);
  formData.append('message', this.contactForm.message);

  fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      this.formSubmitted = true;
    }
  });
}
```

### Add Google Analytics

1. Get your GA tracking ID
2. Add to `src/index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Optimize for Production

```bash
# Build with optimization
ng build --configuration production --optimization --build-optimizer

# Analyze bundle size
npm install -D webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer dist/angular-portfolio/browser/stats.json
```

## 🐛 Troubleshooting

### PDF Parsing Issues

- Ensure your resume has selectable text (not scanned image)
- Check console for parsing errors
- Update `resume-sample.json` as fallback
- Adjust parsing patterns in `resume.service.ts`

### Deployment Issues

- Verify `baseHref` matches your repo name
- Check GitHub Pages is enabled for `gh-pages` branch
- Clear browser cache
- Check for console errors

### Build Errors

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build:prod
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🧪 Testing

```bash
# Run unit tests
ng test

# Run tests with coverage
ng test --code-coverage

# Run e2e tests (if configured)
ng e2e
```

## 📈 Performance

- Lighthouse Score Target: 90+
- Lazy loading for images
- Optimized bundle size
- Tree shaking enabled
- CSS purging via TailwindCSS

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is MIT licensed.

## 👤 Author

**Venkatesan Murali**

- Portfolio: [Your Portfolio URL]
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Design inspired by [ashutoshhathidara.com](https://ashutoshhathidara.com/)
- Built with [Angular](https://angular.io/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- PDF parsing with [PDF.js](https://mozilla.github.io/pdf.js/)
- Icons from [Heroicons](https://heroicons.com/)

---

**Made with ❤️ and Angular**
