type ErrorBannerProps = { message: string };

export default function ErrorBanner({ message }: ErrorBannerProps) {
	return (
		<div className="p-4 mb-4 bg-red-100 text-red-800 rounded">
			<strong>Error:</strong> {message}
		</div>
	);
}
