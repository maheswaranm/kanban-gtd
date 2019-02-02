import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetailModalComponent } from './card-detail-modal.component';

describe('CardDetailModalComponent', () => {
  let component: CardDetailModalComponent;
  let fixture: ComponentFixture<CardDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
