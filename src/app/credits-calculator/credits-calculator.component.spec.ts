import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsCalculatorComponent } from './credits-calculator.component';

describe('CreditsCalculatorComponent', () => {
	let component: CreditsCalculatorComponent;
	let fixture: ComponentFixture<CreditsCalculatorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CreditsCalculatorComponent],
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CreditsCalculatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
