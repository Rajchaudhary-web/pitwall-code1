import { motion } from "framer-motion";

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden">

      {/* 🔥 Animated background lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full animate-[moveLines_6s_linear_infinite]"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.05) 0px,
              rgba(255,255,255,0.05) 1px,
              transparent 1px,
              transparent 60px
            )`
          }}
        />
      </div>

      {/* 🏎️ Main content */}
      <div className="z-10 text-center px-6 max-w-3xl">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-display font-bold tracking-wider"
        >
          AI RACE STRATEGY ENGINE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-4 text-muted-foreground text-sm md:text-base"
        >
          Predict. Decide. Win.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-muted-foreground"
        >
          <div className="border border-border rounded p-3 hover:bg-secondary/30 transition">
            Strategy AI
          </div>
          <div className="border border-border rounded p-3 hover:bg-secondary/30 transition">
            Rival Tracking
          </div>
          <div className="border border-border rounded p-3 hover:bg-secondary/30 transition">
            Live Telemetry
          </div>
          <div className="border border-border rounded p-3 hover:bg-secondary/30 transition">
            Weather Intel
          </div>
          <div className="border border-border rounded p-3 hover:bg-secondary/30 transition">
            Pace Analysis
          </div>
          <div className="border border-border rounded p-3 hover:bg-secondary/30 transition">
            What-If Simulation
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-6 py-3 rounded-md bg-primary text-black font-bold tracking-wide shadow-lg hover:shadow-xl transition"
        >
          Enter Race Control →
        </motion.button>
      </div>

      {/* 🔥 Bottom glow */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />

      {/* CSS animation */}
      <style>
        {`
          @keyframes moveLines {
            0% { transform: translateX(0); }
            100% { transform: translateX(-60px); }
          }
        `}
      </style>
    </div>
  );
}