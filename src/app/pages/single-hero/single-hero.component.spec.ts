import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SingleHeroComponent } from './single-hero.component';

describe('SingleHeroComponent', () => {
  let component: SingleHeroComponent;
  let fixture: ComponentFixture<SingleHeroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SingleHeroComponent,
        HttpClientModule,
        RouterTestingModule
      ]
    });
    fixture = TestBed.createComponent(SingleHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
