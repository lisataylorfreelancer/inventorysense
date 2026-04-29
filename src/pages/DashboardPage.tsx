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
  PlusCircle, 
  ArrowRight,
  TrendingDown,
  LayoutGrid
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
export function DashboardPage() {
  const profile = useQuery(api.inventory.getProfile);
  const alerts = useQuery(api.inventory.listAlerts) ?? [];
  const generateMock = useMutation(api.inventory.generateMockAlerts);
  const handleGenerateMock = async () => {
    if (!profile?.niche) return;
    const promise = generateMock({ niche: profile.niche });
    toast.promise(promise, {
      loading: "Scanning global trends...",
      success: "Found new opportunities in your niche!",
      error: "Scan failed. Please try again."
    });
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
              <Button onClick={handleGenerateMock} size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-glow">
                <Zap className="mr-2 w-4 h-4" /> Scan for New Trends
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard 
                  title="Active Alerts" 
                  value={alerts.length.toString()} 
                  icon={AlertCircle} 
                  color="indigo"
                />
                <MetricCard 
                  title="Demand Index" 
                  value="High (84%)" 
                  icon={TrendingUp} 
                  trend="+12% this week" 
                  color="emerald"
                />
                <MetricCard 
                  title="Market Cap Est." 
                  value="$2.4M" 
                  icon={Zap} 
                  trend="Sub-niche estimate" 
                  color="purple"
                />
              </div>
              {/* Alert Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-display">Active Surge Alerts</h3>
                    <p className="text-sm text-muted-foreground">Social sentiment & aggregate marketplace signals</p>
                  </div>
                  <Button variant="outline" asChild size="sm">
                    <Link to="/reports">View Deep-Dive Reports</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alerts.map((alert) => (
                    <Card key={alert._id} className="hover:shadow-soft transition-all duration-200 border-border/60">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-1">
                          <CardTitle className="text-lg leading-tight">{alert.productName}</CardTitle>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                            {alert.confidenceScore}% Match
                          </span>
                        </div>
                        <CardDescription className="text-xs">{new Date(alert.createdAt).toLocaleString()}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {alert.reason}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-semibold text-foreground uppercase tracking-tighter">
                            <span>Sourcing Confidence</span>
                            <span>{alert.confidenceScore}%</span>
                          </div>
                          <Progress value={alert.confidenceScore} className="h-1.5 bg-muted" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {alerts.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl bg-muted/5">
                      <p className="text-muted-foreground font-medium">No active alerts found. Trigger a scan above to find market opportunities.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
    <Card className="bg-card shadow-sm overflow-hidden border-border/50">
      <CardContent className="p-6 flex items-start justify-between relative">
        <div className="space-y-1 z-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-3xl font-display font-bold">{value}</p>
          {trend && (
            <p className={`text-xs font-medium flex items-center gap-1 ${trend.startsWith('+') ? 'text-emerald-600' : 'text-muted-foreground'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]} z-10 shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-10 ${color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'}`} />
      </CardContent>
    </Card>
  );
}