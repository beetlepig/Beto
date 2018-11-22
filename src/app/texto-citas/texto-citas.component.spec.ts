import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoCitasComponent } from './texto-citas.component';

describe('TextoCitasComponent', () => {
  let component: TextoCitasComponent;
  let fixture: ComponentFixture<TextoCitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextoCitasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextoCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
