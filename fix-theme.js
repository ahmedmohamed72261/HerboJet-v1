const fs = require('fs');

const colors = {
  "primary-container": "#0a2e1f",
  "on-error-container": "#93000a",
  "outline": "#727973",
  "tertiary-fixed": "#ffdea3",
  "tertiary-container": "#362500",
  "primary-fixed": "#c5ebd4",
  "on-primary-fixed-variant": "#2b4e3d",
  "on-secondary-fixed-variant": "#254f38",
  "secondary-fixed": "#bfedce",
  "inverse-on-surface": "#ecf2ec",
  "tertiary": "#1c1200",
  "on-background": "#171d19",
  "inverse-surface": "#2c322e",
  "surface-container-highest": "#dee4de",
  "tertiary-fixed-dim": "#e8c177",
  "error-container": "#ffdad6",
  "surface-tint": "#436653",
  "on-tertiary-fixed": "#261900",
  "surface-container": "#eaefe9",
  "on-surface": "#171d19",
  "on-primary-fixed": "#002113",
  "surface-variant": "#dee4de",
  "primary-fixed-dim": "#a9cfb9",
  "primary": "#00180d",
  "surface-bright": "#f5fbf4",
  "on-tertiary-fixed-variant": "#5c4201",
  "on-tertiary": "#ffffff",
  "error": "#ba1a1a",
  "surface": "#f5fbf4",
  "on-secondary-container": "#416b52",
  "secondary-container": "#bcebcb",
  "on-error": "#ffffff",
  "on-primary-container": "#739783",
  "on-surface-variant": "#414844",
  "secondary-fixed-dim": "#a3d1b3",
  "inverse-primary": "#a9cfb9",
  "outline-variant": "#c1c8c2",
  "surface-dim": "#d6dcd5",
  "surface-container-lowest": "#ffffff",
  "on-secondary-fixed": "#002111",
  "on-secondary": "#ffffff",
  "on-tertiary-container": "#ac8a46",
  "background": "#f5fbf4",
  "secondary": "#3d674e",
  "surface-container-high": "#e4eae3",
  "on-primary": "#ffffff",
  "surface-container-low": "#eff5ef"
};

// Generate a simple dark mode mapping
// This is a heuristic based on MD3 principles
const darkColors = {
  ...colors,
  "background": "#171d19", // was on-background
  "on-background": "#f5fbf4", // was background
  "surface": "#171d19",
  "on-surface": "#f5fbf4",
  "surface-variant": "#414844",
  "on-surface-variant": "#c1c8c2",
  "outline": "#c1c8c2", // lighter outline
  "outline-variant": "#414844", // darker outline variant
  "primary": "#8ad0aa", // lighter primary
  "on-primary": "#003920",
  "primary-container": "#005230",
  "on-primary-container": "#a5ecc2",
  "secondary": "#a2d3b4",
  "on-secondary": "#0e371f",
  "secondary-container": "#274e35",
  "on-secondary-container": "#bcebcb",
  "tertiary": "#d5c4a1",
  "on-tertiary": "#392f15",
  "tertiary-container": "#514529",
  "on-tertiary-container": "#f2dfbb",
  "surface-container-lowest": "#0e1511",
  "surface-container-low": "#171d19",
  "surface-container": "#1d231e",
  "surface-container-high": "#282e29",
  "surface-container-highest": "#333934",
  "error": "#ffb4ab",
  "on-error": "#690005",
  "error-container": "#93000a",
  "on-error-container": "#ffdad6",
};

let cssVarsLight = '';
let cssVarsDark = '';
let twColors = {};

for (const [key, val] of Object.entries(colors)) {
  cssVarsLight += `  --color-${key}: ${val};\n`;
  cssVarsDark += `  --color-${key}: ${darkColors[key] || val};\n`;
  twColors[key] = `var(--color-${key})`;
}

const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');

@layer base {
  :root {
${cssVarsLight}
  }

  .dark {
${cssVarsDark}
  }

  body {
    @apply bg-background text-on-surface antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
  }
}
`;

fs.writeFileSync('styles/globals.css', globalsCss);

const twConfigStr = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx,html}',
    './components/**/*.{js,ts,jsx,tsx,mdx,html}',
    './app/**/*.{js,ts,jsx,tsx,mdx,html}',
    './screens/**/*.{html}'
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: ${JSON.stringify(twColors, null, 8).replace(/}/, '      }')},
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "gutter-tablet": "1.25rem",
        "space-lg": "1.5rem",
        "gutter-mobile": "1rem",
        "margin-tablet": "2rem",
        "gutter": "1.5rem",
        "margin-mobile": "1.25rem",
        "space-xl": "2.5rem",
        "space-md": "1rem",
        "space-xs": "0.25rem",
        "margin": "4rem",
        "space-sm": "0.5rem"
      },
      fontFamily: {
        "body-lg": ["Inter"],
        "headline-md": ["Playfair Display"],
        "headline-lg": ["Playfair Display"],
        "headline-sm": ["Playfair Display"],
        "body-sm": ["Inter"],
        "label-lg": ["Inter"],
        "headline-lg-mobile": ["Playfair Display"],
        "label-sm": ["Inter"],
        "label-md": ["Inter"],
        "body-md": ["Inter"],
        "display-lg-mobile": ["Playfair Display"],
        "display-lg": ["Playfair Display"]
      },
      fontSize: {
        "body-lg": ["18px", { "lineHeight": "28px", "letterSpacing": "-0.005em", "fontWeight": "400" }],
        "headline-md": ["28px", { "lineHeight": "36px", "letterSpacing": "0em", "fontWeight": "500" }],
        "headline-lg": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.015em", "fontWeight": "500" }],
        "headline-sm": ["22px", { "lineHeight": "30px", "letterSpacing": "0em", "fontWeight": "600" }],
        "body-sm": ["13px", { "lineHeight": "20px", "letterSpacing": "0.005em", "fontWeight": "400" }],
        "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "600" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "36px", "letterSpacing": "-0.01em", "fontWeight": "500" }],
        "label-sm": ["10px", { "lineHeight": "14px", "letterSpacing": "0.08em", "fontWeight": "700" }],
        "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.04em", "fontWeight": "600" }],
        "body-md": ["15px", { "lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "400" }],
        "display-lg-mobile": ["38px", { "lineHeight": "46px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "display-lg": ["56px", { "lineHeight": "64px", "letterSpacing": "-0.02em", "fontWeight": "600" }]
      }
    }
  }
};
`;

fs.writeFileSync('tailwind.config.js', twConfigStr);
console.log('Successfully updated theme for dark mode support.');
