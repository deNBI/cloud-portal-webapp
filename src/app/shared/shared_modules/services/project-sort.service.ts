import {Injectable} from '@angular/core';
import {
		BehaviorSubject, delay, Observable, of, Subject,
} from 'rxjs';
import {debounceTime, switchMap, tap} from 'rxjs/operators';
import {Application_States} from '../baseClass/abstract-base-class';
import {Application} from '../../../applications/application.model/application.model';
import {
		compare, SortColumn, SortDirection, State,
} from '../directives/nbd-sortable-header.directive';

interface SearchResult {
		sortedApplications: Application[]
		total: number
}

@Injectable({
		providedIn: 'root',
})
export class ProjectSortService {
		public filterStatusList: number[] = [];
		public showSimpleVM: boolean = true;
		public showOpenStack: boolean = true;
		private _loading$ = new BehaviorSubject<boolean>(true);
		private _search$ = new Subject<void>();
		private _applications$ = new BehaviorSubject<Application[]>([]);
		private _total$ = new BehaviorSubject<number>(0);
		private _applications: Application[] = [];

		_initiateFilterStatusList(): void {
				this.filterStatusList = [
						Application_States.ACTIVE,
						Application_States.SUSPENDED,
						//	Application_States.DELETED,
						Application_States.EXPIRED,
						Application_States.WAIT_FOR_CONFIRMATION,
						Application_States.TERMINATION_REQUESTED,
						Application_States.EXPIRES_SOON,
				];
		}

		get applications$() {
				return this._applications$.asObservable();
		}

		get total$() {
				return this._total$.asObservable();
		}

		get loading$() {
				return this._loading$.asObservable();
		}

		set page(page: number) {
				this._set({page});
		}

		get page() {
				return this._state.page;
		}

		get pageSize() {
				return this._state.pageSize;
		}

		set pageSize(pageSize: number) {
				this._set({pageSize});
		}

		get searchTerm() {
				return this._state.searchTerm;
		}

		set searchTerm(searchTerm: string) {
				searchTerm = searchTerm.trim()
				this._set({searchTerm});
		}

		set sortColumn(sortColumn: SortColumn) {
				this._set({sortColumn});
		}

		set sortDirection(sortDirection: SortDirection) {
				this._set({sortDirection});
		}

		set applications(applications: Application[]) {
				this._applications = applications;
				this._search$.next();
		}

		initiateSearch(): void {
				this._search$.next();
		}

		private _state: State = {
				page: 1,
				pageSize: 10,
				searchTerm: '',
				sortColumn: '',
				sortDirection: '',
		};

		private _set(patch: Partial<State>) {
				Object.assign(this._state, patch);
				this._search$.next();
		}

		constructor() {
				this.applications = [];
				this._initiateFilterStatusList();
				this._search$
						.pipe(
								tap(() => this._loading$.next(true)),
								debounceTime(200),
								switchMap(() => this._search()),
								delay(100),
								tap(() => this._loading$.next(false)),
						)
						.subscribe(result => {
								this._applications$.next(result.sortedApplications);
								this._total$.next(result.total);
						});

				this._search$.next();
		}

		addOrRemoveFromFilterStatusList(status: Application_States) {
				const idx = this.filterStatusList.indexOf(status);
				if (idx === -1) {
						this.filterStatusList.push(status);
				} else {
						this.filterStatusList.splice(idx, 1);
				}
				this._search$.next();
		}

		matches(text: string, project: Application): boolean {
				const term = text.toLowerCase();
				if (
						(!this.showSimpleVM && !project.project_application_openstack_project)
						|| (!this.showOpenStack && project.project_application_openstack_project)
				) {
						return false;
				}

				if (this.filterStatusList) {
						const status_match: boolean = project.project_application_statuses.some(r => this.filterStatusList.includes(r));
						if (!status_match) {
								return false;
						}
				}

				return (
						project.project_application_shortname.toLowerCase().includes(term)
						|| project.project_application_perun_id.toString().toLowerCase().includes(term)
						|| project.project_application_current_credits.toString().toLowerCase().includes(term)
						|| project.project_application_initial_credits.toString().toLowerCase().includes(term)
						|| project?.project_application_compute_center?.Name.toString().toLowerCase().includes(term)
						|| project.project_application_total_ram.toString().toLowerCase().includes(term)
						|| project.project_application_total_cores.toString().toLowerCase().includes(term)
						|| project.project_application_total_gpu.toString().toLowerCase().includes(term)
						|| project.project_application_name.toString().toLowerCase().includes(term)
				);
		}

		sort(applications: Application[], column: SortColumn, direction: string): Application[] {
				if (direction === '' || column === '') {
						return applications;
				} else {
						return [...applications].sort((a, b) => {
								// if (typeof a[column] == 'string' || typeof a[column] == 'number') {

								// @ts-ignore
								const res = compare(a[column], b[column]);

								return direction === 'asc' ? res : -res;
								// }
						});
				}
		}

		private _search(): Observable<SearchResult> {
				const {
						sortColumn, sortDirection, pageSize, page, searchTerm,
				} = this._state;

				// 1. sort
				let sortedApplications = this.sort(this._applications, sortColumn, sortDirection);

				// 2. filter
				sortedApplications = sortedApplications.filter(app => this.matches(searchTerm, app));

				const total = sortedApplications.length;

				// 3. paginate
				sortedApplications = sortedApplications.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

				return of({sortedApplications, total});
		}
}
