import type { FormEvent, ReactNode } from 'react';

type FormContainerProps = {
	onSubmit: (e: FormEvent) => void;
	isSubmitting: boolean;
	errorMessage?: string;
	onCancel: () => void;
	children: ReactNode;
};

export default function FormContainer({
	onSubmit,
	isSubmitting,
	errorMessage,
	onCancel,
	children
}: FormContainerProps) {
	return (
		<form onSubmit={onSubmit} className="space-y-6" noValidate>
			{errorMessage && (
				<div className="text-red-600 font-medium">{errorMessage}</div>
			)}

			{children}

			<div className="flex space-x-4">
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 bg-blue-600 text-white rounded"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					className="px-4 py-2 bg-blue-600 text-white rounded"
				>
					{isSubmitting ? 'Submitting...' : 'Submit'}
				</button>
			</div>
		</form>
	);
}
