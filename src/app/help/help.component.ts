import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***IResponseTemplate***REMOVED*** from '../api-connector/response-template';

@Component(***REMOVED***
    templateUrl: './help.component.html',
    providers: [UserService]

***REMOVED***)

export class HelpComponent ***REMOVED***

    public emailSubject: string;
    public emailText: string;
    public emailStatus: number = 0;
    public emailAdress: string;
    public emailReply: string = '';

    constructor(private userService: UserService) ***REMOVED***

    ***REMOVED***

    sendEmail(subject: string, message: string, reply: string): void ***REMOVED***
        this.userService.sendHelpMail(
            encodeURIComponent(subject), encodeURIComponent(message),
            encodeURIComponent(reply)).subscribe((result: IResponseTemplate) => ***REMOVED***
            if (<boolean><Boolean>result.value) ***REMOVED***
                this.emailStatus = 1;
            ***REMOVED*** else ***REMOVED***
                this.emailStatus = 2;
            ***REMOVED***
        ***REMOVED***)

    ***REMOVED***

    resetEmail(): void ***REMOVED***
        this.emailStatus = 0;
        this.emailText = '';
        this.emailSubject = '';
        this.emailAdress = '';
        this.emailReply = '';

    ***REMOVED***
***REMOVED***
