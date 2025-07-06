import { useFormContext } from 'react-hook-form';

export default function EditSeats() {
	const { register } = useFormContext<{ seats: number }>();
	return (
		<input
			type="number"
			{...register('seats', { valueAsNumber: true })}
			className="block w-24"
		/>
	);
}
