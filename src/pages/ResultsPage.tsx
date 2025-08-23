import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Download, 
  Share2,
  CheckCircle,
  XCircle,
  Minus,
  BarChart3,
  PieChart
} from "lucide-react";

const ResultsPage = () => {
  const { attemptId } = useParams();
  
  // Mock results data
  const results = {
    score: 75,
    totalQuestions: 100,
    attempted: 95,
    correct: 75,
    incorrect: 15,
    skipped: 5,
    negativeMarks: -3.75,
    finalScore: 71.25,
    timeSpent: "45:30",
    totalTime: "60:00",
    rank: 45,
    totalCandidates: 1250,
    percentile: 89.5,
    subjectWise: [
      { subject: "General Knowledge", total: 25, correct: 20, incorrect: 3, skipped: 2, score: 18.25 },
      { subject: "Mathematics", total: 25, correct: 18, incorrect: 5, skipped: 2, score: 16.25 },
      { subject: "Reasoning", total: 25, correct: 19, incorrect: 4, skipped: 2, score: 18 },
      { subject: "English", total: 25, correct: 18, incorrect: 3, skipped: 1, score: 17.25 }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quiz Results</h1>
            <p className="text-muted-foreground">Police Bharti - Model Questions Set 1</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button asChild>
              <Link to="/student/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Overall Score Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">{results.finalScore}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-2">
                  <Target className="w-10 h-10 text-success" />
                </div>
                <div className="text-3xl font-bold text-success">{results.percentile}%</div>
                <div className="text-sm text-muted-foreground">Percentile</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-warning/10 rounded-full flex items-center justify-center mb-2">
                  <Clock className="w-10 h-10 text-warning" />
                </div>
                <div className="text-3xl font-bold text-warning">{results.timeSpent}</div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-info/10 rounded-full flex items-center justify-center mb-2">
                  <TrendingUp className="w-10 h-10 text-info" />
                </div>
                <div className="text-3xl font-bold text-info">#{results.rank}</div>
                <div className="text-sm text-muted-foreground">Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Report</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>Question Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>Correct</span>
                    </div>
                    <Badge variant="outline" className="text-success">{results.correct}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span>Incorrect</span>
                    </div>
                    <Badge variant="outline" className="text-destructive">{results.incorrect}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Minus className="w-4 h-4 text-muted-foreground" />
                      <span>Skipped</span>
                    </div>
                    <Badge variant="outline">{results.skipped}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Positive Marks</span>
                    <span className="font-semibold text-success">+{results.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Negative Marks</span>
                    <span className="font-semibold text-destructive">{results.negativeMarks}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Final Score</span>
                    <span className="text-primary">{results.finalScore}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Subject-wise Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.subjectWise.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.subject}</span>
                        <span className="text-sm font-semibold">{subject.score}/{subject.total}</span>
                      </div>
                      <Progress value={(subject.score / subject.total) * 100} className="h-2" />
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <span className="text-success">✓ {subject.correct}</span>
                        <span className="text-destructive">✗ {subject.incorrect}</span>
                        <span>- {subject.skipped}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Your Score</span>
                      <span className="font-semibold">{results.finalScore}</span>
                    </div>
                    <Progress value={results.finalScore} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Average Score</span>
                      <span className="font-semibold">65.5</span>
                    </div>
                    <Progress value={65.5} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Topper Score</span>
                      <span className="font-semibold">94.25</span>
                    </div>
                    <Progress value={94.25} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Question Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed question-by-question analysis will be available here.</p>
                  <p className="text-sm mt-2">This feature shows your performance on each individual question.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResultsPage;