import { AlertTriangle, Users, Calendar, Target } from "lucide-react";

const ProblemSlide169 = () => {
  const problems = [
    {
      icon: Target,
      title: "Fragmented Roadmaps",
      description: "Every team creates independent roadmaps and backlogs with no consolidated view"
    },
    {
      icon: Users,
      title: "Resource Blindness",
      description: "No visibility into resource allocation across teams and initiatives"
    },
    {
      icon: Calendar,
      title: "Capacity Confusion", 
      description: "Unable to identify over/under-allocated resources or capacity constraints"
    },
    {
      icon: AlertTriangle,
      title: "CTO Visibility Gap",
      description: "Leadership lacks comprehensive view of organizational scope and commitments"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header - 20% of height */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Current Challenge: Scattered Visibility
        </h1>
        <p className="text-xl text-muted-foreground">
          Technology organizations struggle with fragmented planning, leading to misaligned priorities and inefficient resource utilization
        </p>
      </div>

      {/* Main Content - 60% of height */}
      <div className="grid grid-cols-2 gap-8 flex-1">
        {problems.map((problem, index) => (
          <div key={index} className="bg-muted/30 p-6 rounded-xl border border-border/40">
            <div className="flex items-start gap-4">
              <div className="bg-destructive/10 p-4 rounded-xl shrink-0">
                <problem.icon className="w-8 h-8 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - 20% of height */}
      <div className="mt-8 p-6 bg-destructive/5 border border-destructive/20 rounded-xl">
        <p className="text-center text-destructive/80 font-semibold text-lg">
          Result: Inefficient delivery, missed commitments, and strategic misalignment
        </p>
      </div>
    </div>
  );
};

export default ProblemSlide169;