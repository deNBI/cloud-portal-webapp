import {Component, Input} from '@angular/core';

/**
 * Title headbar component.
 */
@Component({
             templateUrl: 'title-headbar.component.html',
             selector: 'app-title-headbar'
           })
export class TitleHeadbarComponent {

  @Input() page_title: string;
}
