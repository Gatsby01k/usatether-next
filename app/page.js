"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion as fm } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";
import {
  Check,
  ChevronRight,
  ArrowUpRight,
  DollarSign,
  Percent,
  Coins,
  Flame,
  Shield,
  Globe,
  BarChart,
} from "lucide-react";

/* --- Content / Data --- */
const COINS = [
  { code: "BTC", name: "Bitcoin" },
  { code: "ETH", name: "Ethereum" },
  { code: "USDT", name: "Tether" },
  { code: "USDC", name: "USD Coin" },
  { code: "SOL", name: "Solana" },
  { code: "TRX", name: "TRON" },
];

const FEATURES = [
  { icon: <Shield className="h-5 w-5" />, title: "Institution-grade custody", desc: "HSM, multisig, 24/7 monitoring." },
  { icon: <Globe className="h-5 w-5" />, title: "Cross-chain rails", desc: "Deposit via BTC, ETH, SOL, TRX, USDT/USDC." },
  { icon: <BarChart className="h-5 w-5" />, title: "Live transparency", desc: "Dashboards, reports, reserve status." },
];

const PLANS = [
  { name: "Flexible", yieldPct: 25, term: "1 month", lock: "no lock", highlight: true },
  { name: "Pro", yieldPct: 25, term: "1 month", lock: "min 7 days" },
  { name: "Institutional", yieldPct: 25, term: "1 month", lock: "custom" },
];

const DEMO_MONTHLY_RATE = 0.25;

/* --- Utils / Hooks --- */
const formatNumber = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n ?? 0);

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return reduced;
};

const calcSimple = (amount, monthlyRate, months) => {
  const profit = amount * monthlyRate * months;
  return { profit, total: amount + profit };
};
const calcCompound = (amount, monthlyRate, months) => {
  const total = amount * Math.pow(1 + monthlyRate, months);
  return { profit: total - amount, total };
};

function useCountUp(value, duration = 600) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

/* --- Page --- */
export default function Page() {
  const [buyAmount, setBuyAmount] = useState(1000);
  const [investAmount, setInvestAmount] = useState(1000);
  const [coin, setCoin] = useState(COINS[2].code);
  const [months, setMonths] = useState(1);
  const [compound, setCompound] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const reduced = usePrefersReducedMotion();
  const MotionDiv = reduced ? "div" : fm.div;

  const safeMonths = Math.max(1, Math.floor(Number.isFinite(months) ? months : 1));
  const safeInvestAmount = Math.max(0, Number.isFinite(investAmount) ? investAmount : 0);

  const { profit, total } = useMemo(() => {
    return compound
      ? calcCompound(safeInvestAmount, DEMO_MONTHLY_RATE, safeMonths)
      : calcSimple(safeInvestAmount, DEMO_MONTHLY_RATE, safeMonths);
  }, [compound, safeInvestAmount, safeMonths]);

  const volAnimated = useCountUp(18.7, 700);
  const reservesAnimated = useCountUp(420, 700);
  const usersAnimated = useCountUp(1.6, 700);
  const networksAnimated = useCountUp(9, 700);

  useEffect(() => {
    if (!actionMsg) return;
    const id = setTimeout(() => setActionMsg(""), 2000);
    return () => clearTimeout(id);
  }, [actionMsg]);

  const selectCoin = useCallback((c) => setCoin(c), []);
  const handleFakePay = () => setActionMsg(`Payment flow opened for ${formatNumber(buyAmount)} ${coin}`);
  const handleFakeInvest = () => setActionMsg(`Invest flow opened for ${formatNumber(safeInvestAmount)} USA₮`);

  return (
    <div className="min-h-screen bg-[#070912] text-white antialiased selection:bg-blue-500/40 selection:text-white">
      {/* Background glows / awwwards vibes */}
      {!reduced && (
        <>
          <fm.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="pointer-events-none fixed -top-32 -left-24 z-0 h-[560px] w-[560px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(37,99,235,0.35) 0%, transparent 60%)" }}
          />
          <fm.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="pointer-events-none fixed -bottom-32 -right-24 z-0 h-[600px] w-[600px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(239,68,68,0.28) 0%, transparent 60%)" }}
          />
        </>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070912]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-4 group" aria-label="USATether — home">
            <img
              src="/brand/USATether-Logo-Neon.svg"
              alt="USATether"
              className="h-8 w-auto md:h-10 transition-transform duration-300 group-hover:scale-[1.02]"
              loading="eager"
            />
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Primary">
            <a href="#buy" className="text-white/70 transition hover:text-white">Buy</a>
            <a href="#invest" className="text-white/70 transition hover:text-white">Invest</a>
            <a href="#stats" className="text-white/70 transition hover:text-white">Stats</a>
            <a href="#faq" className="text-white/70 transition hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Badge className="bg-white/10 text-white backdrop-blur border border-white/10">
              <Flame className="mr-1 h-3.5 w-3.5" /> 25% / mo
              <span className="ml-2 rounded bg-white/10 px-1 text-[10px] uppercase tracking-wider text-white/70">Demo</span>
            </Badge>
            <Button className="hidden bg-white text-black hover:bg-white/90 md:inline-flex" type="button">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="buy" className="relative z-10 mx-auto max-w-7xl px-4 pt-14 md:pt-28" aria-labelledby="hero-title">
        <div className="grid gap-12 md:grid-cols-2 md:items-start" id="main">
          {/* Left: copy */}
          <div>
            <MotionDiv
              initial={!reduced ? { y: 12, opacity: 0 } : undefined}
              animate={!reduced ? { y: 0, opacity: 1 } : undefined}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <p className="text-[12px] uppercase tracking-[0.22em] text-white/50">USA₮ — Stable by Design</p>
              <h1 id="hero-title" className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Neon Stability.<br className="hidden md:block" />
                <span className="bg-gradient-to-r from-blue-300 to-red-300 bg-clip-text text-transparent">Built for Modern Finance</span>
              </h1>
              <p className="mt-5 text-base text-white/70 md:text-lg">
                Buy and invest USA₮ with popular crypto. Earn <span className="text-white">up to 25% monthly</span>.
                Minimal UI, glass surfaces, motion — <span className="text-white/60">demo only</span>.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button className="group bg-white text-black hover:bg-white/90" type="button">
                  Get Started
                  <ArrowUpRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
                <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10" type="button">
                  Docs
                </Button>
              </div>
            </MotionDiv>
          </div>

          {/* Right: glass card with tabs */}
          <div className="relative">
            <MotionDiv
              initial={!reduced ? { opacity: 0, scale: 0.98 } : undefined}
              animate={!reduced ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.7 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl md:min-h-[560px] flex flex-col"
              /* subtle neon aura */
              style={{ boxShadow: "0 0 40px rgba(59,130,246,0.18), 0 0 60px rgba(239,68,68,0.10)" }}
            >
              <Tabs defaultValue="buy" className="w-full flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="buy">Buy USA₮</TabsTrigger>
                  <TabsTrigger value="invest">Invest</TabsTrigger>
                </TabsList>

                <div className="mt-4 flex-1">
                  {/* Buy */}
                  <TabsContent value="buy" className="h-full">
                    <Card className="h-full border-white/10 bg-white/5 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white/90">Pay with Crypto</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3" role="group" aria-label="Select coin">
                          {COINS.map((c) => (
                            <button
                              key={c.code}
                              onClick={() => selectCoin(c.code)}
                              aria-pressed={coin === c.code}
                              className={
                                "rounded-2xl border p-3 text-left transition " +
                                (coin === c.code
                                  ? "border-blue-400/60 bg-blue-400/10"
                                  : "border-white/10 hover:border-white/20 hover:bg-white/5")
                              }
                              type="button"
                            >
                              <div className="text-[12px] uppercase tracking-wider text-white/60">{c.name}</div>
                              <div className="text-lg font-semibold tracking-tight">{c.code}</div>
                            </button>
                          ))}
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="buy-amount" className="text-white/80">Amount ({coin})</Label>
                          <div className="flex items-center gap-2">
                            <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5"><Coins className="h-4 w-4" /></div>
                            <Input
                              id="buy-amount"
                              type="number"
                              min={0}
                              inputMode="decimal"
                              value={buyAmount}
                              onChange={(e) => setBuyAmount(Math.max(0, Number(e.target.value)))}
                              className="bg-white/5 text-white placeholder:text-white/40"
                              placeholder="1000"
                              aria-describedby="buy-help"
                            />
                            <Button className="bg-white text-black hover:bg-white/90" type="button" onClick={handleFakePay}>Pay</Button>
                          </div>
                          <p id="buy-help" className="text-xs text-white/50">Rates calculated at next step. Supported: Ethereum, Tron, Solana.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Invest */}
                  <TabsContent value="invest" className="h-full">
                    <Card className="h-full border-white/10 bg-white/5 text-white">
                      <CardHeader className="flex flex-col gap-2 pb-2">
                        <CardTitle className="text-white/90">Yield Calculator</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Percent className="h-4 w-4" /> Fixed rate: <span className="ml-1 font-medium text-white">25% / mo</span>
                          <Badge className="ml-2 bg-white/10 text-white">Demo</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="grid gap-3">
                          <Label htmlFor="inv-amount" className="text-white/80">Investment Amount (USA₮)</Label>
                          <div className="flex items-center gap-2">
                            <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5"><DollarSign className="h-4 w-4" /></div>
                            <Input
                              id="inv-amount"
                              type="number"
                              min={0}
                              inputMode="decimal"
                              value={safeInvestAmount}
                              onChange={(e) => setInvestAmount(Math.max(0, Number(e.target.value)))}
                              className="bg-white/5 text-white placeholder:text-white/40"
                              placeholder="1000"
                            />
                          </div>
                          <Slider
                            value={[safeInvestAmount]}
                            min={0}
                            max={100000}
                            step={100}
                            onValueChange={(v) => setInvestAmount(v[0] ?? 0)}
                            aria-label="Investment slider"
                          />
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="months" className="text-white/80">Term (months)</Label>
                          <Input
                            id="months"
                            type="number"
                            min={1}
                            inputMode="numeric"
                            value={safeMonths}
                            onChange={(e) => setMonths(Math.max(1, Math.floor(Number(e.target.value))))}
                            className="bg-white/5 text-white placeholder:text-white/40"
                          />
                          <Slider
                            value={[safeMonths]}
                            min={1}
                            max={24}
                            step={1}
                            onValueChange={(v) => setMonths(Math.max(1, Math.floor(v[0] ?? 1)))}
                            aria-label="Term slider"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Toggle pressed={compound} onPressedChange={setCompound} aria-pressed={compound} className="border-white/20 bg-white/10">
                            {compound ? "Compound" : "Simple"}
                          </Toggle>
                          <span className="text-sm text-white/60">Calculation mode</span>
                        </div>

                        <div className="grid gap-2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4" aria-live="polite" aria-atomic="true">
                          <div className="flex items-center justify-between text-white/70">
                            <span>Expected Profit</span>
                            <span className="text-white">{formatNumber(profit)} USA₮</span>
                          </div>
                          <div className="flex items-center justify-between text-white/70">
                            <span>Total Payout</span>
                            <span className="text-white font-semibold">{formatNumber(total)} USA₮</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button className="bg-white text-black hover:bg-white/90" type="button" onClick={handleFakeInvest}>
                            Invest <ChevronRight className="ml-1.5 h-4 w-4" />
                          </Button>
                          <p className="text-xs text-white/60">Demo terms. Availability depends on jurisdiction and risk.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </MotionDiv>
          </div>
        </div>

        {actionMsg && <div className="sr-only" role="status" aria-live="polite">{actionMsg}</div>}
      </section>

      {/* Features */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              className="border-white/10 bg-white/5 text-white transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20"
              style={{ boxShadow: "0 6px 32px rgba(0,0,0,0.35)" }}
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">{f.icon}</div>
                <CardTitle className="text-white/90">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-white/70">{f.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="invest" className="mx-auto mt-20 max-w-7xl px-4">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Plans</h2>
          <div className="text-sm text-white/60">
            25% / month for 1 month term <Badge className="ml-2 bg-white/10 text-white">Demo</Badge>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <Card
              key={p.name}
              className={
                "border-white/10 text-white transition-all duration-300 hover:shadow-2xl " +
                (p.highlight ? "bg-gradient-to-br from-blue-400/10 to-red-500/10" : "bg-white/5")
              }
              style={{ boxShadow: p.highlight ? "0 0 36px rgba(59,130,246,0.15)" : undefined }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white/90">{p.name}</CardTitle>
                  {p.highlight && <Badge className="bg-white text-black">Popular</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{p.yieldPct}%</span>
                  <span className="text-white/60">/ mo</span>
                </div>
                <div className="text-white/70">Term: {p.term}</div>
                <div className="text-white/70">Lock: {p.lock}</div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Daily accrual</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Payout in USA₮</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Low fees</li>
                </ul>
                <Button className="w-full bg-white text-black hover:bg-white/90" type="button">Choose</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="mx-auto mt-20 max-w-7xl px-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white" style={{ boxShadow: "0 8px 36px rgba(0,0,0,0.35)" }}>
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <div className="text-sm text-white/60">24h Volume</div>
              <div className="text-3xl font-semibold">${formatNumber(volAnimated)}M</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Reserves</div>
              <div className="text-3xl font-semibold">${formatNumber(reservesAnimated)}M</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Users</div>
              <div className="text-3xl font-semibold">{formatNumber(usersAnimated)}M</div>
            </div>
            <div>
              <div className="text-sm text-white/60">Networks</div>
              <div className="text-3xl font-semibold">{formatNumber(networksAnimated)}</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-white/50">Demo data for UI showcase. Connect real sources in production.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto mt-20 max-w-5xl px-4">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">FAQ</h2>
        <div className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/5">
          {[
            { q: "What is USA₮?", a: "USA₮ is a USATether stablecoin focused on stability and transparency. This site is a UI demo without on-chain logic." },
            { q: "Is 25% monthly real?", a: "The rate is for mock/demo. Actual terms depend on legal model, risks and availability in your region." },
            { q: "Which cryptocurrencies are supported?", a: "BTC, ETH, USDT, USDC, SOL, TRX. In production, align networks and providers." },
            { q: "Are there risks?", a: "All crypto operations involve risk. Past performance doesn’t guarantee future results. DYOR." },
          ].map((item, i) => (
            <details key={i} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="text-white/90">{item.q}</span>
                <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
              </summary>
              <p className="mt-3 max-w-3xl text-sm text-white/70">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto my-20 max-w-7xl px-4">
        <div
          className="grid items-center gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-red-500/10 p-6 md:grid-cols-2"
          style={{ boxShadow: "0 0 40px rgba(59,130,246,0.15)" }}
        >
          <div>
            <h3 className="text-2xl font-semibold">Ready to start?</h3>
            <p className="mt-2 text-white/70">Create an account and connect your wallet. First operations take minutes.</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20" type="button">Open Account</Button>
            <Button className="bg-white text-black hover:bg-white/90" type="button">Connect Wallet</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070912]/80">
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-white/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/brand/USATether-Logo-Neon.svg" alt="USATether" className="h-6 w-auto" />
              <span>USA₮</span>
            </div>
            <div className="flex items-center gap-3">
              <a className="hover:text-white" href="#">Policy</a>
              <a className="hover:text-white" href="#">Terms</a>
              <a className="hover:text-white" href="#">Support</a>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/50">
            *Disclaimer: This UI is a demo and not financial advice or an offer. Rate shown is illustrative. Product may be unavailable in your region. Please assess risks.
          </p>
        </div>
      </footer>
    </div>
  );
}
