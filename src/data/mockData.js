// Generate realistic mock data for the dashboard

// Helper to generate random number in range
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to add slight variance to a base number
const vary = (base, percent = 0.1) => {
  const variance = base * percent;
  return base + (Math.random() - 0.5) * 2 * variance;
};

// Generate weekly revenue data
export const generateRevenueData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseRevenue = 3500;

  return days.map((day, i) => ({
    day,
    revenue: Math.round(vary(baseRevenue + (i < 5 ? 500 : -200), 0.15)),
    orders: rand(150, 220),
    lastWeek: Math.round(vary(baseRevenue - 200, 0.15)),
  }));
};

// Generate monthly trend data
export const generateMonthlyData = () => {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  let revenue = 85000;

  return months.map((month) => {
    revenue = Math.round(vary(revenue * 1.08, 0.05));
    return {
      month,
      revenue,
      users: rand(35000, 55000),
    };
  });
};

// Generate user metrics
export const generateUserMetrics = () => ({
  dau: rand(7500, 9500),
  mau: rand(42000, 48000),
  avgSessionDuration: rand(8, 15),
  featureAdoption: {
    search: rand(75, 95),
    checkout: rand(45, 65),
    wishlist: rand(25, 40),
    reviews: rand(15, 30),
  },
});

// Generate KPI data
export const generateKPIData = () => ({
  revenue: {
    value: rand(22000, 28000),
    change: (Math.random() * 20 - 5).toFixed(1),
    period: 'today',
  },
  orders: {
    value: rand(1100, 1400),
    change: (Math.random() * 15 - 3).toFixed(1),
    period: 'today',
  },
  aov: {
    value: (rand(1800, 2200) / 100).toFixed(2),
    change: (Math.random() * 10 - 4).toFixed(1),
    period: 'vs last week',
  },
  conversion: {
    value: (rand(28, 42) / 10).toFixed(1),
    change: (Math.random() * 8 - 2).toFixed(1),
    period: 'vs last week',
  },
});

// Generate alerts
export const generateAlerts = () => {
  const allAlerts = [
    { id: 1, type: 'warning', message: 'Revenue down 12% from yesterday', category: 'business', time: '5m ago' },
    { id: 2, type: 'success', message: 'API uptime: 99.97%', category: 'system', time: '1m ago' },
    { id: 3, type: 'warning', message: 'Cart abandonment rate increased to 68%', category: 'business', time: '12m ago' },
    { id: 4, type: 'error', message: 'Payment gateway latency: 850ms', category: 'system', time: '3m ago' },
    { id: 5, type: 'success', message: 'Database health: optimal', category: 'system', time: '30s ago' },
    { id: 6, type: 'info', message: 'New user signups trending up 8%', category: 'business', time: '8m ago' },
    { id: 7, type: 'warning', message: 'Inventory low: 3 products below threshold', category: 'business', time: '15m ago' },
    { id: 8, type: 'success', message: 'CDN response time: 45ms', category: 'system', time: '2m ago' },
  ];

  // Return 4-5 random alerts
  return allAlerts
    .sort(() => Math.random() - 0.5)
    .slice(0, rand(4, 5))
    .sort((a, b) => {
      const order = { error: 0, warning: 1, info: 2, success: 3 };
      return order[a.type] - order[b.type];
    });
};

// Generate feature adoption data for chart
export const generateFeatureAdoptionData = () => [
  { name: 'Search', adoption: rand(75, 95), fill: '#3b82f6' },
  { name: 'Checkout', adoption: rand(45, 65), fill: '#10b981' },
  { name: 'Wishlist', adoption: rand(25, 40), fill: '#f59e0b' },
  { name: 'Reviews', adoption: rand(15, 30), fill: '#8b5cf6' },
];

// System status
export const generateSystemStatus = () => ({
  api: { status: Math.random() > 0.1 ? 'operational' : 'degraded', latency: rand(45, 120) },
  database: { status: Math.random() > 0.05 ? 'operational' : 'degraded', connections: rand(80, 150) },
  cdn: { status: 'operational', latency: rand(20, 60) },
  payments: { status: Math.random() > 0.15 ? 'operational' : 'degraded', latency: rand(200, 500) },
});

// Horse racing handicapping products
const HANDICAPPING_PRODUCTS = [
  { id: 1, name: 'Daily Double Picks', price: 9.99 },
  { id: 2, name: 'Triple Crown Analysis', price: 24.99 },
  { id: 3, name: 'Speed Figure Report', price: 14.99 },
  { id: 4, name: 'Exacta Edge Guide', price: 19.99 },
  { id: 5, name: 'Trainer Trends Report', price: 12.99 },
  { id: 6, name: 'Track Bias Analysis', price: 11.99 },
  { id: 7, name: 'Superfecta Strategies', price: 29.99 },
  { id: 8, name: 'Morning Line Value Plays', price: 7.99 },
  { id: 9, name: 'Pace Scenario Builder', price: 16.99 },
  { id: 10, name: 'Jockey Performance Stats', price: 8.99 },
];

// Generate top 5 products purchased (last 24 hours)
export const generateTopProducts = () => {
  // Shuffle and pick 5 products
  const shuffled = [...HANDICAPPING_PRODUCTS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5);

  return selected
    .map((product) => {
      const downloads = rand(45, 280);
      return {
        ...product,
        downloads,
        revenue: (downloads * product.price).toFixed(2),
      };
    })
    .sort((a, b) => b.downloads - a.downloads); // Sort by downloads descending
};
