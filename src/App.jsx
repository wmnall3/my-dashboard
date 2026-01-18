import { useState, useEffect } from 'react';
import { KPICard } from './components/KPICard';
import { RevenueChart } from './components/RevenueChart';
import { UserMetrics } from './components/UserMetrics';
import { AlertsPanel } from './components/AlertsPanel';
import { SystemStatus } from './components/SystemStatus';
import { TopProducts } from './components/TopProducts';
import {
  generateKPIData,
  generateRevenueData,
  generateUserMetrics,
  generateAlerts,
  generateSystemStatus,
  generateTopProducts,
} from './data/mockData';

function App() {
  const [kpiData, setKpiData] = useState(generateKPIData());
  const [revenueData, setRevenueData] = useState(generateRevenueData());
  const [userMetrics, setUserMetrics] = useState(generateUserMetrics());
  const [alerts, setAlerts] = useState(generateAlerts());
  const [systemStatus, setSystemStatus] = useState(generateSystemStatus());
  const [topProducts, setTopProducts] = useState(generateTopProducts());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real-time polling - refresh data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(generateKPIData());
      setRevenueData(generateRevenueData());
      setUserMetrics(generateUserMetrics());
      setAlerts(generateAlerts());
      setSystemStatus(generateSystemStatus());
      setTopProducts(generateTopProducts());
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">M</div>
            Mission Control Dashboard
          </div>
        </div>
        <div className="header-right">
          <div className="status-indicator">
            <span className="status-dot live" />
            Live
          </div>
          <div className="last-updated">
            Last updated: {formatTime(lastUpdated)}
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          label="Revenue"
          value={kpiData.revenue.value}
          change={kpiData.revenue.change}
          period={kpiData.revenue.period}
          prefix="$"
        />
        <KPICard
          label="Orders"
          value={kpiData.orders.value}
          change={kpiData.orders.change}
          period={kpiData.orders.period}
        />
        <KPICard
          label="Avg Order Value"
          value={kpiData.aov.value}
          change={kpiData.aov.change}
          period={kpiData.aov.period}
          prefix="$"
        />
        <KPICard
          label="Conversion Rate"
          value={`${kpiData.conversion.value}%`}
          change={kpiData.conversion.change}
          period={kpiData.conversion.period}
        />
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Left Column - Charts */}
        <div className="charts-section">
          <RevenueChart data={revenueData} />
          <UserMetrics data={userMetrics} />
        </div>

        {/* Right Column - Alerts & Status */}
        <div className="alerts-panel">
          <AlertsPanel alerts={alerts} />
          <SystemStatus data={systemStatus} />
          <TopProducts products={topProducts} />
        </div>
      </div>
    </div>
  );
}

export default App;
