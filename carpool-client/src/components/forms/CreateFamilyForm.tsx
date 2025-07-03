import { useFormContext, useFieldArray } from 'react-hook-form';
import type { FamilyInput } from '../../types';
import AddressSubform from './AddressSubform';
import { useEffect, useMemo } from 'react';

export default function CreateFamilyForm() {
	const {
		register,
		control,
		watch,
		formState: { errors },
		setValue
	} = useFormContext<FamilyInput>();

	const allValues = watch();

	const {
		fields: parentsFields,
		append: addParent,
		remove: removeParent
	} = useFieldArray({ name: 'parents', control });

	const {
		fields: childrenFields,
		append: addChild,
		remove: removeChild
	} = useFieldArray({ name: 'children', control });

	const copyMembers = useMemo(
		() => [
			...parentsFields.map((f, idx) => ({
				id: f.id,
				name: allValues.parents[idx]?.name ?? '',
				addressId: f.id,
				address: allValues.parents[idx]?.address
			})),
			...childrenFields.map((f, idx) => ({
				id: f.id,
				name: allValues.children[idx]?.name ?? '',
				addressId: f.id,
				address: allValues.children[idx]?.address
			}))
		],
		[parentsFields, childrenFields, allValues]
	);

	const isComplete = (addr: Partial<FamilyInput['parents'][0]['address']>) =>
		Boolean(addr.street && addr.city && addr.state && addr.zip);

	useEffect(() => {
		parentsFields.forEach((_, idx) => {
			const path = `parents.${idx}.address.sameAsId` as const;
			const sameId = allValues.parents[idx]?.address.sameAsId;
			if (sameId) {
				const source = copyMembers.find(m => m.id === sameId);
				if (!source || !isComplete(source.address ?? {})) {
					setValue(path, undefined);
				}
			}
		});
		childrenFields.forEach((_, idx) => {
			const path = `children.${idx}.address.sameAsId` as const;
			const sameId = allValues.children[idx]?.address.sameAsId;
			if (sameId) {
				const source = copyMembers.find(m => m.id === sameId);
				if (!source || !isComplete(source.address ?? {})) {
					setValue(path, undefined);
				}
			}
		});
	}, [parentsFields, childrenFields, allValues, setValue, copyMembers]);

	return (
		<>
			{/* Parents */}
			{parentsFields.map((p, i) => {
				return (
					<div key={p.id} className="border p-4 mb-4 relative">
						<h3 className="font-semibold mb-2">Parent #{i + 1}</h3>

						<input
							{...register(`parents.${i}.name`, {
								required: 'Name is required'
							})}
							placeholder="Name"
							className="block mb-1 w-full"
						/>
						{errors.parents?.[i]?.name && (
							<span className="text-red-600">
								{errors.parents[i].name?.message}
							</span>
						)}

						<input
							{...register(`parents.${i}.email`, {
								required: 'Email is required'
							})}
							placeholder="Email"
							className="block mb-1 w-full"
						/>
						{errors.parents?.[i]?.email && (
							<span className="text-red-600">
								{errors.parents[i].email?.message}
							</span>
						)}

						<input
							{...register(`parents.${i}.phone`, {
								required: 'Phone is required'
							})}
							placeholder="Phone"
							className="block mb-1 w-full"
						/>
						{errors.parents?.[i]?.phone && (
							<span className="text-red-600">
								{errors.parents[i].phone?.message}
							</span>
						)}

						<input
							type="number"
							{...register(`parents.${i}.seats`, {
								valueAsNumber: true,
								min: { value: 1, message: 'Must have at least 1 seat' },
								validate: value =>
									Number.isInteger(value) || 'Must be a whole number'
							})}
							min={1}
							step={1}
							inputMode="numeric"
							placeholder="Seats"
							className="block mb-1 w-24"
						/>
						{errors.parents?.[i]?.seats && (
							<span className="text-red-600">
								{errors.parents[i].seats?.message}
							</span>
						)}

						<AddressSubform
							key={p.id}
							name={`parents.${i}.address`}
							errors={errors.parents?.[i]?.address}
							members={copyMembers}
							selfId={p.id}
						/>

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
						address: {
							street: '',
							city: '',
							state: '',
							zip: '',
							sameAsId: undefined
						}
					})
				}
				className="mb-4"
			>
				+ Add Parent
			</button>

			{/* Children */}
			{childrenFields.map((c, i) => {
				return (
					<div key={c.id} className="border p-4 mb-4 relative">
						<h3 className="font-semibold mb-2">Child #{i + 1}</h3>

						<input
							{...register(`children.${i}.name`, {
								required: 'Name is required'
							})}
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

						<AddressSubform
							key={c.id}
							name={`children.${i}.address`}
							errors={errors.children?.[i]?.address}
							members={copyMembers}
							selfId={c.id}
						/>

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
						address: {
							street: '',
							city: '',
							state: '',
							zip: '',
							sameAsId: undefined
						}
					})
				}
				className="mb-4"
			>
				+ Add Child
			</button>
		</>
	);
}
