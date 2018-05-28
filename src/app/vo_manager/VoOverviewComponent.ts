import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'voOverview',
  templateUrl: 'voOverview.component.html'


})

export class VoOverviewComponent {

    public emailSubject: string = '';
    public emailText: string = '';
    public emailStatus: number = 0;






    constructor() {


    }


     public resetEmailModal() {

      this.emailSubject = '';
      this.emailText = '';
      this.emailStatus = 0;

    }





}
