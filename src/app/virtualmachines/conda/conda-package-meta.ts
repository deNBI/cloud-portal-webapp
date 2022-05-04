export class CondaPackageMeta {
	home: string;
	name: string;
	versions: string[];

	constructor(condaPackageMeta?: Partial<CondaPackageMeta>) {
		Object.assign(this, condaPackageMeta);
	}
}
