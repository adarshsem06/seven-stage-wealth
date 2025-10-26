import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Wallet, 
  Shield, 
  TrendingUp, 
  Briefcase, 
  Home, 
  PiggyBank, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const stages = [
  {
    id: 1,
    title: "Money Management",
    description: "Master the 50/30/20 rule and track every expense with precision",
    icon: Wallet,
    color: "from-primary to-primary/70",
    path: "/stage-1"
  },
  {
    id: 2,
    title: "Debt Elimination",
    description: "Eliminate bad debt and build your safety net",
    icon: Shield,
    color: "from-accent to-accent/70",
    path: "/stage-2"
  },
  {
    id: 3,
    title: "Asset Building",
    description: "Start building wealth through disciplined investing",
    icon: TrendingUp,
    color: "from-success to-success/70",
    path: "/stage-3"
  },
  {
    id: 4,
    title: "Multiple Income Streams",
    description: "Create additional sources of income",
    icon: Briefcase,
    color: "from-primary to-accent",
    path: "/stage-4"
  },
  {
    id: 5,
    title: "Home Purchase",
    description: "Plan your home purchase at the right time",
    icon: Home,
    color: "from-accent to-success",
    path: "/stage-5"
  },
  {
    id: 6,
    title: "Retirement Planning",
    description: "Build a comprehensive retirement strategy",
    icon: PiggyBank,
    color: "from-success to-primary",
    path: "/stage-6"
  },
  {
    id: 7,
    title: "Financial Freedom",
    description: "Enjoy the fruits of your disciplined journey",
    icon: Sparkles,
    color: "from-accent to-accent",
    path: "/stage-7"
  },
];

const features = [
  "Disciplined expense tracking with zero estimation",
  "Automated 50/30/20 budget enforcement",
  "Debt prioritization and elimination planning",
  "Compound growth visualization with Rule of 72",
  "Comprehensive retirement planning calculator",
  "Multiple income stream resources"
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 gradient-primary opacity-50" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient">The 7-Stage</span>
            <br />
            Financial Success Navigator
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Your disciplined path from budgeting to financial freedom
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/stage-1">
              <Button size="lg" className="gap-2 shadow-glow hover:shadow-glow transition-smooth">
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-4 gradient-card border-border hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{feature}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Stages */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Your 7-Stage Journey
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <Link 
                    key={stage.id} 
                    to={stage.path}
                    className="group"
                  >
                    <Card 
                      className="p-6 gradient-card border-border hover-lift h-full animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stage.color} mb-4`}>
                        <Icon className="h-6 w-6 text-background" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-smooth">
                        Stage {stage.id}: {stage.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {stage.description}
                      </p>
                      <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-smooth">
                        Explore Stage
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-12 gradient-card border-primary/20 shadow-glow">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Start with Stage 1 and build the discipline that leads to lasting wealth
            </p>
            <Link to="/stage-1">
              <Button size="lg" className="gap-2">
                Begin Stage 1: Money Management
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
