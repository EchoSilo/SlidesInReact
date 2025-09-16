import { Target, Users, TrendingUp, Puzzle } from "lucide-react";

const IntakeImplementationSlide169 = () => {
  const implementation = [
    {
      icon: Target,
      title: "Thoughtful Implementation",
      description: "Build on current successful practices with gradual adoption based on demonstrated value"
    },
    {
      icon: Users,
      title: "Pilot Approach",
      description: "Start with willing team to refine approach and prove value before broader rollout"
    },
    {
      icon: TrendingUp,
      title: "Continuous Improvement",
      description: "Regular feedback collection and process optimization based on real usage patterns"
    }
  ];

  const integration = [
    {
      icon: Puzzle,
      title: "Complete Value Chain",
      description: "Intake → OVS → Capacity → Strategic Decisions (end-to-end flow)"
    },
    {
      icon: Target,
      title: "System Effectiveness",
      description: "Maximizes ROI on existing capacity management framework"
    },
    {
      icon: Users,
      title: "Executive Visibility",
      description: "Complete demand pipeline powers strategic 'choose what not to do' decisions"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-5xl font-bold text-foreground mb-3">
          Completing the System
        </h1>
        <p className="text-xl text-muted-foreground">
          How intake closes the loop on our capacity management framework investment
        </p>
      </div>

      {/* Implementation Strategy */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-foreground mb-3">Implementation Strategy</h3>
        <div className="grid grid-cols-3 gap-4">
          {implementation.map((item, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-xl border border-border/40">
              <div className="text-center mb-3">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="text-base font-semibold text-foreground">{item.title}</h4>
              </div>
              <p className="text-xs text-foreground/80 text-center leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Integration */}
      <div className="flex-1 mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-3">System Completion Benefits</h3>
        <div className="grid grid-cols-3 gap-4">
          {integration.map((item, index) => (
            <div key={index} className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="text-center mb-3">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="text-base font-semibold text-foreground">{item.title}</h4>
              </div>
              <p className="text-xs text-foreground/80 text-center leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Measures */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
          <h4 className="font-semibold text-foreground mb-2 text-sm">System Success Metrics</h4>
          <ul className="text-xs text-foreground/80 space-y-1">
            <li>• 2-3x improvement in OVS data quality</li>
            <li>• 30-50% reduction in planning overhead</li>
            <li>• Complete demand pipeline visibility</li>
          </ul>
        </div>
        <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <h4 className="font-semibold text-foreground mb-2 text-sm">Next Steps</h4>
          <ul className="text-xs text-foreground/80 space-y-1">
            <li>• Identify pilot team and success metrics</li>
            <li>• Design intake form and routing logic</li>
            <li>• Establish SLA monitoring and reporting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntakeImplementationSlide169;