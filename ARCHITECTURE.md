# Mission Control Dashboard - AWS Architecture

## Overview

This document outlines the cloud architecture for deploying the Mission Control Dashboard to AWS with real-time data sources. The architecture is designed for a small team (1-5 users) with SSO authentication and serverless infrastructure.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  AWS CLOUD                                       │
│                                                                                  │
│   ┌─────────────┐                                                               │
│   │   Route 53  │  (Optional: Custom domain DNS)                                │
│   └──────┬──────┘                                                               │
│          │                                                                       │
│          ▼                                                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐       │
│   │                         CloudFront (CDN)                             │       │
│   │   • SSL/TLS termination                                              │       │
│   │   • Edge caching for static assets                                   │       │
│   │   • DDoS protection                                                  │       │
│   └─────────────────────────┬───────────────────────────────────────────┘       │
│                             │                                                    │
│              ┌──────────────┴──────────────┐                                    │
│              │                             │                                    │
│              ▼                             ▼                                    │
│   ┌─────────────────┐          ┌─────────────────────────┐                     │
│   │    S3 Bucket    │          │      API Gateway        │                     │
│   │                 │          │       (REST API)        │                     │
│   │  • React build  │          │                         │                     │
│   │  • Static assets│          │  /api/kpis             │                     │
│   │  • index.html   │          │  /api/revenue          │                     │
│   │                 │          │  /api/users            │                     │
│   └─────────────────┘          │  /api/alerts           │                     │
│                                │  /api/products         │                     │
│                                │  /api/system-health    │                     │
│                                │  /api/ingest/*         │                     │
│                                └───────────┬─────────────┘                     │
│                                            │                                    │
│                                            │ (Authorizer)                       │
│                                            ▼                                    │
│                                ┌─────────────────────────┐                     │
│                                │        Cognito          │                     │
│                                │                         │                     │
│                                │  • User Pool            │                     │
│                                │  • Google SSO           │                     │
│                                │  • Okta Federation      │                     │
│                                │  • JWT tokens           │                     │
│                                └─────────────────────────┘                     │
│                                            │                                    │
│                                            ▼                                    │
│                                ┌─────────────────────────┐                     │
│                                │    Lambda Functions     │                     │
│                                │                         │                     │
│                                │  ┌─────────────────┐    │                     │
│                                │  │ getKPIs         │    │                     │
│                                │  │ getRevenue      │    │                     │
│                                │  │ getUserMetrics  │    │                     │
│                                │  │ getAlerts       │    │                     │
│                                │  │ getTopProducts  │    │                     │
│                                │  │ getSystemHealth │    │                     │
│                                │  │ ingestEvent     │    │                     │
│                                │  │ aggregateStats  │    │                     │
│                                │  └─────────────────┘    │                     │
│                                └───────────┬─────────────┘                     │
│                                            │                                    │
│                    ┌───────────────────────┼───────────────────────┐           │
│                    │                       │                       │           │
│                    ▼                       ▼                       ▼           │
│         ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │
│         │    DynamoDB     │    │   CloudWatch    │    │   EventBridge   │     │
│         │                 │    │                 │    │                 │     │
│         │  Tables:        │    │  • API metrics  │    │  • Scheduled    │     │
│         │  • Orders       │    │  • Lambda logs  │    │    aggregation  │     │
│         │  • Products     │    │  • Custom       │    │  • Every 5 min  │     │
│         │  • UserSessions │    │    dashboards   │    │                 │     │
│         │  • DailyStats   │    │  • Alarms       │    │                 │     │
│         │  • Alerts       │    │                 │    │                 │     │
│         └─────────────────┘    └─────────────────┘    └─────────────────┘     │
│                                            │                                    │
│                                            ▼                                    │
│                                ┌─────────────────────────┐                     │
│                                │          SNS            │                     │
│                                │   (Alert notifications) │                     │
│                                │   • Email               │                     │
│                                │   • Slack webhook       │                     │
│                                └─────────────────────────┘                     │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Hosting

| Component | Configuration | Purpose |
|-----------|---------------|---------|
| **S3 Bucket** | Static website hosting enabled | Stores React production build |
| **CloudFront** | Origin: S3, HTTPS only, HTTP/2 | CDN, SSL termination, caching |
| **Route 53** | A record → CloudFront (optional) | Custom domain (e.g., dashboard.example.com) |

**S3 Bucket Policy:**
- Block all public access
- CloudFront OAI (Origin Access Identity) for secure access

### Authentication (Cognito)

| Setting | Value |
|---------|-------|
| **User Pool** | Email-based sign-up disabled (SSO only) |
| **Identity Providers** | Google, Okta, or SAML 2.0 |
| **App Client** | SPA (no client secret) |
| **OAuth Flows** | Authorization code grant with PKCE |
| **Callback URLs** | https://dashboard.example.com/callback |

**SSO Configuration:**
- Federated identity through Google Workspace or Okta
- JWT tokens for API authorization
- Token refresh handled automatically

### API Layer

| Endpoint | Method | Lambda | Description |
|----------|--------|--------|-------------|
| `/api/kpis` | GET | getKPIs | Revenue, orders, AOV, conversion |
| `/api/revenue` | GET | getRevenue | Weekly revenue trend data |
| `/api/users` | GET | getUserMetrics | DAU, MAU, sessions, feature adoption |
| `/api/alerts` | GET | getAlerts | Active alerts with severity |
| `/api/products` | GET | getTopProducts | Top 5 products by downloads |
| `/api/system-health` | GET | getSystemHealth | API, DB, CDN, payment status |
| `/api/ingest/purchase` | POST | ingestEvent | Record new purchase |
| `/api/ingest/pageview` | POST | ingestEvent | Record page view |
| `/api/ingest/event` | POST | ingestEvent | Record custom event |

**API Gateway Settings:**
- Regional endpoint
- Cognito authorizer on all GET endpoints
- API key required for ingest endpoints
- Throttling: 100 requests/second
- CORS enabled for dashboard domain

### Lambda Functions

| Function | Runtime | Memory | Timeout | Trigger |
|----------|---------|--------|---------|---------|
| getKPIs | Node.js 20.x | 256 MB | 10s | API Gateway |
| getRevenue | Node.js 20.x | 256 MB | 10s | API Gateway |
| getUserMetrics | Node.js 20.x | 256 MB | 10s | API Gateway |
| getAlerts | Node.js 20.x | 256 MB | 10s | API Gateway |
| getTopProducts | Node.js 20.x | 256 MB | 10s | API Gateway |
| getSystemHealth | Node.js 20.x | 256 MB | 10s | API Gateway |
| ingestEvent | Node.js 20.x | 128 MB | 5s | API Gateway |
| aggregateStats | Node.js 20.x | 512 MB | 60s | EventBridge (5 min) |
| evaluateAlerts | Node.js 20.x | 256 MB | 30s | EventBridge (1 min) |

### Database (DynamoDB)

#### Table: Orders
| Attribute | Type | Key |
|-----------|------|-----|
| orderId | String | Partition Key |
| timestamp | Number | Sort Key |
| productId | String | GSI-PK |
| userId | String | GSI-PK |
| amount | Number | |
| productName | String | |

#### Table: Products
| Attribute | Type | Key |
|-----------|------|-----|
| productId | String | Partition Key |
| name | String | |
| price | Number | |
| category | String | |
| downloads24h | Number | |
| revenue24h | Number | |

#### Table: UserSessions
| Attribute | Type | Key |
|-----------|------|-----|
| sessionId | String | Partition Key |
| userId | String | GSI-PK |
| date | String | Sort Key |
| startTime | Number | |
| duration | Number | |
| pageViews | Number | |
| features | List | |

#### Table: DailyStats
| Attribute | Type | Key |
|-----------|------|-----|
| statType | String | Partition Key (e.g., "revenue", "orders") |
| date | String | Sort Key (YYYY-MM-DD) |
| value | Number | |
| previousValue | Number | |
| change | Number | |

#### Table: Alerts
| Attribute | Type | Key |
|-----------|------|-----|
| alertId | String | Partition Key |
| timestamp | Number | Sort Key |
| type | String | (error, warning, info, success) |
| category | String | (business, system) |
| message | String | |
| resolved | Boolean | |

**DynamoDB Settings:**
- On-demand capacity (pay-per-request)
- Point-in-time recovery enabled
- TTL on UserSessions (30 days)

### Scheduled Jobs (EventBridge)

| Rule | Schedule | Target | Purpose |
|------|----------|--------|---------|
| aggregate-stats | rate(5 minutes) | aggregateStats Lambda | Roll up metrics |
| evaluate-alerts | rate(1 minute) | evaluateAlerts Lambda | Check thresholds |
| daily-rollup | cron(0 0 * * ? *) | aggregateStats Lambda | Daily summary |

### Monitoring & Alerts

#### CloudWatch Alarms
| Alarm | Metric | Threshold | Action |
|-------|--------|-----------|--------|
| High API Latency | API Gateway latency | > 1000ms for 5 min | SNS notification |
| Lambda Errors | Lambda error count | > 5 in 5 min | SNS notification |
| DynamoDB Throttling | Throttled requests | > 0 | SNS notification |
| Revenue Drop | Custom metric | -20% vs yesterday | SNS notification |

#### CloudWatch Dashboard
- API request count and latency
- Lambda invocations and errors
- DynamoDB read/write capacity
- Custom business metrics

## Data Flow

### Real-Time Dashboard Updates

```
┌──────────┐     ┌───────────┐     ┌────────┐     ┌──────────┐     ┌──────────┐
│ Browser  │────▶│ CloudFront│────▶│  API   │────▶│  Lambda  │────▶│ DynamoDB │
│ (React)  │     │           │     │Gateway │     │          │     │          │
└──────────┘     └───────────┘     └────────┘     └──────────┘     └──────────┘
     │                                                                    │
     │◀───────────────────── JSON Response ◀──────────────────────────────┘
     │
     │ (Poll every 5 seconds)
     ▼
┌──────────┐
│ Update   │
│   UI     │
└──────────┘
```

### Event Ingestion (Purchase)

```
┌──────────┐     ┌────────┐     ┌──────────┐     ┌──────────┐
│ Purchase │────▶│  API   │────▶│  Lambda  │────▶│ DynamoDB │
│  Event   │     │Gateway │     │ (ingest) │     │ (Orders) │
└──────────┘     └────────┘     └──────────┘     └──────────┘
                                      │
                                      ▼
                               ┌──────────┐
                               │ Update   │
                               │ Product  │
                               │ Counters │
                               └──────────┘
```

### Alert Evaluation

```
┌─────────────┐     ┌──────────┐     ┌──────────┐     ┌─────────┐
│ EventBridge │────▶│  Lambda  │────▶│ DynamoDB │────▶│   SNS   │
│ (1 min)     │     │(evaluate)│     │ (Alerts) │     │ (notify)│
└─────────────┘     └──────────┘     └──────────┘     └─────────┘
                          │                                 │
                          ▼                                 ▼
                   ┌──────────┐                      ┌──────────┐
                   │CloudWatch│                      │  Email/  │
                   │ Metrics  │                      │  Slack   │
                   └──────────┘                      └──────────┘
```

## Security

### Network Security
- All traffic over HTTPS (TLS 1.2+)
- CloudFront with AWS WAF (optional)
- API Gateway throttling and quotas
- No public access to S3 bucket

### Authentication & Authorization
- Cognito JWT tokens required for all API calls
- API keys for ingestion endpoints
- IAM roles with least-privilege for Lambda
- Secrets Manager for external API keys

### Data Protection
- DynamoDB encryption at rest (AWS managed)
- CloudWatch Logs encrypted
- S3 bucket encryption enabled

## Cost Estimate

### Monthly Costs (1-5 Users)

| Service | Usage Estimate | Cost |
|---------|----------------|------|
| **S3** | 50 MB storage, 10k requests | $1 |
| **CloudFront** | 10 GB transfer, 100k requests | $2-5 |
| **API Gateway** | 500k requests | $2 |
| **Lambda** | 1M invocations, 50k GB-seconds | $1-5 |
| **DynamoDB** | On-demand, ~1M read/write | $5-10 |
| **Cognito** | < 50k MAU | Free |
| **CloudWatch** | Logs, metrics, alarms | $5-10 |
| **Route 53** | 1 hosted zone (optional) | $0.50 |
| | | |
| **Total** | | **$15-35/month** |

### Cost Optimization Tips
- Use CloudFront caching to reduce API calls
- Set DynamoDB TTL to auto-delete old sessions
- Use Lambda ARM64 architecture (20% cheaper)
- Enable S3 Intelligent-Tiering for logs

## Deployment

### Infrastructure as Code
Recommended: AWS CDK (TypeScript) or Terraform

```
infrastructure/
├── lib/
│   ├── frontend-stack.ts    # S3, CloudFront
│   ├── auth-stack.ts        # Cognito
│   ├── api-stack.ts         # API Gateway, Lambda
│   ├── database-stack.ts    # DynamoDB
│   └── monitoring-stack.ts  # CloudWatch, SNS
├── bin/
│   └── app.ts
└── cdk.json
```

### CI/CD Pipeline
```
GitHub Push → GitHub Actions → Build React → Deploy to S3 → Invalidate CloudFront
                            → Build Lambda → Deploy via CDK
```

### Environment Strategy
| Environment | Purpose | Cost |
|-------------|---------|------|
| **dev** | Development and testing | ~$10/month |
| **prod** | Production dashboard | ~$25/month |

## Future Enhancements

### Phase 2
- [ ] WebSocket API for true real-time updates
- [ ] Redis (ElastiCache) for sub-millisecond reads
- [ ] RDS for complex SQL queries and reporting

### Phase 3
- [ ] Multi-region deployment for global access
- [ ] Data lake (S3 + Athena) for historical analysis
- [ ] Machine learning alerts (anomaly detection)

---

*Document created: January 2026*
*Last updated: January 2026*
