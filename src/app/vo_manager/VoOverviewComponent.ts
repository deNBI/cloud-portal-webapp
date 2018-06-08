import ***REMOVED***Component, Input, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***VoService***REMOVED*** from "../api-connector/vo.service";


@Component(***REMOVED***
  selector: 'voOverview',
  templateUrl: 'voOverview.component.html',
    providers:[VoService]


***REMOVED***)

export class VoOverviewComponent ***REMOVED***

    public emailSubject: string = '';
    public emailText: string = '';
    public emailStatus: number = 0;
    public newsletterSubscriptionCounter:number;






    constructor(private voserice:VoService) ***REMOVED***
        this.voserice.getNewsletterSubscriptionCounter().subscribe(result => ***REMOVED***
            this.newsletterSubscriptionCounter=result['subscribed'];

        ***REMOVED***)


    ***REMOVED***

     sendMailToVo(subject:string,message:string)***REMOVED***
        this.voserice.sendMailToVo(encodeURIComponent(subject), encodeURIComponent(message)).subscribe(result =>***REMOVED***
            if (result == 1)***REMOVED***
                this.emailStatus = 1;
            ***REMOVED***
            else ***REMOVED***
                this.emailStatus = 2;
            ***REMOVED***
            ***REMOVED***)

    ***REMOVED***


     public resetEmailModal() ***REMOVED***

      this.emailSubject = '';
      this.emailText = '';
      this.emailStatus = 0;

    ***REMOVED***





***REMOVED***
