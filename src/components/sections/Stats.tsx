import { TrendingUp, Users, BookOpen, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Students",
    color: "text-primary"
  },
  {
    icon: BookOpen,
    value: "10,000+",
    label: "Practice Questions",
    color: "text-secondary"
  },
  {
    icon: Award,
    value: "5,000+",
    label: "Successful Candidates",
    color: "text-accent"
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate",
    color: "text-success"
  }
];

const Stats = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center animate-slide-up card-floating"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-${stat.color.split('-')[1]}/20 to-${stat.color.split('-')[1]}/10 mb-4`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;