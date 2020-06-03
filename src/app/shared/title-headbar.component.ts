import {Component, Input} from '@angular/core';
import {UserService} from '../api-connector/user.service';

/**
 * Title headbar component.
 */
@Component({
             templateUrl: 'title-headbar.component.html',
             selector: 'app-title-headbar',
             providers: [UserService]

           })
export class TitleHeadbarComponent {
    @Input() page_title: string;


  constructor(private userService:UserService) {

  }




    logout(): void {
    this.userService.logoutUser().subscribe((redirect: any) => {

              window.location.href = redirect['redirect'];
    })
  }

}
