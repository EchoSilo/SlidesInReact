import { Eye, TrendingUp, Shield, Zap, BarChart3, CheckCircle } from "lucide-react";

const BenefitsSlide = () => {
  const benefits = [
    {
      icon: Eye,
      title: "Complete Visibility",
      description: "CTO gains comprehensive view of all organizational scope and commitments",
      impact: "100% scope visibility"
    },
    {
      icon: BarChart3,
      title: "Capacity Optimization",
      description: "Identify over/under-allocated resources and optimize team utilization",
      impact: "20-30% efficiency gain"
    },
    {
      icon: TrendingUp,
      title: "Strategic Alignment", 
      description: "Align resource allocation with business priorities and strategic objectives",
      impact: "Enhanced ROI"
    },
    {
      icon: Shield,
      title: "Risk Mitigation",
      description: "Proactively identify resource conflicts and capacity constraints",
      impact: "Reduced delivery risk"
    },
    {
      icon: Zap,
      title: "Faster Decision Making",
      description: "Data-driven insights enable rapid resource reallocation decisions",
      impact: "50% faster planning"
    },
    {
      icon: CheckCircle,
      title: "Improved Delivery",
      description: "Better resource planning leads to more predictable project outcomes",
      impact: "Higher success rate"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Transformational Benefits
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Implementing consolidated capacity management delivers measurable improvements across the organization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-success/5 p-6 rounded-xl border border-success/20 hover:shadow-lg transition-all duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-success/10 p-4 rounded-xl">
                <benefit.icon className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {benefit.description}
                </p>
                <div className="bg-accent/10 px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-accent-foreground">
                    {benefit.impact}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-success/5 border border-primary/20 rounded-xl">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Bottom Line Impact
          </h3>
          <p className="text-muted-foreground">
            Transform from reactive firefighting to proactive, strategic technology delivery
          </p>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSlide;