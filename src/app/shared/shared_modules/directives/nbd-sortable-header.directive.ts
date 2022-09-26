import {Component, Directive, EventEmitter, Input, Output, PipeTransform} from '@angular/core';
import {Application} from '../../../applications/application.model/application.model';
import {DecimalPipe} from '@angular/common';
import {FormControl} from '@angular/forms';
import {Observable, startWith, map} from 'rxjs';

export type SortColumn = keyof Application | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {'asc': 'desc', 'desc': '', '': 'asc'};

export interface SortEvent {
		column: SortColumn;
		direction: SortDirection;
}

@Directive({
		selector: 'th[sortable]',
		host: {
				'[class.asc]': 'direction === "asc"',
				'[class.desc]': 'direction === "desc"',
				'(click)': 'rotate()'
		}
})
export class NgbdSortableHeader {

		@Input() sortable: SortColumn = '';
		@Input() direction: SortDirection = '';
		@Output() sort = new EventEmitter<SortEvent>();

		rotate() {
				this.direction = rotate[this.direction];
				this.sort.emit({column: this.sortable, direction: this.direction});
		}
}

function search(text: string, pipe: PipeTransform, applications: Application[]): Application[] {
		return applications.filter(application => {
				const term = text.toLowerCase();
				return application.project_application_shortname.toLowerCase().includes(term)
						|| pipe.transform(application.project_application_id).includes(term)
						|| pipe.transform(application.project_application_current_credits).includes(term)
						|| pipe.transform(application.project_application_initial_credits).includes(term);

		});
}

