import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
export function SettingsPage() {
  const profile = useQuery(api.inventory.getProfile);
  const saveProfile = useMutation(api.inventory.saveProfile);
  const [niche, setNiche] = useState("");
  const [keywords, setKeywords] = useState("");
  useEffect(() => {
    if (profile) {
      setNiche(profile.niche);
      setKeywords(profile.keywords.join(", "));
    }
  }, [profile]);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const keywordsArray = keywords.split(",").map(k => k.trim()).filter(k => k !== "");
    try {
      await saveProfile({ niche, keywords: keywordsArray });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to save profile.");
    }
  };
  return (
    <Authenticated>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
              <p className="text-muted-foreground">Define your market niche and target keywords.</p>
            </div>
          </div>
          <form onSubmit={handleSave} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Niche Definition</CardTitle>
                <CardDescription>This informs our AI model on where to scan for social signals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="niche">Primary Niche</Label>
                  <Input 
                    id="niche" 
                    placeholder="e.g. Vintage 90s Streetwear, Handmade Ceramics" 
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Be specific to get higher quality surge alerts.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Tracking Keywords</Label>
                  <Input 
                    id="keywords" 
                    placeholder="e.g. denim, y2k, baggy, thrifting" 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Separate keywords with commas.</p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t py-4">
                <Button type="submit" className="ml-auto">
                  <Save className="mr-2 w-4 h-4" /> Save Configuration
                </Button>
              </CardFooter>
            </Card>
          </form>
          <Card className="overflow-hidden border-2 border-indigo-500/20 shadow-glow relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Sparkles className="w-24 h-24 text-indigo-500" />
            </div>
            <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Pro Tier Status <Badge className="bg-indigo-600">Active</Badge>
                  </CardTitle>
                  <CardDescription>Included in your standard plan during early access.</CardDescription>
                </div>
                <ShieldCheck className="w-10 h-10 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Unlimited AI Deep-Dives
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Real-time TikTok API Scanning
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Priority Demand Indexing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Keyword Sentiment Tracking
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Authenticated>
  );
}