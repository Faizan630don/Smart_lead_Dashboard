import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log exception for audit
    console.error('Error caught in Boundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="glass-panel max-w-md w-full rounded-2xl p-8 text-center flex flex-col items-center gap-4">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-full">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Something went wrong</h2>
            <p className="text-sm text-slate-400">
              An error occurred while loading this section of the dashboard. Please try reloading the page.
            </p>
            {this.state.error && (
              <pre className="w-full text-xs bg-slate-950 p-3 rounded-lg overflow-x-auto text-left text-slate-500 border border-slate-900 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <Button variant="outline" size="sm" onClick={this.handleReload}>
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
