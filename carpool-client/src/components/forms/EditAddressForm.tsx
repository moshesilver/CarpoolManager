import { useFormContext } from 'react-hook-form';
import type { AddressInput } from '../../types';

export type EditAddressPayload = AddressInput & {
	sameAsId?: number;
};

type Props = {
	members: { id: number; name: string; addressId: number }[];
	selfId: number;
};

export default function EditAddressForm({ members, selfId }: Props) {
	const {
		register,
		watch,
		formState: { errors }
	} = useFormContext<EditAddressPayload>();

	const sameAsId = watch('sameAsId');

	return (
		<>
			<div className="border p-4 mb-4">
				<label className="block mb-1">
					<input
						type="radio"
						value=""
						{...register('sameAsId', { valueAsNumber: true })}
						// defaultChecked={!sameAsId}
					/>{' '}
					Edit manually
				</label>
				{!sameAsId && (
					<>
						<input
							{...register('street', { required: 'Street required' })}
							placeholder="Street"
							className="block w-full mb-2"
						/>
						{errors.street && <span>{errors.street.message}</span>}

						<input
							{...register('city', { required: 'City required' })}
							placeholder="City"
							className="block w-full mb-2"
						/>
						{errors.city && <span>{errors.city.message}</span>}

						<input
							{...register('state', { required: 'State required' })}
							placeholder="State"
							className="block w-full mb-2"
						/>
						{errors.state && <span>{errors.state.message}</span>}

						<input
							{...register('zip', { required: 'ZIP required' })}
							placeholder="ZIP"
							className="block w-full"
						/>
						{errors.zip && <span>{errors.zip.message}</span>}
					</>
				)}
			</div>

			<fieldset className="border p-4">
				<legend className="font-semibold mb-2">Or copy from:</legend>
				{members
					.filter(m => m.id !== selfId)
					.map(m => (
						<label key={m.id} className="block mb-1">
							<input
								type="radio"
								value={m.addressId}
								{...register('sameAsId', { valueAsNumber: true })}
							/>{' '}
							{m.name} ({/* optionally show their address */})
						</label>
					))}
			</fieldset>
		</>
	);
}
