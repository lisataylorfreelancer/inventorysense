import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated } from "convex/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Settings,
  Save,
  Sparkles,
  ShieldCheck,
  Target,
  Hash,
  Crown,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
export function SettingsPage() {
  const profile = useQuery(api.inventory.getProfile);
  const saveProfile = useMutation(api.inventory.saveProfile);
  const [niche, setNiche] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (profile) {
      setNiche(profile.niche);
      setKeywords(profile.keywords.join(", "));
    }
  }, [profile]);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const keywordsArray = keywords.split(",").map(k => k.trim()).filter(k => k !== "");
    try {
      await saveProfile({ niche, keywords: keywordsArray });
      toast.success("Configuration synced with AI models!");
    } catch (err) {
      toast.error("Failed to save configuration.");
    } finally {
      setIsSaving(false);
    }
  };
  const nicheStrength = niche.length > 20 ? 100 : niche.length > 10 ? 60 : 30;
  const keywordList = keywords.split(",").map(k => k.trim()).filter(k => k !== "");
  return (
    <Authenticated>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl shadow-sm border border-indigo-100">
              <Settings className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Intelligence Config</h1>
              <p className="text-muted-foreground text-sm">Fine-tune the parameters our AI uses to scan the market.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8">
            <form onSubmit={handleSave} className="space-y-6">
              <Card className="border-border/60 shadow-soft overflow-hidden">
                <CardHeader className="bg-muted/5 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="font-display">Market Parameters</CardTitle>
                      <CardDescription>Target niche and semantic keywords.</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Niche Specificity</span>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <Progress value={nicheStrength} className="w-32 h-1.5 bg-muted" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                  <div className="space-y-3">
                    <Label htmlFor="niche" className="flex items-center gap-2 font-bold">
                      <Target className="w-4 h-4 text-indigo-500" /> Your Target Niche
                    </Label>
                    <Input
                      id="niche"
                      placeholder="e.g. Minimalist Handcrafted Woodworking"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      required
                      className="h-12 bg-secondary/30 focus:bg-background transition-all"
                    />
                    <p className="text-xs text-muted-foreground">More specific descriptions yield higher precision trend matching.</p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="keywords" className="flex items-center gap-2 font-bold">
                      <Hash className="w-4 h-4 text-indigo-500" /> Indexing Keywords
                    </Label>
                    <Input
                      id="keywords"
                      placeholder="e.g. walnut, mid-century, scandi, sustainable"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="h-12 bg-secondary/30 focus:bg-background transition-all"
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {keywordList.map((k, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <Badge variant="secondary" className="px-3 py-1 font-medium bg-indigo-50 text-indigo-700 border-indigo-100">
                            {k}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/5 border-t py-6 flex justify-between items-center">
                   <p className="text-xs text-muted-foreground italic">
                    AI Index updated: {profile ? new Date(profile.updatedAt).toLocaleDateString() : 'Pending setup'}
                  </p>
                  <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 shadow-glow px-8 min-w-[180px]">
                    {isSaving ? <Sparkles className="w-4 h-4 mr-2 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
                    Sync Niche
                  </Button>
                </CardFooter>
              </Card>
            </form>
            <motion.div
              whileHover={{ y: -2 }}
              className="relative"
            >
              <Card className="overflow-hidden border-2 border-indigo-500/30 shadow-glow bg-card relative">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className="w-32 h-32 text-indigo-500" />
                  </motion.div>
                </div>
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-b">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-display font-bold">Premium Subscription Status</CardTitle>
                        <Badge className="bg-indigo-600 px-2 py-0">PRO</Badge>
                      </div>
                      <CardDescription>Unlimited real-time scanning features active.</CardDescription>
                    </div>
                    <div className="p-3 bg-white/80 dark:bg-black/40 rounded-2xl shadow-sm border border-indigo-100">
                      <Crown className="w-8 h-8 text-indigo-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PremiumFeature title="Infinite Trend Reports" desc="Run unlimited AI analysis on any sub-niche or keyword." />
                  <PremiumFeature title="4-Hour Pulse Scanning" desc="Social platforms are scanned 6x daily for trend outbreaks." />
                  <PremiumFeature title="Global Marketplace Data" desc="Aggregation from 12+ international marketplaces for arbitrage." />
                  <PremiumFeature title="Priority Queue" desc="Your niche parameters are refreshed first in the AI pipeline." />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
function PremiumFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
      <div className="shrink-0 mt-1">
        <ShieldCheck className="w-5 h-5 text-indigo-500" />
      </div>
      <div className="space-y-1">
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}