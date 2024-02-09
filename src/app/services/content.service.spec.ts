import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContentService } from './content.service';
import { Hero, PaginatedHeroes } from '../models/heromodel';

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContentService]
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get heroes from the API', () => {
    const dummyHeroes: PaginatedHeroes = {
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

    service.getHeroes(1, 2).subscribe(heroes => {
      expect(heroes).toEqual(dummyHeroes);
    });

    const req = httpMock.expectOne('http://localhost:3000/heroes?_page=1&_per_page=2');
    expect(req.request.method).toBe('GET');
    req.flush(dummyHeroes);
  });

  it('should get a single hero from the API', () => {
    const dummyHero: Hero = { id: '1', name: 'Hero 1', nickname: 'Nick 1', picture: '', description: 'Description' };

    service.getHero('1').subscribe(hero => {
      expect(hero).toEqual(dummyHero);
    });

    const req = httpMock.expectOne('http://localhost:3000/heroes/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyHero);
  });

});