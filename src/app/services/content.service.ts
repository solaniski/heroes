import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Hero, PaginatedHeroes } from '../models/heromodel';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})

export class ContentService {
  constructor(
    private http: HttpClient
    ) {}

  public url = environment.apiUrl;

  getHeroes(page:number,pageSize:number): Observable<PaginatedHeroes>{
    const heroes: Observable<PaginatedHeroes> = this.http.get<PaginatedHeroes>(this.url+`?_page=${page}&_per_page=${pageSize}`);
    return heroes;
  }

  getHero(id:string): Observable<Hero>{
    const hero: Observable<Hero> = this.http.get<Hero>(this.url+'/'+id);
    return hero;
  }

  searchHero(search:string): Observable<Hero[]>{
    return this.http.get<Hero[]>(this.url).pipe(
      map(heroes => {
        const byName = heroes.filter(hero => hero.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
        const byNickName = heroes.filter(hero => hero.nickname.toLocaleLowerCase().includes(search.toLocaleLowerCase()));

        const combinedResults = [...byName, ...byNickName];
        const uniqueHeroes: Hero[] = Array.from(new Set(combinedResults.map(hero => hero.id)))
          .map(id => combinedResults.find(hero => hero && hero.id === id))
          .filter(hero => !!hero) as Hero[];

        return uniqueHeroes;
      })
    )  
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.url, hero);
  }

  editHero(hero: Hero, id:string): Observable<Hero> {
    return this.http.put<Hero>(this.url+'/'+id, hero);
  }

  deleteHero(id:string){
    return this.http.delete(this.url+'/'+id);
  }

  getImage(id:string,picture:string){
    let image;
    if(picture == '' || picture == null){
      if(id){
        image = "assets/images/heroes/"+id+".jpg";
      } else {
        image = "assets/images/heroes/generic.jpg";
      }
      
    } else {
      image = picture;
    }
    return image;
  }

}