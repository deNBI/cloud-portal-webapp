import { Component, Input, OnInit } from '@angular/core';
import { VolumeStates } from '../volume_states';
import { Volume } from '../volume';
import { CLOUD_PORTAL_SUPPORT_MAIL } from '../../../../links/links';

/**
 * Volume Status component.
 */
@Component({
	selector: 'app-volum-status',
	templateUrl: './volum-status.component.html',
	styleUrls: ['../../vmOverview.component.scss'],
})
export class VolumStatusComponent implements OnInit {
	VolumeStates: VolumeStates = new VolumeStates();
	CLOUD_PORTAL_SUPPORT_MAIL: string = CLOUD_PORTAL_SUPPORT_MAIL;
  @Input() volume: Volume;

  ngOnInit(): void {
  }

}
