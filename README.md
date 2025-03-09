# Mobile Base

A modern, well-structured React Native starter app that follows Material Design 3 principles.

[![Windsurf](https://img.shields.io/badge/Built%20with-Windsurf-0066CC.svg)](https://codeium.com/windsurf)
[![Codeium](https://img.shields.io/badge/Powered%20by-Codeium-09B6A2.svg)](https://codeium.com)
[![Digital Twin](https://img.shields.io/badge/Digital%20Twin-Ready-blue)](https://www.digitaltwinconsortium.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76.6-blue.svg?style=flat&logo=react)](https://reactnative.dev/)
[![Material Design](https://img.shields.io/badge/Material%20Design-v3-000000.svg?style=flat&logo=materialdesign&logoColor=white)](https://m3.material.io/)
[![Expo](https://img.shields.io/badge/Expo-52.0.30-black.svg?style=flat&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Markdown](https://img.shields.io/badge/Markdown-000000?style=flat&logo=markdown&logoColor=white)](https://www.markdownguide.org/)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://opensource.org/)
[![Documentation](https://img.shields.io/badge/docs-latest-brightgreen.svg)](https://pattern-bridge.github.io/docs)
[![Community](https://img.shields.io/badge/Join-Codeium%20Community-7289DA.svg?style=flat&logo=discord)](https://discord.gg/3XFf78nAx5)
[![X](https://img.shields.io/badge/Follow-@jackccrawford-000000.svg?style=flat&logo=x)](https://x.com/jackccrawford)
[![ManagedV](https://img.shields.io/badge/By-ManagedV-4DFFD2.svg?style=flat)](https://www.managedv.com)
[![Maintained](https://img.shields.io/badge/Maintained-yes-brightgreen.svg)](https://github.com/pattern-bridge/pattern-bridge/pulse)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Material Design 3**: Complete implementation of MD3 theming, components, and interactions
- 🌓 **Smart Theming**: Intuitive theme switching with automatic system theme detection
- 📱 **Navigation**: Production-ready drawer and tab navigation setup using React Navigation
- 🎭 **Pattern Examples**: Multiple layout patterns showcasing different UI approaches
- 📦 **Zero Config**: Ready to use with minimal setup required
- 🔒 **TypeScript**: Type-safe codebase with modern TypeScript practices

## Quick Start

```bash
# Clone the repository
git clone https://github.com/jackccrawford/mobile-base.git

# Install dependencies
cd mobile-base
npm install

# Start the development server
npx expo start --clear
```
Scan barcode to launch the app on your iOS or Android device.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── navigation/     # Navigation configuration
├── screens/        # Screen components
├── theme/         # Material Design 3 theming
└── utils/         # Helper functions and utilities
```

## Layout Patterns

The app includes several layout pattern examples that you can use as starting points for your own screens:

- **Masonry**: Pinterest-style grid layout
- **Card Swipe**: Tinder-style card swiping interface (works on mobile and web)
- **Standard**: Traditional mobile list view
- **Focus**: Centered content with emphasis
- More patterns coming soon!

### Known Issues

- **TODO**: Card swipe animation on desktop browsers needs improvement - cards don't always animate completely off screen when swiped. The implementation works well on mobile web and native platforms.

## Customization

### Settings

The app includes a comprehensive settings screen with:
- Theme switching (Light/Dark/System) with intuitive icon-based toggle
- Custom header title configuration
- Direct links to GitHub and license information

### Color System

The app implements a carefully designed color system that:
- Provides optimal contrast in both light and dark modes
- Uses consistent patterns for selected/unselected states
- Follows Material Design 3 color token guidelines

### Theming

The app uses Material Design 3 theming system. You can customize the theme by modifying `src/theme/theme.ts`:

```typescript
const lightTheme = {
  colors: {
    primary: '#006495',
    // ... other color tokens
  },
  // ... other theme properties
};
```

### Navigation

Navigation is set up using React Navigation v6. The main navigation structure is defined in `src/navigation/ThemedNavigator.tsx`.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - See [LICENSE](LICENSE) for details

---

<p align="center">
  <i>Build beautiful React Native apps.</i><br>
  <i>Start with a solid foundation.</i>
</p>
