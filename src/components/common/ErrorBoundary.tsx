import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Strict TypeScript Error Boundary
 * Prevents application crashes and renders a calming, accessible recovery state.
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected application error occurred.',
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[AeroGuard ErrorBoundary caught]', error, errorInfo);
  }

  private handleReset = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
    this.setState({ hasError: false, errorMessage: '' });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          aria-live="assertive"
          className="min-h-[320px] flex items-center justify-center p-6 bg-slate-50"
        >
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
            <div className="mx-auto w-12 h-12 bg-red-50 text-red-700 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {this.props.fallbackTitle ?? 'Temporary Display Error'}
            </h2>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              AeroGuard AI encountered an unexpected interface issue. Your saved profile
              and local recommendations are safe.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm rounded-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Reset Application
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
