import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAlexComponent } from './about-alex.component';

describe('AboutAlexComponent', () => {
  let component: AboutAlexComponent;
  let fixture: ComponentFixture<AboutAlexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutAlexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutAlexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
