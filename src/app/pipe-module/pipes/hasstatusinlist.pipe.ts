import {Pipe, PipeTransform} from '@angular/core';
import {Application} from '../../applications/application.model/application.model';

@Pipe({
        name: 'hasstatusinlist'
      })
export class HasstatusinlistPipe implements PipeTransform {

  transform(appl: Application, status: number): boolean {
    console.log('checking status list', status)
    return appl.project_application_status.includes(status)
  }

}

