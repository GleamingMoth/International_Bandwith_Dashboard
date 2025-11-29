# 🌐 International Bandwidth Dashboard

A comprehensive data visualization tool developed by the **Global Digital Access Observatory (GDAO)** to track, analyze, and visualize international bandwidth usage per capita across different countries and regions.

## 📖 Project Description

The **International Bandwidth Dashboard** provides interactive insights into global digital connectivity. By leveraging data from the **International Telecommunication Union (ITU)**, specifically the *International bandwidth usage per capita* indicator, this dashboard helps users understand infrastructure developments, identify digital divides, and track growth trends over time.

Key metrics are measured in **Kilobits per second (KBPS)** per individual.

## ✨ Key Features

- **📊 Interactive Dashboard**: A unified view of all critical metrics and charts.
- **📈 Time Series Analysis**: Visualize the growth of bandwidth usage over the years with interactive line charts.
- **🏆 Top Performers**: Bar charts highlighting the top countries with the highest bandwidth capacity.
- **🌍 Global & Regional Filtering**: Deep dive into specific regions (Americas, Europe, Asia, Oceania, Africa) or individual countries.
- **💡 Automated Insights**:
  - **Fastest Growing**: Identifies countries with the highest Year-over-Year (YoY) growth.
  - **Critical Lagging**: Highlights countries with consistently low growth to pinpoint areas needing attention.
- **📉 KPI Cards**: Instant view of Global Average Bandwidth, YoY Growth, and other high-level metrics.
- **📱 Responsive Design**: Built with a mobile-first approach, ensuring a seamless experience on all devices.


## � Data Source

The dashboard uses public data from the **ITU ICT Indicators Database**.
- **Dataset**: `ITU_DH_INT_BAND_PER_CAP.csv`
- **Indicator**: International bandwidth usage per capita
- **Unit**: Kilobits per second (KBPS)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd international-bandwidth-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` (or the port shown in your terminal) to view the dashboard.

## 📁 Project Structure

```
src/
├── components/         # UI components
│   ├── dashboard/      # Dashboard-specific widgets (Charts, KPIs, Panels)
│   └── ui/             # Reusable UI elements (Buttons, Cards, etc.)
├── contexts/           # React Contexts (DashboardContext for state)
├── hooks/              # Custom React hooks
├── pages/              # Route pages (Index, NotFound)
├── types/              # TypeScript type definitions
├── utils/              # Helper functions (Data loading, processing)
└── App.tsx             # Main application entry
public/
└── data/               # Static data files (CSV)
```
