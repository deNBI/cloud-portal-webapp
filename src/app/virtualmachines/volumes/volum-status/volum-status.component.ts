import {Component, Input, OnInit} from '@angular/core';
import {VolumeStates} from '../volume_states';
import {Volume} from '../volume';

/**
 * Volume Status component.
 */
@Component({
             selector: 'app-volum-status',
             templateUrl: './volum-status.component.html',
             styleUrls: ['../../vmOverview.component.scss']
           })
export class VolumStatusComponent implements OnInit {
  VolumeStates: VolumeStates = new VolumeStates();
  @Input() volume: Volume;

  constructor() {
  }

  ngOnInit(): void {
  }

}
