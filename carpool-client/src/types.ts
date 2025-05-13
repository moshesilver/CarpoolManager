export interface AddressInput {
	street: string;
	city: string;
	state: string;
	zip: string;
}

export interface AddressOutput {
	id: string;
	street: string;
	city: string;
	state: string;
	zip: string;
}

export interface PersonOutput {
	id: string;
	name: string;
	address: AddressOutput;
}

export interface ParentInput {
	name: string;
	email: string;
	phone: string;
	seats: number;
	sameAddress?: boolean;
	address: AddressInput;
}

export interface ParentOutput {
	id: string;
	person: PersonOutput;
	email: string;
	phone: string;
	seats: number;
}

export interface ChildInput {
	name: string;
	boosterSeat: boolean;
	frontSeat: boolean;
	sameAddress?: boolean;
	address: AddressInput;
}

export interface ChildOutput {
	id: string;
	person: PersonOutput;
	boosterSeat: boolean;
	frontSeat: boolean;
}

export interface FamilyInput {
	parents: ParentInput[];
	children: ChildInput[];
}

export interface FamilyOutput {
	id: string;
	parents: ParentOutput[];
	children: ChildOutput[];
}
