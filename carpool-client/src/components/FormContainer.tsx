import type { PropsWithChildren } from 'react';
import {
	useForm,
	FormProvider,
	type SubmitHandler,
	type DefaultValues,
	type FieldValues
} from 'react-hook-form';

export interface FormContainerProps<T extends FieldValues> {
	defaultValues: DefaultValues<T>;
	onSubmit: SubmitHandler<T>;
	onCancel?: () => void;
	isSubmitting: boolean;
	errorMessage?: string;
}

export default function FormContainer<T extends FieldValues>({
	defaultValues,
	onSubmit,
	onCancel,
	isSubmitting = false,
	errorMessage,
	children
}: PropsWithChildren<FormContainerProps<T>>) {
	// initialize RHF with DefaultValues<T>
	const methods = useForm<T>({ defaultValues });

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit)}
				className="space-y-6"
				noValidate
			>
				{errorMessage && (
					<div className="text-red-600 font-medium">{errorMessage}</div>
				)}

				{children}

				<div className="flex space-x-4">
					<button
						type="button"
						onClick={onCancel} // might need to add defalut function to use instead??
						className="px-4 py-2 bg-blue-600 text-white rounded"
					>
						Cancel
					</button>

					<button
						type="submit"
						disabled={isSubmitting || methods.formState.isSubmitting}
						className="px-4 py-2 bg-blue-600 text-white rounded"
					>
						{isSubmitting || methods.formState.isSubmitting
							? 'Submitting...'
							: 'Submit'}
					</button>
				</div>
			</form>
		</FormProvider>
	);
}
