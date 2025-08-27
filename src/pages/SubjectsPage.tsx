import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Brain, 
  Globe, 
  Languages, 
  BookOpen,
  ArrowLeft,
  Play
} from "lucide-react";

const SubjectsPage = () => {
  const { examType } = useParams();
  const navigate = useNavigate();

  const subjects = [
    {
      id: "mathematics",
      title: "Mathematics",
      description: "Arithmetic, Algebra, Geometry & Data Interpretation",
      questions: 800,
      icon: Calculator,
      color: "bg-blue-500"
    },
    {
      id: "reasoning",
      title: "Reasoning",
      description: "Logical & Analytical Reasoning",
      questions: 750,
      icon: Brain,
      color: "bg-green-500"
    },
    {
      id: "gk",
      title: "GK",
      description: "General Knowledge & Current Affairs",
      questions: 900,
      icon: Globe,
      color: "bg-purple-500"
    },
    {
      id: "marathi-grammar",
      title: "Marathi Grammar",
      description: "Marathi Language & Grammar",
      questions: 600,
      icon: Languages,
      color: "bg-orange-500"
    },
    {
      id: "english-grammar",
      title: "English Grammar",
      description: "English Language & Grammar",
      questions: 550,
      icon: BookOpen,
      color: "bg-red-500"
    }
  ];

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/quiz/${examType}/subject/${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/student/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Subject wise Questions</h1>
          <p className="text-muted-foreground">Choose a subject to practice</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Card 
                key={subject.id} 
                className="card-floating cursor-pointer group" 
                onClick={() => handleSubjectClick(subject.id)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{subject.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {subject.questions} Questions
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
    </div>
  );
};

export default SubjectsPage;