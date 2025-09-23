import React from "react";
import { ArrowRight, MessageSquare, Clock, CheckCircle } from "lucide-react";

const IntakeExperienceSlide169 = () => {
  const beforeAfter = [
    {
      title: "Currently",
      icon: MessageSquare,
      color: "orange",
      items: [
        "Stakeholders navigate different approaches",
        "Variable communication patterns",
        "Unclear timing expectations"
      ]
    },
    {
      title: "Enhanced",
      icon: CheckCircle,
      color: "green",
      items: [
        "Single entry point with clear next steps",
        "Predictable communication and status updates",
        "Professional service levels across all work types"
      ]
    }
  ];

  const slas = [
    {
      icon: Clock,
      metric: "24 Hours",
      description: "Initial routing decision and acknowledgment"
    },
    {
      icon: MessageSquare,
      metric: "72 Hours",
      description: "Preliminary sizing and next steps communication"
    },
    {
      icon: CheckCircle,
      metric: "7-10 Days",
      description: "Scheduling decision or clear parking rationale"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Enhanced Stakeholder Experience
        </h1>
        <p className="text-xl text-muted-foreground">
          Professional service levels with predictable communication
        </p>
      </div>

      {/* Before/After Comparison */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-6 items-center">
          {/* Before */}
          <div className="p-6 bg-orange-500/10 rounded-xl border border-orange-500/30">
            <div className="text-center mb-4">
              <MessageSquare className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-foreground">Currently</h3>
            </div>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">• Stakeholders navigate different approaches</li>
              <li className="text-sm text-muted-foreground">• Variable communication patterns</li>
              <li className="text-sm text-muted-foreground">• Unclear timing expectations</li>
            </ul>
          </div>

          {/* Arrow */}
          <div className="text-center">
            <ArrowRight className="w-8 h-8 text-muted-foreground mx-auto" />
          </div>

          {/* After */}
          <div className="p-6 bg-green-500/10 rounded-xl border border-green-500/30">
            <div className="text-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-foreground">Enhanced</h3>
            </div>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">• Single entry point with clear next steps</li>
              <li className="text-sm text-muted-foreground">• Predictable communication and status updates</li>
              <li className="text-sm text-muted-foreground">• Professional service levels across all work types</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Service Level Commitments */}
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-foreground text-center mb-6">
          Service Level Commitments
        </h3>
        <div className="grid grid-cols-3 gap-6">
          {slas.map((sla, index) => (
            <div key={index} className="text-center p-6 bg-muted/30 rounded-xl border border-border/40">
              <sla.icon className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-2">{sla.metric}</div>
              <p className="text-sm text-muted-foreground">{sla.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <p className="text-center text-primary/80 font-semibold">
          Consistent, professional experience builds trust and reduces stakeholder friction
        </p>
      </div>
    </div>
  );
};

export default IntakeExperienceSlide169;