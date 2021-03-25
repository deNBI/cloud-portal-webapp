import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TypeOverviewComponent } from './type-overview.component';
/* eslint-disable */

describe('TypeOverviewComponent', () => {
	let component: TypeOverviewComponent;
	let fixture: ComponentFixture<TypeOverviewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TypeOverviewComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TypeOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
/* eslint-enable */
