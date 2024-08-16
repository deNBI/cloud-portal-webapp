import { Pipe, PipeTransform } from '@angular/core'
import { MaintenanceTimeFrame } from '../../../../../vo_manager/maintenance/maintenanceTimeFrame.model'

@Pipe({
	name: 'significanceGiven'
})
export class SignificancePipe implements PipeTransform {
	transform(timeframes: MaintenanceTimeFrame[]): boolean {
		for (const tf of timeframes) {
			if (tf.significant) {
				return true
			}
		}

		return false
	}
}
