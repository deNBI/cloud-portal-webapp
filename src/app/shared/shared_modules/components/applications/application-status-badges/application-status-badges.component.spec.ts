import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ApplicationStatusBadgesComponent } from './application-status-badges.component'

describe('ApplicationStatusBadgesComponent', () => {
	let component: ApplicationStatusBadgesComponent
	let fixture: ComponentFixture<ApplicationStatusBadgesComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ApplicationStatusBadgesComponent]
		}).compileComponents()

		fixture = TestBed.createComponent(ApplicationStatusBadgesComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
