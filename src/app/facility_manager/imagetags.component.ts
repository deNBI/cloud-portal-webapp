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

  addTag(tag: string, description: string, input: HTMLInputElement): void {
    if (input.validity.valid) {
      this.imageService.addImageTags(tag.trim(), description).subscribe((newTag: ImageTag) => {
        this.imageTags.push(newTag)

      });
      this.alertRed = false;
    } else {
      this.alertRed = true;
    }
  }

  deleteTag(tag: string): void {
    this.imageService.deleteImageTag(tag).subscribe(() => {
      this.imageService.getImageTags(this.selectedFacility['FacilityId']).subscribe((tags: ImageTag[]) => {
        this.imageTags = tags;
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
