import { TrendingUp, Zap, Users, BarChart } from "lucide-react";

const IntakeBusinessValueSlide169 = () => {
  const values = [
    {
      icon: TrendingUp,
      title: "Amplified OVS Effectiveness",
      description: "Higher quality intake data improves value scoring accuracy and strategic decisions",
      metric: "Better prioritization outcomes"
    },
    {
      icon: Zap,
      title: "Optimized Planning Cycles",
      description: "30-50% bypass full planning while important work gets proper capacity review",
      metric: "Reduced planning overhead"
    },
    {
      icon: BarChart,
      title: "Enhanced Capacity Forecasting",
      description: "Complete demand pipeline visibility enables proactive resource planning",
      metric: "Improved resource utilization"
    },
    {
      icon: Users,
      title: "Strategic Portfolio Management",
      description: "Systematic intake enables portfolio-level capacity optimization decisions",
      metric: "Better cross-team coordination"
    }
  ];

  const metrics = [
    {
      label: "Planning Efficiency",
      value: "30-50%",
      description: "reduction in planning overhead"
    },
    {
      label: "OVS Data Quality",
      value: "2-3x",
      description: "improvement in scoring accuracy"
    },
    {
      label: "Capacity Utilization",
      value: "15-25%",
      description: "better resource optimization"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-5xl font-bold text-foreground mb-3">
          Amplifying Capacity Management ROI
        </h1>
        <p className="text-xl text-muted-foreground">
          How systematic intake multiplies the value of our capacity planning investment
        </p>
      </div>

      {/* Value Propositions */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          {values.map((value, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-xl border border-border/40">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-xl shrink-0">
                  <value.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {value.title}
                  </h3>
                  <p className="text-xs text-foreground/80 mb-1">
                    {value.description}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {value.metric}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="flex-1 mb-4">
        <h3 className="text-xl font-semibold text-foreground text-center mb-4">
          Expected Impact Metrics
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
              <div className="text-sm font-medium text-foreground mb-1">{metric.label}</div>
              <p className="text-xs text-foreground/70">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Statement */}
      <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
        <p className="text-center text-green-700 font-semibold text-base">
          Investment: Systematic intake design • Return: 2-3x multiplier on capacity management framework effectiveness
        </p>
      </div>
    </div>
  );
};

export default IntakeBusinessValueSlide169;