import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ImageService } from '../api-connector/image.service';
import {
	BlockedImageTag, BlockedImageTagResenv, ImageLogo, ImageMode, ImageTag,
} from './image-tag';
import { FacilityService } from '../api-connector/facility.service';
import { BiocondaService } from '../api-connector/bioconda.service';

/**
 * ImageTag component.
 */
@Component({
	selector: 'app-image-tags',
	templateUrl: 'imageTag.component.html',
	providers: [ImageService, FacilityService, BiocondaService],
})
export class ImageTagComponent implements OnInit {

	title: string = 'Image Tags';

	isLoaded: boolean = false;
	alertRed: boolean = false;
	alertRed_blocked: boolean = false;
	imageTags: ImageTag[];
	imageModes: ImageMode[];
	imageLogos: ImageLogo[];
	checkedModes: ImageMode[] = [];
	blockedImageTags: BlockedImageTag[];
	blockedImageTagsResenv: BlockedImageTagResenv[];
	checkedBlockedImageTagResenv: string[] = [];
	imageTag: string;
	imageUrl: string;
	show_html: boolean = false;
	selectedMode: ImageMode;
	suggestedModes: string[] = [];
	updateModeName: string;
	updateModeDescription: string;
	updateModeCopy: string;
	newModeName: string;
	newModeDescription: string;
	newModeCopy: string;

	/**
	 * Facilitties where the user is manager ['name',id].
	 */
	public managerFacilities: [string, number][];
	/**
	 * Chosen facility.
	 */
	public selectedFacility: [string, number];

	constructor(private imageService: ImageService, private facilityService: FacilityService, private biocondaService: BiocondaService) {
		// constructor for ImageTags
	}

	checkMode(mode: ImageMode): void {
		const idx: number = this.checkedModes.indexOf(mode);

		if (idx === -1) {
			this.checkedModes.push(mode);
		} else {
			this.checkedModes.splice(idx, 1);
		}
	}

	checkBlockedTagResenv(mode: string): void {
		const idx: number = this.checkedBlockedImageTagResenv.indexOf(mode);

		if (idx === -1) {
			this.checkedBlockedImageTagResenv.push(mode);
		} else {
			this.checkedBlockedImageTagResenv.splice(idx, 1);
		}
	}

	resenvModeAdded(mode: string): boolean {
		for (const imageMode of this.imageModes) {
			if (imageMode.name === mode) {
				return true;
			}
		}

		return false;
	}

	reloadData(): void {
		forkJoin(
			this.imageService.getImageTags(this.selectedFacility['FacilityId']),
			this.imageService.getImageLogos(),
			this.imageService.getBlockedImageTags(this.selectedFacility['FacilityId']),
			this.imageService.getImageModes(this.selectedFacility['FacilityId']),
			this.imageService.getBlockedImageTagsResenv(this.selectedFacility['FacilityId']),
		)
			.subscribe((res: any): void => {
				this.imageTags = res[0];
				this.imageLogos = res[1];
				this.blockedImageTags = res[2];
				this.imageModes = res[3];
				this.blockedImageTagsResenv = res[4];
				this.isLoaded = true;
			});
	}

	ngOnInit(): void {
		this.facilityService.getManagerFacilities().subscribe((result: any): void => {
			this.managerFacilities = result;
			this.selectedFacility = this.managerFacilities[0];
			this.getTagModeSuggestions();
			forkJoin(
				this.imageService.getImageTags(this.selectedFacility['FacilityId']),
				this.imageService.getImageLogos(),
				this.imageService.getBlockedImageTags(this.selectedFacility['FacilityId']),
				this.imageService.getImageModes(this.selectedFacility['FacilityId']),
				this.imageService.getBlockedImageTagsResenv(this.selectedFacility['FacilityId']),
			)
				.subscribe((res: any): void => {
					this.imageTags = res[0];
					this.imageLogos = res[1];
					this.blockedImageTags = res[2];
					this.imageModes = res[3];
					this.blockedImageTagsResenv = res[4];
					this.isLoaded = true;
				});
		});
	}

	imageLogoTagAvailable(): boolean {
		for (const il of this.imageLogos) {
			if (il.tag === this.imageTag) {
				return true;
			}
		}

		return false;
	}

	addLogoTag(): void {
		this.imageService.addImageLogos(this.imageTag, this.imageUrl).subscribe((newTag: ImageLogo): void => {
			this.imageLogos.push(newTag);
		});
	}

	removeLogoTag(logoTag: ImageLogo): void {
		this.imageService.deleteImageLogoTag(logoTag.id).subscribe((): void => {
			const idx: number = this.imageLogos.indexOf(logoTag);
			this.imageLogos.splice(idx, 1);
		});
	}

	addTag(tag: string, input: HTMLInputElement): void {
		if (input.validity.valid) {
			this.imageService.addImageTags(tag.trim(), this.checkedModes, this.selectedFacility['FacilityId']).subscribe((newTag: ImageTag): void => {
				this.checkedModes = [];
				this.imageTags.push(newTag);
			});
			this.alertRed = false;
		} else {
			this.alertRed = true;
		}
	}

	addImageMode(): void {
		const newMode: ImageMode = {
			name: this.newModeName,
			description: this.newModeDescription,
			copy_field: this.newModeCopy,
		};
		this.imageService.addImageMode(newMode, this.selectedFacility['FacilityId']).subscribe((createdMode: ImageMode): void => {

			this.newModeName = '';
			this.newModeDescription = '';
			this.newModeCopy = '';
			this.imageModes.push(createdMode);
			this.getTagModeSuggestions();

		});

	}

	deleteTag(tag: ImageTag): void {
		this.imageService.deleteImageTag(tag.id).subscribe((): void => {
			this.imageService.getImageTags(this.selectedFacility['FacilityId']).subscribe((tags: ImageTag[]): void => {
				this.imageTags = tags;
			});
		});
	}

	updateMode(): void {
		const idx: number = this.imageModes.indexOf(this.selectedMode);
		const update_mode: ImageMode = { ...this.selectedMode };
		update_mode.description = this.updateModeDescription;
		update_mode.copy_field = this.updateModeCopy;
		update_mode.name = this.updateModeName;
		this.imageService.updateImageMode(update_mode).subscribe((updated_mode: ImageMode): void => {
			this.imageModes[idx] = updated_mode;
			this.getTagModeSuggestions();
		});
	}

	deleteMode(mode: ImageMode): void {
		this.imageService.deleteImageMode(mode.id).subscribe((): void => {
			this.imageService.getImageModes(this.selectedFacility['FacilityId']).subscribe((tags: ImageMode[]): void => {
				this.imageModes = tags;
			});
		});
	}

	addBlockedTag(tag: string, input: HTMLInputElement): void {
		if (input.validity.valid) {
			this.imageService.addBlockedImageTag(tag.trim(), this.selectedFacility['FacilityId']).subscribe((newTag: BlockedImageTag): void => {
				this.blockedImageTags.push(newTag);
			});
			this.alertRed_blocked = false;
		} else {
			this.alertRed_blocked = true;
		}
	}

	deleteBlockedTag(tag: string, facility_id: number): void {
		this.imageService.deleteBlockedImageTag(tag, facility_id).subscribe((): void => {
			this.imageService.getBlockedImageTags(facility_id).subscribe((tags: BlockedImageTag[]): void => {
				this.blockedImageTags = tags;
			});
		});
	}

	getTagModeSuggestions(): void {
		this.biocondaService
			.getSuggestedForcTemplates(this.selectedFacility['FacilityId'].toString())
			.subscribe((response: any[]): void => {
				this.suggestedModes = response.map((template: any): any => template);
			});
	}

	addBlockedTagResenv(tag: string, input: HTMLInputElement): void {
		if (input.validity.valid) {
			this.imageService
				.addBlockedImageTagResenv(tag.trim(), this.checkedBlockedImageTagResenv, this.selectedFacility['FacilityId'])
				.subscribe((newTag: BlockedImageTagResenv): void => {
					this.blockedImageTagsResenv.push(newTag);
				});
		}
	}

	deleteBlockedTagResenv(tag: string, facility_id: number): void {
		this.imageService.deleteBlockedImageTagResenv(tag, facility_id).subscribe((): void => {
			this.imageService.getBlockedImageTagsResenv(facility_id).subscribe((tags: BlockedImageTagResenv[]): void => {
				this.blockedImageTagsResenv = tags;
			});
		});
	}

}
