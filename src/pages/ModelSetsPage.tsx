import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowLeft, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ModelSetsPage = () => {
  const { examType } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [questionCounts, setQuestionCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  const sets = [1, 2, 3, 4];

  useEffect(() => {
    const fetchQuestionCounts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/questions/counts/model/${examType}`);
        const data = await response.json();
        if (response.ok) {
          setQuestionCounts(data);
        }
      } catch (error) {
        console.error('Failed to fetch question counts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestionCounts();
  }, [examType]);

  const handleSetClick = (setNumber: number) => {
    navigate(`/quiz/${examType}/model_papers/${setNumber}`);
  };

  const getQuestionCount = (setNumber: number) => {
    return questionCounts[setNumber] || 0;
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
            {t('btn.back')}
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {t('section.model')}
          </h1>
          <p className="text-muted-foreground">
            Choose a set to practice {examType === 'police' ? 'Police Bharti' : 'Talathi Bharti'} model papers
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sets.map((setNumber) => (
            <Card 
              key={setNumber} 
              className="card-floating cursor-pointer group" 
              onClick={() => handleSetClick(setNumber)}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-xl">Set {setNumber}</h3>
                <div className="flex flex-col items-center space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {loading ? '...' : `${getQuestionCount(setNumber)} ${t('stats.questions')}`}
                  </Badge>
                  <Button 
                    size="sm" 
                    className="flex items-center space-x-1"
                    disabled={getQuestionCount(setNumber) === 0}
                  >
                    <Play className="h-3 w-3" />
                    <span>{getQuestionCount(setNumber) === 0 ? 'No Questions' : t('btn.start')}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelSetsPage;