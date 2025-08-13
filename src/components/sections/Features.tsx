import { 
  Brain, 
  Clock, 
  BarChart3, 
  Languages, 
  Shield, 
  Smartphone,
  FileText,
  Trophy,
  Target
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart Learning",
    description: "AI-powered personalized study plans based on your performance and weak areas",
    gradient: "from-primary to-primary-glow"
  },
  {
    icon: Clock,
    title: "Timed Practice",
    description: "Real exam conditions with precise timing and automatic submission",
    gradient: "from-secondary to-green-500"
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Comprehensive performance reports with subject-wise breakdowns and progress tracking",
    gradient: "from-accent to-orange-500"
  },
  {
    icon: Languages,
    title: "Bilingual Support",
    description: "Complete interface and questions available in both Marathi and English",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: FileText,
    title: "Previous Year Papers",
    description: "Extensive collection of previous year questions organized by year and topic",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: Target,
    title: "Negative Marking",
    description: "Practice with real negative marking patterns to build exam strategy",
    gradient: "from-red-500 to-red-600"
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Compare your performance with other students and track your rank",
    gradient: "from-yellow-500 to-yellow-600"
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Your data and progress are protected with enterprise-grade security",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Practice anywhere, anytime with our fully responsive mobile interface",
    gradient: "from-indigo-500 to-indigo-600"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
            Why Choose PrepWise?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform is designed specifically for Maharashtra government 
            exam aspirants with cutting-edge features.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card-floating group hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:shadow-glow transition-all duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;