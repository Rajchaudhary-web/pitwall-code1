import { Link } from 'react-router-dom';
import { Activity, BarChart3, Zap, Cloud, Flag, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-display text-sm tracking-widest text-foreground">PITWALL AI</span>
          </div>
          <Link
            to="/dashboard"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-xs font-display tracking-wider hover:opacity-90 transition-opacity"
          >
            LAUNCH DASHBOARD
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px flex-1 max-w-12 bg-primary" />
            <span className="text-[10px] font-display tracking-[0.3em] text-primary">RACE STRATEGY OPTIMIZER</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6">
            AI-POWERED<br />
            <span className="text-primary text-glow">PIT STRATEGY</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-lg mb-10 font-body">
            Real-time telemetry analysis, predictive tyre degradation models, and rival tracking — 
            all powered by live F1 data from the OpenF1 API.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-display text-sm tracking-wider glow-red hover:opacity-90 transition-opacity"
          >
            ENTER PITWALL <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: <Zap className="w-5 h-5" />, title: 'AI Strategy Engine', desc: 'ML-powered tyre degradation predictions and optimal pit windows with undercut/overcut analysis.' },
            { icon: <BarChart3 className="w-5 h-5" />, title: 'Live Telemetry', desc: 'Real-time lap times, sector data, and position tracking from OpenF1 API.' },
            { icon: <Activity className="w-5 h-5" />, title: 'Rival Tracker', desc: 'Head-to-head comparison with gap analysis, strategy overlay, and pace delta.' },
            { icon: <Cloud className="w-5 h-5" />, title: 'Weather Intelligence', desc: 'Rain probability modeling that influences tyre recommendations in real-time.' },
            { icon: <Flag className="w-5 h-5" />, title: 'Strategy Timeline', desc: 'Visual stint-by-stint breakdown with compound analysis across the grid.' },
            { icon: <BarChart3 className="w-5 h-5" />, title: 'Pace Heatmap', desc: 'Lap-by-lap pace visualization revealing degradation patterns and traffic.' },
          ].map((f, i) => (
            <div
              key={i}
              className="group border border-border rounded-lg p-5 bg-card hover:border-primary/30 transition-all duration-300"
            >
              <div className="text-primary mb-3">{f.icon}</div>
              <h3 className="text-xs font-display tracking-wider text-foreground mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="font-display tracking-wider">PITWALL AI © 2026</span>
          <span>Powered by OpenF1 API</span>
        </div>
      </footer>
    </div>
  );
}
