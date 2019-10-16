import {Component, Input} from '@angular/core';

@Component({
  templateUrl: 'title-headbar.component.html',
  selector: 'app-title-headbar'
})
export class TitleHeadbarComponent {

  @Input() page_title:string;
}
