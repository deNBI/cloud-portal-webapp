import { Component, OnInit } from '@angular/core';
import {FacilityService} from '../../../api-connector/facility.service';

@Component({
  selector: 'app-volumestoragefactor-overview',
  templateUrl: './volumestoragefactor-overview.component.html',
               providers: [FacilityService]

})
export class VolumestoragefactorOverviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
