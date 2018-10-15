import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlexLogoComponent } from './alex-logo.component';

describe('AlexLogoComponent', () => {
  let component: AlexLogoComponent;
  let fixture: ComponentFixture<AlexLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlexLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlexLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
