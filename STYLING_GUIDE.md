# Sports Shop App - Styling Guide

## Overview

This guide documents the enhanced styling system for the sports shop application, featuring a modern dark theme with neon green accents and glassmorphism effects.

## Design System

### Color Palette

- **Primary**: Neon Green (#B6FF00)
- **Background**: Black (#000000) with gray scale variations
- **Text**: White (#FFFFFF) with gray scale for secondary text
- **Borders**: Gray scale with neon green for active states

### Typography

- **Font Family**: Inter (system-ui fallback)
- **Weights**: 400 (normal), 600 (semibold), 700 (bold), 900 (black)
- **Sizes**: Responsive scaling from 12px to 48px+

### Spacing System

- **Base Unit**: 4px (0.25rem)
- **Scale**: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px)

## Component Classes

### Buttons

```css
.btn-primary    /* Neon green CTA buttons */
.btn-secondary  /* Gray secondary buttons */
.btn-ghost      /* Text-only buttons with hover states */
```

### Cards

```css
.card           /* Base card styling */
.card-hover     /* Hover effects for interactive cards */
```

### Forms

```css
.input          /* Form inputs with focus states */
```

### Effects

```css
.glass          /* Glassmorphism effect */
.neon-glow      /* Neon shadow effects */
.hover-lift     /* Subtle lift on hover */
```

## Usage Examples

### Button Implementation

```jsx
<button className="btn-primary">
  Add to Cart
</button>

<button className="btn-secondary">
  Learn More
</button>
```

### Card Implementation

```jsx
<div className="card card-hover">
  <h3 className="text-white font-bold">Product Name</h3>
  <p className="text-gray-400">Product description</p>
</div>
```

### Form Input

```jsx
<input type="text" className="input w-full" placeholder="Search products..." />
```

## Responsive Design

- **Breakpoints**: xs (475px), sm (640px), md (768px), lg (1024px), xl (1280px)
- **Mobile-first approach** with responsive utilities

## Accessibility Features

- **Focus states** with neon green outlines
- **Reduced motion** support for users with motion sensitivity
- **High contrast mode** support
- **Keyboard navigation** support

## Animation System

- **Fade-in**: Subtle entrance animations
- **Slide-up**: Content reveal animations
- **Hover effects**: Interactive feedback
- **Loading states**: Skeleton screens and spinners

## Best Practices

1. **Use semantic HTML** elements
2. **Maintain color contrast** ratios (WCAG 2.1 AA)
3. **Test on multiple devices** and screen sizes
4. **Use CSS custom properties** for consistent theming
5. **Implement progressive enhancement**

## File Structure

```
src/
├── styles/
│   ├── globals.css    /* Global styles and utilities */
│   └── components/    /* Component-specific styles */
├── components/        /* React components */
└── app/              /* Next.js app directory */
```

## Custom Properties Reference

All colors and spacing values are available as CSS custom properties:

- `--neon-green`: Primary accent color
- `--bg-primary`: Main background
- `--text-primary`: Primary text color
- `--spacing-*`: Consistent spacing values

## Browser Support

- **Modern browsers**: Full support
- **IE11**: Graceful degradation
- **Mobile browsers**: Optimized for touch
