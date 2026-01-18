function StatusItem({ name, status, detail }) {
  return (
    <div className="system-item">
      <span className="system-name">{name}</span>
      <span className={`system-status ${status}`}>
        <span className="system-status-dot" />
        {status === 'operational' ? 'OK' : 'Degraded'}
      </span>
    </div>
  );
}

export function SystemStatus({ data }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">System Health</div>
          <div className="card-subtitle">Infrastructure status</div>
        </div>
      </div>
      <div className="card-body">
        <div className="system-status-grid">
          <StatusItem name="API" status={data.api.status} detail={`${data.api.latency}ms`} />
          <StatusItem name="Database" status={data.database.status} detail={`${data.database.connections} conn`} />
          <StatusItem name="CDN" status={data.cdn.status} detail={`${data.cdn.latency}ms`} />
          <StatusItem name="Payments" status={data.payments.status} detail={`${data.payments.latency}ms`} />
        </div>
      </div>
    </div>
  );
}
