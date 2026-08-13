import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    // Still log to the console for anyone with dev tools open, but the
    // whole point of this component is that you shouldn't *need* them.
    console.error('Uncaught render error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
          <p className="font-display text-xl text-text-primary">Something went wrong</p>
          <p className="max-w-md text-sm text-text-secondary">
            {this.state.error.message || 'An unexpected error occurred.'}
          </p>
          {this.state.error.stack && (
            <pre className="max-w-full overflow-auto rounded-lg bg-surface-elevated p-3 text-left text-xs text-text-muted">
              {this.state.error.stack}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
