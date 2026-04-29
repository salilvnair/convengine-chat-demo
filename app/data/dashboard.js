// Fake data used throughout the demo dashboard

export const METRICS = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$124,850',
    delta: '+12.4%',
    positive: true,
    icon: '💰',
    sub: 'vs last month',
  },
  {
    id: 'users',
    label: 'Active Users',
    value: '8,342',
    delta: '+5.1%',
    positive: true,
    icon: '👥',
    sub: 'vs last month',
  },
  {
    id: 'orders',
    label: 'Orders',
    value: '1,204',
    delta: '-2.3%',
    positive: false,
    icon: '📦',
    sub: 'vs last month',
  },
  {
    id: 'nps',
    label: 'NPS Score',
    value: '72',
    delta: '+3 pts',
    positive: true,
    icon: '⭐',
    sub: 'vs last quarter',
  },
];

export const WEEKLY_REVENUE = [
  { day: 'Mon', amount: 14200 },
  { day: 'Tue', amount: 18900 },
  { day: 'Wed', amount: 16500 },
  { day: 'Thu', amount: 21300 },
  { day: 'Fri', amount: 19800 },
  { day: 'Sat', amount: 11200 },
  { day: 'Sun', amount: 9600 },
];

export const RECENT_ORDERS = [
  { id: 'ORD-1041', customer: 'Alice Nguyen',    product: 'Pro Plan',       amount: '$299',  status: 'Completed',  date: 'Apr 27' },
  { id: 'ORD-1040', customer: 'Bob Martínez',    product: 'Starter Plan',   amount: '$49',   status: 'Completed',  date: 'Apr 27' },
  { id: 'ORD-1039', customer: 'Priya Sharma',    product: 'Enterprise',     amount: '$999',  status: 'Processing', date: 'Apr 26' },
  { id: 'ORD-1038', customer: 'James O\'Brien',  product: 'Pro Plan',       amount: '$299',  status: 'Completed',  date: 'Apr 26' },
  { id: 'ORD-1037', customer: 'Yuki Tanaka',     product: 'Add-on: API',    amount: '$79',   status: 'Refunded',   date: 'Apr 25' },
  { id: 'ORD-1036', customer: 'Sofia Costa',     product: 'Starter Plan',   amount: '$49',   status: 'Completed',  date: 'Apr 25' },
  { id: 'ORD-1035', customer: 'Marcus Lee',      product: 'Enterprise',     amount: '$999',  status: 'Processing', date: 'Apr 24' },
  { id: 'ORD-1034', customer: 'Anika Patel',     product: 'Pro Plan',       amount: '$299',  status: 'Completed',  date: 'Apr 24' },
];

export const TOP_CHANNELS = [
  { channel: 'Organic Search', sessions: 3840, pct: 46 },
  { channel: 'Direct',         sessions: 1920, pct: 23 },
  { channel: 'Referral',       sessions: 1200, pct: 14 },
  { channel: 'Social Media',   sessions: 960,  pct: 12 },
  { channel: 'Email',          sessions: 420,  pct: 5  },
];

// ── Orders page ──────────────────────────────────────────────────────────────
export const ALL_ORDERS = [
  { id: 'ORD-1041', customer: 'Alice Nguyen',     email: 'alice@example.com',  product: 'Pro Plan',     amount: '$299',  status: 'Completed',  date: 'Apr 27, 2026', payment: 'Visa ••4242' },
  { id: 'ORD-1040', customer: 'Bob Martínez',     email: 'bob@example.com',    product: 'Starter Plan', amount: '$49',   status: 'Completed',  date: 'Apr 27, 2026', payment: 'PayPal' },
  { id: 'ORD-1039', customer: 'Priya Sharma',     email: 'priya@example.com',  product: 'Enterprise',   amount: '$999',  status: 'Processing', date: 'Apr 26, 2026', payment: 'Wire' },
  { id: 'ORD-1038', customer: "James O'Brien",    email: 'james@example.com',  product: 'Pro Plan',     amount: '$299',  status: 'Completed',  date: 'Apr 26, 2026', payment: 'Mastercard ••8871' },
  { id: 'ORD-1037', customer: 'Yuki Tanaka',      email: 'yuki@example.com',   product: 'Add-on: API',  amount: '$79',   status: 'Refunded',   date: 'Apr 25, 2026', payment: 'Visa ••1234' },
  { id: 'ORD-1036', customer: 'Sofia Costa',      email: 'sofia@example.com',  product: 'Starter Plan', amount: '$49',   status: 'Completed',  date: 'Apr 25, 2026', payment: 'PayPal' },
  { id: 'ORD-1035', customer: 'Marcus Lee',       email: 'marcus@example.com', product: 'Enterprise',   amount: '$999',  status: 'Processing', date: 'Apr 24, 2026', payment: 'Wire' },
  { id: 'ORD-1034', customer: 'Anika Patel',      email: 'anika@example.com',  product: 'Pro Plan',     amount: '$299',  status: 'Completed',  date: 'Apr 24, 2026', payment: 'Visa ••5678' },
  { id: 'ORD-1033', customer: 'Luca Rossi',       email: 'luca@example.com',   product: 'Starter Plan', amount: '$49',   status: 'Completed',  date: 'Apr 23, 2026', payment: 'Mastercard ••3344' },
  { id: 'ORD-1032', customer: 'Hannah Schmidt',   email: 'hannah@example.com', product: 'Add-on: SSO',  amount: '$149',  status: 'Completed',  date: 'Apr 23, 2026', payment: 'PayPal' },
  { id: 'ORD-1031', customer: 'Chen Wei',         email: 'chen@example.com',   product: 'Enterprise',   amount: '$999',  status: 'Completed',  date: 'Apr 22, 2026', payment: 'Wire' },
  { id: 'ORD-1030', customer: 'Fatima Al-Sayed',  email: 'fatima@example.com', product: 'Pro Plan',     amount: '$299',  status: 'Refunded',   date: 'Apr 22, 2026', payment: 'Visa ••9911' },
];

// ── Analytics page ───────────────────────────────────────────────────────────
export const MONTHLY_REVENUE = [
  { month: 'Nov', amount: 68400 },
  { month: 'Dec', amount: 91200 },
  { month: 'Jan', amount: 74800 },
  { month: 'Feb', amount: 83600 },
  { month: 'Mar', amount: 109400 },
  { month: 'Apr', amount: 124850 },
];

export const CONVERSION_FUNNEL = [
  { stage: 'Visitors',     count: 48200, pct: 100 },
  { stage: 'Sign-ups',     count: 9640,  pct: 20  },
  { stage: 'Trials',       count: 3856,  pct: 8   },
  { stage: 'Paid',         count: 1204,  pct: 2.5 },
  { stage: 'Enterprise',   count: 48,    pct: 0.1 },
];

export const TOP_PRODUCTS = [
  { name: 'Pro Plan',     revenue: '$62,100',  units: 207, growth: '+18%',  positive: true  },
  { name: 'Enterprise',   revenue: '$47,952',  units: 48,  growth: '+31%',  positive: true  },
  { name: 'Starter Plan', revenue: '$9,016',   units: 184, growth: '-4%',   positive: false },
  { name: 'Add-on: API',  revenue: '$3,792',   units: 48,  growth: '+12%',  positive: true  },
  { name: 'Add-on: SSO',  revenue: '$1,990',   units: 14,  growth: '+7%',   positive: true  },
];

