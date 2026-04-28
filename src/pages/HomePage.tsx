import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "@/components/SignInForm";
import { TrendingUp, Zap, Search, Target, CheckCircle2 } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-32 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" /> <span>Real-time Market Scanning</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-foreground">
              Predict the Next <br />
              <span className="text-gradient">Bestseller</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              AI-driven demand forecasting for niche e-commerce sellers. Scan social trends, analyze marketplace gaps, and source with confidence.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <FeatureItem icon={TrendingUp} label="Surge Alerts" />
              <FeatureItem icon={Search} label="Trend Analysis" />
              <FeatureItem icon={Target} label="Niche Tracking" />
            </div>
          </div>
          <div className="w-full max-w-md">
            <div className="glass p-8 rounded-2xl shadow-glow relative overflow-hidden border border-border/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Get Started</h2>
                  <p className="text-sm text-muted-foreground mt-1">Unlock your niche analytics dashboard</p>
                </div>
                <SignInForm />
              </div>
            </div>
          </div>
        </div>
        <div className="py-24 border-t">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Built for Premium Sellers</h2>
            <p className="text-muted-foreground">The tools you need to stay ahead of the curve.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="TikTok Social Listening"
              desc="We simulate scanning millions of videos to find high-velocity products before they hit mainstream marketplaces."
            />
            <FeatureCard 
              title="Etsy Arbitrage Finder"
              desc="Identify handmade niches with high search volume but low seller competition using our proprietary Demand Index."
            />
            <FeatureCard 
              title="AI Deep Dive Reports"
              desc="Generate 2,000+ word technical analyses on sub-niches, complete with sourcing advice and risk assessment."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function FeatureItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 justify-center lg:justify-start">
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      <span className="font-medium text-foreground">{label}</span>
    </div>
  );
}
function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-8 rounded-xl bg-card border border-border hover:shadow-soft transition-all group">
      <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
        <Target className="text-primary w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}