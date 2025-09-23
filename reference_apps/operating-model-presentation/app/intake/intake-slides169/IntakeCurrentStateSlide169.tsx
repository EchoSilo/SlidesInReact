import { Database, BarChart, AlertTriangle, Target } from "lucide-react";

const IntakeCurrentStateSlide169 = () => {
  const gaps = [
    {
      icon: Database,
      title: "Incomplete Demand Picture",
      description: "Can't optimize capacity without systematic capture of all work requests and scope"
    },
    {
      icon: BarChart,
      title: "Inconsistent Value Signals",
      description: "Variable data quality undermines Objective Value Scoring (OVS) and strategic prioritization decisions"
    },
    {
      icon: AlertTriangle,
      title: "Resource Planning Blind Spots",
      description: "Fragmented intake prevents accurate capacity forecasting and allocation planning"
    },
    {
      icon: Target,
      title: "Strategic Visibility Gap",
      description: "Leadership lacks comprehensive view of demand pipeline to make informed decisions"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header - 20% of height */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          The Missing Foundation
        </h1>
        <p className="text-xl text-muted-foreground">
          We have capacity planning capabilities, but inconsistent demand capture limits their effectiveness
        </p>
      </div>

      {/* Main Content - 60% of height */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {gaps.map((gap, index) => (
          <div key={index} className="bg-muted/30 p-6 rounded-xl border border-border/40 flex flex-col justify-center">
            <div className="text-center mb-4">
              <div className="bg-destructive/10 p-4 rounded-xl inline-block mb-3">
                <gap.icon className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {gap.title}
              </h3>
              <p className="text-foreground/80 text-base leading-relaxed">
                {gap.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - 20% of height */}
      <div className="mt-6 p-5 bg-destructive/5 border border-destructive/20 rounded-xl">
        <p className="text-center text-destructive/80 font-semibold text-lg">
          Result: Can't optimize what you can't see systematically - capacity management needs demand foundation
        </p>
      </div>
    </div>
  );
};

export default IntakeCurrentStateSlide169;