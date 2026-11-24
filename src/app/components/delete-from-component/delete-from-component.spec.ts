import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteFromComponent } from './delete-from-component';

describe('DeleteFromComponent', () => {
  let component: DeleteFromComponent;
  let fixture: ComponentFixture<DeleteFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteFromComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteFromComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
