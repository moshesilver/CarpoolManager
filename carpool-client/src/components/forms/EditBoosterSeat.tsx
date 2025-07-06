import { useFormContext } from 'react-hook-form';

export default function EditBoosterSeat() {
	const { register } = useFormContext<{ boosterSeat: boolean }>();
	return (
		<label>
			Booster Seat
			<input type="checkbox" {...register('boosterSeat')} className="bl w-24" />
		</label>
	);
}
