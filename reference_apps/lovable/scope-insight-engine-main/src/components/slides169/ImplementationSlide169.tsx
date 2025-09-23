import { Calendar, Users, Database, Target, ArrowRight } from "lucide-react";

const ImplementationSlide169 = () => {
  const phases = [
    {
      phase: "Phase 1",
      duration: "2-3 weeks", 
      title: "Scope Discovery & Consolidation",
      icon: Database,
      activities: [
        "Inventory all team roadmaps and backlogs",
        "Create consolidated scope spreadsheet",
        "Categorize by product area and priority"
      ]
    },
    {
      phase: "Phase 2",
      duration: "1-2 weeks",
      title: "Resource Mapping & Skills Assessment", 
      icon: Users,
      activities: [
        "Map people to scope items",
        "Document skills and capabilities",
        "Identify skill gaps and dependencies"
      ]
    },
    {
      phase: "Phase 3", 
      duration: "2-3 weeks",
      title: "Capacity Planning & Allocation",
      icon: Calendar,
      activities: [
        "Define monthly allocation percentages", 
        "Identify capacity constraints",
        "Plan matrix resource requirements"
      ]
    },
    {
      phase: "Phase 4",
      duration: "Ongoing",
      title: "Monitoring & Optimization",
      icon: Target,
      activities: [
        "Monthly capacity reviews",
        "Quarterly scope reassessment", 
        "Continuous process refinement"
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Implementation Roadmap
        </h1>
        <p className="text-xl text-muted-foreground">
          A phased approach to implementing consolidated capacity management across your technology organization
        </p>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-2 gap-8 flex-1">
        {phases.map((phase, index) => (
          <div key={index} className="bg-card border border-border/50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-xl shrink-0">
                <phase.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                    {phase.phase}
                  </span>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {phase.duration}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {phase.title}
                </h3>
              </div>
            </div>
            
            <div className="space-y-2">
              {phase.activities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Timeline Summary */}
      <div className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-1">
              Timeline: 6-8 weeks to full implementation
            </h3>
            <p className="text-muted-foreground">
              With ongoing optimization and refinement based on organizational learnings
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">6-8</div>
            <div className="text-sm text-muted-foreground">weeks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationSlide169;