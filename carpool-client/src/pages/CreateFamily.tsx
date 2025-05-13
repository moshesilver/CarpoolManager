import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import type { FamilyInput } from '../types';
import FormContainer from '../components/FormContainer';
import CreateFamilyForm from '../components/forms/CreateFamilyForm';

export default function CreateFamily() {
	const { getToken } = useAuth();
	const navigate = useNavigate();

	const [isSubmitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	// --- RHF setup ---
	const methods = useForm<FamilyInput>({
		defaultValues: { parents: [], children: [] }
	});
	const { handleSubmit, reset } = methods;

	const onSubmit = async (data: FamilyInput) => {
		if (data.parents.length === 0) {
			setErrorMessage('At least one parent is required');
			return;
		}
		setSubmitting(true);
		setErrorMessage('');
		try {
			const token = await getToken();
			const res = await fetch(`${import.meta.env.VITE_API_URL}/family`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || 'Unknown error');
			}
			reset();
			navigate('/dashboard');
		} catch (err: unknown) {
			if (err instanceof Error) {
				setErrorMessage(err.message);
			} else {
				setErrorMessage('Unknown error');
			}
		} finally {
			setSubmitting(false);
		}
	};

	const onCancel = () => {
		reset();
		navigate(-1);
	};

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Create Family</h1>

			<FormProvider {...methods}>
				<FormContainer
					onSubmit={handleSubmit(onSubmit)}
					isSubmitting={isSubmitting}
					errorMessage={errorMessage}
					onCancel={onCancel}
				>
					<CreateFamilyForm />
				</FormContainer>
			</FormProvider>
		</div>
	);
}
