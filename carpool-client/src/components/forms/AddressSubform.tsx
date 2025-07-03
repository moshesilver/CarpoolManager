import { useFormContext, type FieldErrors } from 'react-hook-form';
import type { AddressInput } from '../../types';

export type Member = {
	id: string;
	name: string;
	addressId: string;
	address?: Partial<AddressInput>;
};

type Props = {
	// e.g. "parents.0.address" or "children.1.address"
	name: string;
	errors?: FieldErrors<AddressInput>;
	/* for copy-from list */
	members: Member[];
	/* the index you want to exclude from that list */
	selfId: string;
};

export default function AddressSubform({
	name,
	errors,
	members,
	selfId
}: Props) {
	const { register, watch, setValue } = useFormContext();

	// watch the numeric sameAsId under this address object
	const sameAsId = watch(`${name}.sameAsId`) as string | undefined;

	// helper to build nested field names
	const field = <K extends keyof AddressInput>(key: K) =>
		`${name}.${key}` as const;

	const isManual = sameAsId === undefined;

	return (
		<>
			{/* Manual vs. Copy selector */}
			<div className="border p-4 mb-4">
				<label className="block mb-2">
					<input
						type="radio"
						value="manual"
						{...register(`${name}.sameAsId`)}
						checked={isManual}
						onChange={() => {
							setValue(`${name}.sameAsId`, undefined);
						}}
					/>{' '}
					Enter address manually
				</label>

				{isManual && (
					<div className="grid grid-cols-1 gap-2 mt-2">
						<input
							{...register(field('street'), { required: 'Street is required' })}
							placeholder="Street"
							className="block w-full"
						/>
						{errors?.street && (
							<span className="text-red-600">{errors.street.message}</span>
						)}

						<input
							{...register(field('city'), { required: 'City is required' })}
							placeholder="City"
							className="block w-full"
						/>
						{errors?.city && (
							<span className="text-red-600">{errors.city.message}</span>
						)}

						<input
							{...register(field('state'), { required: 'State is required' })}
							placeholder="State"
							className="block w-full"
						/>
						{errors?.state && (
							<span className="text-red-600">{errors.state.message}</span>
						)}

						<input
							{...register(field('zip'), { required: 'Zip is required' })}
							placeholder="ZIP"
							className="block w-full"
						/>
						{errors?.zip && (
							<span className="text-red-600">{errors.zip.message}</span>
						)}
					</div>
				)}
			</div>

			{/* copy-from list */}
			<fieldset className="p-4">
				<legend className="font-semibold mb-2">Or copy from:</legend>
				{members
					.filter(m => m.id !== selfId)
					.map(m => {
						const addr = m.address ?? {};
						const isIncomplete =
							!addr?.street || !addr?.city || !addr?.state || !addr?.zip;
						const isChainCopy = addr.sameAsId !== null && addr.sameAsId !== '';

						const isDisabled = isIncomplete || isChainCopy;

						return (
							<label
								key={m.id}
								className={`block mb-1 ${
									isDisabled ? 'text-gray-400 cursor-not-allowed' : ''
								}`}
							>
								<input
									type="radio"
									value={m.addressId}
									{...register(`${name}.sameAsId`)}
									checked={String(sameAsId) === String(m.addressId)}
									onChange={() => {
										if (!isDisabled) {
											setValue(
												`${name}.sameAsId`,
												m.addressId?.trim() || undefined
											);
										}
									}}
									disabled={isDisabled}
									className="mr-2"
								/>
								{m.name}
								{isIncomplete && (
									<span className="text-red-500 text-sm ml-1">
										(incomplete address)
									</span>
								)}
								{isChainCopy && (
									<span className="text-indigo-500 text-sm ml-1">
										(copy of copy)
									</span>
								)}
							</label>
						);
					})}
			</fieldset>
		</>
	);
}
