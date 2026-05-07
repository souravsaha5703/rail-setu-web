# 🛤️ RailSetu

**Intelligent Route Optimization for Indian Railways**

RailSetu is a sophisticated web application designed to solve one of the biggest challenges for Indian Railway passengers: **Waitlisted Tickets**. While traditional platforms only show direct point-to-point availability, RailSetu's "Route-Breaker" engine identifies strategic junctions and splits journeys into multi-leg itineraries to unlock hidden, confirmed seats.

![RailSetu Hero](https://images.unsplash.com/photo-1474487024268-5807b524623f?q=80&w=2000&auto=format&fit=crop)

---

## ✨ Key Features

- **🚀 Smart Route Analysis**: Automatically identifies optimal junctions to split waitlisted journeys into confirmed segments.
- **🧠 AI-Powered Reasoning**: Evaluates layover safety, midnight transfers, and train reliability to rank the best possible itineraries.
- **⚡ Real-Time Availability**: Parallelized segment checks providing results in under 3 seconds.
- **🛡️ Safety-First Connections**: Filters out risky transfers, ensuring no tight layovers or midnight arrivals at small stations.
- **📍 10,102+ Station Network**: A complete local registry of Indian Railways stations with junction rankings and geo-coordinates.
- **📱 Responsive Design**: Fully optimized experience across mobile, tablet, and desktop devices.

---

## 🛠️ Technology Stack

- **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (motion/react)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Local Data**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (via custom service)
- **Search**: [Fuse.js](https://fusejs.io/) for lightweight fuzzy search

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rail-setu-web.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rail-setu-web
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root and add your API URL:
   ```env
   VITE_API_URL=https://your-api-endpoint.com
   ```

### Running Locally
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🏗️ Project Structure

```text
src/
├── components/         # Reusable UI components
│   ├── landing/       # Hero, Features, HowItWorks, etc.
│   └── ...
├── pages/              # Main application pages (SearchResults, SmartRoute)
├── store/              # Redux state configuration
├── services/           # API and IndexedDB services
├── utils/              # Interfaces and helper functions
└── App.tsx             # Main routing and entry point
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ for Indian Railways passengers.
