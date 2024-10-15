import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TerminateProjectModalComponent } from './terminate-project-modal.component'

describe('TerminateProjectModalComponent', () => {
	let component: TerminateProjectModalComponent
	let fixture: ComponentFixture<TerminateProjectModalComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TerminateProjectModalComponent]
		}).compileComponents()

		fixture = TestBed.createComponent(TerminateProjectModalComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
