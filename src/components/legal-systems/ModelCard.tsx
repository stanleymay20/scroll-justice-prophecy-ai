
import { ModelTrainingStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, AlertTriangle, Clock, Globe, Scale, BookOpen } from "lucide-react";

interface ModelCardProps {
  model: ModelTrainingStatus;
}

export function ModelCard({ model }: ModelCardProps) {
  const getStatusIcon = () => {
    switch (model.status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "training":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (model.status) {
      case "completed":
        return "bg-green-500/20 text-green-500";
      case "training":
        return "bg-blue-500/20 text-blue-500";
      case "failed":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="border-justice-tertiary bg-transparent hover:bg-justice-dark/10 transition-colors">
      <CardHeader className="border-b border-justice-dark">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{model.name}</CardTitle>
          <Badge className={getStatusColor()}>
            <span className="flex items-center gap-1">
              {getStatusIcon()}
              {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {model.status === "training" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Training Progress</span>
              <span>{model.progress}%</span>
            </div>
            <Progress value={model.progress} className="h-2" />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <div className="text-muted-foreground">Model ID</div>
            <div>{model.model_id}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Accuracy</div>
            <div>{model.status === "idle" ? "N/A" : `${(model.accuracy * 100).toFixed(1)}%`}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Cases Analyzed</div>
            <div>{model.cases_analyzed.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Started</div>
            <div>{formatDate(model.training_started)}</div>
          </div>
        </div>
        
        {model.international_compliance && model.status !== "idle" && (
          <div className="mt-4 space-y-2">
            <div className="text-muted-foreground mb-1">International Compliance</div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                <span>International</span>
              </div>
              <div className="flex items-center gap-1">
                <Progress value={model.international_compliance * 100} className="h-1.5 w-16" />
                <span>{(model.international_compliance * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Scale className="h-3 w-3 mr-1" />
                <span>UN Charter</span>
              </div>
              <div className="flex items-center gap-1">
                <Progress value={model.un_compliance ? model.un_compliance * 100 : 0} className="h-1.5 w-16" />
                <span>{model.un_compliance ? (model.un_compliance * 100).toFixed(0) : 0}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                <span>ICC Rome Statute</span>
              </div>
              <div className="flex items-center gap-1">
                <Progress value={model.icc_compliance ? model.icc_compliance * 100 : 0} className="h-1.5 w-16" />
                <span>{model.icc_compliance ? (model.icc_compliance * 100).toFixed(0) : 0}%</span>
              </div>
            </div>
          </div>
        )}
        
        {model.jurisdiction_coverage.length > 0 && (
          <div className="mt-4">
            <div className="text-muted-foreground mb-2">Jurisdiction Coverage</div>
            <div className="flex flex-wrap gap-1">
              {model.jurisdiction_coverage.map((jur, index) => (
                <Badge key={index} variant="outline" className="bg-justice-secondary/10">
                  {jur}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {model.languages_supported && model.languages_supported.length > 0 && (
          <div className="mt-4">
            <div className="text-muted-foreground mb-2">Languages</div>
            <div className="flex flex-wrap gap-1">
              {model.languages_supported.map((lang, index) => (
                <Badge key={index} variant="outline" className="bg-justice-primary/10">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-justice-secondary/20 pt-4">
        <div className="flex w-full gap-2">
          {model.status === "training" ? (
            <Button variant="destructive" className="flex-1">Stop Training</Button>
          ) : model.status === "completed" ? (
            <>
              <Button variant="outline" className="border-justice-tertiary flex-1">View Report</Button>
              <Button className="bg-justice-primary flex-1">Deploy Model</Button>
            </>
          ) : model.status === "idle" ? (
            <Button className="bg-justice-primary flex-1">Start Training</Button>
          ) : (
            <Button variant="outline" className="border-justice-tertiary flex-1">View Errors</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
