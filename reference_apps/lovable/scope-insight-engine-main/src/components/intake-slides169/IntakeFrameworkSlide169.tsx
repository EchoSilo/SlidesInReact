import { ArrowRight, Database, Target, TrendingUp } from "lucide-react";

const IntakeFrameworkSlide169 = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-5xl font-bold text-foreground mb-3">
          Intake: The "Front Door" to Capacity Management
        </h1>
        <p className="text-xl text-muted-foreground">
          The data collection mechanism that powers systematic prioritization and strategic resource allocation
        </p>
      </div>

      {/* Key Principle */}
      <div className="mb-5 p-3 bg-muted/30 rounded-xl border border-border/40 text-center">
        <p className="text-base text-foreground font-medium">
          <strong>Core Principle:</strong> Without systematic intake, you can't have systematic prioritization
        </p>
      </div>

      {/* Main Flow - Single Row Layout */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            {/* Step 1: Intake */}
            <div className="flex-1 text-center">
              <div className="bg-primary/10 p-6 rounded-xl border-2 border-primary/30">
                <Database className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Systematic Intake</h3>
                <p className="text-sm text-foreground/80">Creates work inventory that powers prioritization</p>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="flex flex-col items-center px-3">
              <ArrowRight className="w-6 h-6 text-muted-foreground mb-1" />
              <p className="text-sm text-foreground/70 font-medium">powers</p>
            </div>

            {/* Step 2: OVS Scoring */}
            <div className="flex-1 text-center">
              <div className="bg-blue-500/10 p-6 rounded-xl border border-blue-500/30">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">OVS System</h3>
                <p className="text-sm text-foreground/80">Objective Value Scoring for strategic ranking</p>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="flex flex-col items-center px-3">
              <ArrowRight className="w-6 h-6 text-muted-foreground mb-1" />
              <p className="text-sm text-foreground/70 font-medium">enables</p>
            </div>

            {/* Step 3: Capacity Allocation */}
            <div className="flex-1 text-center">
              <div className="bg-green-500/10 p-6 rounded-xl border border-green-500/30">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Strategic Capacity</h3>
                <p className="text-sm text-foreground/80">Data-driven resource allocation decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 p-4 bg-primary/5 rounded-xl border border-primary/20">
        <p className="text-center text-primary/80 font-semibold text-base">
          Result: Complete demand visibility enables our "choose what not to do" capacity management philosophy
        </p>
      </div>
    </div>
  );
};

export default IntakeFrameworkSlide169;