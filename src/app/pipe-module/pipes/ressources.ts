// eslint-disable-next-line max-classes-per-file
import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationRessourceUsage } from '../../applications/application-ressource-usage/application-ressource-usage';

/**
 * Pipe which compares status.
 */
@Pipe({
	name: 'noVMsPipe',
})
export class NoVMsPipe implements PipeTransform {
	transform(ressources: ApplicationRessourceUsage): boolean {
		return ressources.used_vms >= ressources.number_vms;
	}
}

/**
 * Pipe which compares status.
 */
@Pipe({
	name: 'noCoresPipe',
})
export class NoCoresPipe implements PipeTransform {
	transform(ressources: ApplicationRessourceUsage): boolean {
		return ressources.cores_used >= ressources.cores_total;
	}
}

/**
 * Pipe which compares status.
 */
@Pipe({
	name: 'noRamPipe',
})
export class NoRamPipe implements PipeTransform {
	transform(ressources: ApplicationRessourceUsage): boolean {
		return ressources.ram_used >= ressources.ram_total;
	}
}
