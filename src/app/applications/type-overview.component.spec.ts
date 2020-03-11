import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TypeOverviewComponent} from './type-overview.component';
// tslint:disable

describe('TypeOverviewComponent', () => {
  let component: TypeOverviewComponent;
  let fixture: ComponentFixture<TypeOverviewComponent>;

  beforeEach(async(() => {
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
