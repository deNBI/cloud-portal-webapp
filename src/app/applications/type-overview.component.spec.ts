import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {TypeOverviewComponent} from './type-overview.component';
// tslint:disable

describe('TypeOverviewComponent', () => {
  let component: TypeOverviewComponent;
  let fixture: ComponentFixture<TypeOverviewComponent>;

  beforeEach(waitForAsync(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    TestBed.configureTestingModule({
                                     declarations: [TypeOverviewComponent]
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
