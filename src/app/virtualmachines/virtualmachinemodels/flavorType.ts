/**
 * FlavorType class.
 */

export class FlavorType {
	shortcut: string;
	long_name: string;
	description: string;

	constructor(flavorType?: Partial<FlavorType>) {
		Object.assign(this, flavorType);
	}
}
