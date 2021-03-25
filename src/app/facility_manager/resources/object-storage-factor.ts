import { Factor } from './factor';

/**
 * ObjectStorageFactor class.
 */
export class ObjectStorageFactor extends Factor {

	storage: number;

	constructor(objectStorageFactor: ObjectStorageFactor | null) {
		super(objectStorageFactor);

		if (objectStorageFactor) {
			this.storage = objectStorageFactor.storage;
		}

	}
}
