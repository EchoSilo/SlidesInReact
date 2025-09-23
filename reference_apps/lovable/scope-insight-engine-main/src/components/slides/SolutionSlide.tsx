import { Database, Users2, Calendar, Network } from "lucide-react";

const SolutionSlide = () => {
  const steps = [
    {
      number: "01",
      icon: Database,
      title: "Consolidated Scope Registry",
      description: "Create a single spreadsheet capturing every initiative across all teams",
      details: ["All current work", "Planned initiatives", "Future roadmap items"]
    },
    {
      number: "02", 
      icon: Users2,
      title: "Resource Mapping",
      description: "Assign people and skills to each scope item with clear ownership",
      details: ["Team assignments", "Individual allocations", "Skill requirements"]
    },
    {
      number: "03",
      icon: Calendar,
      title: "Capacity Planning", 
      description: "Define monthly percentage allocations for each resource across initiatives",
      details: ["Time allocation %", "Capacity constraints", "Over/under allocation visibility"]
    },
    {
      number: "04",
      icon: Network,
      title: "Cross-Team Dependencies",
      description: "Track demand for matrix resources and external team dependencies",
      details: ["Matrix team needs", "Skill dependencies", "Resource sharing"]
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Unified Capacity Management Solution
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive framework to consolidate scope, resources, and capacity planning into a single strategic view
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {steps.map((step, index) => (
          <div key={index} className="bg-primary/5 p-6 rounded-xl border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {step.description}
                </p>
                <ul className="space-y-1">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolutionSlide;