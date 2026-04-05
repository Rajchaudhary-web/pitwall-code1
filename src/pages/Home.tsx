import { Link } from 'react-router-dom';
import { Activity, BarChart3, Zap, Cloud, Flag, ChevronRight } from 'lucide-react';
import React from "react";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-display text-sm tracking-widest text-foreground">PITWALL AI</span>
          </div>
\
        </div>
      </nav>

      {/* Hero */}
      
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 animate-fade-in-up">
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
          <button
  onClick={() => {
    setLoading(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  }}
  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-display text-sm tracking-wider glow-red hover:opacity-90 transition-opacity"
>
  ENTER PITWALL <ChevronRight className="w-4 h-4" />
</button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 pb-24 animate-fade-in-up delay-200">
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
              className="group border border-border rounded-lg p-5 bg-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
{loading && (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
    <div className="text-primary font-display tracking-widest text-sm animate-pulse mb-3">
      INITIALIZING RACE CONTROL...
    </div>

    <div className="w-32 h-1 bg-secondary rounded overflow-hidden">
      <div className="h-full bg-primary animate-[loadingBar_1.5s_linear]" />
    </div>
  </div>
)}
    </div>
  );
}
