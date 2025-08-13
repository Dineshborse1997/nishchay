import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Calendar,
  User,
  Settings,
  Play,
  FileText,
  MapPin,
  Star
} from "lucide-react";

const StudentDashboard = () => {
  const [selectedExam, setSelectedExam] = useState<"police" | "talathi">("police");

  const examSections = {
    police: [
      { 
        id: "pyq", 
        title: "Previous Year Questions", 
        description: "Practice with actual exam questions from 2015-2024",
        questions: 2500,
        icon: FileText,
        color: "bg-blue-500"
      },
      { 
        id: "model", 
        title: "Model Questions", 
        description: "Expert-created practice sets based on latest patterns",
        questions: 1800,
        icon: BookOpen,
        color: "bg-green-500"
      },
      { 
        id: "district", 
        title: "District-wise Questions", 
        description: "Region-specific questions and local knowledge tests",
        questions: 1200,
        icon: MapPin,
        color: "bg-purple-500"
      }
    ],
    talathi: [
      { 
        id: "pyq", 
        title: "Previous Year Questions", 
        description: "Talathi exam papers from recent years",
        questions: 2200,
        icon: FileText,
        color: "bg-blue-500"
      },
      { 
        id: "model", 
        title: "Model Questions", 
        description: "Comprehensive practice for rural development topics",
        questions: 1600,
        icon: BookOpen,
        color: "bg-green-500"
      },
      { 
        id: "district", 
        title: "District-wise Questions", 
        description: "Local governance and district-specific questions",
        questions: 1000,
        icon: MapPin,
        color: "bg-purple-500"
      }
    ]
  };

  const recentActivity = [
    { test: "Police Bharti Mock Test #15", score: 85, total: 100, date: "2 hours ago", status: "completed" },
    { test: "General Knowledge Practice", score: 92, total: 100, date: "1 day ago", status: "completed" },
    { test: "Marathi Literature Quiz", score: 78, total: 100, date: "2 days ago", status: "completed" },
    { test: "Constitution & Law Test", score: 0, total: 100, date: "3 days ago", status: "incomplete" }
  ];

  const currentSections = examSections[selectedExam];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Rajesh Sharma</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Exam Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose Your Exam</h2>
          <div className="flex gap-4">
            <Button
              variant={selectedExam === "police" ? "default" : "outline"}
              onClick={() => setSelectedExam("police")}
              className="flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>Police Bharti</span>
            </Button>
            <Button
              variant={selectedExam === "talathi" ? "default" : "outline"}
              onClick={() => setSelectedExam("talathi")}
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Talathi Bharti</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Sections */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Practice Sections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Card key={section.id} className="card-floating cursor-pointer group">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">{section.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {section.questions} Questions
                          </Badge>
                          <Button size="sm" className="flex items-center space-x-1">
                            <Play className="h-3 w-3" />
                            <span>Start</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{activity.test}</h4>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {activity.status === "completed" ? (
                          <div className="text-right">
                            <div className="text-lg font-semibold text-foreground">
                              {activity.score}/{activity.total}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round((activity.score / activity.total) * 100)}%
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-warning">
                            Incomplete
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">85%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-semibold text-foreground">142</div>
                    <div className="text-xs text-muted-foreground">Tests Taken</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-foreground">28</div>
                    <div className="text-xs text-muted-foreground">Hours Studied</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rank in Class</span>
                    <span className="font-semibold">#12 / 1,250</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Streak</span>
                    <span className="font-semibold">7 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Take Mock Test
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study Materials
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Study Schedule
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-success-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Week Warrior</div>
                    <div className="text-xs text-muted-foreground">7 day streak</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Top Scorer</div>
                    <div className="text-xs text-muted-foreground">90%+ in last test</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;