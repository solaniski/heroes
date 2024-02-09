import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { ContentService } from '../../services/content.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PaginatedHeroes } from '../../models/heromodel';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let contentServiceSpy: jasmine.SpyObj<ContentService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {

    contentServiceSpy = jasmine.createSpyObj('ContentService', [
      'getHeroes',
      'deleteHero'
    ]);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { params: { q: '' } }
    });

    TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ContentService, useValue: contentServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load heroes on init', () => {
    const heroes: PaginatedHeroes = {
      data: [
        { id: '1', name: 'Hero 1', nickname: 'Nick 1', picture: '', description: 'Description 1' },
        { id: '2', name: 'Hero 2', nickname: 'Nick 2', picture: '', description: 'Description 2' }
      ],
      items: 2,
      first: 1,
      prev: 0,
      next: 1,
      last: 1,
      pages: 1
    };
    contentServiceSpy.getHeroes.and.returnValue(of(heroes));

    component.ngOnInit();

    expect(contentServiceSpy.getHeroes).toHaveBeenCalled();
    expect(component.heroes$).toBeDefined();
  });

});
