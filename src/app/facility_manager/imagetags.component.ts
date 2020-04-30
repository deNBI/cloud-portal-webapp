import {ImageService} from '../api-connector/image.service';
import {Component, OnInit} from '@angular/core';
import {BlockedImageTag, ImageLogo, ImageMode, ImageTag, BlockedImageTagResenv} from './image-tag';
import {forkJoin} from 'rxjs';
import {FacilityService} from '../api-connector/facility.service';
import {BiocondaService} from '../api-connector/bioconda.service';

/**
 * ImageTag component.
 */
@Component({
             selector: 'app-image-tags',
             templateUrl: 'imageTag.component.html',
             providers: [ImageService, FacilityService, BiocondaService]
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

  }

  checkMode(mode: ImageMode): void {
    const idx: number = this.checkedModes.indexOf(mode);

    if (idx === -1) {
      this.checkedModes.push(mode)
    } else {
      this.checkedModes.splice(idx, 1)
    }
  }

  checkBlockedTagResenv(mode: string): void {
    const idx: number = this.checkedBlockedImageTagResenv.indexOf(mode);

    if (idx === -1) {
      this.checkedBlockedImageTagResenv.push(mode)
    } else {
      this.checkedBlockedImageTagResenv.splice(idx, 1)
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
      this.imageService.getImageModes(this.selectedFacility['FacilityId']))
      .subscribe((res: any) => {
        this.imageTags = res[0];
        this.imageLogos = res[1];
        this.blockedImageTags = res[2];
        this.imageModes = res[3];
        this.isLoaded = true;
      })
  }

  ngOnInit(): void {
    this.facilityService.getManagerFacilities().subscribe((result: any) => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
      this.getTagModeSuggestions();
      forkJoin(
        this.imageService.getImageTags(this.selectedFacility['FacilityId']),
        this.imageService.getImageLogos(),
        this.imageService.getBlockedImageTags(this.selectedFacility['FacilityId']),
        this.imageService.getImageModes(this.selectedFacility['FacilityId']))
        .subscribe((res: any) => {
          this.imageTags = res[0];
          this.imageLogos = res[1];
          this.blockedImageTags = res[2];
          this.imageModes = res[3];
          this.isLoaded = true;
        })
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
    this.imageService.addImageLogos(this.imageTag, this.imageUrl).subscribe((newTag: ImageLogo) => {
      this.imageLogos.push(newTag)
    })
  }

  removeLogoTag(logoTag: ImageLogo): void {
    this.imageService.deleteImageLogoTag(logoTag.id).subscribe(() => {
      const idx: number = this.imageLogos.indexOf(logoTag);
      this.imageLogos.splice(idx, 1);
    })
  }

  addTag(tag: string, input: HTMLInputElement): void {
    if (input.validity.valid) {
      this.imageService.addImageTags(tag.trim(), this.checkedModes, this.selectedFacility['FacilityId']).subscribe((newTag: ImageTag) => {
        this.checkedModes = [];
        this.imageTags.push(newTag);
      });
      this.alertRed = false;
    } else {
      this.alertRed = true;
    }
  }

  addImageMode(): void {
    const newMode: ImageMode = {name: this.newModeName, description: this.newModeDescription, copy_field: this.newModeCopy};
    this.imageService.addImageMode(newMode, this.selectedFacility['FacilityId']).subscribe((createdMode: ImageMode) => {

      this.newModeName = '';
      this.newModeDescription = '';
      this.newModeCopy = '';
      this.imageModes.push(createdMode);
      this.getTagModeSuggestions();

    });

  }

  deleteTag(tag: ImageTag): void {
    this.imageService.deleteImageTag(tag.id).subscribe(() => {
      this.imageService.getImageTags(this.selectedFacility['FacilityId']).subscribe((tags: ImageTag[]) => {
        this.imageTags = tags;
      })
    })
  }

  updateMode(): void {
    const idx: number = this.imageModes.indexOf(this.selectedMode);
    const update_mode: ImageMode = Object.assign({}, this.selectedMode);
    update_mode.description = this.updateModeDescription;
    update_mode.copy_field = this.updateModeCopy;
    update_mode.name = this.updateModeName;
    this.imageService.updateImageMode(update_mode).subscribe((updated_mode: ImageMode) => {
      this.imageModes[idx] = updated_mode;
      this.getTagModeSuggestions();
    })
  }

  deleteMode(mode: ImageMode): void {
    this.imageService.deleteImageMode(mode.id).subscribe(() => {
      this.imageService.getImageModes(this.selectedFacility['FacilityId']).subscribe((tags: ImageMode[]) => {
        this.imageModes = tags;
      })
    })
  }

  addBlockedTag(tag: string, input: HTMLInputElement): void {
    if (input.validity.valid) {
      this.imageService.addBlockedImageTag(tag.trim(), this.selectedFacility['FacilityId']).subscribe((newTag: BlockedImageTag) => {
        this.blockedImageTags.push(newTag)
      });
      this.alertRed_blocked = false;
    } else {
      this.alertRed_blocked = true;
    }
  }

  deleteBlockedTag(tag: string, facility_id: number): void {
    this.imageService.deleteBlockedImageTag(tag, facility_id).subscribe(() => {
      this.imageService.getBlockedImageTags(facility_id).subscribe((tags: BlockedImageTag[]) => {
        this.blockedImageTags = tags;
      })
    })
  }

  getTagModeSuggestions(): void {
    this.biocondaService
      .getSuggestedForcTemplates(this.selectedFacility['FacilityId'].toString())
      .subscribe((response: any[]) => {
        this.suggestedModes = response.map((template: any) => template);
      });
  }

  addBlockedTagResenv(tag: string, input: HTMLInputElement): void {
    if (input.validity.valid) {
      console.log(tag, input, this.checkedBlockedImageTagResenv);
    }
    //   this.imageService.addBlockedImageTag(tag.trim(), this.selectedFacility['FacilityId']).subscribe((newTag: BlockedImageTag) => {
    //     this.blockedImageTags.push(newTag)
    //   });
    //   this.alertRed_blocked = false;
    // } else {
    //   this.alertRed_blocked = true;
    // }
  }

  deleteBlockedTagResenv(tag: string, facility_id: number): void {
    this.imageService.deleteBlockedImageTag(tag, facility_id).subscribe(() => {
      this.imageService.getBlockedImageTags(facility_id).subscribe((tags: BlockedImageTag[]) => {
        this.blockedImageTags = tags;
      })
    })
  }

}
