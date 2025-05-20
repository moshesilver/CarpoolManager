import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error };

export default class AppErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error('Uncaught error:', error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="p-6 bg-red-200 text-red-900">
					<h1>Something went wrong.</h1>
					<p>{this.state.error?.message || 'Unexpected error.'}</p>
				</div>
			);
		}
		return this.props.children;
	}
}
