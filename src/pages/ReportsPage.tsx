import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Plus, 
  Search, 
  BookOpen, 
  Clock, 
  AlertCircle,
  Sparkles 
} from "lucide-react";
import { toast } from "sonner";
export function ReportsPage() {
  const reports = useQuery(api.inventory.listReports) ?? [];
  const profile = useQuery(api.inventory.getProfile);
  const generateReportAction = useAction(api.inventory.generateTrendReport);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const selectedReport = reports.find(r => r._id === selectedReportId) || (reports.length > 0 ? reports[0] : null);
  const handleGenerate = async () => {
    if (!profile?.niche) {
      toast.error("Please configure your niche in Settings first.");
      return;
    }
    setIsGenerating(true);
    try {
      await generateReportAction({ niche: profile.niche });
      toast.success("AI Analysis Complete!");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <Authenticated>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-180px)]">
            {/* Left Column: List & Actions */}
            <div className="w-full md:w-80 flex flex-col gap-4">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                size="lg"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-glow"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="animate-spin mr-2 w-4 h-4" />
                    Analyzing Trends...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 w-4 h-4" />
                    Analyze Current Niche
                  </>
                )}
              </Button>
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
                          {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </button>
                    ))}
                    {reports.length === 0 && !isGenerating && (
                      <div className="p-12 text-center">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground">No reports generated yet.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>
            {/* Right Column: Content Area */}
            <div className="flex-1 min-w-0">
              <Card className="h-full flex flex-col border-border/60 shadow-sm">
                <CardHeader className="border-b bg-muted/5 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-display">
                        {isGenerating ? "AI Processing..." : selectedReport?.title || "Market Intelligence"}
                      </CardTitle>
                      {selectedReport && (
                        <CardDescription className="text-xs">
                          Sub-niche analysis for {selectedReport.niche}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1">
                  <div className="p-8 md:p-12">
                    {isGenerating ? (
                      <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-3/4" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                        <div className="space-y-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                        <Skeleton className="h-64 w-full rounded-xl" />
                        <div className="space-y-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </div>
                    ) : selectedReport ? (
                      <article className="max-w-2xl mx-auto">
                        <div className="whitespace-pre-wrap text-foreground leading-relaxed font-sans text-lg selection:bg-indigo-100">
                          {selectedReport.content}
                        </div>
                      </article>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-32 space-y-4 opacity-50">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold">No Analysis Selected</p>
                          <p className="text-sm">Choose a report from the sidebar or click Analyze to generate fresh data.</p>
                        </div>
                      </div>
                    )}
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