export interface AddressInput {
	street: string;
	city: string;
	state: string;
	zip: string;
}

export interface ParentInput {
	name: string;
	email: string;
	phone: string;
	seats: number;
	sameAddress?: boolean;
	address: AddressInput;
}

export interface ChildInput {
	name: string;
	boosterSeat: boolean;
	frontSeat: boolean;
	sameAddress?: boolean;
	address: AddressInput;
}

export interface FamilyInput {
	parents: ParentInput[];
	children: ChildInput[];
}
