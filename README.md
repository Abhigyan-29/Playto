# 💸 Playto: AI-Powered Global Payout Engine

Playto is a high-performance, AI-integrated payout platform designed for modern global businesses. It reimagines the payout experience by combining predictive liquidity, automated fraud detection, and a stunning, interactive user interface.

![Landing Page Screenshot](https://raw.githubusercontent.com/Abhigyan-29/Playto/main/frontend/public/landing_preview.png)

## 🚀 Key Features

- **🧠 Gemini 2.5 AI Core**: Powered by Google's latest AI models for intelligent risk scoring and merchant assistance.
- **🛡️ AI Fraud Engine**: Real-time transaction monitoring that identifies and flags suspicious patterns before they impact your liquidity.
- **📊 Interactive Dashboard**: A premium merchant command center with glassmorphic aesthetics and real-time data streaming.
- **🌓 Global Theme System**: Seamlessly switch between a cinematic Dark Mode and a vibrant Light Mode.
- **✨ Particle Background**: An interactive, mouse-reactive particle system that provides a high-end, alive feel.
- **🔔 Smart Notifications**: Real-time feedback via color-coded toast notifications for all transaction states.
- **🌍 Global Reach**: Engineered for multi-currency payouts and predictive settlement across international borders.
- **🔐 Enterprise Security**: Integrated with Clerk for robust, seamless authentication and session management.

## 🛠️ Tech Stack

### Frontend
- **React 19** & **Vite**
- **Tailwind CSS** (for high-end styling)
- **Framer Motion** (for smooth, orchestrated animations)
- **Clerk** (Authentication)
- **Sonner** (Toast notifications)
- **SimpleIcons** (Brand-accurate logos)

### Backend
- **Node.js** & **Express**
- **PostgreSQL** (with pg-native optimizations)
- **Google Generative AI SDK** (Gemini 2.5 Flash)
- **Worker Threads** (for asynchronous payout processing)

## 📥 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Abhigyan-29/Playto.git
   cd Playto
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file and add your credentials (DATABASE_URL, GEMINI_API_KEY)
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env file and add your Clerk keys (VITE_CLERK_PUBLISHABLE_KEY)
   npm run dev
   ```

## 📖 Development Commands

### Frontend
- `npm run dev`: Start development server.
- `npm run build`: Build for production.

### Backend
- `npm start`: Start the API server.
- `npm run dev`: Start server with nodemon.
- `npm run worker`: Start the background payout processor.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



Built by [Abhigyan](https://github.com/Abhigyan-29)
