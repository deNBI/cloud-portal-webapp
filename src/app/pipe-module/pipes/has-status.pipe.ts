import {Pipe, PipeTransform} from '@angular/core';
import {Application} from '../../applications/application.model/application.model';

@Pipe({
        name: 'hasStatus'
      })
export class HasStatusPipe implements PipeTransform {

  transform(status: string, status_to_compare: string): boolean {
    return status === status_to_compare;
  }

}

