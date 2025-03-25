import { Pipe, PipeTransform } from '@angular/core'
import { DisseminationPlatform } from 'app/applications/application.model/dissemination-platform'

/**
 * Generic Pipe to check if element is in list.
 */
@Pipe({ name: 'isPlatformSelected' })
export class DisseminationPlatformSelectedPipe implements PipeTransform {
	transform(platformList: DisseminationPlatform[], value: DisseminationPlatform): boolean {
		if (!value || typeof value.id === 'undefined' ) {
            return false;
        } 
        return platformList.some(plat => plat.id === value.id)
	}
}
