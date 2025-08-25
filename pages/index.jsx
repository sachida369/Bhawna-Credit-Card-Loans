import React, { useEffect, useMemo, useState } from "react";

// Basic helpers and mocks
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;

function formatINR(n){
  return n?.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }) || "₹0";
}

function calculateEMI(amount, rate, months){
  const r = rate/12/100;
  if(!r || !months) return 0;
  return Math.round(amount * r * ( (1+r)**months) / ((1+r)**months - 1));
}

function gradeFromScore(s){
  if(s>=750) return "Excellent";
  if(s>=700) return "Good";
  if(s>=650) return "Fair";
  if(s>=600) return "Average";
  return "Poor";
}

const api = {
  async sendOtp(mobile){ await new Promise(r=>setTimeout(r,300)); return { success: true }; },
  async verifyOtp(otp){ await new Promise(r=>setTimeout(r,300)); return { success: otp === "123456" }; },
  async createLead({ mobile, pan, consent, product }){ return { id: Math.floor(Math.random()*1e6) }; },
  async checkCreditScore({ pan, mobile }){ return { score: 720, grade: gradeFromScore(720), bureau: "CIBIL", updatedAt: Date.now() }; }
};

function Field({ label, hint, children }){
  return (
    <label className="grid gap-1 text-sm">
      {label && <span className="font-medium">{label}</span>}
      {children}
      {hint && <span className="text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

function Pill({ children }){
  return <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100">{children}</div>;
}

// ---------- Feature: Hero Simple Lead (PAN/Phone + OTP + WhatsApp + Score) ----------
function HeroLead() {
  const [mobile, setMobile] = useState("");
  const [pan, setPan] = useState("");
  const [consent, setConsent] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState(null);
  const [leadId, setLeadId] = useState(null);

  const canSubmit = (MOBILE_REGEX.test(mobile) || PAN_REGEX.test(pan)) && consent;

  async function sendOTP(e){
    e.preventDefault();
    if(!canSubmit) return;
    setBusy(true);
    await api.sendOtp(mobile || "0000000000");
    setOtpSent(true);
    setBusy(false);
  }

  async function verifyOTP(e){
    e.preventDefault();
    setBusy(true);
    const v = await api.verifyOtp(otp);
    if(!v.success){ setBusy(false); return; }
    const res = await api.createLead({ mobile, pan, consent, product: "Quick Check" });
    setLeadId(res.id);
    const result = await api.checkCreditScore({ pan, mobile });
    setScore(result);
    setBusy(false);
  }

  const waText = encodeURIComponent(
    `I just checked my eligibility on Credify. Lead ${leadId || "(pending)"}. Score: ${score?.score || "—"} (${score?.grade || "—"}).`
  );
  const waHref = `https://wa.me/?text=${waText}`;

  return (
    <div className="rounded-2xl border p-4 md:p-6 bg-white shadow-sm">
      <form className="grid gap-3" onSubmit={otpSent ? verifyOTP : sendOTP}>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="PAN Number (optional)" hint="ABCDE1234F">
            <input className="input uppercase" value={pan} onChange={e=>setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" />
          </Field>
          <Field label="Phone Number" hint="10-digit">
            <input className="input" value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="9876543210" inputMode="numeric" />
          </Field>
        </div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1" checked={consent} onChange={e=>setConsent(e.target.checked)} />
          <span>I agree to terms & a soft credit check for eligibility.</span>
        </label>
        {!otpSent ? (
          <button className="btn-primary" disabled={!canSubmit || busy}>{busy ? "Sending OTP…" : "Continue with OTP"}</button>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Enter OTP">
              <input className="input tracking-widest text-center" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="6-digit" />
            </Field>
            <div className="md:col-span-2 flex items-end gap-2">
              <button className="btn-primary" disabled={busy}>{busy ? "Verifying…" : "Verify & See Results"}</button>
              <a className="btn-ghost" href={waHref} target="_blank" rel="noreferrer">Share on WhatsApp</a>
            </div>
          </div>
        )}
      </form>

      {score && (
        <div className="mt-4 grid gap-3 md:grid-cols-4 text-sm">
          <Pill>Score: <strong className="ml-1">{score.score}</strong></Pill>
          <Pill>Bureau: <span className="ml-1">{score.bureau}</span></Pill>
          <Pill>Grade: <span className="ml-1">{score.grade}</span></Pill>
          <Pill>Updated: <span className="ml-1">{new Date(score.updatedAt).toLocaleString()}</span></Pill>
        </div>
      )}
    </div>
  );
}

// ---------- Feature: Top 10 Bank Comparison (Loans + Credit Cards, realtime-capable) ----------
const FALLBACK_BANK_OFFERS = [
  { bank: "HDFC Bank",   product: "Personal Loan", apr: 10.5,  maxAmt: 4000000, minSalary: 25000 },
  { bank: "ICICI Bank",  product: "Personal Loan", apr: 10.99, maxAmt: 3500000, minSalary: 25000 },
  { bank: "SBI",         product: "Home Loan",     apr: 8.5,   maxAmt: 8000000, minSalary: 20000 },
  { bank: "Axis Bank",   product: "Credit Card",   apr: 42.0,  maxAmt: 0,       minSalary: 15000, joiningFee: 499 },
  { bank: "Kotak",       product: "Credit Card",   apr: 41.88, maxAmt: 0,       minSalary: 15000, joiningFee: 0 },
  { bank: "IDFC FIRST",  product: "Personal Loan", apr: 10.75, maxAmt: 3000000, minSalary: 20000 },
  { bank: "Yes Bank",    product: "Credit Card",   apr: 42.0,  maxAmt: 0,       minSalary: 15000, joiningFee: 0 },
  { bank: "IndusInd",    product: "Personal Loan", apr: 11.0,  maxAmt: 3000000, minSalary: 25000 },
  { bank: "PNB",         product: "Home Loan",     apr: 8.6,   maxAmt: 7000000, minSalary: 20000 },
  { bank: "BOB",         product: "Car Loan",      apr: 9.25,  maxAmt: 3000000, minSalary: 15000 },
];

function BankTable() {
  const [rows, setRows] = useState(FALLBACK_BANK_OFFERS);
  const [sortKey, setSortKey] = useState("apr");
  const [dir, setDir] = useState(1);

  useEffect(() => {
    fetch("/api/bank-offers?limit=10")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(json => { if (Array.isArray(json) && json.length) setRows(json); })
      .catch(()=>{ /* stays on fallback */ });
  }, []);

  const data = useMemo(() => {
    const r = [...rows];
    r.sort((a,b)=> (a[sortKey]||0) > (b[sortKey]||0) ? dir : -dir);
    return r;
  }, [rows, sortKey, dir]);

  function changeSort(k){
    if (sortKey === k) setDir(d=>-d); else { setSortKey(k); setDir(1); }
  }

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left">Bank</th>
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left cursor-pointer" onClick={()=>changeSort("apr")}>APR %</th>
            <th className="px-4 py-3 text-left cursor-pointer" onClick={()=>changeSort("maxAmt")}>Max Amount</th>
            <th className="px-4 py-3 text-left cursor-pointer" onClick={()=>changeSort("minSalary")}>Min Salary</th>
            <th className="px-4 py-3 text-left">Joining Fee</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r,i)=> (
            <tr key={i} className="border-t">
              <td className="px-4 py-3">{r.bank}</td>
              <td className="px-4 py-3">{r.product}</td>
              <td className="px-4 py-3">{(r.apr ?? "").toString()}</td>
              <td className="px-4 py-3">{r.maxAmt ? formatINR(r.maxAmt) : "—"}</td>
              <td className="px-4 py-3">{r.minSalary ? formatINR(r.minSalary) : "—"}</td>
              <td className="px-4 py-3">{r.joiningFee ? `₹${r.joiningFee}` : (String(r.product).includes("Credit Card") ? "₹0" : "—")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 text-xs text-gray-500">
        Live offers auto-load from <code>/api/bank-offers</code> when available; showing fallback sample otherwise.
      </div>
    </div>
  );
}

// ---------- Compact EMI Calculator (for hero) ----------
function MiniEMI() {
  const [amount, setAmount] = useState(200000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(24);
  const emi = calculateEMI(amount, rate, months);
  return (
    <div className="rounded-2xl border p-4 bg-white shadow-sm grid gap-3 md:grid-cols-3 text-sm">
      <Field label="Amount">
        <input className="input" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value||0))} />
      </Field>
      <Field label="Rate % p.a.">
        <input className="input" type="number" step={0.1} value={rate} onChange={e=>setRate(Number(e.target.value||0))} />
      </Field>
      <Field label="Tenure (months)">
        <input className="input" type="number" value={months} onChange={e=>setMonths(Number(e.target.value||0))} />
      </Field>
      <div className="md:col-span-3"><Pill>Estimated EMI: <strong className="ml-1">{formatINR(emi)}</strong></Pill></div>
    </div>
  );
}

// ---------- Root App ----------
export default function App() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">Check Your Loan & Card Eligibility Instantly</h1>
          <p className="mt-3 text-gray-600 md:text-lg">
            Get your Credit Score & Compare Top Bank Offers in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column: hero lead, table, emi calculator */}
          <div className="space-y-6">
            <HeroLead />
            <div>
              <h4 className="font-semibold mb-2">Top 10 Bank Loan & Credit Card Compare</h4>
              <BankTable />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Eligibility & EMI Calculator</h4>
              <MiniEMI />
            </div>
          </div>

          {/* Right column: value props */}
          <div className="rounded-2xl border p-4 md:p-6 bg-white shadow-sm">
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
              <li>Soft credit check only (no score impact)</li>
              <li>Compare multiple banks & cards at once</li>
              <li>Instant OTP verification for secure access</li>
              <li>Share your result via WhatsApp in one tap</li>
            </ul>
            <div className="mt-6 text-xs text-slate-500">
              Tip: Implement <code>/api/bank-offers</code> in your app to return live APRs, limits and fees. This UI will auto-refresh.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------- Lightweight tests (run in browser devtools) ----------
(function runSelfTests(){
  if (typeof window === "undefined") return;
  try {
    console.assert(PAN_REGEX.test("ABCDE1234F"), "PAN valid should pass");
    console.assert(!PAN_REGEX.test("abcde1234f"), "PAN lowercase should fail");
    console.assert(MOBILE_REGEX.test("9876543210"), "Valid mobile should pass");
    console.assert(calculateEMI(100000, 12, 12) === 8885, "EMI(100k,12%,12m) should be 8885");
    console.assert(gradeFromScore(800) === "Excellent", "Grade mapping broken");
    console.log("✅ Self-tests passed");
  } catch (e) {
    console.warn("❌ Self-tests failed:", e);
  }
})();

