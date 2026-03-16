# 🇦🇺 Australia Fuel Security Tracker

A real-time dashboard tracking Australia's national fuel stock levels and capital city retail prices — inspired by the COVID-era daily dashboards that made complex data accessible to everyone.

Built in response to the 2026 Middle East conflict (US–Iran war) that disrupted global oil supply chains and triggered Australia's first fuel security crisis in over a decade.

![Dashboard preview](./docs/preview.png)

---

## What It Tracks

### Fuel Stock Levels (days of consumption)
- **Petrol (ULP)** — national MSO-compliant stock
- **Diesel** — national MSO-compliant stock
- **Jet Fuel** — national stock
- Week-on-week delta and IEA 90-day benchmark gap

### Capital City Retail Prices (cents per litre)
- All 8 capital cities: Sydney, Melbourne, Brisbane, Adelaide, Perth, Canberra, Hobart, Darwin
- Petrol and Diesel tabs
- Lowest / Median / Highest summary with per-city change since Feb 20 baseline

### Historical Trend Chart
- Weekly snapshots since the crisis began
- IEA 90-day reference line
- MSO minimum obligation reference

---

## Data Sources

| Data | Source | Cadence |
|---|---|---|
| Stock levels (days) | [DCCEEW MSO statistics](https://www.dcceew.gov.au/energy/security/australias-fuel-security/minimum-stockholding-obligation/statistics) + Minister Bowen press conferences | Weekly |
| Retail prices (cpl) | [ACCC Weekly Fuel Price Monitoring Update](https://www.accc.gov.au/about-us/publications/weekly-fuel-price-monitoring-update) | Weekly (Fridays) |
| Wholesale (TGP) | [Australian Institute of Petroleum](https://www.aip.com.au/pricing/terminal-gate-prices) | Daily |
| Monthly historical | [Australian Petroleum Statistics](https://www.energy.gov.au/energy-data/australian-petroleum-statistics) | Monthly |

> **No live API exists for fuel stock levels.** The DCCEEW collects weekly MSO reports from industry internally via the Liquid Fuels Gateway. The publicly available figure comes from Minister Bowen's weekly press conferences and Parliament statements. Data is entered manually after each update.

---

## How to Update (Weekly)

Updates happen in two steps — stock levels on ~Thursday/Friday after Bowen speaks, prices from the ACCC Friday report.

### 1. Update stock levels

In `src/FuelTracker.jsx`, find the `FUEL_DATA` array and add a new entry:

```js
const FUEL_DATA = [
  // ... existing entries
  {
    date: "Mar 20",       // Short date label for chart axis
    petrol: 38,           // Days of petrol stock (from Bowen press conf.)
    diesel: 31,           // Days of diesel stock
    jet: 30,              // Days of jet fuel stock
    note: "Weekly update — [brief context]"
  },
];
```

**Where to find the number:** Watch for Minister Bowen's weekly press conference (usually Thursday or Friday), or check:
- [minister.dcceew.gov.au/bowen/media-releases](https://minister.dcceew.gov.au/bowen/media-releases)
- ABC News / SBS News coverage of the press conference

### 2. Update retail prices

Find the `PRICE_DATA` object and update the `price` and `change` fields for each city:

```js
const PRICE_DATA = {
  petrol: [
    { city: "Sydney",    price: 245.1, change: +57.0 },  // cpl, change from Feb 20 baseline
    // ... other cities
  ],
  diesel: [
    { city: "Sydney",    price: 235.2, change: +72.5 },
    // ... other cities
  ],
};
```

**Where to find the numbers:** ACCC publishes every Friday at:
[accc.gov.au/about-us/publications/weekly-fuel-price-monitoring-update](https://www.accc.gov.au/about-us/publications/weekly-fuel-price-monitoring-update)

The PDF report contains a table of daily average retail prices for all 8 cities as at the most recent Wednesday.

> The `change` field is always relative to the **Feb 20, 2026 pre-conflict baseline** — don't reset this to the previous week's figure.

---

## Tech Stack

- **React** (Vite)
- **Recharts** — trend line chart
- **Tailwind CSS** — layout utilities
- Pure CSS for gauges and colour coding

No backend. No API calls. Fully static — deployable to GitHub Pages, Vercel, or Netlify in one click.

---

## Project Structure

```
fuel-tracker/
├── README.md
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx          # React entry point
    └── FuelTracker.jsx   # Dashboard component (all data + UI)
```

---

## Understanding the Numbers

### MSO Days vs IEA Days

There are three different "days of fuel" measures used in Australia — they are **not directly comparable**:

| Measure | What it includes | Who reports it |
|---|---|---|
| **MSO days** (what this tracker uses) | On-land stocks + EEZ waters + pipeline + crude at refineries | DCCEEW weekly |
| **Consumption cover days** | On-land + coastal waters only, end of month | Australian Petroleum Statistics (monthly) |
| **IEA days** | On-land + coastal, net imports basis | IEA / DCCEEW (monthly) |

This tracker uses **MSO days** as reported by the minister — the most comprehensive and most current measure.

### The IEA 90-Day Obligation

Australia has been non-compliant with the IEA's 90-day reserve requirement since 2012. The IEA average among net-importing member nations is ~141 days. Australia's MSO minimum is 27 days for petrol and 32 days for diesel.

### Colour Zones

| Colour | Range | Meaning |
|---|---|---|
| 🔴 Red | < 30 days | Critical — below MSO minimum |
| 🟡 Amber | 30–60 days | Low — current crisis range |
| 🟢 Green | 60–90 days | Adequate |
| ✅ IEA line | 90 days | International compliance target |

---

## Deployment

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

Deploy to Vercel by connecting this repo at [vercel.com/new](https://vercel.com/new) — zero config required for Vite + React.

---

## Background

Australia consumes approximately **44 million litres of petrol** and **92 million litres of diesel** every 24 hours. With only two domestic refineries remaining (Ampol Lytton in Brisbane and Viva Energy in Geelong), over 90% of refined fuel is imported — primarily from Singapore, South Korea, and Japan.

The 2026 Middle East conflict disrupted the Strait of Hormuz transit corridor, triggering panic buying, regional shortages, and a ~50 cent per litre retail price spike within two weeks. The federal government responded by:

- Releasing 762 million litres from domestic reserves
- Relaxing fuel sulphur standards for 60 days (adding ~100M litres/month to supply)
- Commissioning the IEA to release 400 million barrels globally
- Mandating weekly ACCC fuel price monitoring reports

This tracker was built to make that data visible in one place.

---

## Contributing

PRs welcome for:

- Automated scraping of the ACCC weekly PDF
- Historical price chart per city
- Regional location price data (ACCC expanding to 190 locations)
- Mobile layout improvements

---

## License

MIT — use freely, attribution appreciated.

---

*Data entered manually from public government sources. Not affiliated with DCCEEW, ACCC, or the Australian Government.*
