import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import type { FamilyOutput } from '../types';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import EditSeatInput from '../components/forms/EditSeatInput';

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [family, setFamily] = useState<FamilyOutput | null>(null);
	const [editingSeats, setEditingSeats] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);

	const { getToken } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				const token = await getToken();

				const res = await fetch(`${import.meta.env.VITE_API_URL}/family`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});

				if (!res.ok) {
					throw new Error((await res.json()).error);
				}

				setFamily(await res.json());
			} catch (err: unknown) {
				setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		})();
	}, [getToken]);

	async function handleSubmitSeats(seats: number, pid: number) {
		setSubmitting(true);
		setErrorMessage('');

		try {
			if (seats < 1) {
				throw new Error('Seats must be at least 1');
			}

			const token = await getToken();
			if (!token) {
				throw new Error('You must be logged in to update seats');
			}

			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/family/${pid}/seats`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({ seats })
				}
			);
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error ?? `HTTP ${res.status}`);
			}

			setFamily(f => {
				if (!f) return f;
				return {
					...f,
					parents: f.parents.map(p =>
						p.person.id === pid
							? {
									...p,
									seats
							  }
							: p
					)
				};
			});
		} catch (err: unknown) {
			setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setSubmitting(false);
			setEditingSeats(false);
		}
	}

	return (
		<div>
			<h1>Your Dashboard</h1>
			<p>Coming soon: trip schedules, family overview, and more.</p>
			<div>
				{errorMessage && <p className="text-red-600">{errorMessage}</p>}
				{family?.parents.map(p => (
					<div key={p.id}>
						<h2>Parent</h2>
						<p>Name: {p.person.name}</p>
						<p>Email: {p.email}</p>
						<p>Phone: {p.phone}</p>
						<p>
							Seats: {p.seats}
							{!editingSeats && (
								<button
									className="text-blue-500 hover:underline ml-2"
									onClick={() => setEditingSeats(true)}
								>
									Edit
								</button>
							)}
						</p>
						{editingSeats && (
							<FormContainer
								defaultValues={{ seats: p.seats }}
								onSubmit={({ seats }) => handleSubmitSeats(seats, p.person.id)}
								onCancel={() => setEditingSeats(false)}
								isSubmitting={isSubmitting}
								errorMessage={errorMessage}
							>
								<EditSeatInput />
							</FormContainer>
						)}
						<p>
							Address: {p.person.address.street}, {p.person.address.city},{' '}
							{p.person.address.state} {p.person.address.zip}
							<button
								className="text-blue-500 hover:underline ml-2"
								onClick={() => navigate(`/edit-address/${p.person.id}`)}
							>
								Edit Address
							</button>
						</p>
					</div>
				))}
			</div>
			<div>
				{family?.children.map(c => (
					<div key={c.id}>
						<h2>Child</h2>
						<p>Name: {c.person.name}</p>
						<p>Booster Seat: {c.boosterSeat ? 'Yes' : 'No'}</p>
						<p>Front Seat: {c.frontSeat ? 'Yes' : 'No'}</p>
						<p>
							Address: {c.person.address.street}, {c.person.address.city},{' '}
							{c.person.address.state} {c.person.address.zip}
							<button
								className="text-blue-500 hover:underline ml-2"
								onClick={() => navigate(`/edit-address/${c.person.id}`)}
							>
								Edit Address
							</button>
						</p>
					</div>
				))}
				{loading && <p>Loading...</p>}
			</div>
		</div>
	);
}
