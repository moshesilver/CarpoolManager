import type { FormEvent, ReactNode } from 'react';

type FormContainerProps = {
	onSubmit: (e: FormEvent) => void;
	children: ReactNode;
	isSubmitting: boolean;
	errorMessage?: string;
};

export default function FormContainer({
	onSubmit,
	children,
	isSubmitting,
	errorMessage
}: FormContainerProps) {
	return (
		<form onSubmit={onSubmit} className="max-w-md mx-auto space-y-4">
			{errorMessage && <div className="text-red-600">{errorMessage}</div>}
			<div className="space-y-2">{children}</div>
			<button
				type="submit"
				disabled={isSubmitting}
				className="px-4 py-2 rounded shadow"
			>
				{isSubmitting ? 'Submitting...' : 'Submit'}
			</button>
		</form>
	);
}
