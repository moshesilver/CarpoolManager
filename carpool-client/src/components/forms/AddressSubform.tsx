import { useFormContext, type FieldErrors } from 'react-hook-form';
import type { AddressInput } from '../../types';

type Props = {
	// e.g. "parents.0.address" or "children.1.address"
	name: `parents.${number}.address` | `children.${number}.address`;
	errors?: FieldErrors<AddressInput>;
};

export default function AddressSubform({ name, errors }: Props) {
	const { register } = useFormContext();

	const field = <K extends keyof AddressInput>(key: K) =>
		`${name}.${key}` as const;

	return (
		<div className="grid grid-cols-1 gap-2">
			<input
				{...register(field('street'), { required: true })}
				placeholder="Street"
				className="block w-full"
			/>
			{errors?.street && (
				<span className="text-red-600">{errors.street?.message}</span>
			)}

			<input
				{...register(field('city'), { required: true })}
				placeholder="City"
				className="block w-full"
			/>
			{errors?.city && (
				<span className="text-red-600">{errors.city?.message}</span>
			)}

			<input
				{...register(field('state'), { required: true })}
				placeholder="State"
				className="block w-full"
			/>
			{errors?.state && (
				<span className="text-red-600">{errors.state?.message}</span>
			)}

			<input
				{...register(field('zip'), { required: true })}
				placeholder="ZIP"
				className="block w-full"
			/>
			{errors?.zip && (
				<span className="text-red-600">{errors.zip?.message}</span>
			)}
		</div>
	);
}
