import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#fef2f2',
                    color: '#991b1b',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <AlertTriangle size={64} style={{ marginBottom: '1rem' }} />
                    <h1>Something went wrong.</h1>
                    <p>The Admin Dashboard crashed.</p>
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        maxWidth: '80%',
                        overflow: 'auto',
                        textAlign: 'left'
                    }}>
                        <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
                        <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '2rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
