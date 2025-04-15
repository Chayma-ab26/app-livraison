import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivraisonDetailsComponent } from './livraison-details.component';

describe('LivraisonDetailsComponent', () => {
  let component: LivraisonDetailsComponent;
  let fixture: ComponentFixture<LivraisonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LivraisonDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivraisonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
