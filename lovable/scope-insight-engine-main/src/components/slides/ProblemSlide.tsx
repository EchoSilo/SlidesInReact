import { AlertTriangle, Users, Calendar, Target } from "lucide-react";

const ProblemSlide = () => {
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Current Challenge: Scattered Visibility
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Technology organizations struggle with fragmented planning, leading to misaligned priorities and inefficient resource utilization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {problems.map((problem, index) => (
          <div key={index} className="bg-muted/50 p-6 rounded-xl border border-border/50">
            <div className="flex items-start gap-4">
              <div className="bg-destructive/10 p-3 rounded-lg">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
        <p className="text-center text-destructive/80 font-medium">
          Result: Inefficient delivery, missed commitments, and strategic misalignment
        </p>
      </div>
    </div>
  );
};

export default ProblemSlide;