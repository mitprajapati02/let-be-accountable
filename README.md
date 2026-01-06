<a href="let-be-accountable.vercel.app">
let-be-accountable
</a>

---

A modern, mobile-first Progressive Web App (PWA) for managing daily tasks, tracking habits, and organizing learning resources. Built with vanilla JavaScript, React, and Tailwind CSS, featuring drag-and-drop functionality, offline support, and installable as a native app on mobile devices.

## Project Status

This project is currently in active development. Core features including calendar view, day planning, habit tracking, and resource management are fully functional. Data persistence with localStorage and PWA installation are implemented. Future enhancements include goals system integration and advanced analytics.

## Project Screen Shots

### Desktop View - Calendar
<img width="1920" height="1020" alt="Screenshot 2026-01-01 163145" src="https://github.com/user-attachments/assets/071c331d-cb77-4ed5-8ce9-0a8b485cc4b6" />

---
### Habit Tracker
<img width="1920" height="1020" alt="Screenshot 2026-01-01 163213" src="https://github.com/user-attachments/assets/f37a6e84-67e2-454f-b7e2-65d36c14e8ba" />

---
### Resources Manager
<img width="1920" height="1080" alt="Screenshot 2026-01-01 163224" src="https://github.com/user-attachments/assets/c1c1af0b-64b1-4ead-9c46-f5e5ede9c887" />


## Features

- **📅 Calendar View**: Monthly calendar with drag-and-drop task scheduling
- **📝 Day Planning**: Detailed todo management with time slots and priorities
- **🎯 Habit Tracker**: Daily habit tracking with streak counting
- **🔗 Resources Manager**: Organize YouTube videos and course links
- **📱 Mobile-First Design**: Responsive UI optimized for touch devices
- **💾 Offline Support**: Works without internet connection once installed
- **🎨 Drag & Drop**: Intuitive task rescheduling across calendar dates
- **🔔 Priority System**: Color-coded tasks (High/Medium/Low priority)
- **💡 Auto-Save**: Data persists in browser localStorage

## Installation and Setup Instructions

This is a standalone HTML application with no build process required.

### Quick Start:

1. **Clone the repository:**
```bash
   git clone https://github.com/mitprajapati02/productivity-hub.git
   cd let-be-accountable
```

2. **Open the application:**
```bash
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

   npm start
```

3. **Visit the app:**
   - Local server: `http://localhost:3000`

## Tech Stack

- **React 18**: UI framework 
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **localStorage**: Client-side data persistence
- **Service Worker**: PWA offline functionality
- **Web App Manifest**: Native app installation

## Reflection

### Context

This project was built as a comprehensive productivity solution to address the common challenge of managing multiple tools for task planning, habit tracking, and learning resources. The goal was to create a single, unified interface that works seamlessly across devices and doesn't require an internet connection.

### What I Set Out to Build

I wanted to create a lightweight, privacy-focused productivity app that:
- Works entirely in the browser without backend dependencies
- Installs like a native app on mobile devices
- Provides an intuitive drag-and-drop interface for task management
- Stores all data locally for privacy and offline access
- Offers a modern, mobile-first user experience

### Challenges and Learning Experience

**PWA Implementation**: Getting the Progressive Web App features to work across both iOS and Android was challenging. iOS requires specific meta tags and doesn't support the standard `beforeinstallprompt` event. I had to implement platform detection and custom UI for iOS users, teaching them to use Safari's "Add to Home Screen" feature.


**localStorage Limitations**: Working within the constraints of localStorage (no backend) meant carefully managing data structure and implementing efficient serialization. The 5-10MB storage limit required thoughtful data architecture.

**Cross-Browser Compatibility**: Ensuring the app works consistently across Safari, Chrome, Firefox, and mobile browsers required extensive testing and polyfills for certain features.

### Unexpected Obstacles

- **iOS PWA Quirks**: iOS treats PWAs differently than Android, requiring special handling for status bars, safe areas, and app icons
- **React CDN Setup**: Using React without a build process meant working with UMD builds and the older `React.createElement` API instead of JSX
- **Drag Events on Mobile**: Native HTML5 drag-and-drop doesn't work well on mobile, requiring touch event handlers as fallbacks
- **Font Size Zoom Prevention**: Mobile browsers automatically zoom on input fields with font-size < 16px, requiring careful typography choices

### Technology Choices

**Why No Build Process?**
I deliberately chose to avoid webpack, Vite, or create-react-app to create a truly portable, single-file application. This makes deployment trivial (just drop the HTML file anywhere) and removes all dependencies beyond a web browser. The trade-off of not using JSX is worth the simplicity.

**Why localStorage Instead of Backend?**
Privacy-first approach. User data never leaves their device, there's no server to maintain, no authentication to manage, and the app works 100% offline. For a personal productivity tool, this aligns with user needs for privacy and reliability.


**Why React via CDN?**
React's component model and state management are perfect for this interactive application, and the CDN approach keeps deployment simple. The newer `React.createElement` syntax (replacing JSX) works perfectly for this scale of application.

**Why PWA over Native App?**
- **Zero App Store Friction**: Users install directly from the browser
- **Cross-Platform**: One codebase works on iOS, Android, desktop
- **Instant Updates**: Changes deploy immediately without app store approval
- **Smaller Size**: HTML/CSS/JS is much smaller than native bundles
- **Universal Access**: Works as both a website and installed app

### Future Enhancements

- **Goals System**: Link todos to overarching goals with progress tracking
- **Data Export/Import**: JSON export for backup and device transfer
- **Theme Customization**: Dark mode and custom color schemes
- **Analytics Dashboard**: Productivity insights and statistics
- **Cloud Sync**: Optional backend for multi-device synchronization
- **Recurring Tasks**: Support for daily/weekly/monthly repeating todos
- **Notifications**: Reminder system for upcoming tasks

## Browser Support

- Chrome 90+ (Desktop & Mobile)
- Safari 14+ (Desktop & Mobile)
- Firefox 88+
- Edge 90+

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

Created by PRAJAPATI MITKUMAR - mp7702524@gmail.com

Project Link: https://github.com/mitprajapati02/productivity-hub.git
