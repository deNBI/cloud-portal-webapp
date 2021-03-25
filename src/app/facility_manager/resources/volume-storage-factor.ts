import { Factor } from './factor';

/**
 * Volumestoragefactor class.
 */
export class VolumeStorageFactor extends Factor {

	storage: number;

	constructor(volumeStorageFactor: VolumeStorageFactor | null) {
		super(volumeStorageFactor);

		if (volumeStorageFactor) {
			this.storage = volumeStorageFactor.storage;
		}

	}
}
