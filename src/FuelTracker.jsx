import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";

const WTI_DATA = [
  { date: "Feb 24", price: 65.2 },
  { date: "Feb 25", price: 66.8 },
  { date: "Feb 26", price: 69.1 },
  { date: "Feb 27", price: 74.3 },
  { date: "Feb 28", price: 84.7 },
  { date: "Mar 1",  price: 89.2 },
  { date: "Mar 2",  price: 92.6 },
  { date: "Mar 3",  price: 94.3 },
  { date: "Mar 4",  price: 92.8 },
  { date: "Mar 5",  price: 95.4 },
  { date: "Mar 6",  price: 97.9 },
  { date: "Mar 7",  price: 96.1 },
  { date: "Mar 8",  price: 98.7 },
  { date: "Mar 9",  price: 90.2 },
  { date: "Mar 10", price: 89.6 },
  { date: "Mar 11", price: 87.4 },
  { date: "Mar 12", price: 95.9 },
  { date: "Mar 13", price: 98.9 },
  { date: "Mar 14", price: 103.7 },
  { date: "Mar 15", price: 105.8 },
  { date: "Mar 16", price: 93.7 },
  { date: "Mar 17", price: 93.7 },
];

const WTITooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0f1724", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
        <div style={{ color: "#64748b", marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>{label}</div>
        <div style={{ color: "#f97316", fontWeight: 700 }}>${payload[0].value.toFixed(2)} <span style={{ fontWeight: 400, color: "#64748b" }}>/ barrel</span></div>
      </div>
    );
  }
  return null;
};

const FUEL_DATA = [
  { date: "Feb 20", petrol: null, diesel: null, jet: null, note: "Pre-conflict baseline" },
  { date: "Feb 28", petrol: 36, diesel: 34, jet: 32, note: "Conflict begins" },
  { date: "Mar 8",  petrol: 36, diesel: 34, jet: 32, note: "Bowen Parliament statement" },
  { date: "Mar 13", petrol: 37, diesel: 30, jet: 29, note: "Weekly press conference — 1.6B L petrol, reserves released" },
];

const PRICE_DATA = {
  petrol: [
    { city: "Sydney",    price: 240.2, change: +52.1 },
    { city: "Melbourne", price: 238.1, change: +46.3 },
    { city: "Brisbane",  price: 237.4, change: +44.8 },
    { city: "Adelaide",  price: 239.8, change: +55.2 },
    { city: "Perth",     price: 241.0, change: +59.5 },
    { city: "Canberra",  price: 225.0, change: +38.6 },
    { city: "Hobart",    price: 236.5, change: +43.1 },
    { city: "Darwin",    price: 248.3, change: +47.2 },
  ],
  diesel: [
    { city: "Sydney",    price: 230.5, change: +67.8 },
    { city: "Melbourne", price: 218.3, change: +51.2 },
    { city: "Brisbane",  price: 215.6, change: +48.3 },
    { city: "Adelaide",  price: 219.1, change: +53.7 },
    { city: "Perth",     price: 222.4, change: +55.1 },
    { city: "Canberra",  price: 205.0, change: +44.2 },
    { city: "Hobart",    price: 216.8, change: +46.5 },
    { city: "Darwin",    price: 240.1, change: +58.3 },
  ],
};

const IEA_TARGET = 90;

function GaugeBar({ value, max = 90, label, color }) {
  const pct = Math.min((value / max) * 100, 100);
  const zone = value < 30 ? "#ef4444" : value < 60 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700, color: zone }}>{value}<span style={{ fontSize: 13, color: "#64748b", marginLeft: 3 }}>days</span></span>
      </div>
      <div style={{ height: 10, background: "#1e293b", borderRadius: 6, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: `${(30/90)*100}%`, top: 0, bottom: 0, width: 1, background: "#ef444455" }} />
        <div style={{ position: "absolute", left: `${(60/90)*100}%`, top: 0, bottom: 0, width: 1, background: "#f59e0b55" }} />
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${zone}88, ${zone})`, borderRadius: 6, transition: "width 0.8s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 10, color: "#475569" }}>0</span>
        <span style={{ fontSize: 10, color: "#ef4444" }}>30</span>
        <span style={{ fontSize: 10, color: "#f59e0b" }}>60</span>
        <span style={{ fontSize: 10, color: "#22c55e" }}>90 (IEA)</span>
      </div>
    </div>
  );
}

function PriceTable({ data, fuelType }) {
  const sorted = [...data].sort((a, b) => a.price - b.price);
  const min = sorted[0].price;
  const max = sorted[sorted.length - 1].price;
  const median = sorted[Math.floor(sorted.length / 2)].price;

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {[
          { label: "Lowest", val: min, city: sorted[0].city, col: "#22c55e" },
          { label: "Median", val: median, city: "National", col: "#f59e0b" },
          { label: "Highest", val: max, city: sorted[sorted.length - 1].city, col: "#ef4444" },
        ].map(({ label, val, city, col }) => (
          <div key={label} style={{ flex: 1, background: "#0f1724", border: `1px solid ${col}22`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: col, fontFamily: "'DM Mono', monospace" }}>{val.toFixed(1)}<span style={{ fontSize: 11 }}>¢</span></div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{city}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {sorted.map(({ city, price, change }) => {
          const pct = ((price - min) / (max - min));
          const col = pct < 0.33 ? "#22c55e" : pct < 0.66 ? "#f59e0b" : "#ef4444";
          return (
            <div key={city} style={{ background: "#0f1724", borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #1e293b" }}>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{city}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 700, color: col }}>{price.toFixed(1)}¢</div>
                <div style={{ fontSize: 11, color: "#ef4444" }}>+{change.toFixed(1)}¢ since Feb 20</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0f1724", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
        <div style={{ color: "#64748b", marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>{label}</div>
        {payload.map(p => p.value != null && (
          <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
            {p.name}: <strong>{p.value} days</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function FuelTracker() {
  const [priceTab, setPriceTab] = useState("petrol");
  const latest = FUEL_DATA[FUEL_DATA.length - 1];
  const prev   = FUEL_DATA[FUEL_DATA.length - 2];

  const petrolChange = latest.petrol - prev.petrol;
  const dieselChange = latest.diesel - prev.diesel;

  const avgPetrol = (PRICE_DATA.petrol.reduce((s, d) => s + d.price, 0) / PRICE_DATA.petrol.length).toFixed(1);
  const avgDiesel = (PRICE_DATA.diesel.reduce((s, d) => s + d.price, 0) / PRICE_DATA.diesel.length).toFixed(1);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070d16",
      color: "#e2e8f0",
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "0 0 60px 0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #0a1628 0%, #070d16 100%)",
        borderBottom: "1px solid #1e293b",
        padding: "28px 32px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 280, height: 280,
          background: "radial-gradient(circle, #ef444415 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 8px #ef4444", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, color: "#ef4444", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Live Monitoring</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              🇦🇺 Australia Fuel Security
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#64748b" }}>
              Stock levels · Capital city prices · Updated weekly via DCCEEW &amp; ACCC
            </p>
          </div>
          <div style={{ background: "#0f1724", border: "1px solid #1e293b", borderRadius: 10, padding: "10px 16px", textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", marginBottom: 3 }}>LAST UPDATE</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8" }}>13 Mar 2026</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Minister Bowen press conf.</div>
          </div>
        </div>

        {/* Alert banner */}
        <div style={{
          marginTop: 20,
          background: "#1a0a0a",
          border: "1px solid #ef444433",
          borderRadius: 8,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span style={{ color: "#fca5a5" }}>
            <strong>Middle East crisis:</strong> US–Iran conflict disrupting global supply chains. Regional shortages reported. Fuel standards relaxed for 60 days. IEA releasing 400M barrels globally.
          </span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* WTI Crude Chart */}
      <div style={{ padding: "16px 32px 0", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ background: "#0a1120", border: "1px solid #1e293b", borderRadius: 14, padding: "20px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>WTI Crude — Global Spot Price</h2>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#475569" }}>USD per barrel · daily · last 3 weeks · West Texas Intermediate</p>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700, color: "#f97316" }}>
                  ${WTI_DATA[WTI_DATA.length - 1].price.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: "#ef4444", marginTop: 1 }}>
                  +${(WTI_DATA[WTI_DATA.length - 1].price - WTI_DATA[0].price).toFixed(2)} since Feb 24
                </div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={WTI_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wtiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis domain={[60, 110]} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<WTITooltip />} />
              <ReferenceLine x="Feb 28" stroke="#ef444466" strokeDasharray="4 4" label={{ value: "Crisis", fill: "#ef4444", fontSize: 10 }} />
              <Area type="monotone" dataKey="price" stroke="#f97316" strokeWidth={2} fill="url(#wtiGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: 860, margin: "0 auto" }}>

        {/* Stock Gauges */}
        <div style={{ background: "#0a1120", border: "1px solid #1e293b", borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>National Fuel Stock Levels</h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#475569" }}>MSO-compliant stocks · days of consumption equivalent</p>
            </div>
            <div style={{ fontSize: 11, color: "#475569", textAlign: "right", fontFamily: "'DM Mono', monospace" }}>
              <div>IEA requirement: <span style={{ color: "#22c55e" }}>90 days</span></div>
              <div>MSO minimum petrol: <span style={{ color: "#f59e0b" }}>27 days</span></div>
            </div>
          </div>
          <GaugeBar value={latest.petrol} label="Petrol (ULP)" />
          <GaugeBar value={latest.diesel} label="Diesel" />
          <GaugeBar value={latest.jet}    label="Jet Fuel" />

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {[
              { label: "Petrol", val: petrolChange, prev: prev.petrol },
              { label: "Diesel", val: dieselChange, prev: prev.diesel },
            ].map(({ label, val, prev: p }) => (
              <div key={label} style={{ flex: 1, background: "#070d16", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{label} WoW</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: val >= 0 ? "#22c55e" : "#ef4444" }}>
                  {val >= 0 ? "+" : ""}{val} days
                </div>
                <div style={{ fontSize: 11, color: "#475569" }}>was {p} days</div>
              </div>
            ))}
            <div style={{ flex: 1, background: "#070d16", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>IEA Gap (Petrol)</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>-{IEA_TARGET - latest.petrol} days</div>
              <div style={{ fontSize: 11, color: "#475569" }}>below 90-day target</div>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div style={{ background: "#0a1120", border: "1px solid #1e293b", borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700 }}>Stock Level Trend</h2>
          <p style={{ margin: "0 0 20px", fontSize: 12, color: "#475569" }}>Days of consumption equivalent · weekly snapshots</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={FUEL_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 95]} tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={90} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "IEA 90d", fill: "#22c55e", fontSize: 11 }} />
              <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "30d", fill: "#ef4444", fontSize: 11 }} />
              <Line type="monotone" dataKey="petrol" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} name="Petrol" connectNulls />
              <Line type="monotone" dataKey="diesel" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b", r: 4 }} name="Diesel" connectNulls />
              <Line type="monotone" dataKey="jet"    stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} name="Jet Fuel" connectNulls />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 20, marginTop: 10, justifyContent: "center" }}>
            {[["#3b82f6", "Petrol"], ["#f59e0b", "Diesel"], ["#8b5cf6", "Jet Fuel"]].map(([col, lbl]) => (
              <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                <div style={{ width: 20, height: 2.5, background: col, borderRadius: 2 }} />
                {lbl}
              </div>
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div style={{ background: "#0a1120", border: "1px solid #1e293b", borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Capital City Retail Prices</h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#475569" }}>Cents per litre · as at 11 March 2026 · Source: ACCC weekly report</p>
            </div>
            <div style={{ display: "flex", background: "#070d16", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
              {["petrol", "diesel"].map(t => (
                <button key={t} onClick={() => setPriceTab(t)} style={{
                  padding: "8px 18px",
                  background: priceTab === t ? "#1e3a5f" : "transparent",
                  color: priceTab === t ? "#93c5fd" : "#475569",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "capitalize",
                  transition: "all 0.2s",
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <PriceTable data={PRICE_DATA[priceTab]} fuelType={priceTab} />

          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <div style={{ flex: 1, background: "#070d16", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>5-CITY AVG PETROL</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f59e0b", fontFamily: "'DM Mono', monospace" }}>{avgPetrol}¢/L</div>
              <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>+48.8¢ since Feb 20</div>
            </div>
            <div style={{ flex: 1, background: "#070d16", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>5-CITY AVG DIESEL</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f59e0b", fontFamily: "'DM Mono', monospace" }}>{avgDiesel}¢/L</div>
              <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>Q4 2025 baseline: 185.9¢</div>
            </div>
            <div style={{ flex: 1, background: "#070d16", border: "1px solid #1e293b", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>ACCC MONITORING</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#22c55e" }}>🟢 Active</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Weekly updates · 8 cities</div>
            </div>
          </div>
        </div>

        {/* Sources */}
        <div style={{ background: "#0a1120", border: "1px solid #1e293b", borderRadius: 14, padding: "20px 28px" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#64748b" }}>Data Sources</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["Stock levels", "DCCEEW MSO Weekly + Minister Bowen press conf.", "#3b82f6"],
              ["Retail prices", "ACCC Weekly Fuel Price Monitoring Update", "#22c55e"],
              ["Wholesale (TGP)", "Australian Institute of Petroleum (AIP)", "#f59e0b"],
              ["WTI spot price", "U.S. EIA · West Texas Intermediate (Cushing, OK)", "#f97316"],
              ["Monthly historical", "Australian Petroleum Statistics (energy.gov.au)", "#8b5cf6"],
            ].map(([label, source, col]) => (
              <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 3, minWidth: 3, height: 36, background: col, borderRadius: 2, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>{label}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{source}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "10px 14px", background: "#070d16", borderRadius: 8, fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
            ⚡ <strong style={{ color: "#64748b" }}>Update cadence:</strong> Stock levels updated weekly (Bowen press conf. + DCCEEW). Retail prices from ACCC weekly report (Fridays). No live API exists — data entered manually. Next update expected ~20 March 2026.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #1e293b",
        marginTop: 40,
        padding: "24px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            background: "linear-gradient(135deg, #1e3a5f, #0f2240)",
            border: "1px solid #2d4f7c",
            borderRadius: 8,
            padding: "6px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#93c5fd", letterSpacing: "-0.01em" }}>Data Grid</span>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
              Analytics for Australian businesses ·{" "}
              <a
                href="https://datagrid.com.au"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}
              >
                datagrid.com.au
              </a>
              {" "}· <span style={{ color: "#475569" }}>← update this link when site is live</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#334155", textAlign: "right", lineHeight: 1.7 }}>
          <div>Data sourced from DCCEEW, ACCC &amp; AIP · Updated weekly</div>
          <div>Not affiliated with the Australian Government</div>
        </div>
      </div>
    </div>
  );
}
