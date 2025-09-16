import { Zap, Users, Building2, ArrowRight } from "lucide-react";

const IntakeThreeLaneSlide169 = () => {
  const lanes = [
    {
      icon: Zap,
      title: "Express Lane",
      description: "Smaller items → Direct team coordination",
      color: "green",
      details: "Fast-track for well-defined, low-complexity work"
    },
    {
      icon: Users,
      title: "Standard",
      description: "Regular capacity planning → Appropriate team/area",
      color: "blue",
      details: "Normal planning cycle for most work items"
    },
    {
      icon: Building2,
      title: "Strategic",
      description: "Cross-functional coordination → Portfolio alignment",
      color: "purple",
      details: "Multi-team coordination and strategic initiatives"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-5xl font-bold text-foreground mb-3">
          Three-Lane System
        </h1>
        <p className="text-xl text-muted-foreground">
          Enhanced routing with clear decision points and professional signage
        </p>
      </div>

      {/* Highway Visual */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Entry Point */}
        <div className="text-center mb-4">
          <div className="inline-block bg-muted/50 p-3 rounded-xl border border-border/30">
            <h3 className="text-base font-semibold text-foreground">Single Entry Point</h3>
            <p className="text-sm text-muted-foreground">All work enters through unified experience</p>
          </div>
        </div>

        {/* Arrow Down */}
        <div className="text-center mb-4">
          <ArrowRight className="w-5 h-5 text-muted-foreground mx-auto rotate-90" />
        </div>

        {/* Three Lanes */}
        <div className="grid grid-cols-3 gap-6">
          {/* Express Lane */}
          <div className="text-center">
            <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/30 h-full">
              <Zap className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Express Lane
              </h3>
              <p className="text-sm text-foreground/80 mb-2 font-medium">
                Smaller items → Direct team coordination
              </p>
              <p className="text-xs text-foreground/70">
                Fast-track for well-defined, low-complexity work
              </p>
            </div>
          </div>

          {/* Standard Lane */}
          <div className="text-center">
            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30 h-full">
              <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Standard
              </h3>
              <p className="text-sm text-foreground/80 mb-2 font-medium">
                Regular capacity planning → Appropriate team/area
              </p>
              <p className="text-xs text-foreground/70">
                Normal planning cycle for most work items
              </p>
            </div>
          </div>

          {/* Strategic Lane */}
          <div className="text-center">
            <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/30 h-full">
              <Building2 className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Strategic
              </h3>
              <p className="text-sm text-foreground/80 mb-2 font-medium">
                Cross-functional coordination → Portfolio alignment
              </p>
              <p className="text-xs text-foreground/70">
                Multi-team coordination and strategic initiatives
              </p>
            </div>
          </div>
        </div>

        {/* Flow Indicators */}
        <div className="mt-4 grid grid-cols-3 gap-6 text-center">
          <div className="text-xs text-green-600 font-medium">Immediate Action</div>
          <div className="text-xs text-blue-600 font-medium">Planning Cycle</div>
          <div className="text-xs text-purple-600 font-medium">Strategic Coordination</div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 p-4 bg-muted/50 rounded-xl border border-border/30">
        <p className="text-center text-foreground font-semibold text-base">
          Clear routing signs ensure work flows to appropriate capacity and coordination level
        </p>
      </div>
    </div>
  );
};

export default IntakeThreeLaneSlide169;