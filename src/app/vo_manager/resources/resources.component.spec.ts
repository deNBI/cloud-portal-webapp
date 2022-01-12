import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResourcesComponent } from './resources.component';
/* eslint-disable */
describe('ResourcesComponent', () => {
	let component: ResourcesComponent;
	let fixture: ComponentFixture<ResourcesComponent>;

	beforeEach(waitForAsync(() => {
		void TestBed.configureTestingModule({
			declarations: [ResourcesComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ResourcesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
/* eslint-enable */
