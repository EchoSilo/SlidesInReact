import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Presentation from "@/components/Presentation";
import Presentation169 from "@/components/Presentation169";

const Index = () => {
  return (
    <div className="space-y-8">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Capacity Management Presentation Formats
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Compare different aspect ratios for your PowerPoint presentation
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/intake">
              <Button variant="outline" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View Intake Framework Presentation
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Original Format</h2>
            <p className="text-muted-foreground mb-4">Flexible responsive design</p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">16:9 Format</h2>
            <p className="text-muted-foreground mb-4">PowerPoint standard aspect ratio</p>
          </div>
        </div>
      </div>
      
      {/* Original Presentation */}
      <div>
        <Presentation />
      </div>
      
      {/* Divider */}
      <div className="border-t border-border my-16"></div>
      
      {/* 16:9 Presentation */}
      <div>
        <Presentation169 />
      </div>
    </div>
  );
};

export default Index;
