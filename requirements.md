# SnipeAI.io Landing Page Requirements

## Core Dependencies
- Node.js >= 16.x
- React 18.x
- Tailwind CSS 3.x
- React Router DOM 6.x

## Additional Libraries
- Framer Motion (animations)
- React Intersection Observer (scroll effects)
- React Icons
- React Hook Form (contact form)

## Development Dependencies
- Vite (build tool)
- ESLint
- Prettier
- PostCSS
- Autoprefixer

## Installation Guide

```bash
# Clone the repository
git clone https://github.com/your-org/snipeai-landing.git
cd snipeai-landing

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup
Create a `.env` file in the root directory:
```
VITE_APP_API_URL=your_api_url
VITE_APP_CONTACT_EMAIL=Admin@SnipeAI.io
```

## Development Commands
```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Build and analyze bundle
npm run analyze
```