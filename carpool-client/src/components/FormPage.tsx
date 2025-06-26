import type {
	FieldValues,
	DefaultValues,
	SubmitHandler
} from 'react-hook-form';
import type { ReactNode } from 'react';
import FormContainer from './FormContainer';

type FormPageProps<T extends FieldValues> = {
	/** Page title above the form */
	title: string;
	/** initial values for RHF */
	defaultValues: DefaultValues<T>;
	/** what to do with the form data on submit */
	onSubmit: SubmitHandler<T>;
	onCancel?: () => void; // only necessary if I want to customize cancel
	/** the actual form fields (must live inside useFormContext) */
	children: ReactNode;
	isSubmitting: boolean; // this is handled by FormContainer
	errorMessage?: string; // this is handled by FormContainer
};

export default function FormPage<T extends FieldValues>({
	title,
	defaultValues,
	onSubmit,
	onCancel,
	children,
	isSubmitting = false,
	errorMessage
}: FormPageProps<T>) {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">{title}</h1>
			<FormContainer<T>
				defaultValues={defaultValues}
				onSubmit={onSubmit}
				onCancel={onCancel}
				isSubmitting={isSubmitting}
				errorMessage={errorMessage}
			>
				{children}
			</FormContainer>
		</div>
	);
}
