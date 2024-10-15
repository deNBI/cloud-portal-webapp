import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserApplicationsModalComponent } from './user-applications-modal.component'

describe('UserApplicationsModalComponent', () => {
	let component: UserApplicationsModalComponent
	let fixture: ComponentFixture<UserApplicationsModalComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserApplicationsModalComponent]
		}).compileComponents()

		fixture = TestBed.createComponent(UserApplicationsModalComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
