 
import { Pipe, PipeTransform } from '@angular/core'
import { ApplicationRessourceUsage } from '../../applications/application-ressource-usage/application-ressource-usage'

/**
 * Pipe which compares status.
 */
@Pipe({ name: 'noVMsPipe' })
export class NoVMsPipe implements PipeTransform {
	transform(ressources: ApplicationRessourceUsage, additional_vms: number = 0): boolean {
		if (additional_vms > 0) {
			return ressources.used_vms + additional_vms > ressources.number_vms
		} else {
			return ressources.used_vms >= ressources.number_vms
		}
	}
}

/**
 * Pipe which compares status.
 */
@Pipe({ name: 'noCoresPipe' })
export class NoCoresPipe implements PipeTransform {
	transform(ressources: ApplicationRessourceUsage): boolean {
		return ressources.cores_used >= ressources.cores_total
	}
}

/**
 * Pipe which compares status.
 */
@Pipe({ name: 'noRamPipe' })
export class NoRamPipe implements PipeTransform {
	transform(ressources: ApplicationRessourceUsage): boolean {
		return ressources.ram_used >= ressources.ram_total
	}
}
