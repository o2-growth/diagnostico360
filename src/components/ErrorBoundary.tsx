import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dashboard-dark">
          <div className="dashboard-card max-w-md text-center">
            <h2 className="text-xl font-semibold mb-2">Algo deu errado</h2>
            <p className="text-dashboard-muted mb-4">Ocorreu um erro inesperado. Tente recarregar a página.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-dashboard-accent3 text-white hover:opacity-90">
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
