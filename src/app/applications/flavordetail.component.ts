import ***REMOVED***Component, Input, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachinemodels/flavor'

@Component(***REMOVED***
  selector: 'flavor-detail',
  templateUrl: 'flavordetail.component.html'


***REMOVED***)
export class FlavorDetailComponent implements OnInit ***REMOVED***
  @Input() flavor: Flavor;
  @Input() collapse2: boolean;


  ngOnInit() ***REMOVED***
  ***REMOVED***
***REMOVED***
