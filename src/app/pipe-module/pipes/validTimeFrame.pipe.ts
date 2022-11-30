import { Pipe, PipeTransform } from '@angular/core';
import { WorkshopTimeFrame } from '../../virtualmachines/workshop/workshopTimeFrame.model';

/**
 * Pipe to check if the timeframe set is valid, which means that the start-time is before the end time.
 */
@Pipe({
	name: 'isValidTimeFrame',
	pure: false,
})
export class ValidTimeFramePipe implements PipeTransform {
	transform(timeframe: WorkshopTimeFrame): boolean {
		return Date.now() <= timeframe.start_time.getTime() && timeframe.start_time.getTime() < timeframe.end_time.getTime();
	}
}
