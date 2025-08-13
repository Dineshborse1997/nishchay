import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  FileText,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Total Students",
      value: "12,450",
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Tests",
      value: "1,247",
      change: "+12.1%", 
      trend: "up",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Questions Bank",
      value: "10,582",
      change: "+8.7%",
      trend: "up", 
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentStudents = [
    { id: 1, name: "Rajesh Sharma", email: "rajesh@email.com", exam: "Police Bharti", joinDate: "2024-01-15", status: "active" },
    { id: 2, name: "Priya Patil", email: "priya@email.com", exam: "Talathi Bharti", joinDate: "2024-01-14", status: "active" },
    { id: 3, name: "Amit Kumar", email: "amit@email.com", exam: "Police Bharti", joinDate: "2024-01-13", status: "inactive" },
    { id: 4, name: "Sneha Joshi", email: "sneha@email.com", exam: "Talathi Bharti", joinDate: "2024-01-12", status: "active" },
  ];

  const recentTests = [
    { id: 1, title: "Police Bharti Mock Test #45", type: "Police", questions: 100, students: 245, created: "2024-01-15" },
    { id: 2, title: "Talathi General Knowledge", type: "Talathi", questions: 75, students: 189, created: "2024-01-14" },
    { id: 3, title: "Constitution & Law Quiz", type: "Police", questions: 50, students: 156, created: "2024-01-13" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your PrepWise platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              <Badge variant="destructive" className="ml-2">3</Badge>
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="notices">Notices</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="card-floating">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className={`text-sm flex items-center ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {stat.change} from last month
                          </p>
                        </div>
                        <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Students */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Registrations</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          <p className="text-xs text-muted-foreground">{student.exam} • {student.joinDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Tests */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Test Activity</CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Test
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTests.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{test.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {test.questions} questions • {test.students} students attempted
                          </p>
                          <p className="text-xs text-muted-foreground">Created: {test.created}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{test.type}</Badge>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Student Management</CardTitle>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Student</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Exam Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Active</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-foreground">{student.name}</div>
                              <div className="text-sm text-muted-foreground">{student.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{student.exam}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{width: '75%'}}></div>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">75% Complete</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">2 hours ago</td>
                          <td className="px-4 py-3">
                            <Badge variant={student.status === "active" ? "default" : "secondary"}>
                              {student.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Question Bank Management</CardTitle>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Upload
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">5,240</div>
                      <div className="text-sm text-muted-foreground">Police Bharti Questions</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">3,890</div>
                      <div className="text-sm text-muted-foreground">Talathi Bharti Questions</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">1,452</div>
                      <div className="text-sm text-muted-foreground">Pending Review</div>
                    </div>
                  </Card>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Question Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload questions in bulk using CSV or create individual questions with our editor.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Question
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Performance Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Activity Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notices Tab */}
          <TabsContent value="notices" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notice Board Management</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Notice
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Important: Exam Pattern Update</h4>
                      <p className="text-sm text-muted-foreground">
                        New negative marking rules for Police Bharti 2024
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Scheduled: Jan 20, 2024 • Active until: Feb 20, 2024
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Active</Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">System Maintenance Notice</h4>
                      <p className="text-sm text-muted-foreground">
                        Platform will be under maintenance on Sunday 2-4 AM
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Scheduled: Jan 25, 2024 • Active until: Jan 26, 2024
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Scheduled</Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;