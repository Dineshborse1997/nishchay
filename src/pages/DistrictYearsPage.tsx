import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Play } from "lucide-react";

const DistrictYearsPage = () => {
  const { examType, district } = useParams();
  const navigate = useNavigate();

  const years = Array.from({ length: 10 }, (_, i) => 2024 - i);

  const handleYearClick = (year: number) => {
    navigate(`/quiz/${examType}/district/${district}/${year}`);
  };

  const getQuestionCount = (year: number) => {
    // Simulate different question counts for different years
    return Math.floor(Math.random() * 50) + 50; // 50-100 questions
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/quiz/${examType}/district`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Districts
          </Button>
          <h1 className="text-2xl font-bold text-foreground capitalize">
            {district} District Questions
          </h1>
          <p className="text-muted-foreground">Choose a year to practice</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {years.map((year) => (
            <Card 
              key={year} 
              className="card-floating cursor-pointer group" 
              onClick={() => handleYearClick(year)}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-xl">{year}</h3>
                <div className="flex flex-col items-center space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {getQuestionCount(year)} Questions
                  </Badge>
                  <Button size="sm" className="flex items-center space-x-1">
                    <Play className="h-3 w-3" />
                    <span>Start</span>
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

export default DistrictYearsPage;