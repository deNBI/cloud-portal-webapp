import {Pipe, PipeTransform} from '@angular/core';
import {ApplicationModification} from '../application_modification.model';
import {Application} from '../application.model/application.model';
import {Flavor} from '../../virtualmachines/virtualmachinemodels/flavor';

@Pipe({
        name: 'flavorCounter'
      })
export class FlavorCounterPipe implements PipeTransform {
  transform(appl: ApplicationModification | Application, flavor: Flavor): number {
    return appl.getFlavorCounter(flavor)
  }
}
