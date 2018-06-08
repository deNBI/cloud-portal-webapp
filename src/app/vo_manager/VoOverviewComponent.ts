import {Component, Input, OnInit} from '@angular/core';
import {VoService} from "../api-connector/vo.service";


@Component({
  selector: 'voOverview',
  templateUrl: 'voOverview.component.html',
    providers:[VoService]


})

export class VoOverviewComponent {

    public emailSubject: string = '';
    public emailText: string = '';
    public emailStatus: number = 0;
    public newsletterSubscriptionCounter:number;






    constructor(private voserice:VoService) {
        this.voserice.getNewsletterSubscriptionCounter().subscribe(result => {
            this.newsletterSubscriptionCounter=result['subscribed'];

        })


    }

     sendMailToVo(subject:string,message:string){
        this.voserice.sendMailToVo(encodeURIComponent(subject), encodeURIComponent(message)).subscribe(result =>{
            if (result == 1){
                this.emailStatus = 1;
            }
            else {
                this.emailStatus = 2;
            }
            })

    }


     public resetEmailModal() {

      this.emailSubject = '';
      this.emailText = '';
      this.emailStatus = 0;

    }





}
