import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus, Search, BookOpen, Clock } from "lucide-react";
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
      toast.error("Configure your niche in settings first.");
      return;
    }
    setIsGenerating(true);
    try {
      await generateReportAction({ niche: profile.niche });
      toast.success("AI Analysis Complete!");
    } catch (e) {
      toast.error("Generation failed. Check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <Authenticated>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-200px)]">
            {/* Sidebar List */}
            <div className="w-full md:w-80 flex flex-col gap-4">
              <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                {isGenerating ? <Plus className="animate-spin mr-2" /> : <Search className="mr-2 w-4 h-4" />}
                Analyze Current Niche
              </Button>
              <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="py-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" /> Report History
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 px-2 pb-4">
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <button
                        key={report._id}
                        onClick={() => setSelectedReportId(report._id)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-colors border ${
                          selectedReport?._id === report._id 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "hover:bg-accent border-transparent"
                        }`}
                      >
                        <p className="font-semibold truncate">{report.title}</p>
                        <p className={`text-[10px] mt-1 ${selectedReport?._id === report._id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                    {reports.length === 0 && !isGenerating && (
                      <div className="p-8 text-center text-xs text-muted-foreground">
                        No reports yet. Click "Analyze" to begin.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>
            {/* Content Pane */}
            <div className="flex-1 min-w-0">
              <Card className="h-full flex flex-col">
                <CardHeader className="border-b bg-muted/10">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">
                      {isGenerating ? "Analyzing..." : selectedReport?.title || "Trend Deep-Dive"}
                    </CardTitle>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-8">
                  {isGenerating ? (
                    <div className="space-y-4 max-w-prose">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ) : selectedReport ? (
                    <article className="max-w-prose mx-auto prose dark:prose-invert">
                      <div className="whitespace-pre-wrap text-foreground leading-relaxed font-sans">
                        {selectedReport.content}
                      </div>
                    </article>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40">
                      <FileText className="w-16 h-16 mb-4" />
                      <p>Select a report from the list or generate a new analysis.</p>
                    </div>
                  )}
                </ScrollArea>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}