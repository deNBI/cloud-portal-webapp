import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ViewPublicKeyComponent } from './view-public-key.component'

describe('ViewPublicKeyComponent', () => {
	let component: ViewPublicKeyComponent
	let fixture: ComponentFixture<ViewPublicKeyComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ViewPublicKeyComponent]
		}).compileComponents()

		fixture = TestBed.createComponent(ViewPublicKeyComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
