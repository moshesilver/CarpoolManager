import { useFormContext, useFieldArray } from 'react-hook-form';
import type { FamilyInput } from '../../types';
import AddressSubform from './AddressSubform';

export default function CreateFamilyForm() {
	// --- RHF setup ---
	const {
		register,
		control,
		watch,
		formState: { errors }
	} = useFormContext<FamilyInput>();

	const allValues = watch();

	const {
		fields: parents,
		append: addParent,
		remove: removeParent
	} = useFieldArray({ name: 'parents', control });

	const {
		fields: children,
		append: addChild,
		remove: removeChild
	} = useFieldArray({ name: 'children', control });

	return (
		<>
			{/* Parents */}
			{parents.map((p, i) => {
				const sameAsFirst =
					i > 0 &&
					allValues.parents[0]?.address &&
					allValues.parents[i]?.sameAddress;

				const parentAddressErrors = errors.parents?.[i]?.address;

				return (
					<div key={p.id} className="border p-4 mb-4 relative">
						<h3 className="font-semibold mb-2">Parent #{i + 1}</h3>

						<input
							{...register(`parents.${i}.name`, { required: true })}
							placeholder="Name"
							className="block mb-1 w-full"
						/>
						<input
							{...register(`parents.${i}.email`, { required: true })}
							placeholder="Email"
							className="block mb-1 w-full"
						/>
						<input
							{...register(`parents.${i}.phone`, { required: true })}
							placeholder="Phone"
							className="block mb-1 w-full"
						/>
						<input
							type="number"
							{...register(`parents.${i}.seats`, {
								valueAsNumber: true,
								min: 1
							})}
							placeholder="Seats"
							className="block mb-1 w-24"
						/>

						{i > 0 && (
							<label className="block mb-1">
								<input
									type="checkbox"
									{...register(`parents.${i}.sameAddress`)}
								/>{' '}
								Same address as Parent #1
							</label>
						)}

						{!sameAsFirst && (
							<AddressSubform
								name={`parents.${i}.address`}
								errors={parentAddressErrors}
							/>
						)}

						<button
							type="button"
							onClick={() => removeParent(i)}
							className="absolute top-2 right-2 text-red-600"
						>
							Remove
						</button>
					</div>
				);
			})}

			<button
				type="button"
				onClick={() =>
					addParent({
						name: '',
						email: '',
						phone: '',
						seats: 1,
						sameAddress: false,
						address: { street: '', city: '', state: '', zip: '' }
					})
				}
				className="mb-4"
			>
				+ Add Parent
			</button>

			{/* Children */}
			{children.map((c, i) => {
				const sameAsParent0 = allValues.children[i]?.sameAddress;

				const childAddressErrors = errors.children?.[i]?.address;

				return (
					<div key={c.id} className="border p-4 mb-4 relative">
						<h3 className="font-semibold mb-2">Child #{i + 1}</h3>

						<input
							{...register(`children.${i}.name`, { required: true })}
							placeholder="Name"
							className="block mb-1 w-full"
						/>
						<label className="block mb-1">
							<input
								type="checkbox"
								{...register(`children.${i}.boosterSeat`)}
							/>{' '}
							Booster Seat
						</label>
						<label className="block mb-1">
							<input type="checkbox" {...register(`children.${i}.frontSeat`)} />{' '}
							Front Seat
						</label>

						{i > 0 && (
							<label className="block mb-1">
								<input
									type="checkbox"
									{...register(`children.${i}.sameAddress`)}
								/>{' '}
								Same address as Parent #1
							</label>
						)}

						{!sameAsParent0 && (
							<AddressSubform
								name={`children.${i}.address`}
								errors={childAddressErrors}
							/>
						)}

						<button
							type="button"
							onClick={() => removeChild(i)}
							className="absolute top-2 right-2 text-red-600"
						>
							Remove
						</button>
					</div>
				);
			})}

			<button
				type="button"
				onClick={() =>
					addChild({
						name: '',
						boosterSeat: false,
						frontSeat: false,
						sameAddress: false,
						address: { street: '', city: '', state: '', zip: '' }
					})
				}
				className="mb-4"
			>
				+ Add Child
			</button>
		</>
	);
}
