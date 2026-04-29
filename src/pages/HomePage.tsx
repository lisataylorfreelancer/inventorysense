import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "@/components/SignInForm";
import { 
  TrendingUp, 
  Zap, 
  Search, 
  Target, 
  CheckCircle2, 
  BarChart3 
} from "lucide-react";
export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.auth.loggedInUser);
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);
  return (
    <div className="min-h-screen bg-background selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-32 flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium animate-fade-in">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Real-time Market Scanning</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tight text-foreground">
              Predict the Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Bestseller</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              AI-driven demand forecasting for niche e-commerce sellers. Scan social trends, analyze marketplace gaps, and source with absolute confidence.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <FeatureItem icon={TrendingUp} label="Surge Alerts" />
              <FeatureItem icon={Search} label="Trend Analysis" />
              <FeatureItem icon={Target} label="Niche Tracking" />
            </div>
          </div>
          {/* Right Content - Auth Form */}
          <div className="w-full max-w-md">
            <div className="glass p-8 rounded-2xl shadow-glow-lg border border-border/50 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold font-display">Get Started</h2>
                  <p className="text-sm text-muted-foreground mt-1">Unlock your niche analytics dashboard</p>
                </div>
                <SignInForm />
              </div>
            </div>
          </div>
        </div>
        {/* Feature Section */}
        <div className="py-24 border-t border-border/50">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Built for Premium Sellers</h2>
            <p className="text-muted-foreground text-lg">Professional tools to stay ahead of the curve.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap}
              title="TikTok Social Listening"
              desc="We simulate scanning millions of videos to find high-velocity products before they hit mainstream marketplaces."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Etsy Arbitrage Finder"
              desc="Identify handmade niches with high search volume but low seller competition using our proprietary Demand Index."
            />
            <FeatureCard 
              icon={Search}
              title="AI Deep Dive Reports"
              desc="Generate technical analyses on sub-niches, complete with sourcing advice, risk assessment, and 30-day outlooks."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function FeatureItem({ label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 justify-center lg:justify-start">
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      <span className="font-medium text-foreground">{label}</span>
    </div>
  );
}
function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string; desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-soft hover:translate-y-[-4px] transition-all group">
      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-indigo-500/10 transition-colors">
        <Icon className="text-primary group-hover:text-indigo-600 transition-colors w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3 font-display">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}