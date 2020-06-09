import {Component, OnInit} from '@angular/core';
import {ImageService} from '../../api-connector/image.service';
import {SnapshotModel} from './snapshot.model';
import {forkJoin, Subject} from 'rxjs';
import {IResponseTemplate} from '../../api-connector/response-template';
import {FacilityService} from '../../api-connector/facility.service';
import {WIKI_SNAPSHOTS} from '../../../links/links';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

enum Snapshot_Delete_Statuses {
  WAITING = 0,
  SUCCESS = 1,
  ERROR = 2
}

/**
 * Snapshot overivew.
 */
@Component({
             selector: 'app-snapshot-overview',
             templateUrl: 'snapshotOverview.component.html',
             providers: [FacilityService, ImageService]
           })

export class SnapshotOverviewComponent implements OnInit {
  WIKI_SNAPSHOTS: string = WIKI_SNAPSHOTS;
  checked_snapshots: SnapshotModel [] = [];

  title: string = 'Snapshot Overview';

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
   * @type {Array}
   */
  snapshots: SnapshotModel[] = [];
  /**
   * Selected snapshot.
   */
  selected_snapshot: SnapshotModel;
  /**
   * All possible statuses when deleting.
   * @type {Snapshot_Delete_Statuses}
   */
  delete_statuses: typeof Snapshot_Delete_Statuses = Snapshot_Delete_Statuses;
  /**
   * Actual delete status.
   * @type {Snapshot_Delete_Statuses}
   */
  delete_status: number = this.delete_statuses.WAITING;
  /**
   * If site was initialized.
   * @type {boolean}
   */
  isLoaded: boolean = false;
  filterChanged: Subject<string> = new Subject<string>();
  filter: string;
  all_snapshots_checked: boolean = false;

  private checkStatusTimeout: number = 5000;

  currentPage: number = 1;
  total_pages: number;
  total_items: number;
  items_per_page: number = 7;
  snapshotsPerPageChange: Subject<number> = new Subject<number>();
  isSearching: boolean = true;
  DEBOUNCE_TIME: number = 300;

  constructor(private facilityService: FacilityService, private imageService: ImageService) {

  }

  changedFilter(text: string): void {
    this.filterChanged.next(text);

  }

  /**
   * Set selected Snapshot.
   * @param {SnapshotModel} snapshot
   */
  setSelectedSnapshot(snapshot: SnapshotModel): void {
    this.selected_snapshot = snapshot;
  }

  /**
   * Get snapshots by user.
   */
  getSnapshots(): void {
    this.imageService.getSnapshotsByUser(this.currentPage, this.items_per_page).subscribe((result: any) => {
      this.snapshots = [];
      this.snapshots = result['snapshot_list'];
      this.total_items = result['total_items'];
      this.items_per_page = result['items_per_page'];
      this.total_pages = result['num_pages'];
      this.isLoaded = true;
      this.checkSnapShotsStatus();
      this.isSearching = false;
    })
  }

  changeCheckAllSnapshots(): void {
    if (this.all_snapshots_checked) {
      this.checked_snapshots = [];
      this.all_snapshots_checked = false;

      return;

    }

    this.snapshots.forEach((snap: SnapshotModel) => {
      if (!this.isSnapChecked(snap)) {
        this.checked_snapshots.push(snap);
      }
    });
    this.all_snapshots_checked = true;

  }

  checkSnapShotsStatus(): void {
    let all_active: boolean = true;

    setTimeout(
      () => {
        const observables: any = [];
        for (const snapshot of this.snapshots) {
          if (snapshot.snapshot_status !== 'active') {

            observables.push(this.imageService.getSnapshot(snapshot.snapshot_openstackid));
          }

        }
        forkJoin(observables).subscribe((res: any) => {
          for (const snap of res) {
            this.snapshots[res.indexOf(snap)].snapshot_status = snap['status'];
            if (snap['status'] !== 'active') {
              all_active = false;
            }

          }
          if (all_active) {
            return;
          } else {
            this.checkSnapShotsStatus();
          }
        })
      },
      this.checkStatusTimeout);

  }

  getFacilitySnapshots(): void {
    this.snapshots = [];
    this.facilityService.getFacilitySnapshots(this.selectedFacility['FacilityId'], this.currentPage, this.items_per_page)
      .subscribe((res: any) => {
        this.snapshots = res['snapshot_list'];
        this.total_items = res['total_items'];
        this.items_per_page = res['items_per_page'];
        this.total_pages = res['num_pages'];
        this.isSearching = false;
      })
  }

  /**
   * Delete snapshot.
   * @param {string} snapshot_id
   */
  deleteSnapshot(snapshot: SnapshotModel): void {
    this.imageService.deleteSnapshot(snapshot.snapshot_openstackid).subscribe((result: IResponseTemplate) => {

      this.delete_status = 0;

      if (<boolean><Boolean>result.value) {
        this.delete_status = 1;
        const idx: number = this.snapshots.indexOf(snapshot)

        this.snapshots.splice(idx, 1);
      } else if (result.value) {
        this.delete_status = 3;
        this.getSnapshots();

      } else {
        this.delete_status = 2;
        this.getSnapshots();

      }

    })

  }

  ngOnInit(): void {
    this.getSnapshots();

    this.filterChanged
      .pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged(), switchMap((filterName: string) => {
          this.isSearching = true;

          this.filter = filterName.trim();
          if (this.showFacilities) {
            // tslint:disable-next-line:max-line-length
            return this.facilityService.getFacilitySnapshots(this.selectedFacility['FacilityId'], this.currentPage, this.items_per_page, this.filter)
          } else {
            return this.imageService.getSnapshotsByUser(this.currentPage, this.items_per_page, this.filter)
          }

        }))
      .subscribe((result: any) => {

        this.snapshots = result['snapshot_list'];
        this.total_items = result['total_items'];
        this.items_per_page = result['items_per_page'];
        this.total_pages = result['num_pages'];
        this.isLoaded = true;
        this.checkSnapShotsStatus();
        this.isSearching = false;

      });

    this.snapshotsPerPageChange.pipe(
      debounceTime(this.DEBOUNCE_TIME),
      distinctUntilChanged())
      .subscribe(() => {
        this.reset();
        if (this.showFacilities) {
          this.getFacilitySnapshots();
        } else {
          this.getSnapshots();
        }
      });
    this.facilityService.getManagerFacilities().subscribe((result: any) => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
    });

  }

  areAllSnapshotsChecked(): void {
    let all_checked: boolean = true;
    this.snapshots.forEach((snap: SnapshotModel) => {
      if (!this.isSnapChecked(snap)) {
        all_checked = false;

      }
    });

    this.all_snapshots_checked = all_checked;

  }

  changeCheckedSnapshot(snap: SnapshotModel): void {
    if (!this.isSnapChecked(snap)) {
      this.checked_snapshots.push(snap);

    } else {
      this.checked_snapshots.splice(this.checked_snapshots.indexOf(snap), 1)
    }
    this.areAllSnapshotsChecked();

  }

  isSnapChecked(snap: SnapshotModel): boolean {
    return this.checked_snapshots.indexOf(snap) !== -1
  }

  deleteSelectedSnapshots(): void {
    this.checked_snapshots.forEach((snap: SnapshotModel) => {
      this.deleteSnapshot(snap)

    });
    this.uncheckAll()
  }

  uncheckAll(): void {
    this.checked_snapshots = [];
    this.all_snapshots_checked = false;
  }

  /**
   * Load vms depending on page.
   * @param event
   */
  pageChanged(event: any): void {
    this.isSearching = true;

    this.currentPage = event.page;
    if (this.showFacilities) {
      this.getFacilitySnapshots();
    } else {
      this.getSnapshots();
    }
  }

  reset(): void {
    this.isSearching = true;
    this.currentPage = 1;
    this.total_pages = null;
    this.total_items = null;
  }

}
