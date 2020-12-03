import {Component, Input} from '@angular/core';
import {Application} from '../../application.model/application.model';
import {is_vo} from '../../../shared/globalvar';

/**
 * Application informations.
 */
@Component({
             selector: 'app-information-detail',
             templateUrl: './information-detail.component.html'
           })
export class InformationDetailComponent {
  @Input() application: Application;
  is_vo: boolean = is_vo;

  constructor() {
  }

}
