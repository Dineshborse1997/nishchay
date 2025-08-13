import { Button } from "@/components/ui/button";
import { Shield, Building, CheckCircle, Clock, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const examTypes = [
  {
    id: "police",
    title: "Police Bharti",
    description: "Complete preparation for Maharashtra Police Constable, ASI, and other police recruitment exams",
    icon: Shield,
    features: [
      "Previous Year Papers (2015-2024)",
      "Subject-wise Mock Tests",
      "Marathi & English Questions",
      "Negative Marking Practice",
      "District-wise Question Banks"
    ],
    stats: {
      questions: "5,000+",
      students: "25,000+",
      success: "92%"
    },
    gradient: "from-blue-600 to-blue-700",
    bgPattern: "bg-blue-50"
  },
  {
    id: "talathi",
    title: "Talathi Bharti",
    description: "Comprehensive preparation for Talathi, Gramsevak, and village-level officer positions",
    icon: Building,
    features: [
      "Latest Syllabus Coverage",
      "Rural Development Focus",
      "Maharashtra History & Geography",
      "Administrative Knowledge",
      "Current Affairs Updates"
    ],
    stats: {
      questions: "5,000+",
      students: "25,000+",
      success: "89%"
    },
    gradient: "from-green-600 to-green-700",
    bgPattern: "bg-green-50"
  }
];

const ExamTypes = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
            Choose Your Exam Path
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Specialized preparation tracks designed for specific Maharashtra government exams
          </p>
        </div>

        {/* Exam Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {examTypes.map((exam, index) => {
            const Icon = exam.icon;
            return (
              <div
                key={exam.id}
                className="relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-hover transition-all duration-500 group animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Header */}
                <div className={`relative bg-gradient-to-br ${exam.gradient} p-8 text-white`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{exam.title}</h3>
                      <p className="text-white/80">{exam.description}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{exam.stats.questions}</div>
                      <div className="text-white/80 text-sm">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{exam.stats.students}</div>
                      <div className="text-white/80 text-sm">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{exam.stats.success}</div>
                      <div className="text-white/80 text-sm">Success Rate</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {exam.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to={`/student/signup?exam=${exam.id}`} className="flex-1">
                      <Button className="w-full btn-hero">
                        Start Preparation
                      </Button>
                    </Link>
                    <Link to={`/exams/${exam.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExamTypes;