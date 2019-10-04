import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***ImageService***REMOVED*** from '../../api-connector/image.service';
import ***REMOVED***SnapshotModel***REMOVED*** from './snapshot.model';
import ***REMOVED***forkJoin, Observable***REMOVED*** from 'rxjs';
import ***REMOVED***IResponseTemplate***REMOVED*** from '../../api-connector/response-template';
import ***REMOVED***VolumeRequestStates***REMOVED*** from '../volumes/volume-request-states.enum';
import ***REMOVED***FacilityService***REMOVED*** from '../../api-connector/facility.service';

enum Snapshot_Delete_Statuses ***REMOVED***
  WAITING = 0,
  SUCCESS = 1,
  ERROR = 2
***REMOVED***

@Component(***REMOVED***
             selector: 'app-snapshot-overview',
             templateUrl: 'snapshotOverview.component.html',
             providers: [FacilityService, ImageService]
           ***REMOVED***)

export class SnapshotOverviewComponent implements OnInit ***REMOVED***

  showFacilities: boolean = false;

  /**
   * Facilitties where the user is manager ['name',id].
   */
  managerFacilities: [string, number][];
  /**
   * Chosen facility.
   */
  selectedFacility: [string, number];
  /**
   * All snapshots.
   * @type ***REMOVED***Array***REMOVED***
   */
  snapshots: SnapshotModel[] = [];
  /**
   * Selected snapshot.
   */
  selected_snapshot: SnapshotModel;
  /**
   * All possible statuses when deleting.
   * @type ***REMOVED***Snapshot_Delete_Statuses***REMOVED***
   */
  delete_statuses = Snapshot_Delete_Statuses;
  /**
   * Actual delete status.
   * @type ***REMOVED***Snapshot_Delete_Statuses***REMOVED***
   */
  delete_status: number = this.delete_statuses.WAITING;
  /**
   * If site was initialized.
   * @type ***REMOVED***boolean***REMOVED***
   */
  isLoaded: boolean = false;

  private checkStatusTimeout: number = 5000;

  constructor(private facilityService: FacilityService, private imageService: ImageService) ***REMOVED***

  ***REMOVED***

  /**
   * Set selected Snapshot.
   * @param ***REMOVED***SnapshotModel***REMOVED*** snapshot
   */
  setSelectedSnapshot(snapshot: SnapshotModel): void ***REMOVED***
    this.selected_snapshot = snapshot;
  ***REMOVED***

  /**
   * Get snapshots by user.
   */
  getSnapshots(): void ***REMOVED***
    this.snapshots = [];
    this.imageService.getSnapshotsByUser().subscribe(result => ***REMOVED***
      this.snapshots = result;
      this.isLoaded = true;
      this.checkSnapShotsStatus()
    ***REMOVED***)
  ***REMOVED***

  checkSnapShotsStatus(): void ***REMOVED***
    let all_active: boolean = true;

    setTimeout(
      () => ***REMOVED***
        const observables = [];
        for (const snapshot of this.snapshots) ***REMOVED***
          if (snapshot.snapshot_status !== 'active') ***REMOVED***

            observables.push(this.imageService.getSnapshot(snapshot.snapshot_openstackid));
          ***REMOVED***

        ***REMOVED***
        forkJoin(observables).subscribe(res => ***REMOVED***
          for (const snap of res) ***REMOVED***
            this.snapshots[res.indexOf(snap)].snapshot_status = snap['status'];
            if (snap['status'] !== 'active') ***REMOVED***
              all_active = false;
            ***REMOVED***

          ***REMOVED***
          if (all_active) ***REMOVED***
            return;
          ***REMOVED*** else ***REMOVED***
            this.checkSnapShotsStatus();
          ***REMOVED***
        ***REMOVED***)
      ***REMOVED***,
      this.checkStatusTimeout);

  ***REMOVED***

  getFacilitySnapshots(): void ***REMOVED***
    this.snapshots = [];
    this.facilityService.getFacilitySnapshots(this.selectedFacility['FacilityId']).subscribe(res => ***REMOVED***
      this.snapshots = res;
    ***REMOVED***)
  ***REMOVED***

  /**
   * Delete snapshot.
   * @param ***REMOVED***string***REMOVED*** snapshot_id
   */
  deleteSnapshot(snapshot_id: string): void ***REMOVED***
    this.imageService.deleteSnapshot(snapshot_id).subscribe((result: IResponseTemplate) => ***REMOVED***

      this.delete_status = 0;

      if (<boolean><Boolean>result.value) ***REMOVED***
        this.delete_status = 1;
      ***REMOVED*** else if (result.value) ***REMOVED***
        this.delete_status = 3;

      ***REMOVED*** else ***REMOVED***
        this.delete_status = 2;
      ***REMOVED***

      this.getSnapshots();
    ***REMOVED***)

  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.getSnapshots();
    this.facilityService.getManagerFacilities().subscribe(result => ***REMOVED***
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
    ***REMOVED***);

  ***REMOVED***

***REMOVED***
