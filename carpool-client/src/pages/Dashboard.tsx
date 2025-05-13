import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import type { FamilyOutput } from '../types';

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [family, setFamily] = useState<FamilyOutput | null>(null);

	const { getToken } = useAuth();

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
				setError(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		})();
	}, [getToken]);

	return (
		<div>
			<h1>Your Dashboard</h1>
			<p>Coming soon: trip schedules, family overview, and more.</p>
			<div>
				{error && <p className="text-red-600">{error}</p>}
				{family?.parents.map(p => (
					<div key={p.id}>
						<h2>Parent</h2>
						<p>Name: {p.person.name}</p>
						<p>Email: {p.email}</p>
						<p>Phone: {p.phone}</p>
						<p>Seats: {p.seats}</p>
						<p>
							Address: {p.person.address.street}, {p.person.address.city},{' '}
							{p.person.address.state} {p.person.address.zip}
						</p>
					</div>
				))}
				{loading && <p>Loading...</p>}
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
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
