import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Users, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="bg-gradient-primary rounded-full p-4 shadow-glow">
          <Trophy className="h-8 w-8 text-primary-foreground" />
        </div>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="bg-gradient-secondary rounded-full p-4 shadow-glow">
          <Target className="h-8 w-8 text-secondary-foreground" />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="bg-gradient-accent rounded-full p-4 shadow-glow">
          <BookOpen className="h-8 w-8 text-accent-foreground" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Join 50,000+ Students</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient-hero">Master Your</span>
            <br />
            <span className="text-foreground">Competitive Exams</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Prepare for <span className="text-primary font-semibold">Police Bharti</span> and{" "}
            <span className="text-secondary font-semibold">Talathi Bharti</span> with our 
            comprehensive question banks, mock tests, and expert guidance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/student/signup">
              <Button className="btn-hero flex items-center space-x-2 text-lg px-8 py-4">
                <span>Start Free Practice</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/student/login">
              <Button className="btn-outline-hero flex items-center space-x-2 text-lg px-8 py-4">
                <span>Student Login</span>
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-success/10 text-success px-4 py-2 rounded-full font-medium">
              ✓ 10,000+ Questions
            </div>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
              ✓ Bilingual Support
            </div>
            <div className="bg-accent/10 text-accent px-4 py-2 rounded-full font-medium">
              ✓ Detailed Analytics
            </div>
            <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-full font-medium">
              ✓ Expert Solutions
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;