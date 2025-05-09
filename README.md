# Crane Film Site

A professional website for a film production studio featuring a dynamic wave background animation.

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Canvas API for wave animations

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

To build the site for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Project Structure

- `/app` - Next.js app directory
  - `/components` - Reusable React components
  - `/page.tsx` - Home page
  - `/layout.tsx` - Root layout
  - `/globals.css` - Global styles

## Wave Background Component

The site features a dynamic animated wave background created with HTML Canvas. The component supports:

- Responsive design that adapts to any screen size
- Customizable through props
- Animated waves with different amplitudes and frequencies 