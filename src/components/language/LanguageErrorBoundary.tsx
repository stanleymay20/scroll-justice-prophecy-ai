
import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class LanguageErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console
    console.error("Language component failed to render:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI if provided, or default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="p-4 border border-yellow-500 bg-yellow-50 text-yellow-700 rounded">
          <h3 className="font-bold mb-2">Translation Error</h3>
          <p className="text-sm">
            There was a problem loading translations. The system will continue with English fallbacks.
          </p>
          {this.state.error && (
            <pre className="mt-2 text-xs p-2 bg-yellow-100 overflow-auto max-h-20">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default LanguageErrorBoundary;
