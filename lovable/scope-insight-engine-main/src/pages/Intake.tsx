import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import IntakePresentation169 from "@/components/IntakePresentation169";

const Intake = () => {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Main Presentations
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Intake Framework Presentation
          </h1>
          <p className="text-xl text-muted-foreground">
            Strategic framework for unified work entry and intelligent routing
          </p>
        </div>
      </div>

      <IntakePresentation169 />
    </div>
  );
};

export default Intake;