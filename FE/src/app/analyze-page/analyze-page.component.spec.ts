import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzePageComponent } from './analyze-page.component';

describe('AnalyzePageComponent', () => {
  let component: AnalyzePageComponent;
  let fixture: ComponentFixture<AnalyzePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyzePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
