import {Pipe, PipeTransform} from '@angular/core';
import {Application} from '../../applications/application.model/application.model';

@Pipe({
        name: 'hasstatusinlist'
      })
export class HasstatusinlistPipe implements PipeTransform {

  transform(appl: Application, status: number): boolean {
    if (appl === undefined) {
      return false
    }

    return appl.project_application_status.includes(status)
  }

}
