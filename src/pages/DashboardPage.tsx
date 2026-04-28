import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap, TrendingUp, AlertCircle, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
export function DashboardPage() {
  const profile = useQuery(api.inventory.getProfile);
  const alerts = useQuery(api.inventory.listAlerts) ?? [];
  const generateMock = useMutation(api.inventory.generateMockAlerts);
  const handleGenerateMock = async () => {
    if (!profile?.niche) return;
    try {
      await generateMock({ niche: profile.niche });
      toast.success("Scanning complete. Found new opportunities!");
    } catch (e) {
      toast.error("Scanning failed.");
    }
  };
  return (
    <Authenticated>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Command Center</h1>
              <p className="text-muted-foreground">Monitoring <span className="font-semibold text-primary">{profile?.niche || "unconfigured"}</span> niche.</p>
            </div>
            {profile && (
              <Button onClick={handleGenerateMock} className="bg-primary hover:bg-primary/90">
                <Zap className="mr-2 w-4 h-4" /> Scan for New Trends
              </Button>
            )}
          </div>
          {!profile ? (
            <Card className="border-dashed py-12">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Niche Not Configured</h2>
                  <p className="text-muted-foreground max-w-sm">Setup your tracking niche in settings to start receiving AI-powered surge alerts.</p>
                </div>
                <Button asChild variant="outline">
                  <Link to="/settings">Go to Settings <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="Active Alerts" value={alerts.length.toString()} icon={AlertCircle} />
                <MetricCard title="Demand Index" value="High (84%)" icon={TrendingUp} trend="+12% this week" />
                <MetricCard title="Market Cap" value="$2.4M" icon={Zap} trend="Sub-niche estimate" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Active Surge Alerts</h3>
                  <span className="text-sm text-muted-foreground">Real-time TikTok & Etsy Aggregation</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alerts.map((alert) => (
                    <Card key={alert._id} className="hover:translate-y-[-2px] transition-transform">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{alert.productName}</CardTitle>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">
                            {alert.confidenceScore}% Match
                          </span>
                        </div>
                        <CardDescription>{new Date(alert.createdAt).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">{alert.reason}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Sourcing Confidence</span>
                            <span>{alert.confidenceScore}%</span>
                          </div>
                          <Progress value={alert.confidenceScore} className="h-1.5" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {alerts.length === 0 && (
                    <div className="col-span-full py-12 text-center border rounded-xl bg-muted/20">
                      <p className="text-muted-foreground">No active alerts. Trigger a scan to find opportunities.</p>
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
function MetricCard({ title, value, icon: Icon, trend }: { title: string; value: string; icon: any; trend?: string }) {
  return (
    <Card className="bg-card">
      <CardContent className="p-6 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && <p className="text-xs text-emerald-600 font-medium">{trend}</p>}
        </div>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}