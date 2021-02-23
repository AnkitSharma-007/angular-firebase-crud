import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeformComponent } from './employeeform.component';

describe('EmployeeformComponent', () => {
  let component: EmployeeformComponent;
  let fixture: ComponentFixture<EmployeeformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
