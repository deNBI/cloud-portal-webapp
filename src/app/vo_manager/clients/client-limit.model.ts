export class ClientLimit {
	maxVolumes: number = 0;
	assignedVolumes: number = 0;
	currentUsedVolumes: number = 0;
	newVolumes: number = 0;

	maxVMs: number = 0;
	assignedVMs: number = 0;
	currentUsedVms: number = 0;
	newVms: number = 0;

	maxVolumeLimit: number = 0;
	currentUsedVolumeStorage: number = 0;
	assignedVolumesStorage: number = 0;
	newVolumeLimit: number = 0;

	maxCores: number = 0;
	assignedCores: number = 0;
	currentUsedCores: number = 0;
	newCores: number = 0;

	maxRam: number = 0;
	assignedRam: number = 0;
	currentUsedRam: number = 0;
	newRam: number = 0;
}
