import { Database, Users2, Calendar, Network } from "lucide-react";

const SolutionSlide169 = () => {
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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Unified Capacity Management Solution
        </h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive framework to consolidate scope, resources, and capacity planning into a single strategic view
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {steps.map((step, index) => (
          <div key={index} className="bg-primary/5 p-6 rounded-xl border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-4 rounded-xl shrink-0">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-mono text-primary bg-primary/10 px-3 py-1.5 rounded">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                  {step.description}
                </p>
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full shrink-0"></div>
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

export default SolutionSlide169;