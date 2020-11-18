import { Component, OnInit } from '@angular/core';
import {FacilityService} from '../../../api-connector/facility.service';

@Component({
  selector: 'app-gpufactor-overview',
  templateUrl: './gpufactor-overview.component.html',
               providers: [FacilityService]

})
export class GpufactorOverviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
