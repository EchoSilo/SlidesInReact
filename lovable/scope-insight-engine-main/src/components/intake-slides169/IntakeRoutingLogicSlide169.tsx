import { CheckCircle, Clock, Building2 } from "lucide-react";

const IntakeRoutingLogicSlide169 = () => {
  const criteria = [
    {
      icon: CheckCircle,
      lane: "Express",
      color: "green",
      criteria: [
        "Defined scope ≤ 2 weeks",
        "Single team impact",
        "Low complexity & risk"
      ]
    },
    {
      icon: Clock,
      lane: "Standard",
      color: "blue",
      criteria: [
        "Regular planning cycle requirements",
        "Standard capacity allocation",
        "Normal coordination needs"
      ]
    },
    {
      icon: Building2,
      lane: "Strategic",
      color: "purple",
      criteria: [
        "Multi-team coordination required",
        "Significant scope (>6 weeks) OR",
        "High business risk/impact"
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Optimizing Planning Cycles
        </h1>
        <p className="text-xl text-muted-foreground">
          Smart routing reduces planning overhead while ensuring appropriate capacity coordination
        </p>
      </div>

      {/* Decision Framework */}
      <div className="flex-1">
        <div className="grid grid-cols-3 gap-8 h-full">
          {/* Express Lane */}
          <div className="flex flex-col">
            <div className="text-center p-4 bg-green-500/10 rounded-t-xl border border-green-500/30 border-b-0">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-foreground">
                Bypass Planning
              </h3>
            </div>
            <div className="flex-1 p-6 bg-green-500/5 rounded-b-xl border border-green-500/30 border-t-0">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                  <span className="text-foreground/80 leading-relaxed">
                    Scope ≤ 2 weeks, clear value
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                  <span className="text-foreground/80 leading-relaxed">
                    Skip full capacity planning cycle
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                  <span className="text-foreground/80 leading-relaxed">
                    Direct to team execution
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Standard Lane */}
          <div className="flex flex-col">
            <div className="text-center p-4 bg-blue-500/10 rounded-t-xl border border-blue-500/30 border-b-0">
              <Clock className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-foreground">
                Full OVS Process
              </h3>
            </div>
            <div className="flex-1 p-6 bg-blue-500/5 rounded-b-xl border border-blue-500/30 border-t-0">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <span className="text-foreground/80 leading-relaxed">
                    Complete value scoring & ranking
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <span className="text-foreground/80 leading-relaxed">
                    Normal capacity planning cycle
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <span className="text-foreground/80 leading-relaxed">
                    Team/resource allocation review
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Strategic Lane */}
          <div className="flex flex-col">
            <div className="text-center p-4 bg-purple-500/10 rounded-t-xl border border-purple-500/30 border-b-0">
              <Building2 className="w-10 h-10 text-purple-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-foreground">
                Portfolio Coordination
              </h3>
            </div>
            <div className="flex-1 p-6 bg-purple-500/5 rounded-b-xl border border-purple-500/30 border-t-0">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                  <span className="text-foreground/80 leading-relaxed">
                    Cross-team capacity impact
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                  <span className="text-foreground/80 leading-relaxed">
                    Strategic resource reallocation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                  <span className="text-foreground/80 leading-relaxed">
                    Portfolio-level prioritization
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Process */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
          <h4 className="font-semibold text-foreground mb-2">Simple Yes/No Questions</h4>
          <p className="text-sm text-muted-foreground">Clear, objective criteria eliminate subjective judgment calls</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
          <h4 className="font-semibold text-foreground mb-2">Consistent Application</h4>
          <p className="text-sm text-muted-foreground">Same routing logic applied fairly across all submissions</p>
        </div>
      </div>
    </div>
  );
};

export default IntakeRoutingLogicSlide169;