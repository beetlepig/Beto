import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetoMainCanvasComponent } from './beto-main-canvas.component';

describe('BetoMainCanvasComponent', () => {
  let component: BetoMainCanvasComponent;
  let fixture: ComponentFixture<BetoMainCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetoMainCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetoMainCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
