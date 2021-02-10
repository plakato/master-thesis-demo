import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhymesMatrixComponent } from './rhymes-matrix.component';

describe('RhymesMatrixComponent', () => {
  let component: RhymesMatrixComponent;
  let fixture: ComponentFixture<RhymesMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RhymesMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RhymesMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
