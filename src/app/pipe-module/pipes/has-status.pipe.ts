import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
        name: 'hasStatus'
      })
export class HasStatusPipe implements PipeTransform {

  transform(status: string | number, status_to_compare: string | number): boolean {
    return status === status_to_compare;
  }

}
