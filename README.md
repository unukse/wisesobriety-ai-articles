# Wise Sobriety - Recovery Support App

A beautiful, modern mobile app designed to support individuals on their journey to recovery from alcohol addiction. Built with React Native and Expo, featuring a stunning UI with smooth animations and intuitive navigation.

## 🌟 Features

### 📱 Core Functionality
- **Intro Screen**: Welcoming introduction with beautiful animations
- **Authentication**: Secure sign up and sign in with email/password
- **Home Dashboard**: Progress tracking and quick access to key features
- **Daily Check-ins**: Mood tracking and reflection tools
- **Wins Celebration**: Record and celebrate achievements and milestones
- **Meditation**: Guided sessions for stress relief and mindfulness
- **Resources**: Support information and educational content

### 🎨 Design Highlights
- **Modern UI**: Clean, card-based design with beautiful gradients
- **Smooth Animations**: Engaging transitions and micro-interactions
- **Haptic Feedback**: Tactile responses for better user experience
- **Responsive Design**: Optimized for various screen sizes
- **Accessibility**: Inclusive design principles throughout

### 🛠 Technical Features
- **React Native**: Cross-platform mobile development
- **Expo**: Simplified development and deployment
- **Navigation**: Stack and tab navigation with smooth transitions
- **State Management**: Local state with React hooks
- **Animations**: Native driver animations for performance

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WiseSobriety
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 📱 App Structure

```
src/
├── screens/
│   ├── IntroScreen.js      # Welcome screen with animations
│   ├── AuthScreen.js       # Sign up/sign in functionality
│   ├── HomeScreen.js       # Main dashboard
│   ├── CheckInScreen.js    # Daily mood and reflection tracking
│   ├── WinsScreen.js       # Achievement celebration
│   ├── MeditationScreen.js # Guided meditation sessions
│   └── ResourcesScreen.js  # Support and educational resources
```

## 🎯 Key Features Explained

### Home Screen
- Progress tracking with streak counter
- Daily motivation quotes
- Quick access to all app features
- Beautiful card-based layout

### Check-In Screen
- Mood selection with emoji indicators
- Trigger identification
- Daily reflection space
- Progress visualization

### Wins Screen
- Achievement tracking
- Milestone celebrations
- Motivational content
- Progress statistics

### Meditation Screen
- Guided meditation sessions
- Different difficulty levels
- Session categories (beginner, intermediate, advanced)
- Play/pause functionality

### Resources Screen
- Crisis hotline access
- Support group information
- Educational content
- Professional help directory

## 🎨 Design System

### Color Palette
- **Primary**: `#667eea` (Blue gradient)
- **Secondary**: `#764ba2` (Purple gradient)
- **Accent**: `#fa709a` (Pink gradient)
- **Success**: `#43e97b` (Green gradient)
- **Background**: `#f8f9fa` (Light gray)

### Typography
- **Headers**: Bold, 28px
- **Subheaders**: Semi-bold, 20px
- **Body**: Regular, 16px
- **Captions**: Regular, 14px

### Components
- **Cards**: Rounded corners (15-20px), subtle shadows
- **Buttons**: Gradient backgrounds, rounded corners
- **Icons**: Ionicons with consistent sizing
- **Animations**: Smooth transitions with native driver

## 🔧 Customization

### Adding New Features
1. Create new screen in `src/screens/`
2. Add navigation route in `App.js`
3. Update tab navigation if needed
4. Add any required dependencies

### Styling Changes
- Modify colors in individual screen styles
- Update gradients in LinearGradient components
- Adjust animations in useEffect hooks

## 📦 Dependencies

### Core Dependencies
- `expo`: ~49.0.15
- `react-native`: 0.72.6
- `@react-navigation/native`: ^6.1.9
- `@react-navigation/bottom-tabs`: ^6.5.11
- `@react-navigation/stack`: ^6.3.20

### UI & Animation
- `expo-linear-gradient`: ~12.3.0
- `expo-blur`: ~12.4.1
- `expo-haptics`: ~12.4.0
- `react-native-reanimated`: ~3.3.0

### Icons
- `@expo/vector-icons`: ^13.0.0
- `react-native-vector-icons`: ^10.0.2

## 🚀 Deployment

### Building for Production
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for web
expo build:web
```

### Publishing Updates
```bash
expo publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Recovery Community**: For inspiration and feedback
- **React Native Team**: For the amazing framework
- **Expo Team**: For simplifying mobile development
- **Design Community**: For UI/UX inspiration

## 📞 Support

If you need help or have questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation

---

**Remember**: Recovery is a journey, and every step forward is a victory. This app is designed to support you on that journey with compassion, understanding, and beautiful design. 💙 