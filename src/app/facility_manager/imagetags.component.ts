import {ImageService} from '../api-connector/image.service';
import {Component, OnInit} from '@angular/core';
import {BlockedImageTag, ImageLogo, ImageMode, ImageTag} from './image-tag';
import {forkJoin} from 'rxjs';
import {FacilityService} from '../api-connector/facility.service';

/**
 * ImageTag component.
 */
@Component({
             selector: 'app-image-tags',
             templateUrl: 'imageTag.component.html',
             providers: [ImageService, FacilityService]
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
  imageTag: string;
  imageUrl: string;
  show_html: boolean = false;
  selectedMode: ImageMode;

  /**
   * Facilitties where the user is manager ['name',id].
   */
  public managerFacilities: [string, number][];
  /**
   * Chosen facility.
   */
  public selectedFacility: [string, number];

  constructor(private imageService: ImageService, private facilityService: FacilityService) {

  }

  checkMode(mode: ImageMode): void {
    const idx: number = this.checkedModes.indexOf(mode);

    if (idx === -1) {
      this.checkedModes.push(mode)
    } else {
      this.checkedModes.splice(idx, 1)
    }
    console.log(this.checkedModes)
  }

  ngOnInit(): void {
    this.facilityService.getManagerFacilities().subscribe((result: any) => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
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
        this.imageTags.push(newTag)

      });
      this.alertRed = false;
    } else {
      this.alertRed = true;
    }
  }

  addImageMode(name: string, description: string, copy_field: string): void {
    const newMode: ImageMode = {name: name, description: description, copy_field: copy_field};
    this.imageService.addImageMode(newMode, this.selectedFacility['FacilityId']).subscribe((createdMode: ImageMode) => {
      this.imageModes.push(createdMode)

    });

  }

  deleteTag(tag: ImageTag): void {
    this.imageService.deleteImageTag(tag.id).subscribe(() => {
      this.imageService.getImageTags(this.selectedFacility['FacilityId']).subscribe((tags: ImageTag[]) => {
        this.imageTags = tags;
      })
    })
  }

  updateMode(name: string, description: string, copy_field: string): void {
    const idx: number = this.imageModes.indexOf(this.selectedMode);
    const update_mode: ImageMode = Object.assign({}, this.selectedMode);
    update_mode.description = description;
    update_mode.copy_field = copy_field;
    update_mode.name = name;
    this.imageService.updateImageMode(update_mode).subscribe((updated_mode: ImageMode) => {
      this.imageModes[idx] = updated_mode;

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

}
