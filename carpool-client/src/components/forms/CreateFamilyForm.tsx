import { useState, type FormEvent } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';
import FormContainer from '../FormContainer';
import type {
	FamilyInput,
	ParentInput,
	ChildInput,
	AddressInput
} from '../../types';

export default function CreateFamilyForm() {
	const { getToken } = useAuth();
	const navigate = useNavigate();

	const [parents, setParents] = useState<ParentInput[]>([
		/* {
			name: '',
			email: '',
			phone: '',
			seats: 1,
			address: {
				street: '',
				city: '',
				state: '',
				zip: ''
			}
		} */
	]);

	const [children, setChildren] = useState<ChildInput[]>([
		/* {
			name: '',
			boosterSeat: false,
			frontSeat: false,
			address: {
				street: '',
				city: '',
				state: '',
				zip: ''
			}
		} */
	]);

	const [isSubmitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const handleParentChange = <K extends keyof Omit<ParentInput, 'address'>>(
		idx: number,
		field: K,
		value: ParentInput[K]
	) => {
		setParents(ps => {
			const copy = [...ps];
			copy[idx] = { ...copy[idx]!, [field]: value };
			return copy;
		});
	};

	const handleParentAddressChange = <K extends keyof AddressInput>(
		idx: number,
		field: K,
		value: AddressInput[K]
	) => {
		setParents(ps => {
			const copy = [...ps];
			copy[idx] = {
				...copy[idx]!,
				address: { ...copy[idx]!.address, [field]: value }
			};
			return copy;
		});
	};

	function addParent() {
		setParents(ps => [
			...ps,
			{
				name: '',
				email: '',
				phone: '',
				seats: 0,
				address: {
					street: '',
					city: '',
					state: '',
					zip: ''
				}
			}
		]);
	}

	function removeParent(idx: number) {
		setParents(ps => ps.filter((_, i) => i !== idx));
	}

	const handleChildChange = <K extends keyof Omit<ChildInput, 'address'>>(
		idx: number,
		field: K,
		value: ChildInput[K]
	) => {
		setChildren(cs => {
			const copy = [...cs];
			copy[idx] = { ...copy[idx]!, [field]: value };
			return copy;
		});
	};

	const handleChildAddressChange = <K extends keyof AddressInput>(
		idx: number,
		field: K,
		value: AddressInput[K]
	) => {
		setChildren(cs => {
			const copy = [...cs];
			copy[idx] = {
				...copy[idx]!,
				address: { ...copy[idx]!.address, [field]: value }
			};
			return copy;
		});
	};

	function addChild() {
		setChildren(cs => [
			...cs,
			{
				name: '',
				boosterSeat: false,
				frontSeat: false,
				address: { street: '', city: '', state: '', zip: '' }
			}
		]);
	}

	function removeChild(idx: number) {
		setChildren(cs => cs.filter((_, i) => i !== idx));
	}

	function handleCancel() {
		setParents([]);
		setChildren([]);
		navigate(-1);
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (parents.length === 0) {
			setErrorMessage('At least one parent is required');
			return;
		}
		setSubmitting(true);
		setErrorMessage('');

		const body: FamilyInput = { parents, children };

		try {
			const token = await getToken();
			const res = await fetch('/family', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || 'Unknown error');
			}

			// success handling...
			navigate('/dashboard');
		} catch (err: unknown) {
			setErrorMessage((err as Error).message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<FormContainer
			onSubmit={handleSubmit}
			isSubmitting={isSubmitting}
			errorMessage={errorMessage}
		>
			{/* Parents */}
			{parents.map((p, i) => (
				<div key={`parent-${i}`} className="space-y-2 border-b pb-4">
					<h3>Parent #{i + 1}</h3>
					<button
						type="button"
						onClick={() => removeParent(i)}
						className="absolute top-0 right-0 text-red-600"
					>
						Remove
					</button>
					<input
						placeholder="Name"
						value={p.name}
						onChange={e => handleParentChange(i, 'name', e.target.value)}
					/>
					<input
						placeholder="Email"
						value={p.email}
						onChange={e => handleParentChange(i, 'email', e.target.value)}
					/>
					<input
						placeholder="Phone"
						value={p.phone}
						onChange={e => handleParentChange(i, 'phone', e.target.value)}
					/>
					<input
						type="number"
						placeholder="Seats"
						value={p.seats}
						onChange={e =>
							handleParentChange(i, 'seats', Number(e.target.value))
						}
					/>
					<input
						placeholder="Street"
						value={p.address.street}
						onChange={e =>
							handleParentAddressChange(i, 'street', e.target.value)
						}
					/>
					<input
						placeholder="City"
						value={p.address.city}
						onChange={e => handleParentAddressChange(i, 'city', e.target.value)}
					/>
					<input
						placeholder="State"
						value={p.address.state}
						onChange={e =>
							handleParentAddressChange(i, 'state', e.target.value)
						}
					/>
					<input
						placeholder="ZIP"
						value={p.address.zip}
						onChange={e => handleParentAddressChange(i, 'zip', e.target.value)}
					/>
				</div>
			))}
			<button type="button" onClick={addParent}>
				+ Add Parent
			</button>

			{/* Children */}
			{children.map((c, i) => (
				<div key={`child-${i}`} className="space-y-2 border-b pb-4 mt-4">
					<h3>Child #{i + 1}</h3>
					<button
						type="button"
						onClick={() => removeChild(i)}
						className="absolute top-0 right-0 text-red-600"
					>
						Remove
					</button>
					<input
						placeholder="Name"
						value={c.name}
						onChange={e => handleChildChange(i, 'name', e.target.value)}
					/>
					<label>
						<input
							type="checkbox"
							checked={c.boosterSeat}
							onChange={e =>
								handleChildChange(i, 'boosterSeat', e.target.checked)
							}
						/>
						Booster Seat
					</label>
					<label>
						<input
							type="checkbox"
							checked={c.frontSeat}
							onChange={e =>
								handleChildChange(i, 'frontSeat', e.target.checked)
							}
						/>
						Front Seat
					</label>
					<input
						placeholder="Street"
						value={c.address.street}
						onChange={e =>
							handleChildAddressChange(i, 'street', e.target.value)
						}
					/>
					<input
						placeholder="City"
						value={c.address.city}
						onChange={e => handleChildAddressChange(i, 'city', e.target.value)}
					/>
					<input
						placeholder="State"
						value={c.address.state}
						onChange={e => handleChildAddressChange(i, 'state', e.target.value)}
					/>
					<input
						placeholder="ZIP"
						value={c.address.zip}
						onChange={e => handleChildAddressChange(i, 'zip', e.target.value)}
					/>
				</div>
			))}
			<button type="button" onClick={addChild}>
				+ Add Child
			</button>
			{/* Cancel and Submit Buttons */}
			<div className="flex space-x-4 mt-4">
				<button type="button" onClick={handleCancel}>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isSubmitting /* || parents.length === 0 */}
				>
					Submit
				</button>
			</div>
		</FormContainer>
	);
}
