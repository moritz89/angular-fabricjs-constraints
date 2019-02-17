import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcsTestComponent } from './ecs-test.component';

describe('EcsTestComponent', () => {
  let component: EcsTestComponent;
  let fixture: ComponentFixture<EcsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcsTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
