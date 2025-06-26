import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ErrorBanner from '../components/ErrorBanner';
import FormPage from '../components/FormPage';
import EditAddressForm from '../components/forms/EditAddressForm';
import type { AddressFormData, AddressInput, FamilyOutput } from '../types';

type Member = {
	id: number;
	name: string;
	addressId: number;
};

export default function EditAddress() {
	const { getToken } = useAuth();
	const navigate = useNavigate();
	const { personId } = useParams();
	const pid = personId ? Number(personId) : NaN;

	const [loadError, setLoadError] = useState<string | null>(null);
	const [initial, setInitial] = useState<AddressInput | null>(null);
	const [members, setMembers] = useState<Member[]>([]);
	const [isSubmitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>('');

	useEffect(() => {
		(async () => {
			try {
				// validate params
				if (!personId || isNaN(pid)) throw new Error('Invalid personId');

				const token = await getToken();

				const familyRes = await fetch(
					`${import.meta.env.VITE_API_URL}/family`,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
				);

				if (!familyRes.ok) throw new Error('Cannot load family');
				const family = (await familyRes.json()) as FamilyOutput;

				// find the person and their address
				const rawPerson =
					family.parents.find(p => p.person.id === pid)?.person ||
					family.children.find(c => c.person.id === pid)?.person;

				if (!rawPerson) throw new Error('Person not in your family');

				// set initial address fields
				const { street, city, state, zip } = rawPerson.address;
				setInitial({ street, city, state, zip });

				// build members list
				const people = [...family.parents, ...family.children];
				setMembers(
					people.map(({ person }) => ({
						id: person.id,
						name: person.name,
						addressId: person.address.id
					}))
				);
			} catch (err: unknown) {
				setLoadError(err instanceof Error ? err.message : 'Unknown error');
			}
		})();
	}, [personId, getToken, pid]);

	const handleSubmit = async (data: AddressFormData) => {
		setSubmitting(true);
		setErrorMessage('');

		try {
			if (isNaN(pid)) throw new Error('Invalid personId');

			const token = await getToken();
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/family/${pid}/address`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(data)
				}
			);
			if (!res.ok) {
				let msg = `HTTP ${res.status}`;
				try {
					const body = await res.json();
					msg = body.error ?? JSON.stringify(body);
				} catch {
					/*  ignore parse errors */
				}
				throw new Error(msg);
			}
			navigate(-1);
		} catch (err: unknown) {
			setLoadError(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setSubmitting(false);
		}
	};

	if (loadError) {
		return <ErrorBanner message={loadError} />;
	}

	if (!initial) return <p>Loading…</p>;

	return (
		<FormPage<AddressFormData>
			title="Edit Address"
			defaultValues={{ ...initial, sameAsId: undefined }}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
			isSubmitting={isSubmitting}
			errorMessage={errorMessage}
		>
			<EditAddressForm members={members} selfId={pid} />
		</FormPage>
	);
}
