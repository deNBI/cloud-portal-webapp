// eslint-disable-next-line max-classes-per-file
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe which compares status.
 */
@Pipe({
	name: 'hasStatus',
})
export class HasStatusPipe implements PipeTransform {
	transform(status: string | number, status_to_compare: string | number): boolean {
		return status === status_to_compare;
	}
}
/**
 * Pipe which checks if status is in a list.
 */
@Pipe({
	name: 'statusInList',
})
export class StatusInListPipe implements PipeTransform {
	transform(status: string, status_list_to_compare: string[]): boolean {
		return status_list_to_compare.indexOf(status) !== -1;
	}
}
