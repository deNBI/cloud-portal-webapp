import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DeclineProjectTerminationModalComponent } from './decline-project-termination-modal.component'

describe('DeclineProjectTerminationModalComponent', () => {
	let component: DeclineProjectTerminationModalComponent
	let fixture: ComponentFixture<DeclineProjectTerminationModalComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DeclineProjectTerminationModalComponent]
		}).compileComponents()

		fixture = TestBed.createComponent(DeclineProjectTerminationModalComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
