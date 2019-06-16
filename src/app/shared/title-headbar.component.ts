import {Component, Input, OnInit} from '@angular/core';

@Component({
  templateUrl: 'title-headbar.component.html',
  selector: 'app-title-headbar'
})
export class TitleHeadbarComponent implements OnInit {

  public page_title: string ='Test';

  constructor() {
  }

  @Input()
  public setTitle(new_title: string): void {

    console.log('yep got called');
    this.page_title = new_title;

  }

  public getTitle(): string {
    return this.page_title;
  }

  ngOnInit(): void {

  }

}
