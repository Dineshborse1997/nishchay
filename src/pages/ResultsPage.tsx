import { useState, useEffect } from "react";
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
  const [results, setResults] = useState(null);
  const [stats, setStats] = useState(null);
  const [topperData, setTopperData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!attemptId) return;
        
        // Fetch result details
        const resultResponse = await fetch(`http://localhost:3001/api/results/${attemptId}`);
        const resultData = await resultResponse.json();
        
        if (resultResponse.ok) {
          setResults(resultData);
          
          // Fetch comparison stats
          const statsResponse = await fetch(`http://localhost:3001/api/results/stats/${resultData.exam_type || 'general'}`);
          const statsData = await statsResponse.json();
          
          if (statsResponse.ok) {
            setStats(statsData);
          }
          
          // Fetch topper data for comparison
          const topperResponse = await fetch(`http://localhost:3001/api/results/topper/general/practice`);
          const topperResult = await topperResponse.json();
          
          if (topperResponse.ok && !topperResult.message) {
            setTopperData(topperResult);
          }
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [attemptId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }
  
  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Result Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested result could not be found.</p>
          <Button asChild>
            <Link to="/student/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Calculate derived values
  const incorrect = results.total_questions - results.score;
  const negativeMarks = incorrect * -0.25;
  const finalScore = results.score + negativeMarks;
  const attempted = results.total_questions; // Assuming all questions were attempted
  
  // Format time spent
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Download PDF function
  const downloadPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Quiz Result - ${results.exam_title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .score-card { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat { text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; }
            .stat-label { font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Quiz Result Report</h1>
            <h2>${results.exam_title}</h2>
            <p>Student: ${results.student_name || 'N/A'}</p>
            <p>Date: ${new Date(results.created_at).toLocaleDateString()}</p>
          </div>
          
          <div class="score-card">
            <h3>Overall Performance</h3>
            <div class="stats">
              <div class="stat">
                <div class="stat-value">${finalScore.toFixed(2)}</div>
                <div class="stat-label">Final Score</div>
              </div>
              <div class="stat">
                <div class="stat-value">${results.percentage}%</div>
                <div class="stat-label">Percentage</div>
              </div>
              <div class="stat">
                <div class="stat-value">${results.score}</div>
                <div class="stat-label">Correct Answers</div>
              </div>
              <div class="stat">
                <div class="stat-value">${results.time_spent ? formatTime(results.time_spent) : 'N/A'}</div>
                <div class="stat-label">Time Spent</div>
              </div>
            </div>
          </div>
          
          <table>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Total Questions</td>
              <td>${results.total_questions}</td>
            </tr>
            <tr>
              <td>Correct Answers</td>
              <td>${results.score}</td>
            </tr>
            <tr>
              <td>Incorrect Answers</td>
              <td>${incorrect}</td>
            </tr>
            <tr>
              <td>Positive Marks</td>
              <td>+${results.score}</td>
            </tr>
            <tr>
              <td>Negative Marks</td>
              <td>${negativeMarks.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Final Score</strong></td>
              <td><strong>${finalScore.toFixed(2)}</strong></td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #666;">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Nishchay - Exam Preparation Platform</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quiz Results</h1>
            <p className="text-muted-foreground">{results.exam_title}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={downloadPDF}>
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
                <div className="text-3xl font-bold text-primary">{finalScore.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-2">
                  <Target className="w-10 h-10 text-success" />
                </div>
                <div className="text-3xl font-bold text-success">{results.percentage}%</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-warning/10 rounded-full flex items-center justify-center mb-2">
                  <Clock className="w-10 h-10 text-warning" />
                </div>
                <div className="text-3xl font-bold text-warning">{results.time_spent ? formatTime(results.time_spent) : 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-info/10 rounded-full flex items-center justify-center mb-2">
                  <TrendingUp className="w-10 h-10 text-info" />
                </div>
                <div className="text-3xl font-bold text-info">{results.score}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
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
                    <Badge variant="outline" className="text-success">{results.score}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span>Incorrect</span>
                    </div>
                    <Badge variant="outline" className="text-destructive">{incorrect}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Minus className="w-4 h-4 text-muted-foreground" />
                      <span>Skipped</span>
                    </div>
                    <Badge variant="outline">0</Badge>
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
                    <span className="font-semibold text-destructive">{negativeMarks.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Final Score</span>
                    <span className="text-primary">{finalScore.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {results.analysis ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>Subject-wise Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const subjectStats = {};
                      results.analysis.questions?.forEach(q => {
                        if (!subjectStats[q.subject]) {
                          subjectStats[q.subject] = { correct: 0, total: 0 };
                        }
                        subjectStats[q.subject].total++;
                        if (q.is_correct) subjectStats[q.subject].correct++;
                      });
                      
                      return Object.keys(subjectStats).length > 0 ? (
                        <div className="space-y-4">
                          {Object.entries(subjectStats).map(([subject, stats]) => {
                            const percentage = Math.round((stats.correct / stats.total) * 100);
                            return (
                              <div key={subject}>
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">{subject}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {stats.correct}/{stats.total} ({percentage}%)
                                  </span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>No subject data available</p>
                        </div>
                      );
                    })()
                    }
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Difficulty-wise Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const difficultyStats = {};
                      results.analysis.questions?.forEach(q => {
                        if (!difficultyStats[q.difficulty]) {
                          difficultyStats[q.difficulty] = { correct: 0, total: 0 };
                        }
                        difficultyStats[q.difficulty].total++;
                        if (q.is_correct) difficultyStats[q.difficulty].correct++;
                      });
                      
                      return (
                        <div className="space-y-4">
                          {Object.entries(difficultyStats).map(([difficulty, stats]) => {
                            const percentage = Math.round((stats.correct / stats.total) * 100);
                            return (
                              <div key={difficulty}>
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium capitalize">{difficulty}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {stats.correct}/{stats.total} ({percentage}%)
                                  </span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()
                    }
                  </CardContent>
                </Card>
                
                {topperData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span>Topper Comparison</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">Current Topper</h4>
                              <p className="text-sm text-muted-foreground">{topperData.studentName}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-yellow-600">{topperData.score}%</div>
                              <div className="text-sm text-muted-foreground">Best Score</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h5 className="font-semibold">Performance Comparison</h5>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span>Your Score:</span>
                                <span className="font-semibold">{results.percentage}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Topper Score:</span>
                                <span className="font-semibold text-yellow-600">{topperData.score}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Gap:</span>
                                <span className={`font-semibold ${
                                  results.percentage >= topperData.score ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {results.percentage >= topperData.score ? '+' : ''}
                                  {(results.percentage - topperData.score).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h5 className="font-semibold">Time Comparison</h5>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span>Your Time:</span>
                                <span className="font-semibold">
                                  {results.time_spent ? formatTime(results.time_spent) : 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Topper Time:</span>
                                <span className="font-semibold text-yellow-600">
                                  {formatTime(topperData.timeSpent)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Difference:</span>
                                <span className={`font-semibold ${
                                  (results.time_spent || 0) <= topperData.timeSpent ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {results.time_spent ? 
                                    (results.time_spent <= topperData.timeSpent ? 'Faster' : 'Slower') + 
                                    ` by ${formatTime(Math.abs((results.time_spent || 0) - topperData.timeSpent))}` 
                                    : 'N/A'
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-semibold mb-2">Key Insights</h5>
                          <div className="text-sm space-y-1">
                            {results.percentage >= topperData.score ? (
                              <p className="text-green-700">🎉 Congratulations! You've matched or exceeded the current topper's score!</p>
                            ) : (
                              <p className="text-blue-700">📈 You need {(topperData.score - results.percentage).toFixed(1)}% more to match the topper.</p>
                            )}
                            {results.time_spent && results.time_spent <= topperData.timeSpent && (
                              <p className="text-green-700">⚡ Great! You completed the quiz faster than the topper.</p>
                            )}
                            <p className="text-gray-600">Topper answered {topperData.correctAnswers}/{topperData.totalQuestions} questions correctly.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Analysis data not available for this result.</p>
                  </div>
                </CardContent>
              </Card>
            )}
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
                    <Progress value={finalScore} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Average Score</span>
                      <span className="font-semibold">{stats?.averageScore || 'N/A'}</span>
                    </div>
                    <Progress value={stats?.averageScore || 0} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Topper Score</span>
                      <span className="font-semibold">{stats?.highestScore || 'N/A'}</span>
                    </div>
                    <Progress value={stats?.highestScore || 0} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Question-by-Question Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {results.analysis?.questions ? (
                  <div className="space-y-4">
                    {results.analysis.questions.map((q, index) => (
                      <div key={q.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">Q{index + 1}.</span>
                              {q.is_correct ? (
                                <CheckCircle className="w-4 h-4 text-success" />
                              ) : (
                                <XCircle className="w-4 h-4 text-destructive" />
                              )}
                              <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
                              <Badge variant="secondary" className="text-xs">{q.subject}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{q.text}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Your Answer: </span>
                            <span className={q.is_correct ? 'text-success' : 'text-destructive'}>
                              {q.user_answer ? q.user_answer.toUpperCase() : 'Not Answered'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Correct Answer: </span>
                            <span className="text-success">{q.correct_answer.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Detailed analysis not available for this result.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResultsPage;