const TitleSlide = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Technology Capacity Management
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
        <h2 className="text-2xl text-foreground/80 font-light">
          Consolidated Scope & Resource Planning Framework
        </h2>
      </div>
      
      <div className="space-y-2 text-muted-foreground">
        <p className="text-lg">Transforming Technology Delivery Through</p>
        <p className="text-lg font-semibold">Unified Visibility & Strategic Resource Allocation</p>
      </div>

      <div className="mt-12 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Strategic Framework for CTOs and Technology Leadership
        </p>
      </div>
    </div>
  );
};

export default TitleSlide;