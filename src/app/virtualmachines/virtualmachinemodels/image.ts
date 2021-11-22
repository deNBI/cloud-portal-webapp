import { ImageMode } from '../../facility_manager/image-tag';

/**
 * Image Types enum.
 */
export enum ImageTypes {
	IMAGE = 'IMAGE',
	SNAPSHOT = 'SNAPSHOT'
}

/**
 * Image class.
 */
export class Image {
	id: string;
	openstackid: string;
	name: string;
	status: string;
	tags: string[];
	description: string;
	is_snapshot: boolean;
	logo_url: string;
	modes: ImageMode[];

	constructor(image?: Partial<Image>) {
		Object.assign(this, image);
	}
}
