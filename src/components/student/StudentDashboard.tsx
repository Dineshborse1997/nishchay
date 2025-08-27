import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Star,
  LogOut,
  BookOpenCheck,
  Target,
  Zap,
  BarChart3,
  Bell,
  AlertCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [selectedExam, setSelectedExam] = useState<"police" | "talathi">("police");
  const [userName, setUserName] = useState("Student");
  const [userPhoto, setUserPhoto] = useState("");
  const [userStats, setUserStats] = useState({
    averageScore: 0,
    testsTaken: 0,
    hoursStudied: 0,
    bestScore: 0,
    weeklyTests: 0,
    recentActivity: []
  });
  const [questionCounts, setQuestionCounts] = useState({
    pyq: 0,
    model: 0,
    district: 0,
    subject: 0
  });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.fullName || "Student");
      fetchUserProfile(user.id);
      fetchUserStats(user.id);
      fetchNotices();
    } else {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchQuestionCounts();
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      fetchUserStats(user.id);
    }
  }, [selectedExam]);

  const fetchUserProfile = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/profile/${userId}`);
      const data = await response.json();
      
      if (response.ok && data.user.photo) {
        setUserPhoto(data.user.photo);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const fetchUserStats = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/stats/${userId}/${selectedExam}`);
      const data = await response.json();
      
      if (response.ok) {
        setUserStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionCounts = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/questions/counts/${selectedExam}`);
      const data = await response.json();
      
      console.log('Question counts for', selectedExam, ':', data);
      
      if (response.ok) {
        setQuestionCounts(data);
      }
    } catch (error) {
      console.error('Failed to fetch question counts:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/notices');
      const data = await response.json();
      
      if (response.ok) {
        setNotices(data);
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    navigate(`/quiz/${selectedExam}/${sectionId}`);
  };

  const examSections = {
    police: [
      { 
        id: "pyq", 
        title: t('section.pyq'), 
        description: t('section.pyq.desc'),
        questions: questionCounts.pyq,
        icon: FileText,
        color: "bg-blue-500"
      },
      { 
        id: "model_papers", 
        title: t('section.model'), 
        description: t('section.model.desc'),
        questions: questionCounts.model,
        icon: BookOpen,
        color: "bg-green-500"
      },
      { 
        id: "district_papers", 
        title: t('section.district'), 
        description: t('section.district.desc'),
        questions: questionCounts.district,
        icon: MapPin,
        color: "bg-purple-500"
      },
      { 
        id: "subject_wise", 
        title: t('section.subject'), 
        description: t('section.subject.desc'),
        questions: questionCounts.subject,
        icon: BookOpenCheck,
        color: "bg-orange-500"
      }
    ],
    talathi: [
      { 
        id: "pyq", 
        title: t('section.pyq'), 
        description: t('section.pyq.desc'),
        questions: questionCounts.pyq,
        icon: FileText,
        color: "bg-blue-500"
      },
      { 
        id: "model_papers", 
        title: t('section.model'), 
        description: t('section.model.desc'),
        questions: questionCounts.model,
        icon: BookOpen,
        color: "bg-green-500"
      },
      { 
        id: "district_papers", 
        title: t('section.district'), 
        description: t('section.district.desc'),
        questions: questionCounts.district,
        icon: MapPin,
        color: "bg-purple-500"
      },
      { 
        id: "subject_wise", 
        title: t('section.subject'), 
        description: t('section.subject.desc'),
        questions: questionCounts.subject,
        icon: BookOpenCheck,
        color: "bg-orange-500"
      }
    ]
  };



  const currentSections = examSections[selectedExam];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 ring-2 ring-blue-100 ring-offset-2">
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">{t('dashboard.title')}</h1>
                <p className="text-slate-600 text-sm">{t('dashboard.welcome')}, {userName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Button 
                variant="ghost" 
                size="sm"
                className="h-10 px-4 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                asChild
              >
                <Link to="/student/profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {t('btn.profile')}
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-10 px-4 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/student/login');
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('btn.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Exam Switcher */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">{t('dashboard.currentExam')}</h2>
          <div className="relative inline-flex items-center bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg border border-white/20">
            <div 
              className={`absolute top-1.5 bottom-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl transition-all duration-500 ease-out shadow-lg ${
                selectedExam === "police" ? "left-1.5 w-[140px]" : "left-[145px] w-[150px]"
              }`}
            />
            <button
              onClick={() => setSelectedExam("police")}
              className={`relative z-10 flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                selectedExam === "police" ? "text-white" : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>{t('exam.police')}</span>
            </button>
            <button
              onClick={() => setSelectedExam("talathi")}
              className={`relative z-10 flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                selectedExam === "talathi" ? "text-white" : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>{t('exam.talathi')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Notice Board */}
            {notices.length > 0 && (
              <div className="rounded-3xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Notice Board</h3>
                  </div>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {notices.slice(0, 3).map((notice) => (
                      <div key={notice.id} className="p-4 bg-white/50 rounded-2xl border border-white/30">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-800">{notice.title}</h4>
                          <div className="flex items-center space-x-2">
                            {notice.priority === 'high' && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <Badge variant={notice.priority === 'high' ? 'destructive' : notice.priority === 'medium' ? 'default' : 'secondary'}>
                              {notice.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{notice.content}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(notice.created_at).toLocaleDateString()} • By {notice.created_by_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Quiz Sections */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">{t('dashboard.practiceSection')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div 
                      key={section.id} 
                      className="group cursor-pointer" 
                      onClick={() => handleSectionClick(section.id)}
                    >
                      <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                        <div className="relative p-8">
                          <div className={`w-16 h-16 ${section.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h4 className="font-bold text-slate-800 mb-3 text-lg">{section.title}</h4>
                          <p className="text-slate-600 mb-6 text-sm leading-relaxed">{section.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="px-3 py-1.5 bg-slate-100/80 rounded-full">
                              <span className="text-xs font-semibold text-slate-700">
                                {section.questions} {t('stats.questions')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white font-semibold text-sm group-hover:shadow-lg transition-all duration-300">
                              <Play className="h-4 w-4" />
                              <span>{t('btn.start')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">{t('dashboard.recentActivity')}</h3>
                </div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading activity...</p>
                  </div>
                ) : userStats.recentActivity.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600">No recent activity. Start taking quizzes to see your progress!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userStats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-6 bg-white/50 rounded-2xl border border-white/30 hover:bg-white/70 transition-all duration-300">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 mb-1">{activity.exam_title}</h4>
                          <p className="text-sm text-slate-600">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-800">
                              {activity.score}/{activity.total_questions}
                            </div>
                            <div className="text-sm text-slate-600">
                              {activity.percentage}%
                            </div>
                          </div>
                          <Link 
                            to={`/results/${activity.id}`}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                          >
                            {t('btn.view')}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Performance Stats */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">{t('dashboard.performance')}</h3>
                </div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading stats...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Circular Progress */}
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="8"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${(userStats.averageScore / 100) * 314} 314`}
                            className="transition-all duration-1000 ease-out"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-800">{userStats.averageScore}%</div>
                            <div className="text-xs text-slate-600">{t('stats.averageScore')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/50 rounded-2xl border border-white/30">
                        <div className="text-2xl font-bold text-slate-800">{userStats.testsTaken}</div>
                        <div className="text-xs text-slate-600">{t('stats.testsTaken')}</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-2xl border border-white/30">
                        <div className="text-2xl font-bold text-slate-800">{userStats.hoursStudied}</div>
                        <div className="text-xs text-slate-600">{t('stats.hoursStudied')}</div>
                      </div>
                    </div>
                    
                    {userStats.testsTaken > 0 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl border border-white/30">
                          <span className="text-sm text-slate-600">Best Score</span>
                          <span className="font-bold text-slate-800">{userStats.bestScore || 0}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl border border-white/30">
                          <span className="text-sm text-slate-600">This Week</span>
                          <span className="font-bold text-slate-800">{userStats.weeklyTests || 0} tests</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">{t('dashboard.quickActions')}</h3>
                </div>
                <div className="space-y-4">
                  <button 
                    className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                    onClick={() => handleSectionClick('model_papers')}
                  >
                    <Play className="h-5 w-5" />
                    <span>{t('action.mockTest')}</span>
                  </button>
                  <button 
                    className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                    onClick={() => handleSectionClick('subject_wise')}
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>{t('action.studyMaterials')}</span>
                  </button>
                  <button className="w-full p-4 bg-slate-200 text-slate-500 rounded-2xl font-semibold text-sm cursor-not-allowed flex items-center justify-center space-x-3">
                    <Trophy className="h-5 w-5" />
                    <span>{t('action.leaderboard')}</span>
                  </button>
                  <button className="w-full p-4 bg-slate-200 text-slate-500 rounded-2xl font-semibold text-sm cursor-not-allowed flex items-center justify-center space-x-3">
                    <Calendar className="h-5 w-5" />
                    <span>{t('action.schedule')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">{t('dashboard.achievements')}</h3>
                </div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading achievements...</p>
                  </div>
                ) : userStats.testsTaken === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600">Complete quizzes to unlock achievements!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userStats.averageScore >= 80 && (
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">High Achiever</div>
                          <div className="text-sm text-slate-600">{userStats.averageScore}% average score</div>
                        </div>
                      </div>
                    )}
                    {userStats.testsTaken >= 10 && (
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Star className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">Dedicated Learner</div>
                          <div className="text-sm text-slate-600">{userStats.testsTaken} tests completed</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;