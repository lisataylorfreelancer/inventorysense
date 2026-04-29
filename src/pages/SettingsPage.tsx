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
import { 
  Settings, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  Hash,
  Crown
} from "lucide-react";
import { toast } from "sonner";
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
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to save configuration.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Authenticated>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-10">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Settings className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Configuration</h1>
              <p className="text-muted-foreground">Define your target markets and monitoring keywords.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8">
            <form onSubmit={handleSave} className="space-y-6">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="bg-muted/5 border-b">
                  <CardTitle className="font-display">Niche Definition</CardTitle>
                  <CardDescription>
                    We use these parameters to fine-tune our social listening models.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                  <div className="space-y-3">
                    <Label htmlFor="niche" className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-500" /> Primary Niche
                    </Label>
                    <Input
                      id="niche"
                      placeholder="e.g. 90s Vintage Tech, Minimalist Ceramics"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      required
                      className="h-12 bg-secondary/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Be specific to get higher quality trend alerts (e.g. "Vintage Levi's" vs "Clothes").
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="keywords" className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-indigo-500" /> Tracking Keywords
                    </Label>
                    <Input
                      id="keywords"
                      placeholder="e.g. walkman, crt, floppy, aesthetic"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="h-12 bg-secondary/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate keywords with commas. These influence search indexing.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t py-4 flex justify-between items-center">
                  <p className="text-xs text-muted-foreground italic">
                    Last updated: {profile ? new Date(profile.updatedAt).toLocaleDateString() : 'Never'}
                  </p>
                  <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 shadow-glow px-8">
                    {isSaving ? <Sparkles className="w-4 h-4 mr-2 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
                    Save Configuration
                  </Button>
                </CardFooter>
              </Card>
            </form>
            {/* Premium Mockup */}
            <Card className="overflow-hidden border-2 border-indigo-500/20 shadow-glow relative bg-card">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Sparkles className="w-32 h-32 text-indigo-500" />
              </div>
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-b">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl font-display">Pro Tier Status</CardTitle>
                      <Badge className="bg-indigo-600 hover:bg-indigo-600 px-2 py-0">ACTIVE</Badge>
                    </div>
                    <CardDescription>Enterprise-grade scanning features unlocked.</CardDescription>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-black/50 rounded-2xl shadow-sm border border-indigo-100">
                    <Crown className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PremiumFeature 
                    title="Unlimited Deep-Dives" 
                    desc="Generate as many AI market reports as you need without credits."
                  />
                  <PremiumFeature 
                    title="Real-time Social Scanning" 
                    desc="Our models scan TikTok & IG every 4 hours for trend spikes."
                  />
                  <PremiumFeature 
                    title="Priority Indexing" 
                    desc="Your keywords are given higher weight in our global trend queue."
                  />
                  <PremiumFeature 
                    title="Sentiment Dashboard" 
                    desc="Access advanced visual analytics on market sentiment (Coming Soon)."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
function PremiumFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex-shrink-0">
        <ShieldCheck className="w-5 h-5 text-indigo-500" />
      </div>
      <div className="space-y-1">
        <p className="font-bold text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}