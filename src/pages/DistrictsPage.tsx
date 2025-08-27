import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft, Play } from "lucide-react";

const DistrictsPage = () => {
  const { examType } = useParams();
  const navigate = useNavigate();

  const districts = [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur",
    "Sangli", "Jalgaon", "Akola", "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani",
    "Jalna", "Bhiwandi", "Nanded", "Ulhasnagar", "Malegaon", "Yavatmal", "Satara", "Gondia",
    "Barshi", "Achalpur", "Osmanabad", "Nandurbar", "Wardha", "Udgir", "Hinganghat"
  ];

  const handleDistrictClick = (district: string) => {
    navigate(`/quiz/${examType}/district/${district.toLowerCase()}`);
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
          <h1 className="text-2xl font-bold text-foreground">District-wise Questions</h1>
          <p className="text-muted-foreground">Choose a district to practice</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {districts.map((district) => (
            <Card 
              key={district} 
              className="card-floating cursor-pointer group" 
              onClick={() => handleDistrictClick(district)}
            >
              <CardContent className="p-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{district}</h3>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    2015-2024
                  </Badge>
                  <Button size="sm" className="flex items-center space-x-1">
                    <Play className="h-3 w-3" />
                    <span>View</span>
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

export default DistrictsPage;