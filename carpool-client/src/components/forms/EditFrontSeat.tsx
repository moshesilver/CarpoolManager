import { useFormContext } from 'react-hook-form';

export default function EditFrontSeat() {
	const { register } = useFormContext<{ frontSeat: boolean }>();
	return (
		<label>
			Front Seat
			<input type="checkbox" {...register('frontSeat')} className="bl w-24" />
		</label>
	);
}
