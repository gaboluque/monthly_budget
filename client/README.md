# PLUTO - Budget PWA

Pluto is a Progressive Web App (PWA) for monthly budget tracking. This application is built with React, TypeScript, and Vite, designed to work offline and provide a native-like experience on both mobile and desktop devices.

## Features

- Track income and expenses
- Categorize transactions
- View transaction history
- Works offline
- Installable on mobile and desktop devices
- Responsive design for all screen sizes

## Development

To run the development server:

```bash
npm install
npm run dev
```

## Building for Production

To build the app for production:

```bash
npm run build
```

This will generate a production-ready bundle in the `dist` directory that can be deployed to any static hosting service.

## PWA Features

This application is built as a Progressive Web App, which means:

- It can be installed on your device's home screen
- It works offline using service workers
- It has a splash screen and app-like navigation
- It updates automatically when new versions are available

## Technologies Used

- React 18
- TypeScript
- Vite
- PWA (vite-plugin-pwa)
- Service Workers (workbox)
- CSS3 with Grid and Flexbox

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
