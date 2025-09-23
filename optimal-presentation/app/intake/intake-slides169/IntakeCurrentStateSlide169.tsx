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
    <div className="h-full flex flex-col max-h-full overflow-hidden">
      {/* Header - Reduced spacing */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          The Missing Foundation
        </h1>
        <p className="text-lg text-muted-foreground">
          We have capacity planning capabilities, but inconsistent demand capture limits their effectiveness
        </p>
      </div>

      {/* Main Content - Adjusted for better fit */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        {gaps.map((gap, index) => (
          <div key={index} className="bg-muted/30 p-4 rounded-xl border border-border/40 flex flex-col justify-center">
            <div className="text-center">
              <div className="bg-destructive/10 p-3 rounded-xl inline-block mb-2">
                <gap.icon className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">
                {gap.title}
              </h3>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {gap.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Reduced spacing */}
      <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
        <p className="text-center text-destructive/80 font-semibold text-base">
          Result: Can't optimize what you can't see systematically - capacity management needs demand foundation
        </p>
      </div>
    </div>
  );
};

export default IntakeCurrentStateSlide169;