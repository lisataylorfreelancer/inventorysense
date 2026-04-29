import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  LayoutGrid,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from "framer-motion";
export function DashboardPage() {
  const profile = useQuery(api.inventory.getProfile);
  const alerts = useQuery(api.inventory.listAlerts) ?? [];
  const demandStats = useQuery(api.inventory.getDemandStats) ?? [];
  const generateMock = useMutation(api.inventory.generateMockAlerts);
  const [isScanning, setIsScanning] = React.useState(false);
  const handleGenerateMock = async () => {
    if (!profile?.niche) return;
    setIsScanning(true);
    const promise = generateMock({ niche: profile.niche });
    toast.promise(promise, {
      loading: "Scanning global trends...",
      success: "Found new opportunities in your niche!",
      error: "Scan failed. Please try again."
    });
    try { await promise; } finally { setIsScanning(false); }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  return (
    <Authenticated>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Command Center</h1>
              <p className="text-muted-foreground">
                Monitoring <span className="font-semibold text-indigo-600">{profile?.niche || "unconfigured"}</span> niche.
              </p>
            </div>
            {profile && (
              <Button 
                onClick={handleGenerateMock} 
                size="lg" 
                disabled={isScanning}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-glow transition-all"
              >
                {isScanning ? (
                  <Activity className="mr-2 w-4 h-4 animate-pulse" />
                ) : (
                  <Zap className="mr-2 w-4 h-4" />
                )}
                {isScanning ? "Scanning..." : "Scan for New Trends"}
              </Button>
            )}
          </div>
          {!profile ? (
            <Card className="border-dashed border-2 py-16 bg-muted/5">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
                  <LayoutGrid className="w-10 h-10 text-indigo-500" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h2 className="text-2xl font-bold">Niche Not Configured</h2>
                  <p className="text-muted-foreground">Setup your tracking niche in settings to start receiving AI-powered surge alerts.</p>
                </div>
                <Button asChild size="lg">
                  <Link to="/settings">Go to Settings <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants}>
                  <MetricCard title="Active Alerts" value={alerts.length.toString()} icon={AlertCircle} color="indigo" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricCard title="Avg Sentiment" value="Positive (92%)" icon={TrendingUp} trend="+4% this week" color="emerald" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MetricCard title="Scanning Status" value={isScanning ? "Active" : "Optimal"} icon={Zap} trend="Last scan 4h ago" color="purple" />
                </motion.div>
              </div>
              {/* Demand Index Chart Section */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/60 shadow-soft overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-display font-bold">Demand Index over Time</CardTitle>
                      <CardDescription>30-day aggregate consumer interest forecast</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-xs font-bold">
                      <TrendingUp className="w-3 h-3" /> HIGH VELOCITY
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 pt-4">
                    <div className="h-[300px] w-full px-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={demandStats}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} minTickGap={30} />
                          <YAxis hide domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#4f46e5" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorScore)" 
                            animationDuration={2000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Alert Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-display">Active Surge Alerts</h3>
                    <p className="text-sm text-muted-foreground">High-velocity signals detected from marketplaces</p>
                  </div>
                  <Button variant="outline" asChild size="sm">
                    <Link to="/reports">View Trend Reports</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alerts.map((alert) => (
                    <motion.div 
                      key={alert._id} 
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, translateY: -4 }}
                      className="h-full"
                    >
                      <Card className="h-full hover:shadow-soft transition-all duration-200 border-border/60 flex flex-col">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start mb-1">
                            <CardTitle className="text-lg leading-tight truncate pr-2">{alert.productName}</CardTitle>
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                              {alert.confidenceScore}% Match
                            </span>
                          </div>
                          <CardDescription className="text-xs">{new Date(alert.createdAt).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 flex-1 flex flex-col justify-between">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {alert.reason}
                          </p>
                          <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-[11px] font-semibold text-foreground uppercase tracking-tighter">
                              <span>Confidence Index</span>
                              <span>{alert.confidenceScore}%</span>
                            </div>
                            <Progress value={alert.confidenceScore} className="h-1.5 bg-muted" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  {alerts.length === 0 && !isScanning && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl bg-muted/5">
                      <p className="text-muted-foreground font-medium">No active alerts found. Trigger a scan above to find market opportunities.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Authenticated>
  );
}
function MetricCard({ title, value, icon: Icon, trend, color }: {
  title: string;
  value: string;
  icon: any;
  trend?: string;
  color: 'indigo' | 'emerald' | 'purple';
}) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600"
  };
  return (
    <Card className="bg-card shadow-sm overflow-hidden border-border/50 h-full">
      <CardContent className="p-6 flex items-start justify-between relative h-full">
        <div className="space-y-1 z-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-display font-bold">{value}</p>
          {trend && (
            <p className={`text-[10px] font-medium flex items-center gap-1 ${trend.startsWith('+') ? 'text-emerald-600' : 'text-muted-foreground'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]} z-10 shadow-sm shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-10 ${color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'}`} />
      </CardContent>
    </Card>
  );
}