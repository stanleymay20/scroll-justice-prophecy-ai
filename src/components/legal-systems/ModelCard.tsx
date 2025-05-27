
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ModelTrainingStatus } from '@/types';
import { Brain, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface ModelCardProps {
  model: ModelTrainingStatus;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const getStatusIcon = () => {
    switch (model.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'training':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (model.status) {
      case 'completed': return 'bg-green-500';
      case 'training': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              {model.name || `Model ${model.id?.substring(0, 8) || model.model_version}`}
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge className={`${getStatusColor()} text-white text-xs`}>
              {model.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{model.progress}%</span>
          </div>
          <Progress value={model.progress} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Version:</span>
            <p className="font-medium">{model.model_version}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Accuracy:</span>
            <p className="font-medium">{model.accuracy}%</p>
          </div>
        </div>

        {model.started_at && (
          <div className="text-xs">
            <span className="text-muted-foreground">Started:</span>
            <p className="font-medium">
              {new Date(model.started_at).toLocaleDateString()}
            </p>
          </div>
        )}

        {model.cases_analyzed && (
          <div className="text-xs">
            <span className="text-muted-foreground">Cases Analyzed:</span>
            <p className="font-medium">{model.cases_analyzed.toLocaleString()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
