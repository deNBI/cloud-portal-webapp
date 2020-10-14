import {Pipe, PipeTransform} from '@angular/core';
import {Application} from '../../applications/application.model/application.model';
import {ProjectEnumeration} from '../../projectmanagement/project-enumeration';
import {Project} from '../../projectmanagement/project.model';

/**
 * Pipe which checks if status is in list.
 */
@Pipe({
  name: 'hasstatusinlist'
})
export class GraphIsGroupedPipe implements PipeTransform {

  transform(graph: any): boolean {
    if (graph === undefined) {
      return false;
    }

  }

}
