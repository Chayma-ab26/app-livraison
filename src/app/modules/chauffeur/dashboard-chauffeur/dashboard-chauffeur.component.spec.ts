import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChauffeurComponent } from './dashboard-chauffeur.component';

describe('DashboardChauffeurComponent', () => {
  let component: DashboardChauffeurComponent;
  let fixture: ComponentFixture<DashboardChauffeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardChauffeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardChauffeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
