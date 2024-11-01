<p align="center">
  <br>
  <img width="240" src="./src/assets/tapps.png" alt="logo of telegram web apps">
  <br>
  <br>
</p>

# Telegram Mini Apps(TMA) Haptic Feedback Demo

This is a demonstration project showcasing haptic feedback capabilities in Telegram Mini Apps (TMA) using React, TypeScript, and Vite. The app provides a comprehensive library of haptic patterns and effects that can be used to enhance user experience in Telegram Mini Apps.

## Features

- **Single Haptic Impacts**

  - Light, Medium, Heavy impacts
  - Rigid and Soft impacts
  - Error, Success, Warning notifications
  - Selection changed feedback

- **Haptic Sequences**
  - Pre-configured pattern sequences
  - Customizable delays and repetitions
  - Multiple categories of haptic patterns

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Telegram account

### Installation

```bash
# Clone the repository
git clone https://github.com/veebull/tma-haptic-feedback.git
cd tma-haptic-feedback

# Install dependencies using npm
npm install

# Or using yarn
yarn
```

### Development

```bash
# Start development server with npm
npm run dev --host

# Or using yarn
yarn dev --host
```

## Usage

1. Open the demo in Telegram Mini Apps
2. Try different haptic feedback patterns:
   - Single impacts for immediate feedback
   - Complex sequences for more elaborate patterns
3. Experience different intensities and patterns
4. Use these patterns as reference for your own TWA implementations

## Technical Details

- Built with React + TypeScript + Vite
- Uses @twa-dev/sdk for Telegram Web Apps integration
- Implements all available haptic feedback patterns from Telegram Mini Apps SDK

## Links

- [Live Demo](https://t.me/supertmabot/haptic)
- [TWA Documentation](https://docs.ton.org/develop/dapps/telegram-apps)
- [Vite Boilerplate](https://twa-dev.github.io/vite-boilerplate/)
- [GitHub Repository](https://github.com/veebull/tma-haptic-feedback)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
