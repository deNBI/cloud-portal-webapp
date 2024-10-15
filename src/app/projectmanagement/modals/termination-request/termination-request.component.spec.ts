import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TerminationRequestComponent } from './termination-request.component'

describe('TerminationRequestComponent', () => {
	let component: TerminationRequestComponent
	let fixture: ComponentFixture<TerminationRequestComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TerminationRequestComponent]
		}).compileComponents()

		fixture = TestBed.createComponent(TerminationRequestComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
