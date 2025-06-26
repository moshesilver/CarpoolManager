import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import FormPage from '../components/FormPage';
import CreateFamilyForm from '../components/forms/CreateFamilyForm';
import type { FamilyInput } from '../types';

export default function CreateFamily() {
	const { getToken } = useAuth();
	const navigate = useNavigate();

	const [isSubmitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const handleSubmit = async (data: FamilyInput) => {
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
			if (!res.ok) throw new Error((await res.json()).error || 'Unknown');
			navigate('/dashboard');
		} catch (err: unknown) {
			setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<FormPage<FamilyInput>
			title="Create Family"
			defaultValues={{ parents: [], children: [] }}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isSubmitting={isSubmitting}
			errorMessage={errorMessage}
		>
			<CreateFamilyForm />
		</FormPage>
	);
}
