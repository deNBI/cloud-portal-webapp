import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ApplicationFilterInputComponent } from './application-filter-input.component'

describe('ApplicationFilterInputComponent', () => {
	let component: ApplicationFilterInputComponent
	let fixture: ComponentFixture<ApplicationFilterInputComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ApplicationFilterInputComponent]
		}).compileComponents()

		fixture = TestBed.createComponent(ApplicationFilterInputComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
