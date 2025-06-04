import { useState } from 'react';
import {
	useForm,
	FormProvider,
	type FieldValues,
	type DefaultValues
} from 'react-hook-form';
import type { ReactNode } from 'react';
import FormContainer from './FormContainer';

type FormPageProps<T extends FieldValues> = {
	/** Page title above the form */
	title: string;
	/** initial values for RHF */
	defaultValues: DefaultValues<T>;
	/** what to do with the form data on submit */
	onSubmit: (data: T) => Promise<void>;
	onCancel?: () => void; // only necessary if I want to customize cancel
	/** the actual form fields (must live inside useFormContext) */
	children: ReactNode;
};

export default function FormPage<T extends FieldValues>({
	title,
	defaultValues: initialValues,
	onSubmit,
	children,
	onCancel
}: FormPageProps<T>) {
	const methods = useForm<T>({ defaultValues: initialValues });
	const { handleSubmit, reset } = methods;

	const [isSubmitting, setSubmitting] = useState(false);
	const [errorMessage, setError] = useState<string>('');

	const wrappedSubmit = async (data: T) => {
		setSubmitting(true);
		setError('');
		try {
			await onSubmit(data);
			reset();
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : 'Unknown error');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">{title}</h1>
			<FormProvider {...methods}>
				<FormContainer
					onSubmit={handleSubmit(wrappedSubmit)}
					isSubmitting={isSubmitting}
					errorMessage={errorMessage}
					onCancel={() => (onCancel ? onCancel() : reset())}
				>
					{children}
				</FormContainer>
			</FormProvider>
		</div>
	);
}
