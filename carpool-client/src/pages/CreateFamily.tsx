import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import FormPage from '../components/FormPage';
import CreateFamilyForm from '../components/forms/CreateFamilyForm';
import type { FamilyInput } from '../types';

export default function CreateFamily() {
	const { getToken } = useAuth();
	const navigate = useNavigate();

	const onSubmit = async (data: FamilyInput) => {
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
	};

	return (
		<FormPage<FamilyInput>
			title="Create Family"
			defaultValues={{ parents: [], children: [] }}
			onSubmit={onSubmit}
		>
			<CreateFamilyForm />
		</FormPage>
	);
}
