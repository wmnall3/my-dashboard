export function TopProducts({ products }) {
  const totalDownloads = products.reduce((sum, p) => sum + p.downloads, 0);
  const totalRevenue = products.reduce((sum, p) => sum + parseFloat(p.revenue), 0);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Top 5 Products</div>
          <div className="card-subtitle">Last 24 hours</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Total Revenue</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', fontFamily: "'JetBrains Mono', monospace" }}>
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
      <div className="card-body" style={{ padding: '12px 20px 20px' }}>
        <div className="products-list">
          {products.map((product, index) => (
            <div key={product.id} className="product-item">
              <div className="product-rank">#{index + 1}</div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-price">${product.price}</div>
              </div>
              <div className="product-stats">
                <div className="product-downloads">
                  <span className="stat-value">{product.downloads}</span>
                  <span className="stat-label">downloads</span>
                </div>
                <div className="product-revenue">${product.revenue}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="products-footer">
          <span>{totalDownloads} total downloads</span>
        </div>
      </div>
    </div>
  );
}
