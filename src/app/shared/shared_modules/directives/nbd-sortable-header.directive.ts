import {
	Directive, EventEmitter, HostBinding, HostListener, Input, Output,
} from '@angular/core';
import { Application } from '../../../applications/application.model/application.model';

export type SortColumn = keyof Application | ''
export type SortDirection = 'asc' | 'desc' | ''
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
	column: SortColumn
	direction: SortDirection
}

export interface State {
	page: number
	pageSize: number
	searchTerm: string
	sortColumn: SortColumn
	sortDirection: SortDirection
}

export const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

@Directive({
	selector: 'th[appSortable]',
})
export class NgbdSortableHeaderDirective {
	@Input() appSortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	@HostBinding('class.asc') get asc() {
		return this.direction === 'asc';
	}

	@HostBinding('class.desc') get desc() {
		return this.direction === 'desc';
	}

	@HostListener('click') rotate() {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.appSortable, direction: this.direction });
	}
}
