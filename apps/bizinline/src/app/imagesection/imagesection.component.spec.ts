import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesectionComponent } from './imagesection.component';

describe('ImagesectionComponent', () => {
  let component: ImagesectionComponent;
  let fixture: ComponentFixture<ImagesectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagesectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
