import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  SkipForward
} from "lucide-react";
import { Link } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  textMarathi: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  optionsMarathi: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  expectedTime: number;
  negativeMarks: boolean;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of Maharashtra?",
    textMarathi: "महाराष्ट्राची राजधानी कोणती आहे?",
    options: {
      a: "Mumbai",
      b: "Pune", 
      c: "Nagpur",
      d: "Nashik"
    },
    optionsMarathi: {
      a: "मुंबई",
      b: "पुणे",
      c: "नागपूर", 
      d: "नाशिक"
    },
    subject: "General Knowledge",
    difficulty: "easy",
    expectedTime: 30,
    negativeMarks: true
  },
  {
    id: 2,
    text: "Which article of Indian Constitution deals with Right to Education?",
    textMarathi: "भारतीय संविधानाचा कोणता कलम शिक्षणाच्या अधिकाराशी संबंधित आहे?",
    options: {
      a: "Article 19",
      b: "Article 21A",
      c: "Article 25", 
      d: "Article 32"
    },
    optionsMarathi: {
      a: "कलम १९",
      b: "कलम २१ अ",
      c: "कलम २५",
      d: "कलम ३२"
    },
    subject: "Constitution",
    difficulty: "medium",
    expectedTime: 45,
    negativeMarks: true
  }
];

interface QuizInterfaceProps {
  examType?: string;
  section?: string;
}

const QuizInterface = ({ examType, section }: QuizInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [questionTime, setQuestionTime] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [language, setLanguage] = useState<"english" | "marathi">("english");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = sampleQuestions;
  const question = questions[currentQuestion];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setQuestionTime(questionTime + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsSubmitted(true);
    }
  }, [timeLeft, questionTime, isSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (option: string) => {
    setAnswers({ ...answers, [question.id]: option });
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(question.id)) {
      newFlagged.delete(question.id);
    } else {
      newFlagged.add(question.id);
    }
    setFlagged(newFlagged);
  };

  const getQuestionStatus = (questionIndex: number) => {
    const qId = questions[questionIndex].id;
    if (answers[qId]) return "answered";
    if (flagged.has(qId)) return "flagged";
    if (questionIndex < currentQuestion) return "skipped";
    return "not-visited";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered": return "bg-success";
      case "flagged": return "bg-warning";
      case "skipped": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "answered": return <CheckCircle className="h-3 w-3" />;
      case "flagged": return <Flag className="h-3 w-3" />;
      case "skipped": return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-success">Quiz Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your quiz has been submitted successfully. Results will be shown after processing.
            </p>
            <Button className="w-full" asChild>
              <Link to="/results/1">View Results</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-destructive" />
              <span className="text-lg font-mono font-bold text-destructive">
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Question:</span>
              <span className="font-semibold">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={language === "english" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("english")}
            >
              English
            </Button>
            <Button
              variant={language === "marathi" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("marathi")}
            >
              मराठी
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setIsSubmitted(true)}
            >
              Submit Quiz
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{question.subject}</Badge>
                      <Badge 
                        variant={question.difficulty === "easy" ? "default" : 
                                question.difficulty === "medium" ? "secondary" : "destructive"}
                      >
                        {question.difficulty}
                      </Badge>
                      {question.negativeMarks && (
                        <Badge variant="destructive" className="flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>-0.25</span>
                        </Badge>
                      )}
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                  <Button
                    variant={flagged.has(question.id) ? "default" : "outline"}
                    size="sm"
                    onClick={toggleFlag}
                    className="flex items-center space-x-1"
                  >
                    <Flag className="h-4 w-4" />
                    <span>{flagged.has(question.id) ? "Flagged" : "Flag"}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question Text */}
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Q{currentQuestion + 1}. {language === "english" ? question.text : question.textMarathi}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {Object.entries(language === "english" ? question.options : question.optionsMarathi).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleAnswerSelect(key)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:border-primary ${
                        answers[question.id] === key
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                          answers[question.id] === key
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-muted-foreground text-muted-foreground"
                        }`}>
                          {key.toUpperCase()}
                        </div>
                        <span className="text-foreground">{value}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>

                  <div className="flex items-center space-x-3">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <RotateCcw className="h-4 w-4" />
                      <span>Clear</span>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                      className="flex items-center space-x-2"
                    >
                      <SkipForward className="h-4 w-4" />
                      <span>Skip</span>
                    </Button>
                  </div>

                  <Button
                    onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                    disabled={currentQuestion === questions.length - 1}
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Palette */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {questions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                          index === currentQuestion
                            ? "border-primary bg-primary text-primary-foreground"
                            : `border-border ${getStatusColor(status)} text-foreground hover:scale-105`
                        }`}
                      >
                        <span>{index + 1}</span>
                        {getStatusIcon(status) && (
                          <div className="absolute -top-1 -right-1">
                            {getStatusIcon(status)}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-success rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-warning rounded"></div>
                    <span>Flagged</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-destructive rounded"></div>
                    <span>Skipped</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span>Not Visited</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Answered:</span>
                  <span className="font-semibold text-success">
                    {Object.keys(answers).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Flagged:</span>
                  <span className="font-semibold text-warning">
                    {flagged.size}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining:</span>
                  <span className="font-semibold text-muted-foreground">
                    {questions.length - Object.keys(answers).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;