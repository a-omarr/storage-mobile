import React, { Component, type ErrorInfo } from 'react';
import { Result, Button } from 'antd';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;  // optional custom fallback
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, info);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <Result
                    status="error"
                    title={
                        <span style={{ fontFamily: 'Cairo, sans-serif' }}>
                            حدث خطأ غير متوقع
                        </span>
                    }
                    subTitle={
                        <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: 13, color: '#6b7c93' }}>
                            {this.state.error?.message || 'يرجى المحاولة مرة أخرى أو إعادة تحميل الصفحة'}
                        </span>
                    }
                    extra={
                        <Button
                            type="primary"
                            onClick={this.handleRetry}
                            style={{ fontFamily: 'Cairo, sans-serif' }}
                        >
                            حاول مجدداً
                        </Button>
                    }
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
