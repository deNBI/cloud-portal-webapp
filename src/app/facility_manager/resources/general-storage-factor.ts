import { Factor } from './factor';

/**
 * GeneralStorageFactor class.
 */
export class GeneralStorageFactor extends Factor {

	storage: number;

	constructor(generalStorageFactor: GeneralStorageFactor | null) {
		super(generalStorageFactor);

		if (generalStorageFactor) {
			this.storage = generalStorageFactor.storage;
		}

	}
}
