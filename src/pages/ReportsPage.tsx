import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  BookOpen,
  Clock,
  Sparkles,
  Copy,
  Download,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
export function ReportsPage() {
  const reports = useQuery(api.inventory.listReports) ?? [];
  const profile = useQuery(api.inventory.getProfile);
  const generateReportAction = useAction(api.inventory.generateTrendReport);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  // Wizard State
  const [targetKeyword, setTargetKeyword] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["TikTok", "Etsy"]);
  const selectedReport = reports.find(r => r._id === selectedReportId) || (reports.length > 0 ? reports[0] : null);
  const handleGenerate = async () => {
    if (!profile?.niche) {
      toast.error("Please configure your niche in Settings first.");
      return;
    }
    setWizardOpen(false);
    setIsGenerating(true);
    try {
      await generateReportAction({ 
        niche: profile.niche, 
        keyword: targetKeyword || undefined,
        platforms: selectedPlatforms 
      });
      toast.success("AI Trend Analysis Complete!");
      setTargetKeyword("");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };
  const copyToClipboard = () => {
    if (!selectedReport) return;
    navigator.clipboard.writeText(selectedReport.content);
    toast.success("Report content copied to clipboard");
  };
  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };
  return (
    <Authenticated>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-180px)]">
            {/* Sidebar */}
            <div className="w-full md:w-80 flex flex-col gap-4">
              <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
                <DialogTrigger asChild>
                  <Button
                    disabled={isGenerating}
                    size="lg"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-glow"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="animate-spin mr-2 w-4 h-4" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 w-4 h-4" />
                        New AI Analysis
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Trend Report Wizard</DialogTitle>
                    <DialogDescription>Customize your AI deep-dive for your niche: {profile?.niche}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label>Specific Focus (Optional)</Label>
                      <Input 
                        placeholder="e.g. Vintage Denim, 1990s Electronics" 
                        value={targetKeyword}
                        onChange={(e) => setTargetKeyword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Data Sources</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {["TikTok", "Instagram", "Etsy", "Pinterest"].map(p => (
                          <div key={p} className="flex items-center space-x-2">
                            <Checkbox 
                              id={p} 
                              checked={selectedPlatforms.includes(p)} 
                              onCheckedChange={() => handlePlatformToggle(p)}
                            />
                            <label htmlFor={p} className="text-sm font-medium">{p}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setWizardOpen(false)}>Cancel</Button>
                    <Button onClick={handleGenerate} className="bg-indigo-600">Start Intelligence Scan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Card className="flex-1 flex flex-col overflow-hidden border-border/60">
                <CardHeader className="py-4 border-b">
                  <CardTitle className="text-sm flex items-center gap-2 font-display">
                    <Clock className="w-4 h-4 text-muted-foreground" /> Report History
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {reports.map((report) => (
                      <button
                        key={report._id}
                        onClick={() => setSelectedReportId(report._id)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${
                          selectedReport?._id === report._id
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "hover:bg-accent border-transparent"
                        }`}
                      >
                        <p className="font-bold truncate">{report.title}</p>
                        <p className={`text-[10px] mt-1 font-medium ${selectedReport?._id === report._id ? "text-indigo-100" : "text-muted-foreground"}`}>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                    {reports.length === 0 && !isGenerating && (
                      <div className="p-12 text-center">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground">No reports yet.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>
            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <Card className="h-full flex flex-col border-border/60 shadow-sm relative">
                <CardHeader className="border-b bg-muted/5 flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-display">
                        {isGenerating ? "AI Processing..." : selectedReport?.title || "Market Intelligence"}
                      </CardTitle>
                    </div>
                  </div>
                  {selectedReport && !isGenerating && (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy Content">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toast.info("Premium PDF Export coming soon!")} title="Download PDF">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <ScrollArea className="flex-1">
                  <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                      {isGenerating ? (
                        <motion.div 
                          key="loading"
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          exit={{ opacity: 0 }}
                          className="space-y-6 max-w-2xl mx-auto"
                        >
                          <Skeleton className="h-10 w-3/4" />
                          <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                          <Skeleton className="h-80 w-full rounded-2xl" />
                        </motion.div>
                      ) : selectedReport ? (
                        <motion.article 
                          key={selectedReport._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="max-w-2xl mx-auto"
                        >
                          <div className="whitespace-pre-wrap text-foreground leading-relaxed font-sans text-lg selection:bg-indigo-100">
                            {selectedReport.content}
                          </div>
                        </motion.article>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-32 space-y-4 opacity-50">
                          <FileText className="w-12 h-12 text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="font-bold text-lg">No Analysis Selected</p>
                            <p className="text-sm">Start a new intelligence scan to see data.</p>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}