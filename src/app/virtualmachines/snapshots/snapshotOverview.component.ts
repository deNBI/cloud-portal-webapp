import { Component, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ImageService } from '../../api-connector/image.service';
import { SnapshotModel } from './snapshot.model';
import { IResponseTemplate } from '../../api-connector/response-template';
import { FacilityService } from '../../api-connector/facility.service';
import { WIKI_SNAPSHOTS, CLOUD_PORTAL_SUPPORT_MAIL } from '../../../links/links';
import { SnapshotPage } from './snapshotPage.model';

// eslint-disable-next-line no-shadow
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
	providers: [FacilityService, ImageService],
})

export class SnapshotOverviewComponent implements OnInit {

	snapshot_page: SnapshotPage = new SnapshotPage();
	WIKI_SNAPSHOTS: string = WIKI_SNAPSHOTS;
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
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
	 * Selected snapshot.
	 */
	selected_snapshot: SnapshotModel;
	/**
	 * Actual delete status.
	 *
	 * @type {Snapshot_Delete_Statuses}
	 */
	delete_status: number = Snapshot_Delete_Statuses.WAITING;
	delete_statuses: typeof Snapshot_Delete_Statuses = Snapshot_Delete_Statuses;
	/**
	 * If site was initialized.
	 *
	 * @type {boolean}
	 */
	isLoaded: boolean = false;
	filterChanged: Subject<string> = new Subject<string>();
	filter: string;
	all_snapshots_checked: boolean = false;

	private checkStatusTimeout: number = 5000;

	currentPage: number = 1;
	snapshotsPerPageChange: Subject<number> = new Subject<number>();
	isSearching: boolean = true;
	DEBOUNCE_TIME: number = 300;

	constructor(private facilityService: FacilityService, private imageService: ImageService) {
		this.facilityService = facilityService;
		this.imageService = imageService;
	}

	changedFilter(text: string): void {
		this.filterChanged.next(text);

	}

	/**
	 * Set selected Snapshot.
	 *
	 * @param snapshot
	 */
	setSelectedSnapshot(snapshot: SnapshotModel): void {
		this.selected_snapshot = snapshot;
	}

	/**
	 * Get snapshots by user.
	 */
	getSnapshots(): void {
		this.imageService.getSnapshotsByUser(this.currentPage, this.snapshot_page.items_per_page)
			.subscribe((snapshot_page: SnapshotPage): void => {
				this.snapshot_page = snapshot_page;
				this.isLoaded = true;
				this.checkSnapShotsStatus();
				this.isSearching = false;
			});
	}

	changeCheckAllSnapshots(): void {
		if (this.all_snapshots_checked) {
			this.checked_snapshots = [];
			this.all_snapshots_checked = false;

			return;

		}

		this.snapshot_page.snapshot_list.forEach((snap: SnapshotModel): void => {
			if (!this.isSnapChecked(snap)) {
				this.checked_snapshots.push(snap);
			}
		});
		this.all_snapshots_checked = true;

	}

	checkSnapShotsStatus(): void {
		let all_active: boolean = true;

		setTimeout(
			(): void => {
				const observables: any = [];
				for (const snapshot of this.snapshot_page.snapshot_list) {
					if (snapshot.snapshot_status !== 'active') {

						observables.push(this.imageService.getSnapshot(snapshot.snapshot_openstackid));
					}

				}
				forkJoin(observables).subscribe((res: any): void => {
					for (const snap of res) {
						this.snapshot_page.snapshot_list[res.indexOf(snap)].snapshot_status = snap['status'];
						if (snap['status'] !== 'active') {
							all_active = false;
						}

					}
					if (!all_active) {
						this.checkSnapShotsStatus();
					}
				});
			},
			this.checkStatusTimeout,
		);

	}

	getFacilitySnapshots(): void {
		this.facilityService.getFacilitySnapshots(this.selectedFacility['FacilityId'], this.currentPage, this.snapshot_page.items_per_page)
			.subscribe((snapshot_page: SnapshotPage): void => {
				this.snapshot_page = snapshot_page;
				this.isSearching = false;
			});
	}

	/**
	 * Delete snapshot.
	 *
	 * @param snapshot
	 */
	deleteSnapshot(snapshot: SnapshotModel): void {
		this.imageService.deleteSnapshot(snapshot.snapshot_openstackid).subscribe((result: IResponseTemplate): void => {

			this.delete_status = 0;

			if (result.value as boolean) {
				this.delete_status = 1;
				const idx: number = this.snapshot_page.snapshot_list.indexOf(snapshot);

				this.snapshot_page.snapshot_list.splice(idx, 1);
			} else if (result.value) {
				this.delete_status = 3;
				this.getSnapshots();

			} else {
				this.delete_status = 2;
				this.getSnapshots();

			}

		});

	}

	ngOnInit(): void {
		this.getSnapshots();

		this.filterChanged
			.pipe(
				debounceTime(this.DEBOUNCE_TIME),
				distinctUntilChanged(),
				switchMap((filterName: string): any => {
					this.isSearching = true;

					this.filter = filterName.trim();
					if (this.showFacilities) {
						return this.facilityService
							.getFacilitySnapshots(
								this.selectedFacility['FacilityId'],
								this.currentPage,
								this.snapshot_page.items_per_page,
								this.filter,
							);
					} else {
						return this.imageService.getSnapshotsByUser(this.currentPage, this.snapshot_page.items_per_page, this.filter);
					}

				}),
			)
			.subscribe((snapshot_page: SnapshotPage): void => {

				this.snapshot_page = snapshot_page;
				this.isLoaded = true;
				this.checkSnapShotsStatus();
				this.isSearching = false;

			});

		this.snapshotsPerPageChange.pipe(
			debounceTime(this.DEBOUNCE_TIME),
			distinctUntilChanged(),
		)
			.subscribe((): void => {
				this.reset();
				if (this.showFacilities) {
					this.getFacilitySnapshots();
				} else {
					this.getSnapshots();
				}
			});
		this.facilityService.getManagerFacilities().subscribe((result: any): void => {
			this.managerFacilities = result;
			this.selectedFacility = this.managerFacilities[0];
		});

	}

	areAllSnapshotsChecked(): void {
		let all_checked: boolean = true;
		this.snapshot_page.snapshot_list.forEach((snap: SnapshotModel): void => {
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
			this.checked_snapshots.splice(this.checked_snapshots.indexOf(snap), 1);
		}
		this.areAllSnapshotsChecked();

	}

	isSnapChecked(snap: SnapshotModel): boolean {
		return this.checked_snapshots.indexOf(snap) !== -1;
	}

	deleteSelectedSnapshots(): void {
		this.checked_snapshots.forEach((snap: SnapshotModel): void => {
			this.deleteSnapshot(snap);

		});
		this.uncheckAll();
	}

	uncheckAll(): void {
		this.checked_snapshots = [];
		this.all_snapshots_checked = false;
	}

	/**
	 * Load vms depending on page.
	 *
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
		this.snapshot_page = new SnapshotPage();
		this.isSearching = true;
		this.currentPage = 1;
	}

}
