import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ClusterActionsComponent } from './cluster-actions.component'

describe('ClusterActionsComponent', () => {
	let component: ClusterActionsComponent
	let fixture: ComponentFixture<ClusterActionsComponent>

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ClusterActionsComponent]
		})
		fixture = TestBed.createComponent(ClusterActionsComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
