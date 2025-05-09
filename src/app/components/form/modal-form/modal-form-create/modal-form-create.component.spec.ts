import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormCreateComponent } from './modal-form-create.component';

describe('ModalFormCreateComponent', () => {
  let component: ModalFormCreateComponent;
  let fixture: ComponentFixture<ModalFormCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFormCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFormCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
