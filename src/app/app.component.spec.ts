import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements and attributes like swiper
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle mode without error', () => {
    expect(component.isDesigner).toBeFalse();
    component.toggleMode();
    expect(component.isDesigner).toBeTrue();
  });

  it('should have toggleEduCard function', () => {
    expect(typeof component.toggleEduCard).toBe('function');
  });

  it('should have closeModal function', () => {
    expect(typeof component.closeModal).toBe('function');
  });
});
