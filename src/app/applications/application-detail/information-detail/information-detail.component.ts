import {Component, Input} from '@angular/core';
import {Application} from '../../application.model/application.model';

/**
 * Application informations.
 */
@Component({
             selector: 'app-information-detail',
             templateUrl: './information-detail.component.html',
           })
export class InformationDetailComponent {
  @Input() application: Application;

  constructor() {
  }

}
