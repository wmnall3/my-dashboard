const COLORS = {
  search: '#3b82f6',
  checkout: '#10b981',
  wishlist: '#f59e0b',
  reviews: '#8b5cf6',
};

function FeatureBar({ name, value, color }) {
  return (
    <div className="feature-bar">
      <div className="feature-bar-header">
        <span className="feature-bar-name">{name}</span>
        <span className="feature-bar-value">{value}%</span>
      </div>
      <div className="feature-bar-track">
        <div
          className="feature-bar-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function UserMetrics({ data }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">User Metrics</div>
          <div className="card-subtitle">Activity and engagement</div>
        </div>
      </div>
      <div className="card-body">
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-label">DAU</div>
            <div className="metric-value">{data.dau.toLocaleString()}</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">MAU</div>
            <div className="metric-value">{data.mau.toLocaleString()}</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Avg Session</div>
            <div className="metric-value">
              {data.avgSessionDuration}<span className="metric-unit">m</span>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-label">DAU/MAU</div>
            <div className="metric-value">
              {((data.dau / data.mau) * 100).toFixed(1)}<span className="metric-unit">%</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#475569' }}>
            Feature Adoption
          </div>
          <FeatureBar name="Search" value={data.featureAdoption.search} color={COLORS.search} />
          <FeatureBar name="Checkout" value={data.featureAdoption.checkout} color={COLORS.checkout} />
          <FeatureBar name="Wishlist" value={data.featureAdoption.wishlist} color={COLORS.wishlist} />
          <FeatureBar name="Reviews" value={data.featureAdoption.reviews} color={COLORS.reviews} />
        </div>
      </div>
    </div>
  );
}
