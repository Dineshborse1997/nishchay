import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import NoticeManagement from "@/components/admin/NoticeManagement";
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
  AlertCircle,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  console.log('AdminDashboard component rendering');
  const [activeTab, setActiveTab] = useState("overview");
  const [recentStudents, setRecentStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: ""
  });
  const [questions, setQuestions] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({ policeBharti: 0, talathiBharti: 0, total: 0 });
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "a",
    category: "general",
    difficulty: "medium",
    practice_section: "subject_wise",
    exam_year: ""
  });
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [bulkQuestions, setBulkQuestions] = useState("");
  const [uploadMethod, setUploadMethod] = useState("text");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfCategory, setPdfCategory] = useState("general");
  const [pdfDifficulty, setPdfDifficulty] = useState("medium");
  const [bulkSection, setBulkSection] = useState("subject_wise");
  const [bulkYear, setBulkYear] = useState("");
  const [isViewQuestionOpen, setIsViewQuestionOpen] = useState(false);
  const [isEditQuestionOpen, setIsEditQuestionOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewStudentOpen, setIsViewStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editStudentForm, setEditStudentForm] = useState({
    fullName: "",
    email: "",
    mobile: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('AdminDashboard useEffect running');
    fetchRecentStudents();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') {
      fetchAllStudents();
    } else if (activeTab === 'questions') {
      fetchQuestions();
      fetchQuestionCounts();
    }
  }, [activeTab]);

  const fetchRecentStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/students/recent');
      const data = await response.json();
      
      if (response.ok) {
        setRecentStudents(data);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    setStudentsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/students/all');
      const data = await response.json();
      
      if (response.ok) {
        setAllStudents(data);
      }
    } catch (error) {
      console.error('Failed to fetch all students:', error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Student added successfully"
        });
        setStudentForm({ fullName: "", email: "", mobile: "", password: "" });
        setIsAddStudentOpen(false);
        fetchRecentStudents();
        fetchAllStudents();
      } else {
        throw new Error(data.error || 'Failed to add student');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive"
      });
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsViewStudentOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setEditStudentForm({
      fullName: student.full_name,
      email: student.email,
      mobile: student.mobile
    });
    setIsEditStudentOpen(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:3001/api/user/profile/${selectedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editStudentForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Student updated successfully"
        });
        setIsEditStudentOpen(false);
        setSelectedStudent(null);
        fetchAllStudents();
        fetchRecentStudents();
      } else {
        throw new Error(data.error || 'Failed to update student');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update student",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/api/admin/students/${studentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Student deleted successfully"
        });
        fetchAllStudents();
        fetchRecentStudents();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete student');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete student",
        variant: "destructive"
      });
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/questions');
      const data = await response.json();
      if (response.ok) {
        setQuestions(data);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const fetchQuestionCounts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/questions/counts');
      const data = await response.json();
      if (response.ok) {
        setQuestionCounts(data);
      }
    } catch (error) {
      console.error('Failed to fetch question counts:', error);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    
    // Validate year for PYQ questions and set for Model Papers
    if ((questionForm.practice_section === 'pyq' || questionForm.practice_section === 'model_papers') && !questionForm.exam_year) {
      const fieldName = questionForm.practice_section === 'pyq' ? 'exam year' : 'model set';
      const sectionName = questionForm.practice_section === 'pyq' ? 'Previous Year Questions' : 'Model Papers';
      toast({
        title: "Error",
        description: `Please select a ${fieldName} for ${sectionName}`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Question added successfully"
        });
        setQuestionForm({
          question_text: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_answer: "a",
          category: "general",
          difficulty: "medium",
          practice_section: "subject_wise",
          exam_year: ""
        });
        setIsAddQuestionOpen(false);
        fetchQuestions();
        fetchQuestionCounts();
      } else {
        throw new Error(data.error || 'Failed to add question');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add question",
        variant: "destructive"
      });
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    
    try {
      if (uploadMethod === "text") {
        const questionsArray = bulkQuestions.split('\n').filter(line => line.trim()).map(line => {
          const parts = line.split('|').map(part => part.trim());
          if (parts.length < 7) throw new Error('Invalid format');
          
          return {
            question_text: parts[0],
            option_a: parts[1],
            option_b: parts[2],
            option_c: parts[3],
            option_d: parts[4],
            correct_answer: parts[5].toLowerCase(),
            category: parts[6] || 'general',
            difficulty: parts[7] || 'medium'
          };
        });
        
        const response = await fetch('http://localhost:3001/api/admin/questions/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions: questionsArray })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          toast({ title: "Success", description: data.message });
          setBulkQuestions("");
          setBulkSection("subject_wise");
          setBulkYear("");
          setIsBulkUploadOpen(false);
          fetchQuestions();
          fetchQuestionCounts();
        } else {
          throw new Error(data.error || 'Failed to upload questions');
        }
      } else {
        if (!pdfFile) throw new Error('Please select a PDF file');
        
        const formData = new FormData();
        formData.append('pdf', pdfFile);
        formData.append('category', pdfCategory);
        formData.append('difficulty', pdfDifficulty);
        
        const response = await fetch('http://localhost:3001/api/admin/questions/bulk-pdf', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          toast({ title: "Success", description: data.message });
          setPdfFile(null);
          setIsBulkUploadOpen(false);
          fetchQuestions();
          fetchQuestionCounts();
        } else {
          throw new Error(data.error || 'Failed to upload PDF');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload questions",
        variant: "destructive"
      });
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/questions/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Question deleted successfully"
        });
        fetchQuestions();
        fetchQuestionCounts();
      } else {
        throw new Error(data.error || 'Failed to delete question');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete question",
        variant: "destructive"
      });
    }
  };

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setIsViewQuestionOpen(true);
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setQuestionForm({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      category: question.category,
      difficulty: question.difficulty,
      practice_section: question.practice_section || "subject_wise",
      exam_year: question.exam_year || ""
    });
    setIsEditQuestionOpen(true);
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    
    // Validate year for PYQ questions
    if (questionForm.practice_section === 'pyq' && !questionForm.exam_year) {
      toast({
        title: "Error",
        description: "Please select an exam year for Previous Year Questions",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/api/admin/questions/${selectedQuestion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Question updated successfully"
        });
        setIsEditQuestionOpen(false);
        setSelectedQuestion(null);
        fetchQuestions();
        fetchQuestionCounts();
      } else {
        throw new Error(data.error || 'Failed to update question');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update question",
        variant: "destructive"
      });
    }
  };

  const stats = [
    {
      title: "Total Students",
      value: recentStudents.length.toString(),
      change: "0%",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Tests",
      value: "0",
      change: "0%", 
      trend: "up",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Questions Bank",
      value: "0",
      change: "0%",
      trend: "up", 
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Success Rate",
      value: "0%",
      change: "0%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];



  console.log('AdminDashboard rendering with activeTab:', activeTab);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your Nishchay platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/admin/login');
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
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
                  {loading ? (
                    <div className="text-center py-8">Loading students...</div>
                  ) : recentStudents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No students registered yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentStudents.slice(0, 4).map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{student.full_name}</h4>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                            <p className="text-xs text-muted-foreground">{student.mobile} • {new Date(student.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="default">Student</Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Database Connection</h4>
                        <p className="text-sm text-muted-foreground">MySQL database is connected</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Server Status</h4>
                        <p className="text-sm text-muted-foreground">Backend server running on port 3001</p>
                      </div>
                      <Badge variant="default">Running</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">Notice Board</h4>
                        <p className="text-sm text-muted-foreground">Notice management system active</p>
                      </div>
                      <Badge variant="default">Ready</Badge>
                    </div>
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
                    <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Student
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Student</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                          <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={studentForm.fullName}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, fullName: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={studentForm.email}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="mobile">Mobile</Label>
                            <Input
                              id="mobile"
                              value={studentForm.mobile}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, mobile: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              value={studentForm.password}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, password: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button type="submit" className="flex-1">
                              Add Student
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setIsAddStudentOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
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
                      {studentsLoading ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                            Loading students...
                          </td>
                        </tr>
                      ) : allStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                            No students found.
                          </td>
                        </tr>
                      ) : (
                        allStudents.map((student) => (
                          <tr key={student.id} className="border-b hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium text-foreground">{student.full_name}</div>
                                <div className="text-sm text-muted-foreground">{student.email}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline">Student</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{width: '0%'}}></div>
                              </div>
                              <span className="text-xs text-muted-foreground mt-1">0% Complete</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {new Date(student.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="default">Active</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewStudent(student)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditStudent(student)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDeleteStudent(student.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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
                    <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Bulk Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Bulk Upload Questions</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleBulkUpload} className="space-y-4">
                          <div>
                            <Label>Upload Method</Label>
                            <div className="flex space-x-4 mt-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  value="text"
                                  checked={uploadMethod === "text"}
                                  onChange={(e) => setUploadMethod(e.target.value)}
                                />
                                <span>Text Format</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  value="pdf"
                                  checked={uploadMethod === "pdf"}
                                  onChange={(e) => setUploadMethod(e.target.value)}
                                />
                                <span>PDF File</span>
                              </label>
                            </div>
                          </div>
                          
                          {uploadMethod === "text" ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Practice Section</Label>
                                  <Select value={bulkSection} onValueChange={setBulkSection}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pyq">Previous Year Questions</SelectItem>
                                      <SelectItem value="model_papers">Model Papers</SelectItem>
                                      <SelectItem value="district_papers">District Papers</SelectItem>
                                      <SelectItem value="subject_wise">Subject Wise</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {bulkSection === "pyq" && (
                                  <div>
                                    <Label>Exam Year</Label>
                                    <Select value={bulkYear} onValueChange={setBulkYear}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 11 }, (_, i) => 2025 - i).map(year => (
                                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                                {bulkSection === "model_papers" && (
                                  <div>
                                    <Label>Model Set</Label>
                                    <Select value={bulkYear} onValueChange={setBulkYear}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select set" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[1, 2, 3, 4].map(set => (
                                          <SelectItem key={set} value={set.toString()}>Set {set}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="bulkQuestions">Questions (Multiple formats supported)</Label>
                                <Textarea
                                  id="bulkQuestions"
                                  className="h-64"
                                  placeholder="Format 1: Question|Option A|Option B|Option C|Option D|Answer|Category|Difficulty&#10;&#10;Format 2: What is 2+2? A) 2 B) 3 C) 4 D) 5 Answer: C&#10;&#10;Format 3: Capital of India? (a) Mumbai (b) Delhi (c) Kolkata (d) Chennai Answer: b"
                                  value={bulkQuestions}
                                  onChange={(e) => setBulkQuestions(e.target.value)}
                                  required
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                  Supports: Pipe separated (|), A)B)C)D) format, or (a)(b)(c)(d) format
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="pdfFile">PDF File</Label>
                                <input
                                  id="pdfFile"
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => setPdfFile(e.target.files[0])}
                                  className="w-full p-2 border rounded-lg"
                                  required
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                  PDF upload is currently under development. Please use text format for now.
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Default Category</Label>
                                  <Select value={pdfCategory} onValueChange={setPdfCategory}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="general">General</SelectItem>
                                      <SelectItem value="police_bharti">Police Bharti</SelectItem>
                                      <SelectItem value="talathi_bharti">Talathi Bharti</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Default Difficulty</Label>
                                  <Select value={pdfDifficulty} onValueChange={setPdfDifficulty}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="easy">Easy</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex space-x-2">
                            <Button type="submit" className="flex-1">
                              Upload Questions
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setIsBulkUploadOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Question</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddQuestion} className="space-y-4">
                          <div>
                            <Label htmlFor="question_text">Question</Label>
                            <Textarea
                              id="question_text"
                              value={questionForm.question_text}
                              onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="option_a">Option A</Label>
                              <Input
                                id="option_a"
                                value={questionForm.option_a}
                                onChange={(e) => setQuestionForm(prev => ({ ...prev, option_a: e.target.value }))}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="option_b">Option B</Label>
                              <Input
                                id="option_b"
                                value={questionForm.option_b}
                                onChange={(e) => setQuestionForm(prev => ({ ...prev, option_b: e.target.value }))}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="option_c">Option C</Label>
                              <Input
                                id="option_c"
                                value={questionForm.option_c}
                                onChange={(e) => setQuestionForm(prev => ({ ...prev, option_c: e.target.value }))}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="option_d">Option D</Label>
                              <Input
                                id="option_d"
                                value={questionForm.option_d}
                                onChange={(e) => setQuestionForm(prev => ({ ...prev, option_d: e.target.value }))}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="correct_answer">Correct Answer</Label>
                              <Select value={questionForm.correct_answer} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, correct_answer: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select correct answer" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="a">A</SelectItem>
                                  <SelectItem value="b">B</SelectItem>
                                  <SelectItem value="c">C</SelectItem>
                                  <SelectItem value="d">D</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="practice_section">Practice Section</Label>
                              <Select value={questionForm.practice_section} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, practice_section: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select practice section" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pyq">Previous Year Questions</SelectItem>
                                  <SelectItem value="model_papers">Model Papers</SelectItem>
                                  <SelectItem value="district_papers">District Papers</SelectItem>
                                  <SelectItem value="subject_wise">Subject Wise</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="category">Category</Label>
                              <Select value={questionForm.category} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">General</SelectItem>
                                  <SelectItem value="police_bharti">Police Bharti</SelectItem>
                                  <SelectItem value="talathi_bharti">Talathi Bharti</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="difficulty">Difficulty</Label>
                              <Select value={questionForm.difficulty} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, difficulty: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="easy">Easy</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {questionForm.practice_section === "pyq" && (
                            <div>
                              <Label htmlFor="exam_year">Exam Year *</Label>
                              <Select value={questionForm.exam_year} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, exam_year: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 11 }, (_, i) => 2025 - i).map(year => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {questionForm.practice_section === "model_papers" && (
                            <div>
                              <Label htmlFor="exam_year">Model Set *</Label>
                              <Select value={questionForm.exam_year} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, exam_year: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select set" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4].map(set => (
                                    <SelectItem key={set} value={set.toString()}>Set {set}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="flex space-x-2">
                            <Button type="submit" className="flex-1">
                              Add Question
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setIsAddQuestionOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{questionCounts.policeBharti}</div>
                      <div className="text-sm text-muted-foreground">Police Bharti Questions</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{questionCounts.talathiBharti}</div>
                      <div className="text-sm text-muted-foreground">Talathi Bharti Questions</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{questionCounts.total}</div>
                      <div className="text-sm text-muted-foreground">Total Questions</div>
                    </div>
                  </Card>
                </div>

                {questions.length > 0 ? (
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Question</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Answer</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.map((question) => (
                          <tr key={question.id} className="border-b hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3">
                              <div className="max-w-md">
                                <div className="font-medium text-foreground truncate">{question.question_text}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline">{question.category}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={question.difficulty === 'hard' ? 'destructive' : question.difficulty === 'medium' ? 'default' : 'secondary'}>
                                {question.difficulty}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline">{question.correct_answer.toUpperCase()}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewQuestion(question)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditQuestion(question)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-muted/30 p-6 rounded-lg text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Questions Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload questions in bulk using the format above or create individual questions.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button onClick={() => setIsAddQuestionOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Question
                      </Button>
                      <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Bulk Upload
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* View Question Dialog */}
            <Dialog open={isViewQuestionOpen} onOpenChange={setIsViewQuestionOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>View Question</DialogTitle>
                </DialogHeader>
                {selectedQuestion && (
                  <div className="space-y-4">
                    <div>
                      <Label>Question</Label>
                      <div className="p-3 bg-muted rounded-lg">{selectedQuestion.question_text}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Option A</Label>
                        <div className="p-2 bg-muted rounded">{selectedQuestion.option_a}</div>
                      </div>
                      <div>
                        <Label>Option B</Label>
                        <div className="p-2 bg-muted rounded">{selectedQuestion.option_b}</div>
                      </div>
                      <div>
                        <Label>Option C</Label>
                        <div className="p-2 bg-muted rounded">{selectedQuestion.option_c}</div>
                      </div>
                      <div>
                        <Label>Option D</Label>
                        <div className="p-2 bg-muted rounded">{selectedQuestion.option_d}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Correct Answer</Label>
                        <Badge variant="outline" className="ml-2">{selectedQuestion.correct_answer.toUpperCase()}</Badge>
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Badge variant="outline" className="ml-2">{selectedQuestion.category}</Badge>
                      </div>
                      <div>
                        <Label>Difficulty</Label>
                        <Badge variant="outline" className="ml-2">{selectedQuestion.difficulty}</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Edit Question Dialog */}
            <Dialog open={isEditQuestionOpen} onOpenChange={setIsEditQuestionOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Question</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateQuestion} className="space-y-4">
                  <div>
                    <Label htmlFor="edit_question_text">Question</Label>
                    <Textarea
                      id="edit_question_text"
                      value={questionForm.question_text}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_option_a">Option A</Label>
                      <Input
                        id="edit_option_a"
                        value={questionForm.option_a}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_a: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_option_b">Option B</Label>
                      <Input
                        id="edit_option_b"
                        value={questionForm.option_b}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_b: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_option_c">Option C</Label>
                      <Input
                        id="edit_option_c"
                        value={questionForm.option_c}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_c: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_option_d">Option D</Label>
                      <Input
                        id="edit_option_d"
                        value={questionForm.option_d}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, option_d: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Correct Answer</Label>
                      <Select value={questionForm.correct_answer} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, correct_answer: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">A</SelectItem>
                          <SelectItem value="b">B</SelectItem>
                          <SelectItem value="c">C</SelectItem>
                          <SelectItem value="d">D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Practice Section</Label>
                      <Select value={questionForm.practice_section} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, practice_section: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pyq">Previous Year Questions</SelectItem>
                          <SelectItem value="model_papers">Model Papers</SelectItem>
                          <SelectItem value="district_papers">District Papers</SelectItem>
                          <SelectItem value="subject_wise">Subject Wise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select value={questionForm.category} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="police_bharti">Police Bharti</SelectItem>
                          <SelectItem value="talathi_bharti">Talathi Bharti</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Difficulty</Label>
                      <Select value={questionForm.difficulty} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {questionForm.practice_section === "pyq" && (
                    <div>
                      <Label>Exam Year</Label>
                      <Select value={questionForm.exam_year} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, exam_year: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 11 }, (_, i) => 2025 - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      Update Question
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditQuestionOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* View Student Dialog */}
          <Dialog open={isViewStudentOpen} onOpenChange={setIsViewStudentOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Student Details</DialogTitle>
              </DialogHeader>
              {selectedStudent && (
                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <div className="p-3 bg-muted rounded-lg">{selectedStudent.full_name}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="p-3 bg-muted rounded-lg">{selectedStudent.email}</div>
                  </div>
                  <div>
                    <Label>Mobile</Label>
                    <div className="p-3 bg-muted rounded-lg">{selectedStudent.mobile}</div>
                  </div>
                  <div>
                    <Label>Registration Date</Label>
                    <div className="p-3 bg-muted rounded-lg">{new Date(selectedStudent.created_at).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Badge variant="outline" className="ml-2">Student</Badge>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Student Dialog */}
          <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateStudent} className="space-y-4">
                <div>
                  <Label htmlFor="edit_fullName">Full Name</Label>
                  <Input
                    id="edit_fullName"
                    value={editStudentForm.fullName}
                    onChange={(e) => setEditStudentForm(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_email">Email</Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={editStudentForm.email}
                    onChange={(e) => setEditStudentForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_mobile">Mobile</Label>
                  <Input
                    id="edit_mobile"
                    value={editStudentForm.mobile}
                    onChange={(e) => setEditStudentForm(prev => ({ ...prev, mobile: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Update Student
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditStudentOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

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
            <NoticeManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
