import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'

import { ProjectMember } from '../../../projectmanagement/project_member.model'
import { VoService } from '../../../api-connector/vo.service'
import { is_vo } from '../../globalvar'
import { FacilityService } from '../../../api-connector/facility.service'
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-project-members-list',
    templateUrl: './members-list-modal.component.html',
    imports: [NgIf, NgFor]
})
export class MembersListModalComponent implements OnDestroy, OnInit {
	// currently only for vo
	members: ProjectMember[] = []
	@Input() projectId: string | number
	@Input() projectName: string
	@Input() facilityId: string | number

	constructor(
		public bsModalRef: BsModalRef,
		private voService: VoService,
		private facilityService: FacilityService
	) {
		 
	}

	ngOnInit() {
		if (is_vo) {
			this.voService.getVoGroupRichMembers(this.projectId).subscribe((members: ProjectMember[]): void => {
				this.members = members
			})
		} else if (this.facilityId) {
			this.facilityService
				.getFacilityGroupRichMembers(this.projectId, this.facilityId)
				.subscribe((members: ProjectMember[]): void => {
					this.members = members
				})
		}
	}

	ngOnDestroy(): void {
		this.bsModalRef.hide()
	}
}
