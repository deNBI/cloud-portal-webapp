import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
        name: 'hasStatus'
      })
export class HasStatusPipe implements PipeTransform {

  transform(status: string, status_to_compare: string): boolean {
    console.log('checking', status)
    return status === status_to_compare;
  }

}
